// src/data/partnersApi.js
import { supabase } from "@lib/supabaseClient";

// ⚠️ MUST match your partner_category enum values in Supabase
export const PARTNER_CATEGORIES = [
  { value: "Lead Sponsor", label: "Lead Sponsor" },
  { value: "Sponsor", label: "Sponsor" },
  { value: "Industry Collaborator", label: "Industry Collaborator" },
  { value: "Academic Collaborator", label: "Academic Collaborator" },
];

const PARTNER_FIELDS = `
  id,
  created_at,
  name,
  category,
  logo_url,
  website_url,
  is_active,
  priority,
  slug
`;

// 🔹 Public: used by homepage/partners page
export async function fetchActivePartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS)
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading active partners:", error);
    throw error;
  }

  return data ?? [];
}

// 🔹 Admin: list all partners
export async function adminFetchPartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading partners (admin):", error);
    throw error;
  }

  return data ?? [];
}

// 🔹 Admin: create or update a partner
export async function adminUpsertPartner(partner) {
  const priority =
    partner.priority === "" || partner.priority == null
      ? null
      : Number(partner.priority);

  let slug = (partner.slug || "").trim();
  if (!slug && partner.name) {
    slug = partner.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const payload = {
    name: partner.name?.trim(),
    category: partner.category, // MUST match partner_category enum
    logo_url: partner.logo_url?.trim() || null,
    website_url: partner.website_url?.trim() || null,
    is_active: !!partner.is_active,
    priority,
    slug,
  };

  if (!payload.name) {
    throw new Error("Name is required.");
  }
  if (!payload.category) {
    throw new Error("Category is required.");
  }
  if (!payload.slug) {
    throw new Error("Slug is required.");
  }

  if (partner.id) {
    const { error } = await supabase
      .from("partners")
      .update(payload)
      .eq("id", partner.id);

    if (error) {
      console.error("Error updating partner:", error);
      throw error;
    }
  } else {
    const { error } = await supabase.from("partners").insert(payload);
    if (error) {
      console.error("Error inserting partner:", error);
      throw error;
    }
  }
}

// 🔹 Admin: delete
export async function adminDeletePartner(id) {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    console.error("Error deleting partner:", error);
    throw error;
  }
}
