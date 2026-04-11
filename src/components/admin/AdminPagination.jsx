import Button from "@components/ui/Button";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_unused, i) => i + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("...");
  }

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);
  return pages;
}

export default function AdminPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-white/65">
          Showing {from}-{to} of {totalItems}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="admin-page-size" className="text-xs text-white/60">
            Per page
          </label>
          <select
            id="admin-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-white/15 bg-black/30 px-2 py-1 text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalItems > pageSize && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </Button>

          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-1 text-xs text-white/40">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-8 min-w-8 rounded-md border px-2 text-xs transition-colors ${
                  isActive
                    ? "border-blue-300/40 bg-accent text-white"
                    : "border-white/15 bg-black/20 text-white/80 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            );
          })}

          <Button
            size="sm"
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
