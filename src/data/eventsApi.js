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
  format,
  is_featured,
  cover_url,
  description,
  summary,
  registration_url,
  start_at,
  end_at
`;

/**
 * Fetch events for homepage, ordered by start time.
 */
export async function fetchEventsForHomepage() {
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

/**
 * Generic fetch (if you need filters later).
 */
export async function fetchEvents(options = {}) {
  const { fromDate, toDate, category } = options;

  let query = supabase
    .from("events")
    .select(EVENT_FIELDS)
    .order("start_at", { ascending: true });

  if (fromDate) {
    query = query.gte("start_at", fromDate);
  }
  if (toDate) {
    query = query.lte("start_at", toDate);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading events (filtered):", error);
    throw error;
  }

  return data ?? [];
}