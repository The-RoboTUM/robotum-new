import { supabase } from "@lib/supabaseClient";

const PREREGISTRATION_FIELDS = `
  id,
  created_at,
  first_name,
  last_name,
  email,
  field_of_study,
  background
`;

const PREREGISTRATIONS_TABLE = "preregistrations";

export async function submitRoboticsWeekPreregistration(payload) {
  const data = {
    first_name: payload.first_name?.trim(),
    last_name: payload.last_name?.trim(),
    email: payload.email?.trim().toLowerCase(),
    field_of_study: payload.field_of_study?.trim() || null,
    background: payload.background?.trim() || null,
  };

  if (!data.first_name) throw new Error("First name is required.");
  if (!data.last_name) throw new Error("Last name is required.");
  if (!data.email) throw new Error("Email is required.");

  const { error } = await supabase
    .from(PREREGISTRATIONS_TABLE)
    .insert(data)
    .select(PREREGISTRATION_FIELDS)
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      throw new Error("This email is already registered.");
    }
    console.error("Error creating pre-registration:", error);
    throw error;
  }

  return true;
}