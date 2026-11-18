// src/components/admin/members/TeamsTab.jsx
// Per-team overview (active vs inactive) + editor for a member's project
// assignments (member_projects: project, role, department).
import { useMemo, useRef, useState } from "react";
import { logger } from "@utils/logger";
import Button from "@components/ui/Button";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import { formatEnumLabel } from "@utils/formatCategory";
import {
  adminRemoveMemberProject,
  adminUpsertMemberProject,
  MEMBER_STATUS_ACTIVE,
  MEMBER_STATUS_DELETED,
  MEMBER_STATUS_INACTIVE,
} from "@data";
import {
  MemberSelect,
  MemberStat,
  revealEditor,
} from "@components/admin/members/memberUi";

const UNASSIGNED_ID = "__unassigned";
const ALL_TEAMS = "";

function emptyForm(departments) {
  return { projectId: "", role: "", departmentSlug: departments[0]?.slug ?? "" };
}

/** Bucket members into teams by status. Deleted members are left out. */
function buildTeams(members, projects) {
  const teams = projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    active: [],
    inactive: [],
    otherCount: 0,
  }));
  const byId = new Map(teams.map((team) => [team.id, team]));
  const unassigned = {
    id: UNASSIGNED_ID,
    name: "No team yet",
    status: null,
    active: [],
    inactive: [],
    otherCount: 0,
  };

  const place = (team, member, role) => {
    if (member.status === MEMBER_STATUS_ACTIVE) team.active.push({ member, role });
    else if (member.status === MEMBER_STATUS_INACTIVE)
      team.inactive.push({ member, role });
    else team.otherCount += 1;
  };

  for (const member of members) {
    if (member.status === MEMBER_STATUS_DELETED) continue;
    if (member.projects.length === 0) {
      place(unassigned, member, "");
      continue;
    }
    for (const assignment of member.projects) {
      const team = byId.get(assignment.projectId);
      if (team) place(team, member, assignment.role);
    }
  }

  // Unassigned only matters for people currently on the roster.
  if (unassigned.active.length + unassigned.inactive.length > 0) {
    teams.push(unassigned);
  }
  return teams;
}

