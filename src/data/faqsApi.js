// src/data/faqsApi.js
import { supabase } from "@lib/supabaseClient";

export const FAQ_CATEGORIES = [
  { value: "About RoboTUM", label: "About RoboTUM" },
  { value: "Membership & Recruitment", label: "Membership & Recruitment" },
  {
    value: "Collaboration & Partnerships",
    label: "Collaboration & Partnerships",
  },
  { value: "Contact", label: "Contact" },
];

export async function fetchFaqs() {
  // You can change order if you later add a sort_order column
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading FAQs:", error);
    throw error;
  }

  return data ?? [];
}

const FAQ_SELECT = `
  id,
  created_at,
  question,
  answer,
  category
`;

export async function adminFetchFaqs() {
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpsertFaq(faq) {
  const payload = {
    question: faq.question.trim(),
    answer: faq.answer.trim(),
    category: faq.category.trim(), // enum, NOT NULL
  };

  if (faq.id) {
    const { error } = await supabase
      .from("faqs")
      .update(payload)
      .eq("id", faq.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("faqs").insert(payload);
    if (error) throw error;
  }
}

export async function adminDeleteFaq(id) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}
