// src/components/admin/members/memberStatus.js
// Status knowledge for the admin Directory: what a status change sets off in
// the DB, and how long a member has had their status / what happens next.
// Keyed by status value: a status added later in the DB simply gets no extra
// info here instead of breaking anything.
import { MEMBER_STATUS_DELETED } from "@data";
import { MEMBER_LIFECYCLE } from "@config/memberLifecycle";
import { addDays, daysFromNow, toDate } from "@utils/relativeTime";

/** Warnings shown before saving a status that triggers DB automation. */
export const STATUS_SIDE_EFFECTS = {
  graduated:
    "This runs make_alumni: every membership except Founders is replaced by Alumni and their access is updated.",
  [MEMBER_STATUS_DELETED]:
    "This offboards them: all team assignments and club memberships are removed and their Google, Slack and Notion access is revoked. Changing the status back later does NOT restore those.",
};

// For each status: which date marks its start, and (for the lifecycle
// statuses) what the daily Edge Function does next and after how many days.
const STATUS_TIMELINE = {
  inactive: {
    sinceKey: "inactiveSince",
    next: { label: "Suspension", afterDays: MEMBER_LIFECYCLE.suspendAfterInactiveDays },
  },
  suspended: {
    sinceKey: "suspendedAt",
    next: { label: "Deletion", afterDays: MEMBER_LIFECYCLE.deleteAfterSuspendedDays },
  },
  graduated: { sinceKey: "graduatedAt" },
  [MEMBER_STATUS_DELETED]: { sinceKey: "deletedAt" },
};

/**
 * @returns {null | {
 *   since: Date|null,                 // null = not recorded
 *   next: null | { label, date, daysLeft, overdue },
 *   nextSkippedReason: string,        // why there is no countdown although the status has one
 * }}
 * null when the status has no timeline at all (e.g. active, paused).
 */
export function getStatusTiming(member, now = new Date()) {
  const timeline = STATUS_TIMELINE[member.status];
  if (!timeline) return null;

  const since = toDate(member.statusDates?.[timeline.sinceKey]);
  const result = { since, next: null, nextSkippedReason: "" };
  if (!timeline.next) return result;

  // The lifecycle function ignores these members (see its header comment).
  if (member.lifecycleExempt) {
    result.nextSkippedReason = "Exempt from the automatic lifecycle";
    return result;
  }
  if (!member.robotumEmail) {
    result.nextSkippedReason = "No roboTUM email, so not handled by the lifecycle";
    return result;
  }
  if (!since) return result;

  const date = addDays(since, timeline.next.afterDays);
  const daysLeft = daysFromNow(date, now);
  result.next = { label: timeline.next.label, date, daysLeft, overdue: daysLeft <= 0 };
  return result;
}

/** Sort key: soonest upcoming lifecycle step first, members without one last. */
export function nextStepSortValue(member, now = new Date()) {
  const next = getStatusTiming(member, now)?.next;
  return next ? next.date.getTime() : Number.POSITIVE_INFINITY;
}
