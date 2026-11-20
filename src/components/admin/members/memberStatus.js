// src/components/admin/members/memberStatus.js
// Status knowledge for the admin Directory: what a status change sets off in
// the DB, and how long a member has had their status / what happens next.
// The lifecycle part mirrors processMember() in the member-deactivation-lifecycle
// Edge Function; numbers live in src/config/memberLifecycle.js.
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

// Statuses the lifecycle function processes (its HANDLED list).
const LIFECYCLE_STATUSES = ["active", "inactive", "suspended"];

// Which column marks the start of a status ("<Status> since …").
const SINCE_KEY = {
  inactive: "inactiveSince",
  suspended: "suspendedAt",
  graduated: "graduatedAt",
  [MEMBER_STATUS_DELETED]: "deletedAt",
};

/**
 * Sign-in facts as the lifecycle sees them.
 * lastSeen = later of (last sign-in, or account creation if never signed in)
 * and reactivated_at.
 */
export function getSignInInfo(member) {
  const lastSignIn = toDate(member.signIn?.lastSignIn);
  const created = toDate(member.signIn?.accountCreated);
  const reactivated = toDate(member.signIn?.reactivatedAt);
  const base = lastSignIn ?? created;
  const countsFromReactivation = Boolean(reactivated && (!base || reactivated > base));
  return {
    lastSignIn,
    created,
    reactivated,
    neverSignedIn: !lastSignIn,
    lastSeen: countsFromReactivation ? reactivated : base,
    countsFromReactivation,
  };
}

function nextStep(label, dueLabel, date, now) {
  const daysLeft = daysFromNow(date, now);
  return { label, dueLabel, date, daysLeft, overdue: daysLeft <= 0 };
}

/**
 * @returns {null | {
 *   hasSince: boolean,        // show "<Status> since …" (false for active)
 *   since: Date|null,         // null = not recorded
 *   signIn: object|null,      // getSignInInfo(), for statuses the lifecycle handles
 *   next: null | { label, dueLabel, date, daysLeft, overdue },
 *   note: string,             // why there is no countdown, or what happens instead
 * }}
 * null when there is nothing to show (e.g. paused).
 */
export function getStatusTiming(member, now = new Date()) {
  const { status } = member;
  const sinceKey = SINCE_KEY[status];
  const inLifecycle = LIFECYCLE_STATUSES.includes(status);
  if (!sinceKey && !inLifecycle) return null;

  const result = {
    hasSince: Boolean(sinceKey),
    since: sinceKey ? toDate(member.statusDates?.[sinceKey]) : null,
    signIn: null,
    next: null,
    note: "",
  };
  if (!inLifecycle) return result;

  // The lifecycle function skips these members entirely.
  if (member.lifecycleExempt) {
    result.note = "Exempt from the automatic lifecycle";
    return result;
  }
  if (!member.robotumEmail) {
    result.note = "No roboTUM email, so not handled by the lifecycle";
    return result;
  }

  result.signIn = getSignInInfo(member);
  const rules = result.signIn.neverSignedIn
    ? MEMBER_LIFECYCLE.neverSignedIn
    : MEMBER_LIFECYCLE.signedIn;

  if (status === "active") {
    const { lastSeen } = result.signIn;
    if (!lastSeen) {
      result.note = "Sign-in data arrives with the next daily run";
      return result;
    }
    result.next = nextStep(
      "Becomes inactive",
      "Becomes inactive with the next daily run",
      addDays(lastSeen, rules.inactiveAfterDays),
      now,
    );
    return result;
  }

  if (status === "inactive") {
    if (!result.since) {
      // Set to inactive by hand: the next run sends the warning and starts the clock.
      result.note = `Warning email + ${rules.suspendAfterInactiveDays}-day countdown start with the next daily run`;
      return result;
    }
    result.next = nextStep(
      "Suspension",
      "Suspension due - happens with the next daily run",
      addDays(result.since, rules.suspendAfterInactiveDays),
      now,
    );
    return result;
  }

  // suspended
  if (!result.since) {
    result.note = `Suspended in Google with the next daily run; deletion ${rules.deleteAfterSuspendedDays} days later`;
    return result;
  }
  result.next = nextStep(
    "Deletion",
    "Deletion due - happens with the next daily run",
    addDays(result.since, rules.deleteAfterSuspendedDays),
    now,
  );
  return result;
}

/** Sort key: soonest upcoming lifecycle step first, members without one last. */
export function nextStepSortValue(member, now = new Date()) {
  const next = getStatusTiming(member, now)?.next;
  return next ? next.date.getTime() : Number.POSITIVE_INFINITY;
}
