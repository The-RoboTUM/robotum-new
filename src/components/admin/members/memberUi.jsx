// src/components/admin/members/memberUi.jsx
// Small building blocks shared by the /admin/members tabs.
import clsx from "clsx";
import { formatEnumLabel } from "@utils/formatCategory";

// Colour per known member_status value. A status added later in the DB still
// renders (neutral tone, label derived from the value) - no code change needed.
const STATUS_TONES = {
  active: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  inactive: "border-white/15 bg-white/5 text-white/60",
  paused: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  graduated: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  deleted: "border-red-400/40 bg-red-500/10 text-red-200",
};
const NEUTRAL_TONE = "border-white/15 bg-white/5 text-white/70";

export function MemberStatusBadge({ status }) {
  if (!status) return null;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_TONES[status] ?? NEUTRAL_TONE,
      )}
    >
      {formatEnumLabel(status)}
    </span>
  );
}

/** Small pill for a club membership type / project name. */
export function MemberTag({ children }) {
  return (
    <span className="inline-block rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/70">
      {children}
    </span>
  );
}

/**
 * Toggle-button filter row. `options`: [{ value, label, count }].
 */
export function MemberFilterChips({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "border-blue-300/40 bg-accent text-white"
                : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span className={active ? "text-white/80" : "text-white/45"}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Labelled <select> of members for the editor side cards. */
export function MemberSelect({ id, members, value, onChange, label = "Member" }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs text-white/70">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      >
        <option value="">Select a member…</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.fullName}
            {member.status ? ` (${formatEnumLabel(member.status)})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

/** One row in a member list: name + badge, free-form details, actions. */
export function MemberListItem({ member, selected, children, actions }) {
  return (
    <li
      className={clsx(
        "flex items-start justify-between gap-3 card-surface card-surface-hover px-4 py-3",
        selected && "border-accent/60 bg-white/10",
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-white">{member.fullName}</p>
          <MemberStatusBadge status={member.status} />
        </div>
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-col gap-2">{actions}</div>}
    </li>
  );
}

/** Small stat tile, same look as the dashboard counters. */
export function MemberStat({ label, value }) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

/**
 * On narrow screens the editor card sits below the list; bring it into view
 * when a member is picked from the list so the click visibly does something.
 */
export function revealEditor(ref) {
  if (!ref?.current || typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  ref.current.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

/** Case-insensitive search over name + emails. */
export function matchesMemberQuery(member, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [member.fullName, member.personalEmail, member.robotumEmail].some(
    (field) => field && field.toLowerCase().includes(q),
  );
}
