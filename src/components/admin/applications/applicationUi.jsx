// Small helpers shared by the /admin/applications components.
import clsx from "clsx";
import { APPLICATION_STATUSES } from "@data";

const STATUS_TONES = {
  received: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  in_review: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  interview: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  accepted: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  rejected: "border-red-400/40 bg-red-500/10 text-red-200",
  withdrawn: "border-white/15 bg-white/5 text-white/60",
};

export const statusLabel = (value) =>
  APPLICATION_STATUSES.find((s) => s.value === value)?.label ?? value;

export function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_TONES[status] ?? "border-white/15 bg-white/5 text-white/70",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export const fullName = (a) =>
  `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim();
