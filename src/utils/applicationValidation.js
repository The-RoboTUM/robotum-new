// Validation for the on-site application form (src/config/applicationForm.js).
// Each step validator returns { fieldName: "message" }; empty object = valid.
import {
  applicationForm,
  ATTENDANCE_DATES,
  MAX_ROLES,
  WORK_QUESTIONS,
} from "@config/applicationForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()/-]{6,20}$/;

export function countWords(text = "") {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const isBlank = (v) => !v || !String(v).trim();

function longAnswer(errors, key, value, { required }) {
  if (required && isBlank(value)) {
    errors[key] = "Please answer this question.";
  } else if (countWords(value) > applicationForm.maxWords) {
    errors[key] = `Please keep this under ${applicationForm.maxWords} words.`;
  }
}

const validators = {
  about(a) {
    const e = {};
    if (isBlank(a.firstName)) e.firstName = "Please enter your first name.";
    if (isBlank(a.lastName)) e.lastName = "Please enter your last name.";
    if (isBlank(a.email)) e.email = "Please enter your email.";
    else if (!EMAIL_RE.test(a.email.trim()))
      e.email = "This doesn't look like a valid email address.";
    if (isBlank(a.phone)) e.phone = "Please enter your phone number.";
    else if (!PHONE_RE.test(a.phone.trim()))
      e.phone = "Use digits, spaces and an optional leading +.";
    if (isBlank(a.matriculationNumber))
      e.matriculationNumber = "Please enter your matriculation number.";
    if (isBlank(a.university)) e.university = "Please choose your university.";
    else if (a.university === "Other" && isBlank(a.universityOther))
      e.universityOther = "Please name your university.";
    if (isBlank(a.degree)) e.degree = "Please choose your degree.";
    if (isBlank(a.fieldOfStudy))
      e.fieldOfStudy = "Please enter your field of study.";
    if (isBlank(a.semester)) e.semester = "Please choose your semester.";
    if (isBlank(a.living)) e.living = "Please choose an option.";
    else if (a.living === "other" && isBlank(a.livingOther))
      e.livingOther = "Please tell us where you'll live.";
    if (isBlank(a.heardAbout)) e.heardAbout = "Please choose an option.";
    return e;
  },

  availability(a) {
    const e = {};
    ATTENDANCE_DATES.forEach(({ id }) => {
      if (isBlank(a.attendance?.[id]))
        e[`attendance.${id}`] = "Please let us know if you can attend.";
    });
    if (isBlank(a.hoursPerWeek))
      e.hoursPerWeek = "Please choose how many hours you can commit.";
    return e;
  },

  work(a) {
    const e = {};
    WORK_QUESTIONS.forEach(({ id }) =>
      longAnswer(e, `work.${id}`, a.work?.[id], { required: true }),
    );
    return e;
  },

  interests(a) {
    const e = {};
    if (!a.roles?.length) e.roles = "Please pick at least one role.";
    else if (a.roles.length > MAX_ROLES)
      e.roles = `Please pick at most ${MAX_ROLES} roles.`;
    if (isBlank(a.projectType)) e.projectType = "Please choose a project type.";
    return e;
  },

  skills(a) {
    const e = {};
    if (isBlank(a.mainSkillArea))
      e.mainSkillArea = "Please choose your main skill area.";
    longAnswer(e, "mainSkillStory", a.mainSkillStory, { required: true });
    longAnswer(e, "secondSkillStory", a.secondSkillStory, { required: false });
    if (
      !isBlank(a.secondSkillArea) &&
      a.secondSkillArea === a.mainSkillArea
    ) {
      e.secondSkillArea = "Pick a different area than your main one.";
    }
    return e;
  },
};

export function validateStep(stepId, answers) {
  return validators[stepId]?.(answers) ?? {};
}
