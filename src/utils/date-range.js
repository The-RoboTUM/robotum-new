export function formatEventDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : startDate; // fallback

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return ""; // or return start as-is, or "TBA"
  }

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  const sameMonthAndYear =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  const fullOpts = { day: "numeric", month: "short", year: "numeric" };

  if (sameDay) {
    return startDate.toLocaleDateString("en-US", fullOpts);
  }

  if (sameMonthAndYear) {
    const month = startDate.toLocaleString("en-US", { month: "short" });
    const year = startDate.getFullYear();
    return `${startDate.getDate()}–${endDate.getDate()} ${month}, ${year}`;
  }

  const startStr = startDate.toLocaleDateString("en-US", fullOpts);
  const endStr = endDate.toLocaleDateString("en-US", fullOpts);
  return `${startStr} – ${endStr}`;
}
