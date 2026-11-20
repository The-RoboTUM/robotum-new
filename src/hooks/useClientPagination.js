// src/hooks/useClientPagination.js
import { useMemo, useState } from "react";

/**
 * Page through an in-memory list with the same props AdminPagination expects.
 * For admin lists that are already fully loaded and filtered client-side.
 *
 * @param {Array} items
 * @param {object} [options]
 * @param {number} [options.pageSize]  initial page size (default 10)
 * @returns {{ pageItems: Array, paginationProps: object, resetPage: () => void }}
 */
export function useClientPagination(items, { pageSize: initialPageSize = 10 } = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  // Clamp instead of resetting in an effect: a shrinking list (filter, save)
  // simply lands on the last page that still exists.
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );

  return {
    pageItems,
    resetPage: () => setPage(1),
    paginationProps: {
      currentPage,
      pageSize,
      totalItems,
      onPageChange: setPage,
      onPageSizeChange: (next) => {
        setPageSize(next);
        setPage(1);
      },
    },
  };
}

export default useClientPagination;