function TeamMemberGroup({ title, entries, tone, onSelect, selectedId }) {
  return (
    <div className="card-inset p-3">
      <p className={`mb-2 text-[11px] uppercase tracking-[0.12em] ${tone}`}>
        {title} · {entries.length}
      </p>
      {entries.length === 0 ? (
        <p className="text-xs text-white/40">Nobody</p>
      ) : (
        <ul className="space-y-1">
          {entries.map(({ member, role }) => (
            <li key={member.id}>
              <button
                type="button"
                onClick={() => onSelect(member)}
                aria-pressed={selectedId === member.id}
                className={`w-full rounded-md px-2 py-1 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  selectedId === member.id
                    ? "bg-accent/30 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="font-medium">{member.fullName}</span>
                {role && <span className="text-white/50"> · {role}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TeamsTab({ members, projects, departments, onSaved, onError }) {
  const editorRef = useRef(null);
  const [teamFilter, setTeamFilter] = useState(ALL_TEAMS);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(() => emptyForm(departments));
  const [saving, setSaving] = useState(false);

  const teams = useMemo(() => buildTeams(members, projects), [members, projects]);
  const visibleTeams =
    teamFilter === ALL_TEAMS ? teams : teams.filter((t) => t.id === teamFilter);

  const pickable = useMemo(
    () => members.filter((m) => m.status !== MEMBER_STATUS_DELETED),
    [members],
  );
  const selected = pickable.find((m) => m.id === selectedId) ?? null;

  const activeCount = members.filter((m) => m.status === MEMBER_STATUS_ACTIVE).length;
  const inactiveCount = members.filter((m) => m.status === MEMBER_STATUS_INACTIVE).length;

  const selectMember = (memberId, projectId = "") => {
    setSelectedId(memberId);
    const member = members.find((m) => m.id === memberId);
    const existing = member?.projects.find((p) => p.projectId === projectId);
    setForm(
      existing
        ? {
            projectId: existing.projectId,
            role: existing.role,
            departmentSlug: existing.departmentSlug,
          }
        : emptyForm(departments),
    );
  };

  // Picking a project the member is already on loads that assignment for edit;
  // otherwise keep whatever role/department was already typed.
  const handleProjectChange = (projectId) => {
    const existing = selected?.projects.find((p) => p.projectId === projectId);
    setForm((prev) =>
      existing
        ? {
            projectId,
            role: existing.role,
            departmentSlug: existing.departmentSlug,
          }
        : { ...prev, projectId },
    );
  };

  const handleTeamMemberClick = (team) => (member) => {
    selectMember(member.id, team.id === UNASSIGNED_ID ? "" : team.id);
    revealEditor(editorRef);
  };

  const isUpdate = Boolean(
    selected?.projects.some((p) => p.projectId === form.projectId),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await adminUpsertMemberProject({
        memberId: selected.id,
        projectId: form.projectId,
        role: form.role,
        departmentSlug: form.departmentSlug,
      });
      const projectName = projects.find((p) => p.id === form.projectId)?.name ?? "the team";
      onSaved(
        isUpdate
          ? `Updated ${selected.fullName}'s role in ${projectName}.`
          : `Added ${selected.fullName} to ${projectName}.`,
      );
      setForm(emptyForm(departments));
    } catch (err) {
      logger.error("Error saving project assignment:", err);
      onError(err.message || "Failed to save the team assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (assignment) => {
    if (!selected) return;
    if (
      !window.confirm(`Remove ${selected.fullName} from ${assignment.projectName}?`)
    )
      return;
    try {
      await adminRemoveMemberProject(selected.id, assignment.projectId);
      onSaved(`Removed ${selected.fullName} from ${assignment.projectName}.`);
      if (form.projectId === assignment.projectId) setForm(emptyForm(departments));
    } catch (err) {
      logger.error("Error removing project assignment:", err);
      onError(err.message || "Failed to remove the team assignment.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MemberStat label="Active members" value={activeCount} />
        <MemberStat label="Inactive members" value={inactiveCount} />
        <MemberStat label="Teams" value={projects.length} />
      </div>

      <div className="grid items-start gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)]">
        <div>
          <AdminListHeader title="Members per team" count={visibleTeams.length} />

          <div className="mb-4 space-y-1">
            <label htmlFor="teams-filter" className="text-xs text-white/70">
              Show
            </label>
            <select
              id="teams-filter"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="field-input"
            >
              <option value={ALL_TEAMS}>All teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {visibleTeams.length === 0 ? (
            <p className="text-sm text-white/60">
              No projects yet. Create one under Projects first.
            </p>
          ) : (
            <ul className="space-y-3">
              {visibleTeams.map((team) => (
                <li key={team.id} className="card-surface p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{team.name}</h3>
                    {team.status && (
                      <span className="chip">{formatEnumLabel(team.status)}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/60">
                    <span className="text-emerald-200">{team.active.length} active</span>
                    {" · "}
                    {team.inactive.length} inactive
                    {team.otherCount > 0 && (
                      <span className="text-white/45">
                        {" · "}
                        {team.otherCount} paused/other (see Status tab)
                      </span>
                    )}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <TeamMemberGroup
                      title="Active"
                      tone="text-emerald-200/80"
                      entries={team.active}
                      selectedId={selectedId}
                      onSelect={handleTeamMemberClick(team)}
                    />
                    <TeamMemberGroup
                      title="Inactive"
                      tone="text-white/50"
                      entries={team.inactive}
                      selectedId={selectedId}
                      onSelect={handleTeamMemberClick(team)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={editorRef} className="scroll-mt-32">
          <AdminSideCard
            title="Team assignments"
            description="Add a member to a project team, change their role or department, or remove them. Click a name on the left to load it here."
          >
            <div className="space-y-4">
              <MemberSelect
                id="teams-member"
                members={pickable}
                value={selectedId}
                onChange={(id) => selectMember(id)}
              />

              {selected && (
                <>
                  <div className="space-y-2">
                    <p className="text-xs text-white/70">Current teams</p>
                    {selected.projects.length === 0 ? (
                      <p className="text-xs text-white/50">Not on any team yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {selected.projects.map((assignment) => (
                          <li
                            key={assignment.projectId}
                            className="card-inset flex items-start justify-between gap-2 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="text-sm text-white">{assignment.projectName}</p>
                              <p className="text-xs text-white/55">
                                {assignment.role || "No role"}
                                {assignment.departmentName &&
                                  ` · ${assignment.departmentName}`}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-1.5">
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => selectMember(selected.id, assignment.projectId)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="xs"
                                variant="danger"
                                onClick={() => handleRemove(assignment)}
                              >
                                Remove
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <form
                    className="space-y-4 border-t border-white/10 pt-4"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-1">
                      <label htmlFor="teams-project" className="text-xs text-white/70">
                        Team / project
                      </label>
                      <select
                        id="teams-project"
                        required
                        value={form.projectId}
                        onChange={(e) => handleProjectChange(e.target.value)}
                        className="field-input"
                      >
                        <option value="">Select a project…</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="teams-role" className="text-xs text-white/70">
                        Role
                      </label>
                      <input
                        id="teams-role"
                        type="text"
                        required
                        value={form.role}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="field-input"
                        placeholder="Member, Software Lead, …"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="teams-department" className="text-xs text-white/70">
                        Department
                      </label>
                      <select
                        id="teams-department"
                        required
                        value={form.departmentSlug}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, departmentSlug: e.target.value }))
                        }
                        className="field-input"
                      >
                        {departments.length === 0 && (
                          <option value="">No departments found</option>
                        )}
                        {departments.map((dept) => (
                          <option key={dept.slug} value={dept.slug}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {form.projectId && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setForm(emptyForm(departments))}
                        >
                          Clear
                        </Button>
                      )}
                      <Button type="submit" variant="primary" size="sm" disabled={saving}>
                        {saving ? "Saving…" : isUpdate ? "Update assignment" : "Add to team"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </AdminSideCard>
        </div>
      </div>
    </div>
  );
}
