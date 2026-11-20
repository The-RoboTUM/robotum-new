// src/config/memberLifecycle.js
// Mirrors RULES in the member-deactivation-lifecycle Edge Function (run daily
// by pg_cron). Only used to DISPLAY countdowns in /admin/members - the Edge
// Function decides. If you change the rules there, change them here too.
export const MEMBER_LIFECYCLE = {
  // inactive -> suspended, counted from members_personal.inactive_since
  suspendAfterInactiveDays: 30,
  // suspended -> deleted, counted from members_personal.suspended_at
  deleteAfterSuspendedDays: 14,
};
