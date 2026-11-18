// src/components/admin/members/DirectoryTab.jsx
// All members: add new people, edit personal details, "delete" (soft delete
// via status, restorable from the Status tab).
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
  MemberListItem,
  revealEditor,
} from "@components/admin/members/memberUi";

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
  const [editingId, setEditingId] = useState(null); // null = new member
  const [form, setForm] = useState(() => emptyForm(defaultStatus));
  const [saving, setSaving] = useState(false);

  const roster = useMemo(
    () =>
      members.filter(
        (m) => m.status !== MEMBER_STATUS_DELETED && matchesMemberQuery(m, query),
      ),
    [members, query],
  );
  const { pageItems, paginationProps, resetPage } = useClientPagination(roster);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      // Status is only set on create here; later changes go through the Status tab.
      const { status, ...details } = form;
      await adminUpsertMember(
        editingId ? { id: editingId, ...details } : { ...details, status },
      );
      onSaved(
        editingId
          ? `Saved ${form.fullName}.`
          : `Added ${form.fullName}. Assign a team in the Teams tab and a club membership in the Memberships tab.`,
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
    if (
      !window.confirm(
        `Delete ${member.fullName}? They are hidden from the public site and moved to the Status tab, where they can be restored.`,
      )
    )
      return;
    try {
      await adminSetMemberStatus(member.id, MEMBER_STATUS_DELETED);
      if (editingId === member.id) startNew();
      onSaved(`${member.fullName} was deleted. Restore them from the Status tab if needed.`);
    } catch (err) {
      logger.error("Error deleting member:", err);
      onError(err.message || "Failed to delete member.");
    }
  };

  const isEditing = Boolean(editingId);

  return (
    <div className="grid items-start gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)]">
      <div>
        <AdminListHeader
          title="All members"
          count={roster.length}
          buttonLabel="+ New member"
          onButtonClick={() => {
            startNew();
            revealEditor(editorRef);
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

        {roster.length === 0 ? (
          <p className="text-sm text-white/60">
            {query ? "No members match your search." : "No members yet. Add the first one on the right."}
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
                    <Button size="xs" variant="danger" onClick={() => handleDelete(member)}>
                      Delete
                    </Button>
                  </>
                }
              >
                <p className="truncate text-xs text-white/60">
                  {member.robotumEmail || member.personalEmail || "No email"}
                </p>
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
          title={isEditing ? "Edit member" : "New member"}
          description={
            isEditing
              ? "Update this member's personal details."
              : "Add a new person to the club registry."
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

            {!isEditing && (
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
                    .filter((o) => o.value !== MEMBER_STATUS_DELETED)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {isEditing && (
                <Button type="button" variant="secondary" size="sm" onClick={startNew}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? "Saving…" : isEditing ? "Save member" : "Add member"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </div>
  );
}
