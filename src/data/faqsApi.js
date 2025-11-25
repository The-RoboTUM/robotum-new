// src/data/faqsApi.js
import { supabase } from '@lib/supabaseClient';

export async function fetchFaqs() {
  // You can change order if you later add a sort_order column
  const { data, error } = await supabase
    .from('faqs')           // or "FAQs" if your table name is still capitalized
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading FAQs:', error);
    throw error;
  }

  return data ?? [];
}