// src/utils/passwordRules.js
import { MIN_PASSWORD_LENGTH, ROBOTUM_EMAIL_DOMAIN } from "@config/auth";

/** "" if the new password + confirmation are acceptable, else a message. */
export function validateNewPassword(password, confirmation) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirmation) {
    return "The two passwords don’t match.";
  }
  return "";
}

/** "" if the address is a roboTUM address, else a message. */
export function validateRobotumEmail(email) {
  const domain = email.trim().toLowerCase().split("@")[1];
  if (domain !== ROBOTUM_EMAIL_DOMAIN) {
    return `Use your @${ROBOTUM_EMAIL_DOMAIN} address.`;
  }
  return "";
}

/** Absolute URL for a Supabase email redirect (works on prod, previews and localhost). */
export function authRedirectUrl(path) {
  return `${window.location.origin}${path}`;
}
