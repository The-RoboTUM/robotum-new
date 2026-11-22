// src/data/authApi.js
// All Supabase Auth + admin-profile access lives here so UI components never
// touch `supabase.auth.*` or the `profiles` table directly.
import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";

// Read the is_admin flag for a user id. Throws on query error.
async function fetchIsAdmin(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    logger.error("Error loading profile:", error);
    throw error;
  }
  return Boolean(data?.is_admin);
}

/**
 * What the signed-in user may do in the admin area.
 *
 * Source of truth is the `my_access()` RPC (supabase/migrations/0006): one row
 * per admin area with can_read / can_write, from `access_grants` + is_admin.
 * If that RPC isn't deployed yet, fall back to the old is_admin-only rule so
 * existing admins are never locked out by deploy order.
 *
 * @returns {Promise<{ isAdmin: boolean, canEnter: boolean,
 *   areas: Record<string, { read: boolean, write: boolean }> }>}
 *   Throws if the profile can't be read.
 */
export async function fetchMyAccess(userId) {
  const isAdmin = await fetchIsAdmin(userId);

  const { data, error } = await supabase.rpc("my_access");
  if (error) {
    logger.warn("my_access() unavailable, falling back to is_admin:", error);
    return { isAdmin, canEnter: isAdmin, areas: {} };
  }

  const areas = {};
  for (const row of data ?? []) {
    if (!row?.area) continue;
    areas[row.area] = {
      read: Boolean(row.can_read),
      write: Boolean(row.can_write),
    };
  }

  const canEnter = isAdmin || Object.values(areas).some((a) => a.read);
  return { isAdmin, canEnter, areas };
}

const NO_ACCESS_MESSAGE =
  "Your account doesn’t have access to the admin area (yet). Ask a board member if you think it should.";

/**
 * Verify the current session may enter the admin area.
 * @returns {Promise<{ allowed: boolean, error: string, access: object|null }>}
 *   `error` is "" when simply not logged in (caller supplies a default prompt).
 */
export async function verifyAdminAccess() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    logger.error("Error getting session:", sessionError);
    return {
      allowed: false,
      error: "Failed to verify session. Please log in again.",
      access: null,
    };
  }

  if (!session) {
    return { allowed: false, error: "", access: null };
  }

  try {
    const access = await fetchMyAccess(session.user.id);
    if (!access.canEnter) {
      logger.warn("User without admin access tried to enter the admin area.");
      return { allowed: false, error: NO_ACCESS_MESSAGE, access };
    }
    return { allowed: true, error: "", access };
  } catch {
    return {
      allowed: false,
      error: "Failed to load your profile. Please contact an admin.",
      access: null,
    };
  }
}

/**
 * Sign in with email/password and require admin-area access.
 * Signs the user out again if the account has no access.
 * @returns {Promise<{ ok: boolean, error: string }>}
 */
export async function signInAdmin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    logger.error("Login error:", error);
    return { ok: false, error: friendlyAuthError(error, "sign in") };
  }

  const user = data.user;
  if (!user) {
    return { ok: false, error: "No user returned from sign-in." };
  }

  let access;
  try {
    access = await fetchMyAccess(user.id);
  } catch {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Could not load your profile. Please contact an admin.",
    };
  }

  if (!access.canEnter) {
    await supabase.auth.signOut();
    return { ok: false, error: NO_ACCESS_MESSAGE };
  }

  return { ok: true, error: "" };
}

/**
 * Create an account with a self-chosen password. Supabase emails a
 * confirmation link; the account works once it's clicked. Whether the email
 * may sign up at all is decided server-side by the Auth hook.
 * @returns {Promise<{ ok: boolean, error: string }>}
 */
export async function signUpMember({ email, password, redirectTo }) {
  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    logger.error("Sign-up error:", error);
    return { ok: false, error: friendlyAuthError(error, "create your account") };
  }
  return { ok: true, error: "" };
}

/**
 * Send a password-reset link. Always reports success to the caller so the
 * form doesn't reveal which addresses have accounts.
 */
export async function requestPasswordReset({ email, redirectTo }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });
  if (error) {
    logger.error("Password reset request error:", error);
    // Rate limits are the one error worth surfacing.
    if (error.status === 429) {
      return { ok: false, error: friendlyAuthError(error, "send the link") };
    }
  }
  return { ok: true, error: "" };
}

/** True if a session exists (e.g. after opening a password-reset link). */
export async function hasActiveSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    logger.error("Error getting session:", error);
    return false;
  }
  return Boolean(data.session);
}

/** Set a new password for the signed-in user (password-reset flow). */
export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    logger.error("Password update error:", error);
    return { ok: false, error: friendlyAuthError(error, "update your password") };
  }
  return { ok: true, error: "" };
}

// Supabase error messages are fine for most cases; make the common ones clearer.
function friendlyAuthError(error, action) {
  const message = error?.message || "";
  if (error?.status === 429 || /rate limit/i.test(message)) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (/invalid login credentials/i.test(message)) {
    return "Wrong email or password.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email first - check your inbox for the link we sent.";
  }
  if (/same.*password|different from the old/i.test(message)) {
    return "Please choose a password you haven’t used before.";
  }
  return message || `Could not ${action}. Please try again.`;
}

// Current signed-in user's email, or "" if none / on error.
export async function getSessionEmail() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    logger.error("Failed to load admin session:", error);
    return "";
  }
  return data.session?.user?.email || "";
}

/**
 * Subscribe to auth state changes. The callback receives the current user
 * email (or ""). Returns the subscription - call `.unsubscribe()` to clean up.
 */
export function onAuthEmailChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.email || "");
  });
  return subscription;
}

// Sign out the current user.
export async function signOutAdmin() {
  await supabase.auth.signOut();
}
