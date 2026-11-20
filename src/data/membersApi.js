import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import { ENUM_TYPES, fetchEnumOptions } from "./enumsApi";

// The team grid shows a curated subset of the public.membership_type enum -
// see ENUM_ALLOWLIST in enumsApi.js to change which values appear.

/**
 * member_status values the code has to reason about (the full list is the
 * DB enum, loaded via useEnumOptions(ENUM_TYPES.MEMBER_STATUS)).
 * - DELETED: hidden from the public site; the on_member_deleted trigger also
 *   removes all projects/memberships and revokes tool access (not reversible
 *   by changing the status back).
 * - ACTIVE / INACTIVE are the two "on the roster" columns of the Teams tab.
 */
export const MEMBER_STATUS_ACTIVE = "active";
export const MEMBER_STATUS_INACTIVE = "inactive";
export const MEMBER_STATUS_DELETED = "deleted";

/**
 * Turn a membership_type label into a per-person role label:
 * "Project Leads" -> "Project Lead". Values that are not plural are left
 * alone, so new enum values get a sensible label without a code change.
 */
function toRoleLabel(membershipType) {
  if (!membershipType) return "Member";
  return String(membershipType).replace(/s$/, "");
}

/**
 * Fetch team members for About page
 * - Uses members_personal + member_memberships
 * - Adds projects for Project Leads from projects.project_lead_id
 */
