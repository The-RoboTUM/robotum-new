// src/data/eventsApi.js
import { supabase } from "@lib/supabaseClient";

const EVENT_FIELDS = `
  id,
  created_at,
  title,
  slug,
  location_name,
  location_url,
  category,
  is_featured,
  cover_url,
  description,
  summary,
  registration_url,
  start_at,
  end_at,
  format
`;

// ---------- PUBLIC HELPERS ----------

// List all events (for Events page)
export async function fetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .order("start_at", { ascending: true });

  if (error) {
    console.error("Error loading events:", error);
    throw error;
  }

  return data ?? [];
}
// ✅ used on homepage
export async function fetchEventsForHomepage() {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .gte("end_at", nowIso) // upcoming / ongoing
    .order("start_at", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error loading homepage events:", error);
    throw error;
  }

  return data ?? [];
}

// Single event by slug (for EventDetail page)
export async function fetchEventBySlug(slug) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error loading event by slug:", error);
    throw error;
  }

  return data; // can be null
}

// ---------- ADMIN HELPERS ----------

// Admin: list all events (no filtering)
export async function adminFetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .order("start_at", { ascending: false });

  if (error) {
    console.error("Error loading events (admin):", error);
    throw error;
  }

  return data ?? [];
}

// Admin: create or update event
export async function adminUpsertEvent(event) {
  // Normalize / generate slug
  let slug = (event.slug || "").trim();
  if (!slug && event.title) {
    slug = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Handle datetime-local values from the form
  // (if you pass strings like "2025-03-10T18:30", Postgres will parse them)
  const start_at = event.start_at
    ? new Date(event.start_at).toISOString()
    : null;
  const end_at = event.end_at
    ? new Date(event.end_at).toISOString()
    : null;

  const payload = {
    title: event.title?.trim(),
    slug,
    location_name: event.location_name?.trim(),
    location_url: event.location_url?.trim() || null,
    category: event.category, // must match event_category enum
    is_featured: !!event.is_featured,
    cover_url: event.cover_url?.trim() || null,
    description: event.description?.trim() || "",
    summary: event.summary?.trim() || "",
    registration_url: event.registration_url?.trim() || "",
    start_at,
    end_at,
    format: event.format, // must match event_format enum
  };

  if (!payload.title) throw new Error("Title is required.");
  if (!payload.slug) throw new Error("Slug is required.");
  if (!payload.category) throw new Error("Category is required.");
  if (!payload.format) throw new Error("Format is required.");
  if (!payload.start_at) throw new Error("Start date/time is required.");
  if (!payload.end_at) throw new Error("End date/time is required.");
  if (!payload.location_name) throw new Error("Location name is required.");
  if (!payload.registration_url) throw new Error("Registration URL is required.");

  if (event.id) {
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", event.id);

    if (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  } else {
    const { error } = await supabase.from("events").insert(payload);
    if (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  }
}

// Admin: delete event
export async function adminDeleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}