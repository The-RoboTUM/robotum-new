// src/components/admin/members/StatusTab.jsx
// Members who are not on the current roster (paused, graduated, deleted, …)
// with a filter per status, + editor to change anyone's status.
import { useMemo, useRef, useState } from "react";
import { logger } from "@utils/logger";
import Button from "@components/ui/Button";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";
import { useClientPagination } from "@hooks/useClientPagination";
import {
  adminSetMemberStatus,
  CURRENT_MEMBER_STATUSES,
  MEMBER_STATUS_DELETED,
} from "@data";
import {
  matchesMemberQuery,
  MemberFilterChips,
  MemberListItem,
  MemberSelect,
  MemberTag,
  revealEditor,
} from "@components/admin/members/memberUi";

const FILTER_ALL = "__all";

function StatusEditor({ member, statusOptions, onSaved, onError }) {
  const [status, setStatus] = useState(member.status);
  const [saving, setSaving] = useState(false);
  const labelOf = (value) =>
    statusOptions.find((o) => o.value === value)?.label ?? value;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      status === MEMBER_STATUS_DELETED &&
      !window.confirm(
        `Mark ${member.fullName} as deleted? They disappear from the public site but can be restored here.`,
      )
    )
      return;

    setSaving(true);
    try {
      await adminSetMemberStatus(member.id, status);
      onSaved(`${member.fullName} is now ${labelOf(status)}.`);
    } catch (err) {
      logger.error("Error saving member status:", err);
      onError(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="status-value" className="text-xs text-white/70">
          Status
        </label>
        <select
          id="status-value"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field-input"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {member.status === MEMBER_STATUS_DELETED && (
        <p className="text-xs text-white/55">
          This member is deleted. Pick another status to restore them.
        </p>
      )}
      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={saving || status === member.status}
        >
          {saving ? "Saving…" : "Save status"}
        </Button>
      </div>
    </form>
  );
}

export default function StatusTab({ members, statusOptions, onSaved, onError }) {
  const editorRef = useRef(null);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  // Everything that isn't active/inactive lives here; driven by the enum, so a
  // new status added in the DB shows up as another filter automatically.
  const otherStatusOptions = useMemo(
    () => statusOptions.filter((o) => !CURRENT_MEMBER_STATUSES.includes(o.value)),
    [statusOptions],
  );

  const offRoster = useMemo(
    () => members.filter((m) => !CURRENT_MEMBER_STATUSES.includes(m.status)),
    [members],
  );

  const filterOptions = useMemo(
    () => [
      { value: FILTER_ALL, label: "All", count: offRoster.length },
      ...otherStatusOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: offRoster.filter((m) => m.status === option.value).length,
      })),
    ],
    [offRoster, otherStatusOptions],
  );

  const filtered = useMemo(
    () =>
      offRoster.filter(
        (member) =>
          matchesMemberQuery(member, query) &&
          (filter === FILTER_ALL || member.status === filter),
      ),
    [offRoster, filter, query],
  );

  const { pageItems, paginationProps, resetPage } = useClientPagination(filtered);
  const selected = members.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="grid items-start gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)]">
      <div>
        <AdminListHeader title="Paused, graduated & deleted" count={filtered.length} />

        <MemberFilterChips
          label="Filter by status"
          options={filterOptions}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            resetPage();
          }}
        />

        <div className="mb-4">
          <label htmlFor="status-search" className="sr-only">
            Search members
          </label>
          <input
            id="status-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            className="field-input"
            placeholder="Search by name or email…"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-white/60">
            Nobody with this status. Active and inactive members are on the Teams tab.
          </p>
        ) : (
          <ul className="space-y-3">
            {pageItems.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                selected={member.id === selectedId}
                actions={
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => {
                      setSelectedId(member.id);
                      revealEditor(editorRef);
                    }}
                  >
                    Change
                  </Button>
                }
              >
                {member.projects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {member.projects.map((p) => (
                      <MemberTag key={p.projectId}>{p.projectName}</MemberTag>
                    ))}
                  </div>
                )}
              </MemberListItem>
            ))}
          </ul>
        )}

        <AdminPagination {...paginationProps} />
      </div>

      <div ref={editorRef} className="scroll-mt-32">
        <AdminSideCard
          title="Change status"
          description="Change any member's status. Deleted members are hidden from the public site and can be restored here."
        >
          <div className="space-y-4">
            <MemberSelect
              id="status-member"
              members={members}
              value={selectedId}
              onChange={setSelectedId}
            />
            {selected && (
              <StatusEditor
                key={`${selected.id}:${selected.status}`}
                member={selected}
                statusOptions={statusOptions}
                onSaved={onSaved}
                onError={onError}
              />
            )}
          </div>
        </AdminSideCard>
      </div>
    </div>
  );
}
