// src/config/memberLifecycle.js
// Mirrors RULES in the member-deactivation-lifecycle Edge Function (run daily
// by pg_cron). Only used to DISPLAY countdowns in /admin/members - the Edge
// Function decides. If you change the rules there, change them here too.
//
// Two tracks, picked by whether the member has EVER signed in to Google
// (members_personal.last_sign_in):
//   signedIn:      60 days unseen -> inactive, +30 -> suspended, +14 -> deleted
//   neverSignedIn:  7 days after account creation -> inactive, +7 -> suspended, +7 -> deleted
// "Last seen" = the later of the last sign-in (or account creation if never
// signed in) and reactivated_at.
export const MEMBER_LIFECYCLE = {
  signedIn: {
    inactiveAfterDays: 60, // active -> inactive, from last seen
    suspendAfterInactiveDays: 30, // inactive -> suspended, from inactive_since
    deleteAfterSuspendedDays: 14, // suspended -> deleted, from suspended_at
  },
  neverSignedIn: {
    inactiveAfterDays: 7,
    suspendAfterInactiveDays: 7,
    deleteAfterSuspendedDays: 7,
  },
};
