// src/data/projectsApi.js
import { supabase } from "@lib/supabaseClient";
/**
 * Base column list for all project queries.
 * Must match your actual DB schema.
 */
const PROJECT_FIELDS = `
  id,
  created_at,
  slug,
  title,
  category,
  summary,
  description,
  status,
  team_name,
  used_tools,
  future_plans,
  cover_url,
  tags,
  is_featured
`;

/**
 * Fetch featured projects (for homepage section)
 */
export async function fetchFeaturedProjects({ limit } = {}) {
  let query = supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading featured projects:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch a single project by slug (for ProjectDetail page)
 */
export async function fetchProjectBySlug(slug) {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error loading project by slug:", error);
    throw error;
  }

  return data; // can be null if not found
}

/**
 * Fetch projects with optional filters (for Projects list page).
 */
export async function fetchProjects(options = {}) {
  const { category, teamName, tag, search, isFeatured } = options;

  let query = supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (teamName) {
    query = query.eq("team_name", teamName);
  }

  if (typeof isFeatured === "boolean") {
    query = query.eq("is_featured", isFeatured);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`title.ilike.${pattern},summary.ilike.${pattern}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading projects with filters:", error);
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------
   ADMIN HELPERS
   Used by AdminProjects page (CRUD)
------------------------------------------------------- */

/**
 * Admin: fetch all projects (no filters).
 * You can reuse this for the admin list.
 */
export async function adminFetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects (admin):", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Admin: insert OR update a project.
 * Expects a `project` object (from your admin form).
 */
export async function adminUpsertProject(project) {
  // Slug: either from form, or auto-generated from title
  let slug = (project.slug || "").trim();
  if (!slug && project.title) {
    slug = project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Tags: allow either array or comma-separated string
  const tags = Array.isArray(project.tags)
    ? project.tags
    : (project.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

  const payload = {
    slug,
    title: project.title?.trim(),
    category: project.category, // must match project_category enum
    summary: project.summary?.trim(),
    description: project.description?.trim(),
    status: project.status || null, // if you use project_status enum
    team_name: project.team_name?.trim(),
    used_tools: project.used_tools?.trim() || null,
    future_plans: project.future_plans?.trim() || null,
    cover_url: project.cover_url?.trim(),
    tags,
    is_featured: !!project.is_featured,
  };

  // Basic validation to avoid DB errors
  if (!payload.title) throw new Error("Title is required.");
  if (!payload.slug) throw new Error("Slug is required.");
  if (!payload.summary) throw new Error("Summary is required.");
  if (!payload.description) throw new Error("Description is required.");
  if (!payload.team_name) throw new Error("Team name is required.");
  if (!payload.cover_url) throw new Error("Cover image URL is required.");
  if (!payload.category) throw new Error("Category is required.");
  if (!Array.isArray(payload.tags) || payload.tags.length === 0) {
    throw new Error("At least one tag is required.");
  }

  if (project.id) {
    // Update existing project
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", project.id);

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  } else {
    // Insert new project
    const { error } = await supabase.from("projects").insert(payload);

    if (error) {
      console.error("Error inserting project:", error);
      throw error;
    }
  }
}

/**
 * Admin: delete project by id
 */
export async function adminDeleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
