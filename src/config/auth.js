// src/config/auth.js
// Settings for admin sign-up / sign-in. Keep MIN_PASSWORD_LENGTH in line with
// Supabase → Authentication → Sign In / Providers → Email → minimum password length.

// Sign-up only works for members_personal.robotum_email addresses (checked
// server-side by the hook_before_user_created Auth hook). This is just the
// early, friendlier client-side hint.
export const ROBOTUM_EMAIL_DOMAIN = "robotum.info";

export const MIN_PASSWORD_LENGTH = 8;

// Paths Supabase email links send people back to. Both must be listed under
// Supabase → Authentication → URL Configuration → Redirect URLs.
export const AUTH_REDIRECT_PATHS = {
  afterSignupConfirm: "/admin/login",
  passwordReset: "/admin/reset-password",
};
