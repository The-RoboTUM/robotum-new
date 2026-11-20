// src/utils/relativeTime.js
// Day-level relative dates for admin views ("12 days ago", "in 3 days").

const DAY_MS = 86_400_000;
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Parse a timestamp; null for empty/invalid input. */
export function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Whole calendar days from `now` to `date` (negative = in the past). */
export function daysFromNow(date, now = new Date()) {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOfDay(date) - startOfDay(now)) / DAY_MS);
}

/** "today", "yesterday", "12 days ago", "in 3 days", "in 2 months" … */
export function formatRelativeDays(date, now = new Date()) {
  const days = daysFromNow(date, now);
  if (Math.abs(days) >= 60) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(days, "day");
}

/** "3 Nov 2026" */
export function formatShortDate(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
