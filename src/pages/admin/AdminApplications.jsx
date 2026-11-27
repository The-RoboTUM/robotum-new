// src/pages/admin/AdminApplications.jsx
// Membership applications from /join/apply as a sortable table (filters,
// bulk status change, CSV export). Clicking a row opens the full application;
// it lives in ?id= so a link or reload opens the same one, and
// Previous / Next walk through the current filtered + sorted list.
//
// Access: today RLS (migration 0008) shows applications to admins only.
// Later: separate rights to view / rate / see ratings - adapt here then.
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@components/admin/AdminLayout";
import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminPagination from "@components/admin/AdminPagination";
import Button from "@components/ui/Button";
import { MemberFilterChips } from "@components/admin/members/memberUi";
import ApplicationDetail from "@components/admin/applications/ApplicationDetail";
import ApplicationsTable, {
  sortApplications,
} from "@components/admin/applications/ApplicationsTable";
import {
  fullName,
  statusLabel,
} from "@components/admin/applications/applicationUi";
import { PROJECT_TYPES, ROLES, SKILL_AREAS } from "@config/applicationForm";
import { useAsyncData } from "@hooks/useAsyncData";
import { useClientPagination } from "@hooks/useClientPagination";
import {
  adminFetchApplications,
  adminSetApplicationsStatus,
  adminSetApplicationStatus,
  APPLICATION_STATUSES,
} from "@data";
import { applicationsToCsv } from "@utils/applicationExport";
import { downloadCsv } from "@utils/csv";

