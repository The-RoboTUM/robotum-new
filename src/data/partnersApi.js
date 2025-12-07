// src/data/partnersApi.js
import { supabase } from "@lib/supabaseClient";

/**
 * Columns we fetch from public.partners
 * Must match your Supabase schema.
 *
 * create table public.partners (
 *   created_at   timestamptz not null default now(),
 *   name         text        not null,
 *   category     public.partner_category not null,
 *   logo_url     text        not null,
 *   website_url  text        null,
 *   id           uuid        not null default gen_random_uuid (),
 *   priority     bigint      null default 1,
 *   slug         text        not null,
 *   is_active    boolean     not null default false,
 *   ...
 * );
 */
const PARTNER_FIELDS = `
  id,
  created_at,
  name,
  category,
  logo_url,
  website_url,
  priority,
  slug,
  is_active
`;

/**
 * Small helper: add a cache-buster (?t=timestamp) to image URLs
 * so that when you replace a file in Supabase Storage with the same name,
 * browsers are forced to re-fetch it.
 *
 * We use `created_at` for now — if you later add an `updated_at` column,
 * just swap it in here.
 */
function addCacheBuster(url, updatedAt) {
  if (!url) return url;

  const t = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}t=${t}`;
}

/**
 * Public: fetch all *active* partners, with logo_url cache-busted.
 * Used by:
 *  - Home: PartnersSection
 *  - /partners: PartnerCategories
 */
export async function fetchActivePartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS)
    .eq("is_active", true)
    .order("priority", { ascending: true }) // custom ordering
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching active partners:", error);
    throw error;
  }

  const rows = data ?? [];

  // Attach cache-buster to logo_url
  return rows.map((p) => ({
    ...p,
    logo_url: addCacheBuster(p.logo_url, p.created_at),
  }));
}