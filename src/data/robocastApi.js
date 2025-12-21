import { supabase } from "@lib/supabaseClient";

const EP_FIELDS = `
  id, created_at, updated_at,
  title, slug, description,
  cover_url,
  spotify_url, apple_podcasts_url, youtube_url,
  other_links,
  published_at, duration_seconds,
  is_published, is_featured,
  priority,
  robocast_episode_partners:robocast_episode_partners(
    priority,
    partner:partners(id, name, logo_url, website_url, slug)
  )
`;

export async function fetchPublishedRobocastEpisodes() {
  const { data, error } = await supabase
    .from("robocast_episodes")
    .select(EP_FIELDS)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("priority", { ascending: true });

  if (error) throw error;

  // sort partner logos by join priority
  const normalized =
    (data ?? []).map((ep) => ({
      ...ep,
      robocast_episode_partners: (ep.robocast_episode_partners ?? []).sort(
        (a, b) => (a.priority ?? 1) - (b.priority ?? 1),
      ),
    })) ?? [];

  return normalized;
}