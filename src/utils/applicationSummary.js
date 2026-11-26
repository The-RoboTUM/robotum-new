// Turns stored application answers into labelled sections, in form order.
// Shared by the applicant's review screen and /admin/applications so both
// always show the same questions with the same labels.
import {
  APPLICATION_STEPS,
  ATTENDANCE_DATES,
  LIVING_OPTIONS,
  PROJECT_TYPES,
  SKILL_FOLLOW_UP,
  SKILL_LEVELS,
  WORK_QUESTIONS,
} from "@config/applicationForm";

const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value;

const yesNo = (v) => (v === "yes" ? "Yes" : v === "no" ? "No" : "");

/**
 * @param {object} a  answers (shape of emptyApplication())
 * @param {{ cvLabel?: string }} [opts]
 * @returns {Array<{ stepIndex: number, id: string, title: string,
 *   rows: Array<{ label: string, value: string, long?: boolean }> }>}
 */
export function buildApplicationSummary(a = {}, { cvLabel } = {}) {
  const work = a.work ?? {};
  const attendance = a.attendance ?? {};
  const skillLevels = a.skillLevels ?? {};
  const roles = Array.isArray(a.roles) ? a.roles : [];

  const skills = Object.entries(skillLevels)
    .filter(([, lvl]) => lvl && lvl !== "none")
    .map(([tag, lvl]) => `${tag} (${labelOf(SKILL_LEVELS, lvl).toLowerCase()})`)
    .join(", ");

  const rowsByStep = {
    about: [
      { label: "Name", value: `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() },
      { label: "Email", value: a.email },
      { label: "Phone", value: a.phone },
      { label: "Matriculation number", value: a.matriculationNumber },
      {
        label: "University",
        value: a.university === "Other" ? a.universityOther : a.university,
      },
      {
        label: "Degree & field",
        value: [a.degree, a.fieldOfStudy].filter(Boolean).join(" · "),
      },
      { label: "Semester", value: a.semester },
      {
        label: "Living during the semester",
        value:
          a.living === "other" ? a.livingOther : labelOf(LIVING_OPTIONS, a.living),
      },
      { label: "Heard about us via", value: a.heardAbout },
    ],
    availability: [
      ...ATTENDANCE_DATES.map((d) => ({
        label: `${d.label} (${d.date})`,
        value: yesNo(attendance[d.id]),
      })),
      { label: "Hours per week", value: a.hoursPerWeek },
      { label: "Other commitments", value: a.otherCommitments },
    ],
    work: WORK_QUESTIONS.map((q) => ({
      label: q.label,
      value: work[q.id],
      long: true,
    })),
    interests: [
      { label: "Skills", value: skills },
      { label: "Roles", value: roles.join(", ") },
      { label: "Project type", value: labelOf(PROJECT_TYPES, a.projectType) },
      { label: "Curious about", value: a.curiousProjects },
    ],
    skills: [
      { label: "Main skill area", value: a.mainSkillArea },
      { label: SKILL_FOLLOW_UP, value: a.mainSkillStory, long: true },
      ...(a.secondSkillArea
        ? [
            { label: "Second skill area", value: a.secondSkillArea },
            { label: SKILL_FOLLOW_UP, value: a.secondSkillStory, long: true },
          ]
        : []),
      { label: "CV", value: cvLabel ?? a.cvFileName },
      { label: "Links", value: a.links },
    ],
  };

  return APPLICATION_STEPS.map((step, stepIndex) => ({
    stepIndex,
    id: step.id,
    title: step.title,
    rows: rowsByStep[step.id] ?? [],
  }));
}
