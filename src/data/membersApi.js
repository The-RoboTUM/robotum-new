// src/data/membersApi.js
import { supabase } from "@lib/supabaseClient";

// These must match your enum labels in public.membership_type
export const MEMBER_CATEGORIES = [
  "Founders",
  "Department Heads",
  "Project Leads",
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
    // No rows = no members visible
    return [];
  }

  // 2) Flatten rows into simple member objects (one per membership_type)
  const flatMembers = rows
    .filter((row) => row.member) // safety in case of dangling FKs
    .map((row) => {
      const m = row.member;
      const membershipType = row.membership_type;

      // "role" text displayed under the name – you can customize mapping if you want
      const roleLabel =
        membershipType === "Founders"
          ? "Founder"
          : membershipType === "Department Heads"
            ? "Department Head"
            : membershipType === "Project Leads"
              ? "Project Lead"
              : membershipType;

      return {
        id: m.id,
        name: m.full_name,
        photo: m.avatar_url, // avatar_url from members_personal
        linkedin: m.linkedin_url, // linkedin_url from members_personal
        category: membershipType, // used for filtering by tab
        role: roleLabel,
        projects: [], // we’ll fill this for project leads below
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
        title: p.title,
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
