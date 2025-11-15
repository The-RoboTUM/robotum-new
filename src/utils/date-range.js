// src/utils/dateUtils.js

export function formatEventDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  const sameMonthAndYear =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  const fullOpts = { day: "numeric", month: "short", year: "numeric" };

  // 1) Single-day event → "15 Feb, 2026"
  if (sameDay) {
    return startDate.toLocaleDateString("en-US", fullOpts);
  }

  // 2) Same month & year → "15–17 Feb, 2026"
  if (sameMonthAndYear) {
    const month = startDate.toLocaleString("en-US", { month: "short" });
    const year = startDate.getFullYear();
    return `${startDate.getDate()}–${endDate.getDate()} ${month}, ${year}`;
  }

  // 3) Different month/year → "30 Jan, 2026 – 2 Feb, 2026"
  const startStr = startDate.toLocaleDateString("en-US", fullOpts);
  const endStr = endDate.toLocaleDateString("en-US", fullOpts);
  return `${startStr} – ${endStr}`;
}