// src/data/robocastApi.js
import { supabase } from "@lib/supabaseClient";

const EP_FIELDS = `
  id,
  created_at,
  updated_at,
  title,
  slug,
  summary,
  description,
  cover_url,
  hero_image_url,
  spotify_url,
  apple_podcasts_url,
  youtube_url,
  other_links,
  published_at,
  duration_seconds,
  is_published,
  is_featured,
  season,
  episode_number,
  priority
`;

export async function fetchPublishedRobocastEpisodes() {
  const { data, error } = await supabase
    .from("robocast_episodes")
    .select(
      `${EP_FIELDS},
       robocast_episode_partners:robocast_episode_partners(
         role,
         priority,
         partner:partners(
           id,
           name,
           slug,
           category,
           logo_url,
           website_url
         )
       )`,
    )
    .eq("is_published", true)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true })
    .order("priority", {
      foreignTable: "robocast_episode_partners",
      ascending: true,
    });

  if (error) {
    console.error("Error loading published robocast episodes:", error);
    throw error;
  }

  return data ?? [];
}