// src/utils/formatCategory.js
// Category label formatting. Partner and event categories use different
// separators and fallbacks, so they stay as two functions.

// Title-case the first letter of each word: "next prototypes" -> "Next Prototypes".
function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Partner category labels (underscore-separated enum values).
 * e.g. "lead_sponsors" -> "Lead Sponsors". Empty -> "Partner".
 */
export function formatPartnerCategory(category) {
  if (!category) return "Partner";
  return titleCase(String(category).toLowerCase().replace(/_/g, " "));
}

/**
 * Event category labels (hyphen-separated slugs) with a known special case.
 * e.g. "tech-talk" -> "Tech Talk". Empty -> options.fallback (default "Event").
 */
export function formatEventCategory(category, { fallback = "Event" } = {}) {
  if (!category) return fallback;
  if (category === "innovation-and-entrepreneurship") {
    return "Innovation & Entrepreneurship";
  }
  return titleCase(String(category).replace(/-/g, " "));
}

/**
 * Project categories share the event slug format and the I&E special case,
 * but fall back to "Project". e.g. "technical" -> "Technical".
 */
export function formatProjectCategory(category) {
  return formatEventCategory(category, { fallback: "Project" });
}
