import { supabase } from "@lib/supabaseClient";

// These must match your enum labels in public.membership_type
export const MEMBER_CATEGORIES = [
  "Founders",
  "Department Heads",
  "Project Leads",
  "Seniors",
];

/**
 * Fetch team members for About page
 * - Uses members_personal + member_memberships
 * - Adds projects for Project Leads from projects.project_lead_id
 */
export async function fetchTeamMembers() {
  // 1) Get memberships + linked member info
  const { data: rows, error } = await supabase
    .from("member_memberships")
    .select(
      `
      membership_type,
      member:members_personal (
        id,
        full_name,
        avatar_url,
        linkedin_url
      )
    `,
    )
    .in("membership_type", MEMBER_CATEGORIES); // only the 3 categories we care about

  if (error) {
    console.error("Error fetching member memberships:", error);
    throw error;
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  // 2) Flatten rows into simple member objects (one per membership_type)
  const flatMembers = rows
    .filter((row) => row.member) // safety
    .map((row) => {
      const m = row.member;
      const membershipType = row.membership_type;

      const roleLabel =
        membershipType === "Founders"
          ? "Founder"
          : membershipType === "Department Heads"
            ? "Department Head"
            : membershipType === "Project Leads"
              ? "Project Lead"
              : membershipType === "Seniors"
                ? "Senior"
                : membershipType;

      return {
        id: m.id,
        name: m.full_name,
        photo: m.avatar_url,
        linkedin: m.linkedin_url,
        category: membershipType, // "Founders" | "Department Heads" | "Project Leads" | "Seniors"
        role: roleLabel,
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
      console.error("Error fetching projects for project leads:", projError);
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
    .not("story", "is", null);

  if (error) {
    console.error("Error fetching member stories:", error);
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