export async function fetchTeamMembers() {
  // 0) Live membership types from the DB enum (falls back to enumsApi defaults)
  const categoryOptions = await fetchEnumOptions(ENUM_TYPES.MEMBERSHIP_TYPE);
  const categories = categoryOptions.map((option) => option.value);

  // 1) Get memberships + linked member info
  const { data: rows, error } = await supabase
    .from("member_memberships")
    .select(
      `
      membership_type,
      title,
      member:members_personal (
        id,
        full_name,
        avatar_url,
        linkedin_url,
        status
      )
    `,
    )
    .in("membership_type", categories); // only the categories we display

  if (error) {
    logger.error("Error fetching member memberships:", error);
    throw error;
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  // 2) Flatten rows into simple member objects (one per membership_type)
  const flatMembers = rows
    .filter(
      (row) => row.member && row.member.status !== MEMBER_STATUS_DELETED,
    )
    .map((row) => {
      const m = row.member;
      const membershipType = row.membership_type;

      const roleLabel = toRoleLabel(membershipType);

      return {
        id: m.id,
        name: m.full_name,
        photo: m.avatar_url,
        linkedin: m.linkedin_url,
        category: membershipType, // a public.membership_type enum label
        role: roleLabel,
        title: row.title, // per-membership title, e.g. "Head of Software"
        projects: [], // filled below for project leads
      };
    });

  // 3) For project leads, fetch projects where they are project_lead_id
  const projectLeadIds = Array.from(
    new Set(
      flatMembers
        .filter((m) => m.category === "Project Leads")
        .map((m) => m.id),
    ),
  );

  let projectsByLead = {};
  if (projectLeadIds.length > 0) {
    const { data: projects, error: projError } = await supabase
      .from("projects")
      .select("id, name, project_lead_id")
      .in("project_lead_id", projectLeadIds);

    if (projError) {
      logger.error("Error fetching projects for project leads:", projError);
      throw projError;
    }

    projectsByLead = (projects || []).reduce((acc, p) => {
      if (!acc[p.project_lead_id]) acc[p.project_lead_id] = [];
      acc[p.project_lead_id].push({
        id: p.id,
        name: p.name, // 🔴 FIXED: was `title`
      });
      return acc;
    }, {});
  }

  // 4) Attach projects to project-lead members
  return flatMembers.map((m) => ({
    ...m,
    projects: projectsByLead[m.id] || [],
  }));
}

export async function fetchMemberStories() {
  const { data, error } = await supabase
    .from("members_personal")
    .select(
      `
      id,
      full_name,
      avatar_url,
      story,
      created_at,
      study_program,
      university,
      member_projects:member_projects (
        role,
        department_slug,
        department:departments (
          name
        )
      )
    `,
    )
    // only rows where story is NOT NULL
    .not("story", "is", null)
    .neq("status", MEMBER_STATUS_DELETED);

  if (error) {
    logger.error("Error fetching member stories:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row) => {
    const mp = Array.isArray(row.member_projects)
      ? row.member_projects[0]
      : null;

    const departmentName = mp?.department?.name || mp?.department_slug;

    const joinedYear = row.created_at
      ? new Date(row.created_at).getFullYear()
      : null;

    return {
      id: row.id,
      name: row.full_name,
      avatarUrl: row.avatar_url,
      story: row.story,
      joinedYear,
      studyProgram: row.study_program,
      university: row.university,
      role: mp?.role || "Member",
      department: departmentName,
    };
  });
}

/* ------------------------------------------------------------------------- */
/* Admin                                                                      */
/* ------------------------------------------------------------------------- */

const ADMIN_MEMBER_SELECT = `
  id,
  created_at,
  full_name,
  avatar_url,
  personal_email,
  robotum_email,
  phone,
  university,
  study_program,
  linkedin_url,
  status,
  inactive_since,
  suspended_at,
  deleted_at,
  lifecycle_exempt
`;

// Added by migration 0007. Selected separately so the page keeps working
// (without graduation dates) if that migration hasn't been run yet.
const ADMIN_MEMBER_SELECT_WITH_GRADUATED = `${ADMIN_MEMBER_SELECT.trim()},
  graduated_at
`;
const UNDEFINED_COLUMN = "42703";

async function fetchAdminMembersRows() {
  const withGraduated = await supabase
    .from("members_personal")
    .select(ADMIN_MEMBER_SELECT_WITH_GRADUATED)
    .order("full_name", { ascending: true });
  if (withGraduated.error?.code !== UNDEFINED_COLUMN) return withGraduated;

  logger.warn("members_personal.graduated_at missing - run migration 0007.");
  return supabase
    .from("members_personal")
    .select(ADMIN_MEMBER_SELECT)
    .order("full_name", { ascending: true });
}

/**
 * Admin: every member with their club memberships and project assignments,
 * plus the projects/departments needed for the assignment dropdowns.
 * One round of parallel queries - the club roster is small enough that the
 * admin tabs filter/count client-side.
 */
export async function adminFetchMembersRegistry() {
  const [membersRes, membershipsRes, assignmentsRes, projectsRes, deptsRes] =
    await Promise.all([
      fetchAdminMembersRows(),
      supabase.from("member_memberships").select("member_id, membership_type"),
      supabase
        .from("member_projects")
        .select("member_id, project_id, role, department_slug"),
      supabase
        .from("projects")
        .select("id, name, status")
        .order("name", { ascending: true }),
      supabase
        .from("departments")
        .select("slug, name")
        .order("name", { ascending: true }),
    ]);

  for (const res of [
    membersRes,
    membershipsRes,
    assignmentsRes,
    projectsRes,
    deptsRes,
  ]) {
    if (res.error) {
      logger.error("Error loading member registry:", res.error);
      throw res.error;
    }
  }

  const projects = (projectsRes.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
  }));
  const departments = (deptsRes.data ?? []).map((d) => ({
    slug: d.slug,
    name: d.name || d.slug,
  }));

  const projectName = new Map(projects.map((p) => [p.id, p.name]));
  const departmentName = new Map(departments.map((d) => [d.slug, d.name]));

  const membershipsByMember = new Map();
  for (const row of membershipsRes.data ?? []) {
    const list = membershipsByMember.get(row.member_id) ?? [];
    list.push(row.membership_type);
    membershipsByMember.set(row.member_id, list);
  }

  const assignmentsByMember = new Map();
  for (const row of assignmentsRes.data ?? []) {
    const list = assignmentsByMember.get(row.member_id) ?? [];
    list.push({
      projectId: row.project_id,
      projectName: projectName.get(row.project_id) ?? "Unknown project",
      role: row.role ?? "",
      departmentSlug: row.department_slug ?? "",
      departmentName:
        departmentName.get(row.department_slug) ?? row.department_slug ?? "",
    });
    assignmentsByMember.set(row.member_id, list);
  }

  const members = (membersRes.data ?? []).map((m) => ({
    id: m.id,
    createdAt: m.created_at,
    fullName: m.full_name ?? "",
    avatarUrl: m.avatar_url ?? "",
    personalEmail: m.personal_email ?? "",
    robotumEmail: m.robotum_email ?? "",
    phone: m.phone ?? "",
    university: m.university ?? "",
    studyProgram: m.study_program ?? "",
    linkedinUrl: m.linkedin_url ?? "",
    status: m.status ?? "",
    // When the current status started (null = unknown); see memberStatusTiming.
    statusDates: {
      inactiveSince: m.inactive_since ?? null,
      suspendedAt: m.suspended_at ?? null,
      graduatedAt: m.graduated_at ?? null,
      deletedAt: m.deleted_at ?? null,
    },
    lifecycleExempt: Boolean(m.lifecycle_exempt),
    memberships: membershipsByMember.get(m.id) ?? [],
    projects: (assignmentsByMember.get(m.id) ?? []).sort((a, b) =>
      a.projectName.localeCompare(b.projectName),
    ),
  }));

  return { members, projects, departments };
}

