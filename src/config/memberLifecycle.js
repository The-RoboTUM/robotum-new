// src/config/memberLifecycle.js
// Mirrors RULES in the member-deactivation-lifecycle Edge Function (run daily
// by pg_cron). Only used to DISPLAY countdowns in /admin/members - the Edge
// Function decides. If you change the rules there, change them here too.
export const MEMBER_LIFECYCLE = {
  // active -> inactive, counted from "last seen" = the later of the last
  // Google sign-in (or account creation if never signed in) and reactivated_at
  inactiveAfterDays: 60, // RULES.warnAfterDays
  inactiveAfterDaysNeverSignedIn: 14, // RULES.warnNeverSignedInDays
  // inactive -> suspended, counted from members_personal.inactive_since
  suspendAfterInactiveDays: 30, // RULES.suspendAfterWarningDays
  // suspended -> deleted, counted from members_personal.suspended_at
  deleteAfterSuspendedDays: 14, // RULES.deleteAfterSuspensionDays
};
