// src/data/pagination.js
// Internal helper for the admin `*Page` fetchers (not re-exported from @data).

/** Convert a 1-based page + page size into Supabase's inclusive `.range()` bounds. */
export function pageRange(page = 1, pageSize = 10) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const from = (safePage - 1) * safePageSize;
  return [from, from + safePageSize - 1];
}
