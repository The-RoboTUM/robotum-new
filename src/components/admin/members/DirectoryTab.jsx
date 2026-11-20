// src/components/admin/members/DirectoryTab.jsx
// All members, filterable by status (with counts): add people, edit personal
// details and status, delete.
// - Adding a member fires the member_creation webhook (account provisioning).
// - Status changes can set off DB automation (see STATUS_SIDE_EFFECTS):
//   graduated -> make_alumni, deleted -> full offboarding.
import { useMemo, useRef, useState } from "react";
import { logger } from "@utils/logger";
import Button from "@components/ui/Button";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";
import { useClientPagination } from "@hooks/useClientPagination";
import {
  adminSetMemberStatus,
  adminUpsertMember,
  MEMBER_STATUS_DELETED,
} from "@data";
import {
  matchesMemberQuery,
  MemberFilterChips,
  MemberListItem,
  MemberStatusTiming,
  revealEditor,
} from "@components/admin/members/memberUi";
import {
  nextStepSortValue,
  STATUS_SIDE_EFFECTS,
} from "@components/admin/members/memberStatus";

// "All" deliberately leaves out deleted members; they have their own filter.
const FILTER_ALL = "__all";

const TEXT_FIELDS = [
  { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "Ada Lovelace" },
  { name: "personalEmail", label: "Personal email", type: "email", required: true, placeholder: "ada@example.com" },
  { name: "robotumEmail", label: "roboTUM email", type: "email", placeholder: "ada.lovelace@robotum.info" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+49 …" },
  { name: "university", label: "University", type: "text", placeholder: "TUM" },
  { name: "studyProgram", label: "Study program", type: "text", placeholder: "M.Sc. Robotics" },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/…" },
];

function emptyForm(defaultStatus) {
  return {
    fullName: "",
    personalEmail: "",
    robotumEmail: "",
    phone: "",
    university: "",
    studyProgram: "",
    linkedinUrl: "",
    status: defaultStatus,
  };
}

export default function DirectoryTab({ members, statusOptions, onSaved, onError }) {
  // New members default to the enum's first value (active).
  const defaultStatus = statusOptions[0]?.value ?? "";
  const editorRef = useRef(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [editingId, setEditingId] = useState(null); // null = new member
  const [form, setForm] = useState(() => emptyForm(defaultStatus));
  const [saving, setSaving] = useState(false);

  const labelOf = (value) => statusOptions.find((o) => o.value === value)?.label ?? value;
  const editing = members.find((m) => m.id === editingId) ?? null;

  const filterOptions = useMemo(
    () => [
      {
        value: FILTER_ALL,
        label: "All",
        count: members.filter((m) => m.status !== MEMBER_STATUS_DELETED).length,
      },
      ...statusOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: members.filter((m) => m.status === option.value).length,
      })),
    ],
    [members, statusOptions],
  );

  const visible = useMemo(() => {
    const list = members.filter(
      (m) =>
        (statusFilter === FILTER_ALL
          ? m.status !== MEMBER_STATUS_DELETED
          : m.status === statusFilter) && matchesMemberQuery(m, query),
    );
    // Inactive/suspended: whoever is closest to the next lifecycle step first.
    if (statusFilter === FILTER_ALL) return list;
    const now = new Date();
    return [...list].sort((a, b) => nextStepSortValue(a, now) - nextStepSortValue(b, now));
  }, [members, statusFilter, query]);

  const { pageItems, paginationProps, resetPage } = useClientPagination(visible);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm(defaultStatus));
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setForm({
      fullName: member.fullName,
      personalEmail: member.personalEmail,
      robotumEmail: member.robotumEmail,
      phone: member.phone,
      university: member.university,
      studyProgram: member.studyProgram,
      linkedinUrl: member.linkedinUrl,
      status: member.status,
    });
    revealEditor(editorRef);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const confirmStatus = (fullName, status) => {
    const warning = STATUS_SIDE_EFFECTS[status];
    return !warning || window.confirm(`Set ${fullName} to ${labelOf(status)}?\n\n${warning}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { status, ...details } = form;
    // Only send the status when it changes, so editing e.g. a phone number
    // never touches the status triggers.
    const statusChanged = editing ? status !== editing.status : true;
    if (statusChanged && !confirmStatus(form.fullName, status)) return;

    setSaving(true);
    try {
      await adminUpsertMember(
        editing
          ? { id: editing.id, ...details, ...(statusChanged ? { status } : {}) }
          : { ...details, status },
      );
      onSaved(
        !editing
          ? `Added ${form.fullName}. Assign a team in the Teams tab and a club membership in the Memberships tab.`
          : statusChanged
            ? `Saved ${form.fullName} - status is now ${labelOf(status)}.`
            : `Saved ${form.fullName}.`,
      );
      startNew();
    } catch (err) {
      logger.error("Error saving member:", err);
      onError(err.message || "Failed to save member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    if (!confirmStatus(member.fullName, MEMBER_STATUS_DELETED)) return;
    try {
      await adminSetMemberStatus(member.id, MEMBER_STATUS_DELETED);
      if (editingId === member.id) startNew();
      onSaved(`${member.fullName} was deleted and is being offboarded.`);
    } catch (err) {
      logger.error("Error deleting member:", err);
      onError(err.message || "Failed to delete member.");
    }
  };

  return (
    <div className="grid items-start gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)]">
      <div>
        <AdminListHeader
          title="Members"
          count={visible.length}
          buttonLabel="+ New member"
          onButtonClick={() => {
            startNew();
            revealEditor(editorRef);
          }}
        />

        <MemberFilterChips
          label="Filter by status"
          options={filterOptions}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            resetPage();
          }}
        />

        <div className="mb-4">
          <label htmlFor="directory-search" className="sr-only">
            Search members
          </label>
          <input
            id="directory-search"
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

        {visible.length === 0 ? (
          <p className="text-sm text-white/60">
            {query ? "No members match your search." : "Nobody with this status."}
          </p>
        ) : (
          <ul className="space-y-3">
            {pageItems.map((member) => (
              <MemberListItem
                key={member.id}
                member={member}
                selected={member.id === editingId}
                actions={
                  <>
                    <Button size="xs" variant="secondary" onClick={() => startEdit(member)}>
                      Edit
                    </Button>
                    {member.status !== MEMBER_STATUS_DELETED && (
                      <Button size="xs" variant="danger" onClick={() => handleDelete(member)}>
                        Delete
                      </Button>
                    )}
                  </>
                }
              >
                <p className="truncate text-xs text-white/60">
                  {member.robotumEmail || member.personalEmail || "No email"}
                </p>
                <MemberStatusTiming member={member} statusLabel={labelOf(member.status)} />
                {(member.studyProgram || member.university) && (
                  <p className="text-xs text-white/45">
                    {[member.studyProgram, member.university].filter(Boolean).join(" · ")}
                  </p>
                )}
              </MemberListItem>
            ))}
          </ul>
        )}

        <AdminPagination {...paginationProps} />
      </div>

      <div ref={editorRef} className="scroll-mt-32">
        <AdminSideCard
          title={editing ? "Edit member" : "New member"}
          description={
            editing
              ? "Update personal details or status. Graduated and Deleted start automatic offboarding."
              : "Add a new person to the club registry. This creates their roboTUM Google account."
          }
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            {TEXT_FIELDS.map((field) => (
              <div key={field.name} className="space-y-1">
                <label htmlFor={`directory-${field.name}`} className="text-xs text-white/70">
                  {field.label}
                  {field.required && <span className="text-white/40"> *</span>}
                </label>
                <input
                  id={`directory-${field.name}`}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="field-input"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div className="space-y-1">
              <label htmlFor="directory-status" className="text-xs text-white/70">
                Status
              </label>
              <select
                id="directory-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="field-input"
              >
                {statusOptions
                  // A new member can't start out deleted.
                  .filter((o) => editing || o.value !== MEMBER_STATUS_DELETED)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              {editing && (
                <MemberStatusTiming member={editing} statusLabel={labelOf(editing.status)} />
              )}
              {editing?.status === MEMBER_STATUS_DELETED && form.status !== MEMBER_STATUS_DELETED && (
                <p className="text-xs text-amber-200/90">
                  Restoring doesn’t bring back their teams, memberships or tool access - re-add those by hand.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editing && (
                <Button type="button" variant="secondary" size="sm" onClick={startNew}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save member" : "Add member"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </div>
  );
}
