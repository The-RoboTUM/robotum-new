// Spreadsheet-style list of applications: click a header to sort, tick rows
// for bulk actions, click a row (or the name) to open it.
import clsx from "clsx";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { PROJECT_TYPES } from "@config/applicationForm";
import { APPLICATION_STATUSES } from "@data";
import { formatDate, fullName, StatusBadge } from "./applicationUi";

const answersOf = (a) => a.answers ?? {};

// "13+" → 13, "Less than 8" → 7, "25+" → 26, "" → null.
function semesterNumber(value) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}
function hoursNumber(value) {
  if (!value) return null;
  if (/less/i.test(value)) return 7;
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return value.endsWith("+") ? n + 1 : n;
}

// "Technical University of Munich (TUM)" → "TUM"; full name in the tooltip.
const shortUniversity = (name) => name?.match(/\(([^)]+)\)\s*$/)?.[1] ?? name;

const projectType = (value) => {
  const type = PROJECT_TYPES.find((t) => t.value === value);
  return type?.short ?? type?.label ?? value ?? "";
};

const roles = (a) =>
  Array.isArray(answersOf(a).roles) ? answersOf(a).roles : [];

const text = (v) => (v ? String(v).toLowerCase() : null);

/**
 * `sortValue` returns a string/number (null = empty, always sorted last).
 * `className` is applied to both the header and the cells.
 */
export const APPLICATION_COLUMNS = [
  {
    key: "name",
    label: "Name",
    sortValue: (a) => text(fullName(a)),
  },
  {
    key: "status",
    label: "Status",
    sortValue: (a) => APPLICATION_STATUSES.findIndex((s) => s.value === a.status),
    render: (a) => <StatusBadge status={a.status} />,
  },
  {
    key: "skill",
    label: "Skill area",
    sortValue: (a) => text(a.main_skill_area),
    render: (a) => a.main_skill_area,
  },
  {
    key: "studies",
    label: "Studies",
    sortValue: (a) => text([a.degree, a.field_of_study].filter(Boolean).join(" ")),
    render: (a) => (
      <span className="block max-w-[14rem] truncate" title={a.field_of_study}>
        {[a.degree, a.field_of_study].filter(Boolean).join(" · ")}
      </span>
    ),
  },
  {
    key: "semester",
    label: "Sem.",
    className: "text-right",
    sortValue: (a) => semesterNumber(a.semester_of_study),
    render: (a) => a.semester_of_study,
  },
  {
    key: "university",
    label: "Uni",
    sortValue: (a) => text(shortUniversity(a.university)),
    render: (a) => <span title={a.university}>{shortUniversity(a.university)}</span>,
  },
  {
    key: "hours",
    label: "Hrs/wk",
    className: "text-right",
    sortValue: (a) => hoursNumber(answersOf(a).hoursPerWeek),
    render: (a) => answersOf(a).hoursPerWeek,
  },
  {
    key: "projectType",
    label: "Project type",
    sortValue: (a) => text(projectType(answersOf(a).projectType)),
    render: (a) => projectType(answersOf(a).projectType),
  },
  {
    key: "roles",
    label: "Roles",
    sortValue: (a) => text(roles(a).join(", ")),
    render: (a) => (
      <span className="block max-w-[16rem] truncate" title={roles(a).join(", ")}>
        {roles(a).join(", ")}
      </span>
    ),
  },
  {
    key: "cv",
    label: "CV",
    sortValue: (a) => (a.cv_path ? 1 : 0),
    render: (a) =>
      a.cv_path ? (
        <span className="text-emerald-300">Yes</span>
      ) : (
        <span className="text-white/35">-</span>
      ),
  },
  {
    key: "created_at",
    label: "Submitted",
    sortValue: (a) => a.created_at ?? null,
    render: (a) => formatDate(a.created_at),
  },
];

/** Sorted copy of `items`. Empty values always go last. */
export function sortApplications(items, { key, dir }) {
  const column = APPLICATION_COLUMNS.find((c) => c.key === key);
  if (!column) return items;
  const factor = dir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const va = column.sortValue(a);
    const vb = column.sortValue(b);
    const emptyA = va === null || va === undefined || va === "";
    const emptyB = vb === null || vb === undefined || vb === "";
    if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
    if (va < vb) return -1 * factor;
    if (va > vb) return 1 * factor;
    return 0;
  });
}

function SortIcon({ active, dir }) {
  const Icon = !active ? ChevronUpDownIcon : dir === "asc" ? ChevronUpIcon : ChevronDownIcon;
  return (
    <Icon
      aria-hidden="true"
      className={clsx("h-4 w-4 shrink-0", active ? "text-accent" : "text-white/30")}
    />
  );
}

export default function ApplicationsTable({
  rows,
  sort,
  onSort,
  selectedIds,
  onToggle,
  allSelected,
  someSelected,
  onToggleAll,
  selectAllLabel,
  onOpen,
}) {
  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs text-white/55">
            <th scope="col" className="w-10 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={onToggleAll}
                aria-label={selectAllLabel}
                className="h-4 w-4 cursor-pointer accent-accent"
              />
            </th>
            {APPLICATION_COLUMNS.map((col) => {
              const active = sort.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={clsx("px-2 py-1.5 font-medium", col.className)}
                >
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={clsx(
                      "inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      active && "text-white",
                    )}
                  >
                    {col.label}
                    <SortIcon active={active} dir={sort.dir} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((app) => {
            const checked = selectedIds.has(app.id);
            return (
              <tr
                key={app.id}
                onClick={() => onOpen(app.id)}
                className={clsx(
                  "cursor-pointer border-b border-white/5 text-white/75 transition-colors last:border-0 hover:bg-white/5",
                  checked && "bg-accent/10 hover:bg-accent/15",
                )}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(app.id)}
                    aria-label={`Select ${fullName(app)}`}
                    className="h-4 w-4 cursor-pointer accent-accent"
                  />
                </td>
                {APPLICATION_COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={clsx("whitespace-nowrap px-3.5 py-2", col.className)}
                  >
                    {col.key === "name" ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(app.id);
                        }}
                        className="rounded-sm text-left font-medium text-white hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {fullName(app) || "(no name)"}
                      </button>
                    ) : (
                      col.render(app)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
