// src/pages/admin/AdminApplications.jsx
// Membership applications from /join/apply: searchable list + full detail
// (all answers, CV, status). The selected application lives in ?id= so a
// link or reload opens the same one.
//
// Access: today RLS (migration 0008) shows applications to admins only.
// Later: separate rights to view / rate / see ratings - adapt here then.
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@components/admin/AdminLayout";
import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminPagination from "@components/admin/AdminPagination";
import Button from "@components/ui/Button";
import ApplicationAnswers from "@components/sections/apply-sections/ApplicationAnswers";
import {
  MemberFilterChips,
  revealEditor,
} from "@components/admin/members/memberUi";
import { useAsyncData } from "@hooks/useAsyncData";
import { useClientPagination } from "@hooks/useClientPagination";
import {
  adminFetchApplications,
  adminGetApplicationCvUrl,
  adminSetApplicationStatus,
  APPLICATION_STATUSES,
} from "@data";
import { logger } from "@utils/logger";

const FILTER_ALL = "__all";

const STATUS_TONES = {
  received: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  in_review: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  interview: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  accepted: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  rejected: "border-red-400/40 bg-red-500/10 text-red-200",
  withdrawn: "border-white/15 bg-white/5 text-white/60",
};

const statusLabel = (value) =>
  APPLICATION_STATUSES.find((s) => s.value === value)?.label ?? value;

function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_TONES[status] ?? "border-white/15 bg-white/5 text-white/70",
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const fullName = (a) => `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim();

function matchesQuery(app, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    fullName(app),
    app.email,
    app.university,
    app.field_of_study,
    app.main_skill_area,
  ]
    .filter(Boolean)
    .some((v) => v.toLowerCase().includes(q));
}

// ── Detail panel ─────────────────────────────────────────────────────────
function ApplicationDetail({ app, onStatusChange, savingStatus, onError }) {
  const [openingCv, setOpeningCv] = useState(false);

  const openCv = async () => {
    // Open the tab right away (inside the click) so popup blockers allow it,
    // then point it at the short-lived signed link.
    const tab = window.open("", "_blank");
    setOpeningCv(true);
    try {
      const url = await adminGetApplicationCvUrl(app.cv_path);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      logger.error(err);
      tab?.close();
      onError("Couldn't open the CV. Please try again.");
    } finally {
      setOpeningCv(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{fullName(app)}</h2>
          <StatusBadge status={app.status} />
        </div>
        <p className="text-xs text-white/55">
          Submitted {formatDate(app.created_at)}
          {app.round ? ` · ${app.round}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <a
            href={`mailto:${app.email}`}
            className="rounded-sm text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {app.email}
          </a>
          {app.answers?.phone && (
            <a
              href={`tel:${app.answers.phone.replace(/\s+/g, "")}`}
              className="rounded-sm text-white/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {app.answers.phone}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1 sm:w-56">
            <label htmlFor="application-status" className="text-xs text-white/70">
              Status
            </label>
            <select
              id="application-status"
              value={app.status}
              disabled={savingStatus}
              onChange={(e) => onStatusChange(app.id, e.target.value)}
              className="field-input"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-primary">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {app.cv_path ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={openCv}
              loading={openingCv}
              leadingIcon={() => <DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Open CV
            </Button>
          ) : (
            <p className="text-xs text-white/45 sm:pb-2">No CV uploaded</p>
          )}
        </div>
      </div>

      <ApplicationAnswers
        answers={app.answers ?? {}}
        cvLabel={app.cv_path ? "Uploaded - use “Open CV” above" : ""}
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");
  const detailRef = useRef(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [savingStatus, setSavingStatus] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Local edits on top of the loaded list (status changes).
  const [updates, setUpdates] = useState({});

  const { data, loading, error } = useAsyncData(adminFetchApplications, [], {
    initialData: [],
    errorMessage:
      "Failed to load applications. Has migration 0008 been run in Supabase?",
  });

  const applications = useMemo(
    () => (data ?? []).map((a) => updates[a.id] ?? a),
    [data, updates],
  );

  const filterOptions = useMemo(
    () => [
      { value: FILTER_ALL, label: "All", count: applications.length },
      ...APPLICATION_STATUSES.map((s) => ({
        value: s.value,
        label: s.label,
        count: applications.filter((a) => a.status === s.value).length,
      })),
    ],
    [applications],
  );

  const filtered = useMemo(
    () =>
      applications.filter(
        (a) =>
          (statusFilter === FILTER_ALL || a.status === statusFilter) &&
          matchesQuery(a, query),
      ),
    [applications, statusFilter, query],
  );

  const { pageItems, paginationProps, resetPage } = useClientPagination(
    filtered,
    { pageSize: 25 },
  );

  const selected = applications.find((a) => a.id === selectedId) ?? null;

  const select = (id) => {
    setActionError("");
    setSuccessMsg("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("id", id);
        return next;
      },
      { replace: true },
    );
    revealEditor(detailRef);
  };

  const changeStatus = async (id, status) => {
    setSavingStatus(true);
    setActionError("");
    setSuccessMsg("");
    try {
      const row = await adminSetApplicationStatus(id, status);
      setUpdates((prev) => ({ ...prev, [id]: row }));
      setSuccessMsg(`Status changed to “${statusLabel(status)}”.`);
    } catch {
      setActionError("Couldn't change the status. Please try again.");
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <AdminLayout
      title="Applications"
      description="Applications submitted through the form on /join/apply. Click one to see all answers and the CV."
    >
      <AdminBanner message={error || actionError} />
      <AdminBanner message={successMsg} tone="success" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] xl:items-start">
        {/* List */}
        <div className="min-w-0">
          <AdminListHeader title="All applications" count={applications.length} />

          <label htmlFor="application-search" className="sr-only">
            Search applications
          </label>
          <input
            id="application-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Search name, email, university, skill…"
            className="field-input mb-3"
          />

          <MemberFilterChips
            label="Filter by status"
            options={filterOptions}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              resetPage();
            }}
          />

          {loading ? (
            <p className="text-sm text-white/60">Loading applications…</p>
          ) : filtered.length === 0 ? (
            <div className="card-inset p-5 text-sm text-white/60">
              {applications.length === 0
                ? "No applications yet."
                : "No applications match this filter."}
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-2">
                {pageItems.map((app) => {
                  const active = app.id === selectedId;
                  return (
                    <li key={app.id}>
                      <button
                        type="button"
                        onClick={() => select(app.id)}
                        aria-current={active ? "true" : undefined}
                        className={clsx(
                          "w-full card-surface card-surface-hover px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          active && "border-accent/60 bg-white/10",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {fullName(app)}
                          </p>
                          <StatusBadge status={app.status} />
                          <span className="ml-auto text-[11px] text-white/45">
                            {formatDate(app.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-white/55">
                          {[
                            app.main_skill_area,
                            [app.degree, app.field_of_study]
                              .filter(Boolean)
                              .join(" "),
                            app.semester_of_study &&
                              `Sem. ${app.semester_of_study}`,
                            app.university,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <AdminPagination {...paginationProps} />
            </>
          )}
        </div>

        {/* Detail */}
        <div
          ref={detailRef}
          className="card-surface min-w-0 p-5 sm:p-6 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto"
        >
          {selected ? (
            <ApplicationDetail
              key={selected.id}
              app={selected}
              onStatusChange={changeStatus}
              savingStatus={savingStatus}
              onError={setActionError}
            />
          ) : (
            <p className="text-sm text-white/60">
              {selectedId && !loading
                ? "This application wasn't found - it may have been deleted."
                : "Select an application on the left to see all answers."}
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
