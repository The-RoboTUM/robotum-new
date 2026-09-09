// ─────────────────────────────────────────────────────────────────────────
// APPLICATIONS - manual values for the membership application campaign.
// Single source of truth for the hero announcement, the news ticker and the
// whole "Join us" application flow. Not stored in Supabase (see also
// src/config/fundraising.js for the same pattern).
//
// TO OPEN / CLOSE APPLICATIONS:
//   1. Set `isOpen` to true (open) or false (closed).
//   2. Paste the Google Form link into `formUrl` (must start with http).
//   3. Set `deadline` ("YYYY-MM-DD") + `deadlineTime` - leave "" to hide.
//   4. Commit + redeploy (Vercel auto-deploys on push to main).
//
// While `formUrl` is still the placeholder below, the UI shows a
// "link coming soon" state instead of a dead button - so the page can ship
// before the form exists.
// ─────────────────────────────────────────────────────────────────────────

/** Sentinel used until the real Google Form link is available. */
export const FORM_URL_PLACEHOLDER = "REPLACE_WITH_GOOGLE_FORM_LINK";

export const applications = {
  isOpen: true, // ← master switch: open / closed
  semester: "Winter Semester 2026/27", // long label used in headings + copy
  semesterShort: "WS 2026/27", // compact label used in chips/ticker
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSeYFHXS8hFRGdnU9vZuH8o7RhZwF9frOhkTzSv6_EMEjB-N6A/viewform", // ← the live Google Form
  deadline: "2026-10-21", // ← e.g. "2026-10-15" ("" hides the deadline)
  deadlineTime: "23:59", // shown next to the deadline ("" hides it)
  durationLabel: "30-45 minutes", // rough time to fill out the form
  locationNote: "On-site in Munich - remote members can't be accepted",
  contactEmail: "operations@robotum.info",
};

/** True once a real (http) form link has replaced the placeholder. */
export const hasApplicationForm = /^https?:\/\//.test(applications.formUrl);

/** Applications are only truly actionable when open AND linked. */
export const applicationsOpen = applications.isOpen;

/** "15 Oct 2026" - empty string when no deadline is configured/parseable. */
export function formatApplicationDeadline(value = applications.deadline) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "21 Oct 2026, 23:59" - falls back to the plain date when no time is set. */
export function formatApplicationDeadlineWithTime() {
  const date = formatApplicationDeadline();
  if (!date) return "";
  return applications.deadlineTime
    ? `${date}, ${applications.deadlineTime}`
    : date;
}

/** Messages for the homepage <NewsTicker /> - derived from the state above. */
export function applicationTickerMessages() {
  const deadline = formatApplicationDeadline();

  if (!applications.isOpen) {
    return [
      `${applications.semesterShort} applications are closed`,
      "Follow our channels for the next application phase",
    ];
  }

  return [
    `Applications for ${applications.semester} are OPEN`,
    deadline
      ? `Apply by ${deadline} - we review on a rolling basis`
      : "Build robots with us - apply on the Join us page",
  ];
}
