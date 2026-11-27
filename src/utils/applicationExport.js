// CSV export of applications for /admin/applications: one row per applicant,
// one column per question (fixed order, so files from different days line up).
// Text only - CVs are PDFs in Storage and are not part of the file.
import {
  ATTENDANCE_DATES,
  LIVING_OPTIONS,
  PROJECT_TYPES,
  SKILL_LEVELS,
  WORK_QUESTIONS,
} from "@config/applicationForm";
import { APPLICATION_STATUSES } from "@data";
import { toCsv } from "@utils/csv";

const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value ?? "";

const yesNo = (v) => (v === "yes" ? "Yes" : v === "no" ? "No" : "");

// "2026-11-27 14:03" in the viewer's time zone.
const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("sv-SE").slice(0, 16) : "";

const ans = (row) => row.answers ?? {};

const COLUMNS = [
  { label: "Status", value: (r) => labelOf(APPLICATION_STATUSES, r.status) },
  { label: "Submitted", value: (r) => formatDateTime(r.created_at) },
  { label: "Round", value: (r) => r.round },
  { label: "First name", value: (r) => r.first_name },
  { label: "Last name", value: (r) => r.last_name },
  { label: "Email", value: (r) => r.email },
  { label: "Phone", value: (r) => ans(r).phone },
  { label: "Matriculation number", value: (r) => ans(r).matriculationNumber },
  {
    label: "University",
    value: (r) =>
      ans(r).university === "Other" ? ans(r).universityOther : r.university,
  },
  { label: "Degree", value: (r) => r.degree },
  { label: "Field of study", value: (r) => r.field_of_study },
  { label: "Semester", value: (r) => r.semester_of_study },
  {
    label: "Living during the semester",
    value: (r) =>
      ans(r).living === "other"
        ? ans(r).livingOther
        : labelOf(LIVING_OPTIONS, ans(r).living),
  },
  { label: "Heard about us via", value: (r) => ans(r).heardAbout },
  ...ATTENDANCE_DATES.map((d) => ({
    label: `${d.label} (${d.date})`,
    value: (r) => yesNo(ans(r).attendance?.[d.id]),
  })),
  { label: "Hours per week", value: (r) => ans(r).hoursPerWeek },
  { label: "Other commitments", value: (r) => ans(r).otherCommitments },
  // Short header: the part before ":" ("Curiosity", "Teamwork", …).
  ...WORK_QUESTIONS.map((q) => ({
    label: q.label.split(":")[0],
    value: (r) => ans(r).work?.[q.id],
  })),
  {
    label: "Skills",
    value: (r) =>
      Object.entries(ans(r).skillLevels ?? {})
        .filter(([, lvl]) => lvl && lvl !== "none")
        .map(([tag, lvl]) => `${tag} (${labelOf(SKILL_LEVELS, lvl).toLowerCase()})`)
        .join(", "),
  },
  {
    label: "Roles",
    value: (r) => (Array.isArray(ans(r).roles) ? ans(r).roles.join(", ") : ""),
  },
  {
    label: "Project type",
    value: (r) => labelOf(PROJECT_TYPES, ans(r).projectType),
  },
  { label: "Curious about", value: (r) => ans(r).curiousProjects },
  { label: "Main skill area", value: (r) => r.main_skill_area },
  { label: "Main skill: project", value: (r) => ans(r).mainSkillStory },
  { label: "Second skill area", value: (r) => ans(r).secondSkillArea },
  { label: "Second skill: project", value: (r) => ans(r).secondSkillStory },
  { label: "CV uploaded", value: (r) => (r.cv_path ? "Yes" : "No") },
  { label: "Links", value: (r) => ans(r).links },
  { label: "Application ID", value: (r) => r.id },
];

export function applicationsToCsv(rows) {
  return toCsv(COLUMNS, rows ?? []);
}
