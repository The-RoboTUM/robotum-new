import { supabase } from "@lib/supabaseClient";

/**
 * Fetch all active partners, ordered for display.
 * Used by homepage PartnersSection + PartnerCategories.
 */
export async function fetchActivePartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(
      "id, name, category, logo_url, website_url, is_active, priority, created_at, slug",
    )
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading partners:", error);
    throw error;
  }

  return data ?? [];
}