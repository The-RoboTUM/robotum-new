// Pure helpers behind the /projects page filters (kept here so they're testable).

/**
 * Which category tab is active. Trusts `?type=` while the enum is still
 * loading (it may be a DB-only value); afterwards an unknown value falls back
 * to the first tab.
 */
export function resolveActiveTab(typeParam, tabs, tabsLoading) {
  if (typeParam && (tabsLoading || tabs.some((t) => t.value === typeParam))) {
    return typeParam;
  }
  return tabs[0]?.value || "";
}

/** Projects in `category` matching the search text and curated tag. */
export function filterProjects(projects, { category, query = "", tag = "" }) {
  const q = query.toLowerCase();
  return projects.filter((p) => {
    if (p.category !== category) return false;

    const content = [p.name, p.summary, ...(p.tags || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (q && !content.includes(q)) return false;

    return tag ? (p.tags || []).includes(tag) : true;
  });
}

/** Active (or status-less) projects are current; paused/completed are history. */
export function splitByStatus(projects) {
  const current = [];
  const past = [];
  for (const p of projects) {
    (!p.status || p.status === "active" ? current : past).push(p);
  }
  return { current, past };
}
