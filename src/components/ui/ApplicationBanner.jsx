import { Link } from "react-router-dom";
import {
  applications,
  applicationsOpen,
  formatApplicationDeadline,
} from "@config/applications";

/**
 * Announcement pill for an open application phase.
 * Renders nothing while applications are closed, so heroes stay clean.
 *
 * - `to`: internal route to link to; pass `null` for a static status pill
 *         (e.g. on the Join us page itself, where linking to /join is a no-op)
 * - `align`: "center" (centered heroes) | "start" (left-aligned heroes)
 */
export default function ApplicationBanner({
  to = "/join",
  align = "center",
  className = "",
}) {
  if (!applicationsOpen) return null;

  const isLink = Boolean(to);
  const Component = isLink ? Link : "div";
  const deadline = formatApplicationDeadline();

  const classes = [
    "inline-flex max-w-full items-center gap-2.5 rounded-full",
    "border border-white/15 bg-white/5 py-1.5 pl-3 pr-2.5 sm:gap-3 sm:pl-4 sm:pr-3.5",
    "backdrop-blur-md shadow-[0_8px_28px_rgba(37,99,235,0.18)]",
    isLink &&
      "group transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:shadow-[0_10px_34px_rgba(124,58,237,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    align === "center" && "mx-auto",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component {...(isLink ? { to } : {})} className={classes}>
      {/* Live indicator */}
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>

      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:text-xs">
        Applications open
      </span>

      <span
        className="hidden h-3.5 w-px bg-white/20 sm:block"
        aria-hidden="true"
      />

      {/* Compact label on phones, full semester name from sm upwards. */}
      <span className="truncate text-xs text-white/75 sm:text-sm">
        <span className="sm:hidden">{applications.semesterShort}</span>
        <span className="hidden sm:inline">{applications.semester}</span>
        {deadline && (
          <span className="hidden md:inline"> · until {deadline}</span>
        )}
      </span>

      {isLink && (
        <span
          aria-hidden="true"
          className="ml-0.5 shrink-0 text-white/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white"
        >
          →
        </span>
      )}
    </Component>
  );
}
