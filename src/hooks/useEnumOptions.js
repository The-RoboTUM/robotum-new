// src/hooks/useEnumOptions.js
import { useEffect, useState } from "react";
import { fetchEnumOptions, getFallbackEnumOptions } from "@data";

/**
 * Live `[{ value, label }]` options for a Supabase enum.
 *
 * Starts from the hardcoded fallback so the first render already has valid
 * options (callers can safely read `options[0].value` for form defaults), then
 * swaps in the DB values once they load. Failures keep the fallback, so a
 * dropdown is never empty.
 *
 * Not built on `useAsyncData` on purpose: that hook starts at
 * `initialData`/`null` with `loading: true` and has no non-empty guarantee,
 * which is exactly what would break form defaults here.
 *
 * @param {string} enumType  value from `ENUM_TYPES`
 * @param {object} [opts]
 * @param {boolean} [opts.includeAll]  ignore ENUM_ALLOWLIST (admin screens)
 * @returns {{ options: Array<{value: string, label: string}>, loading: boolean }}
 */
export function useEnumOptions(enumType, { includeAll = false } = {}) {
  const [options, setOptions] = useState(() =>
    getFallbackEnumOptions(enumType, { includeAll }),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setOptions(getFallbackEnumOptions(enumType, { includeAll }));
    setLoading(true);

    fetchEnumOptions(enumType, { includeAll })
      .then((live) => {
        if (!cancelled && live.length > 0) setOptions(live);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enumType, includeAll]);

  return { options, loading };
}

export default useEnumOptions;