// "" -> null so optional text columns stay NULL instead of empty strings.
function optionalText(value) {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed : null;
}

/**
 * Admin: create or update a member's personal record. Returns the member id.
 */
export async function adminUpsertMember(member) {
  const payload = {
    full_name: (member.fullName ?? "").trim(),
    personal_email: (member.personalEmail ?? "").trim(),
    robotum_email: optionalText(member.robotumEmail),
    phone: optionalText(member.phone),
    university: optionalText(member.university),
    study_program: optionalText(member.studyProgram),
    linkedin_url: optionalText(member.linkedinUrl),
  };
  if (member.status) payload.status = member.status;

  if (member.id) {
    const { error } = await supabase
      .from("members_personal")
      .update(payload)
      .eq("id", member.id);
    if (error) throw error;
    return member.id;
  }

  const { data, error } = await supabase
    .from("members_personal")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/** Admin: change a member's lifecycle status (DB triggers handle offboarding). */
export async function adminSetMemberStatus(memberId, status) {
  const { error } = await supabase
    .from("members_personal")
    .update({ status })
    .eq("id", memberId);
  if (error) throw error;
}

/**
 * Admin: make a member's club memberships exactly `nextTypes`.
 * Only the difference is written, so untouched rows are left alone.
 */
export async function adminSetMemberMemberships(
  memberId,
  nextTypes,
  currentTypes = [],
) {
  const next = new Set(nextTypes);
  const current = new Set(currentTypes);
  const toAdd = [...next].filter((t) => !current.has(t));
  const toRemove = [...current].filter((t) => !next.has(t));

  if (toRemove.length > 0) {
    const { error } = await supabase
      .from("member_memberships")
      .delete()
      .eq("member_id", memberId)
      .in("membership_type", toRemove);
    if (error) throw error;
  }

  if (toAdd.length > 0) {
    const { error } = await supabase
      .from("member_memberships")
      .insert(
        toAdd.map((type) => ({ member_id: memberId, membership_type: type })),
      );
    if (error) throw error;
  }
}

/**
 * Admin: add a member to a project, or update their role/department if they
 * are already on it (primary key is project_id + member_id).
 */
export async function adminUpsertMemberProject({
  memberId,
  projectId,
  role,
  departmentSlug,
}) {
  const { error } = await supabase.from("member_projects").upsert(
    {
      member_id: memberId,
      project_id: projectId,
      role: (role ?? "").trim(),
      department_slug: departmentSlug,
    },
    { onConflict: "project_id,member_id" },
  );
  if (error) throw error;
}

/** Admin: remove a member from a project. */
export async function adminRemoveMemberProject(memberId, projectId) {
  const { error } = await supabase
    .from("member_projects")
    .delete()
    .eq("member_id", memberId)
    .eq("project_id", projectId);
  if (error) throw error;
}
