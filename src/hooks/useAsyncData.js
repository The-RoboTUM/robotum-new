// src/hooks/useAsyncData.js
import { useCallback, useEffect, useState } from "react";
import { logger } from "@utils/logger";

/**
 * Run an async loader on mount (and whenever `deps` change) with the standard
 * loading / error / data lifecycle. Replaces the repeated
 * useState + useEffect + try/catch/finally fetch pattern across components.
 *
 * @param {() => Promise<any>} asyncFn   loader; returns the value to store in `data`
 * @param {Array} deps                   re-run when any of these change (like useEffect deps)
 * @param {object} [options]
 * @param {string} [options.errorMessage]  user-facing message shown on failure
 * @param {*}      [options.initialData]    initial value for `data` (default null)
 * @returns {{ data: any, loading: boolean, error: string, reload: () => void }}
 */
export function useAsyncData(
  asyncFn,
  deps = [],
  {
    errorMessage = "Something went wrong. Please try again later.",
    initialData = null,
  } = {},
) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);

  const reload = useCallback(() => setReloadIndex((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.resolve()
      .then(asyncFn)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        logger.error(errorMessage, err);
        setError(errorMessage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // asyncFn / errorMessage are intentionally excluded; `deps` controls re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadIndex]);

  return { data, loading, error, reload };
}

export default useAsyncData;