const ALL = "__all";
const DEFAULT_SORT = { key: "created_at", dir: "desc" };

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

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-white/60">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-primary">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AdminApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");
  const listScrollY = useRef(0);

  // Filters + sort (kept while you open an application and come back).
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [roundFilter, setRoundFilter] = useState(null); // null = latest round
  const [skillFilter, setSkillFilter] = useState(ALL);
  const [projectTypeFilter, setProjectTypeFilter] = useState(ALL);
  const [roleFilter, setRoleFilter] = useState(ALL);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [checkedIds, setCheckedIds] = useState(() => new Set());
  const [bulkStatus, setBulkStatus] = useState(APPLICATION_STATUSES[0].value);
  const [saving, setSaving] = useState(false);
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

  // Rounds, newest first (the list is loaded newest first).
  const rounds = useMemo(
    () => [...new Set(applications.map((a) => a.round).filter(Boolean))],
    [applications],
  );
  const activeRound = roundFilter ?? rounds[0] ?? ALL;

  // Everything except the status filter - the status chips count from this.
  const baseFiltered = useMemo(
    () =>
      applications.filter((a) => {
        const ans = a.answers ?? {};
        return (
          (activeRound === ALL || a.round === activeRound) &&
          (skillFilter === ALL || a.main_skill_area === skillFilter) &&
          (projectTypeFilter === ALL || ans.projectType === projectTypeFilter) &&
          (roleFilter === ALL ||
            (Array.isArray(ans.roles) && ans.roles.includes(roleFilter))) &&
          matchesQuery(a, query)
        );
      }),
    [applications, activeRound, skillFilter, projectTypeFilter, roleFilter, query],
  );

  const statusOptions = useMemo(
    () => [
      { value: ALL, label: "All", count: baseFiltered.length },
      ...APPLICATION_STATUSES.map((s) => ({
        value: s.value,
        label: s.label,
        count: baseFiltered.filter((a) => a.status === s.value).length,
      })),
    ],
    [baseFiltered],
  );

  const visible = useMemo(
    () =>
      sortApplications(
        baseFiltered.filter(
          (a) => statusFilter === ALL || a.status === statusFilter,
        ),
        sort,
      ),
    [baseFiltered, statusFilter, sort],
  );

  const { pageItems, paginationProps, resetPage } = useClientPagination(
    visible,
    { pageSize: 50 },
  );

  // Only rows that are still visible count as selected.
  const checkedVisible = useMemo(
    () => visible.filter((a) => checkedIds.has(a.id)),
    [visible, checkedIds],
  );
  const allChecked = visible.length > 0 && checkedVisible.length === visible.length;

  const clearMessages = () => {
    setActionError("");
    setSuccessMsg("");
  };

  // Wrap a filter setter: changing a filter starts at page 1, clears ticks.
  const onFilter = (setter) => (value) => {
    setter(value);
    resetPage();
    setCheckedIds(new Set());
  };

  const hasExtraFilters =
    query ||
    statusFilter !== ALL ||
    skillFilter !== ALL ||
    projectTypeFilter !== ALL ||
    roleFilter !== ALL;

  const resetFilters = () => {
    setQuery("");
    setStatusFilter(ALL);
    setSkillFilter(ALL);
    setProjectTypeFilter(ALL);
    setRoleFilter(ALL);
    resetPage();
    setCheckedIds(new Set());
  };

  const onSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "created_at" ? "desc" : "asc" },
    );
    resetPage();
  };

  const toggleChecked = (id) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setCheckedIds(allChecked ? new Set() : new Set(visible.map((a) => a.id)));

  // ── Open / close one application ──────────────────────────────────────
  const setOpenId = (id) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id) next.set("id", id);
        else next.delete("id");
        return next;
      },
      { replace: true },
    );

  const open = (id) => {
    clearMessages();
    if (!selectedId) listScrollY.current = window.scrollY;
    setOpenId(id);
    window.scrollTo({ top: 0 });
  };

  const backToList = () => {
    clearMessages();
    setOpenId(null);
    requestAnimationFrame(() => window.scrollTo({ top: listScrollY.current }));
  };

  const selected = applications.find((a) => a.id === selectedId) ?? null;
  const position = selected ? visible.findIndex((a) => a.id === selected.id) : -1;
  const prevApp = position > 0 ? visible[position - 1] : null;
  const nextApp =
    position !== -1 && position < visible.length - 1 ? visible[position + 1] : null;

  // ── Actions ───────────────────────────────────────────────────────────
  const storeRows = (rows) =>
    setUpdates((prev) => ({
      ...prev,
      ...Object.fromEntries(rows.map((r) => [r.id, r])),
    }));

  const changeStatus = async (id, status) => {
    setSaving(true);
    clearMessages();
    try {
      storeRows([await adminSetApplicationStatus(id, status)]);
      setSuccessMsg(`Status changed to “${statusLabel(status)}”.`);
    } catch {
      setActionError("Couldn't change the status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const applyBulkStatus = async () => {
    const ids = checkedVisible.map((a) => a.id);
    if (!ids.length) return;
    const label = statusLabel(bulkStatus);
    if (
      !window.confirm(
        `Set ${ids.length} application${ids.length === 1 ? "" : "s"} to “${label}”?`,
      )
    )
      return;

    setSaving(true);
    clearMessages();
    try {
      const rows = await adminSetApplicationsStatus(ids, bulkStatus);
      storeRows(rows);
      setCheckedIds(new Set());
      setSuccessMsg(
        `${rows.length} application${rows.length === 1 ? "" : "s"} set to “${label}”.`,
      );
    } catch {
      setActionError("Couldn't change the statuses. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const exportRows = checkedVisible.length ? checkedVisible : visible;
  const exportCsv = () => {
    const date = new Date().toLocaleDateString("sv-SE"); // 2026-11-27
    downloadCsv(`robotum-applications-${date}.csv`, applicationsToCsv(exportRows));
  };

  // ── Detail view ───────────────────────────────────────────────────────
  if (selectedId) {
    return (
      <AdminLayout title="Applications">
        <AdminBanner message={error || actionError} />
        <AdminBanner message={successMsg} tone="success" />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={backToList}
            leadingIcon={() => <ArrowLeftIcon className="h-4 w-4" />}
          >
            All applications
          </Button>
          {position !== -1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/55">
                {position + 1} of {visible.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={!prevApp}
                onClick={() => prevApp && open(prevApp.id)}
              >
                ← Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!nextApp}
                onClick={() => nextApp && open(nextApp.id)}
              >
                Next →
              </Button>
            </div>
          )}
        </div>

        <div className="card-surface p-5 sm:p-8">
          {selected ? (
            <ApplicationDetail
              key={selected.id}
              app={selected}
              onStatusChange={changeStatus}
              savingStatus={saving}
              onError={setActionError}
            />
          ) : (
            <p className="text-sm text-white/60">
              {loading
                ? "Loading application…"
                : "This application wasn't found - it may have been deleted."}
            </p>
          )}
        </div>
      </AdminLayout>
    );
  }

  // ── Table view ────────────────────────────────────────────────────────
  return (
    <AdminLayout
      title="Applications"
      description="Applications submitted through the form on /join/apply. Click a column to sort, a row to open it."
    >
      <AdminBanner message={error || actionError} />
      <AdminBanner message={successMsg} tone="success" />

      <AdminListHeader title="Applications" count={visible.length} />

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
          <label htmlFor="application-search" className="text-xs text-white/60">
            Search
          </label>
          <input
            id="application-search"
            type="search"
            value={query}
            onChange={(e) => onFilter(setQuery)(e.target.value)}
            placeholder="Name, email, uni, field…"
            className="field-input"
          />
        </div>
        <FilterSelect
          id="application-round"
          label="Round"
          value={activeRound}
          onChange={onFilter(setRoundFilter)}
          options={[
            ...rounds.map((r) => ({ value: r, label: r })),
            { value: ALL, label: "All rounds" },
          ]}
        />
        <FilterSelect
          id="application-skill"
          label="Main skill area"
          value={skillFilter}
          onChange={onFilter(setSkillFilter)}
          options={[
            { value: ALL, label: "All skill areas" },
            ...SKILL_AREAS.map((s) => ({ value: s, label: s })),
          ]}
        />
        <FilterSelect
          id="application-project-type"
          label="Project type"
          value={projectTypeFilter}
          onChange={onFilter(setProjectTypeFilter)}
          options={[
            { value: ALL, label: "All project types" },
            ...PROJECT_TYPES.map((t) => ({ value: t.value, label: t.label })),
          ]}
        />
        <FilterSelect
          id="application-role"
          label="Interested in role"
          value={roleFilter}
          onChange={onFilter(setRoleFilter)}
          options={[
            { value: ALL, label: "All roles" },
            ...ROLES.map((r) => ({ value: r, label: r })),
          ]}
        />
      </div>

      <MemberFilterChips
        label="Filter by status"
        options={statusOptions}
        value={statusFilter}
        onChange={onFilter(setStatusFilter)}
      />

      {/* Bulk actions + export */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-end gap-2">
          {checkedVisible.length > 0 ? (
            <>
              <span className="chip self-center">
                {checkedVisible.length} selected
              </span>
              <div className="flex flex-col gap-1">
                <label htmlFor="application-bulk-status" className="sr-only">
                  New status for selected applications
                </label>
                <select
                  id="application-bulk-status"
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="field-input py-1.5"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s.value} value={s.value} className="bg-primary">
                      Set to: {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button size="sm" variant="primary" onClick={applyBulkStatus} loading={saving}>
                Apply
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setCheckedIds(new Set())}>
                Clear selection
              </Button>
            </>
          ) : (
            <p className="text-xs text-white/50">
              Tick rows to change several statuses at once.
              {hasExtraFilters && (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-sm text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Reset filters
                  </button>
                </>
              )}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={exportCsv}
          disabled={exportRows.length === 0}
          leadingIcon={() => <ArrowDownTrayIcon className="h-4 w-4" />}
        >
          {checkedVisible.length
            ? `Export selected (${checkedVisible.length})`
            : `Export CSV (${visible.length})`}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/60">Loading applications…</p>
      ) : visible.length === 0 ? (
        <div className="card-inset p-5 text-sm text-white/60">
          {applications.length === 0
            ? "No applications yet."
            : "No applications match these filters."}
        </div>
      ) : (
        <>
          <ApplicationsTable
            rows={pageItems}
            sort={sort}
            onSort={onSort}
            selectedIds={checkedIds}
            onToggle={toggleChecked}
            allSelected={allChecked}
            someSelected={checkedVisible.length > 0}
            onToggleAll={toggleAll}
            selectAllLabel={`Select all ${visible.length} matching applications`}
            onOpen={open}
          />
          <AdminPagination {...paginationProps} />
        </>
      )}
    </AdminLayout>
  );
}
