// src/components/admin/members/MembershipsTab.jsx
// Who holds which club membership (Founders, Seniors, Project Leads, …) +
// editor for one member's memberships (member_memberships).
import { useMemo, useRef, useState } from "react";
import { logger } from "@utils/logger";
import Button from "@components/ui/Button";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";
import { useClientPagination } from "@hooks/useClientPagination";
import { adminSetMemberMemberships, MEMBER_STATUS_DELETED } from "@data";
import {
  matchesMemberQuery,
  MemberFilterChips,
  MemberListItem,
  MemberSelect,
  MemberTag,
  revealEditor,
} from "@components/admin/members/memberUi";

const FILTER_ALL = "__all";
const FILTER_NONE = "__none";

function MembershipEditor({ member, membershipOptions, onSaved, onError }) {
  const [draft, setDraft] = useState(() => new Set(member.memberships));
  const [saving, setSaving] = useState(false);

  const toggle = (value) =>
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const changed =
    draft.size !== member.memberships.length ||
    member.memberships.some((type) => !draft.has(type));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminSetMemberMemberships(member.id, [...draft], member.memberships);
      onSaved(`Updated club membership for ${member.fullName}.`);
    } catch (err) {
      logger.error("Error saving memberships:", err);
      onError(err.message || "Failed to save club membership.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs text-white/70">Club membership</legend>
        {membershipOptions.map((option) => {
          const id = `membership-${option.value.replace(/\W+/g, "-")}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className="card-inset flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/5 focus-within:ring-2 focus-within:ring-accent"
            >
              <input
                id={id}
                type="checkbox"
                checked={draft.has(option.value)}
                onChange={() => toggle(option.value)}
                className="h-4 w-4 accent-accent"
              />
              {option.label}
            </label>
          );
        })}
      </fieldset>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!changed || saving}
          onClick={() => setDraft(new Set(member.memberships))}
        >
          Reset
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={!changed || saving}>
          {saving ? "Saving…" : "Save membership"}
        </Button>
      </div>
    </form>
  );
}

export default function MembershipsTab({ members, membershipOptions, onSaved, onError }) {
  const editorRef = useRef(null);
  const [filter, setFilter] = useState(FILTER_ALL);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  // Deleted members are hidden; graduated founders etc. still count.
  const roster = useMemo(
    () => members.filter((m) => m.status !== MEMBER_STATUS_DELETED),
    [members],
  );

  const filterOptions = useMemo(() => {
    const countOf = (type) => roster.filter((m) => m.memberships.includes(type)).length;
    return [
      { value: FILTER_ALL, label: "All", count: roster.length },
      ...membershipOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: countOf(option.value),
      })),
      {
        value: FILTER_NONE,
        label: "No membership",
        count: roster.filter((m) => m.memberships.length === 0).length,
      },
    ];
  }, [roster, membershipOptions]);

  const filtered = useMemo(
    () =>
      roster.filter((member) => {
        if (!matchesMemberQuery(member, query)) return false;
        if (filter === FILTER_ALL) return true;
        if (filter === FILTER_NONE) return member.memberships.length === 0;
        return member.memberships.includes(filter);
      }),
    [roster, filter, query],
  );

  const { pageItems, paginationProps, resetPage } = useClientPagination(filtered);
  const selected = roster.find((m) => m.id === selectedId) ?? null;

  // Show memberships in enum order, not insertion order.
  const orderOf = (type) => {
    const index = membershipOptions.findIndex((o) => o.value === type);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const labelOf = (type) =>
    membershipOptions.find((o) => o.value === type)?.label ?? type;

  return (
    <div className="grid items-start gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)]">
      <div>
        <AdminListHeader title="Club memberships" count={filtered.length} />

        <MemberFilterChips
          label="Filter by membership"
          options={filterOptions}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            resetPage();
          }}
        />

        <div className="mb-4">
          <label htmlFor="memberships-search" className="sr-only">
            Search members
          </label>
          <input
            id="memberships-search"
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
          <p className="text-sm text-white/60">No members match this filter.</p>
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
                    Manage
                  </Button>
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  {member.memberships.length === 0 ? (
                    <span className="text-xs text-white/45">No club membership</span>
                  ) : (
                    [...member.memberships]
                      .sort((a, b) => orderOf(a) - orderOf(b))
                      .map((type) => <MemberTag key={type}>{labelOf(type)}</MemberTag>)
                  )}
                </div>
              </MemberListItem>
            ))}
          </ul>
        )}

        <AdminPagination {...paginationProps} />
      </div>

      <div ref={editorRef} className="scroll-mt-32">
        <AdminSideCard
          title="Manage club membership"
          description="Tick every membership a person holds - e.g. Seniors + Project Leads for a senior project lead."
        >
          <div className="space-y-4">
            <MemberSelect
              id="memberships-member"
              members={roster}
              value={selectedId}
              onChange={setSelectedId}
            />
            {selected && (
              <MembershipEditor
                // Re-seed the draft whenever the member or their saved data changes.
                key={`${selected.id}:${selected.memberships.join("|")}`}
                member={selected}
                membershipOptions={membershipOptions}
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
