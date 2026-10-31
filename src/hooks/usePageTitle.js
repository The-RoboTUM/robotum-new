// src/hooks/usePageTitle.js
import { useEffect } from "react";

/**
 * Set `document.title` and jump to the top of the page on mount.
 *
 * @param {string} title       full document title, e.g. "Events | roboTUM"
 * @param {*}      [scrollKey] scroll to top again whenever this changes
 *                             (e.g. the route `slug` on detail pages)
 */
export function usePageTitle(title, scrollKey) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [scrollKey]);
}

export default usePageTitle;
