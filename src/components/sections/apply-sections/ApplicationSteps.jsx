// The five steps of the application form. Each step gets
// { answers, set, errors } from ApplicationForm and renders its fields.
// Questions and options live in src/config/applicationForm.js.
import clsx from "clsx";
import {
  applicationForm,
  ATTENDANCE_DATES,
  DEGREES,
  HEARD_ABOUT_OPTIONS,
  HOURS_PER_WEEK,
  LIVING_OPTIONS,
  MAX_ROLES,
  PROJECT_TYPES,
  ROLES,
  SEMESTERS,
  SKILL_AREAS,
  SKILL_FOLLOW_UP,
  SKILL_FOLLOW_UP_HINT,
  SKILL_LEVELS,
  SKILL_TAGS,
  UNIVERSITIES,
  WORK_QUESTIONS,
} from "@config/applicationForm";
import {
  ChipCheckboxGroup,
  FieldShell,
  LongAnswerField,
  RadioCards,
  SelectField,
  TextField,
} from "./FormFields";

const grid2 = "grid grid-cols-1 gap-5 sm:grid-cols-2";

// ── 1. About you ─────────────────────────────────────────────────────────
export function AboutStep({ answers: a, set, errors: e }) {
  return (
    <div className="flex flex-col gap-5">
      <div className={grid2}>
        <TextField
          id="firstName"
          label="First name"
          required
          autoComplete="given-name"
          value={a.firstName}
          onChange={set("firstName")}
          error={e.firstName}
        />
        <TextField
          id="lastName"
          label="Last name"
          required
          autoComplete="family-name"
          value={a.lastName}
          onChange={set("lastName")}
          error={e.lastName}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          hint="Your university email if you have one."
          value={a.email}
          onChange={set("email")}
          error={e.email}
        />
        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          value={a.phone}
          onChange={set("phone")}
          error={e.phone}
        />
        <TextField
          id="matriculationNumber"
          label="Matriculation number"
          required
          inputMode="numeric"
          value={a.matriculationNumber}
          onChange={set("matriculationNumber")}
          error={e.matriculationNumber}
        />
      </div>

      <div className={grid2}>
        <SelectField
          id="university"
          label="University"
          required
          options={UNIVERSITIES}
          value={a.university}
          onChange={set("university")}
          error={e.university}
        />
        {a.university === "Other" ? (
          <TextField
            id="universityOther"
            label="Which university?"
            required
            value={a.universityOther}
            onChange={set("universityOther")}
            error={e.universityOther}
          />
        ) : (
          <div className="hidden sm:block" />
        )}
        <SelectField
          id="degree"
          label="Degree"
          required
          options={DEGREES}
          value={a.degree}
          onChange={set("degree")}
          error={e.degree}
        />
        <TextField
          id="fieldOfStudy"
          label="Field of study"
          required
          value={a.fieldOfStudy}
          onChange={set("fieldOfStudy")}
          error={e.fieldOfStudy}
        />
        <SelectField
          id="semester"
          label="Semester"
          required
          hint="Your current semester in this degree."
          options={SEMESTERS}
          value={a.semester}
          onChange={set("semester")}
          error={e.semester}
        />
        <SelectField
          id="heardAbout"
          label="How did you hear about us?"
          required
          options={HEARD_ABOUT_OPTIONS}
          value={a.heardAbout}
          onChange={set("heardAbout")}
          error={e.heardAbout}
        />
      </div>

      <RadioCards
        name="living"
        legend="Where will you live during the semester?"
        required
        options={LIVING_OPTIONS}
        value={a.living}
        onChange={set("living")}
        error={e.living}
      />
      {a.living === "other" && (
        <TextField
          id="livingOther"
          label="Where will you live?"
          required
          value={a.livingOther}
          onChange={set("livingOther")}
          error={e.livingOther}
        />
      )}
    </div>
  );
}

// ── 2. Availability ──────────────────────────────────────────────────────
const YES_NO = [
  { value: "yes", label: "Yes, I can attend" },
  { value: "no", label: "No, I can't" },
];

export function AvailabilityStep({ answers: a, set, errors: e }) {
  return (
    <div className="flex flex-col gap-5">
      {ATTENDANCE_DATES.map((d) => (
        <RadioCards
          key={d.id}
          name={`attendance.${d.id}`}
          legend={`Can you attend the ${d.label.toLowerCase()} (${d.date})?`}
          required
          columns="sm:grid-cols-2"
          options={YES_NO}
          value={a.attendance[d.id]}
          onChange={set(`attendance.${d.id}`)}
          error={e[`attendance.${d.id}`]}
        />
      ))}
      <div className={grid2}>
        <SelectField
          id="hoursPerWeek"
          label="Hours per week you can commit"
          required
          options={HOURS_PER_WEEK}
          value={a.hoursPerWeek}
          onChange={set("hoursPerWeek")}
          error={e.hoursPerWeek}
        />
      </div>
      <TextField
        id="otherCommitments"
        label="Other commitments this semester"
        hint="E.g. a job, another club, exams abroad."
        value={a.otherCommitments}
        onChange={set("otherCommitments")}
      />
    </div>
  );
}

// ── 3. How you work ──────────────────────────────────────────────────────
export function WorkStep({ answers: a, set, errors: e }) {
  return (
    <div className="flex flex-col gap-6">
      {WORK_QUESTIONS.map((q) => (
        <LongAnswerField
          key={q.id}
          id={`work.${q.id}`}
          label={q.label}
          hint={q.hint}
          required
          value={a.work[q.id]}
          onChange={set(`work.${q.id}`)}
          error={e[`work.${q.id}`]}
        />
      ))}
    </div>
  );
}

// ── 4. Interests ─────────────────────────────────────────────────────────
function SkillLevelRow({ tag, value, onChange }) {
  const name = `skill-${tag}`;
  return (
    <fieldset className="flex flex-col gap-2 border-b border-white/10 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <legend className="float-left text-sm text-white/85 sm:float-none">
        {tag}
      </legend>
      <div className="clear-both flex gap-1.5 sm:clear-none">
        {SKILL_LEVELS.map((lvl) => {
          const checked = value === lvl.value;
          return (
            <label
              key={lvl.value}
              className={clsx(
                "cursor-pointer rounded-full border px-3 py-1 text-xs transition focus-within:ring-2 focus-within:ring-accent",
                checked
                  ? lvl.value === "none"
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-accent bg-accent/20 text-white"
                  : "border-white/15 text-white/60 hover:border-white/30",
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={lvl.value}
                checked={checked}
                onChange={() => onChange(lvl.value)}
              />
              {lvl.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function InterestsStep({ answers: a, set, errors: e }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-white">
          Your experience with these skills
        </p>
        <p className="text-xs text-white/50">
          Leave anything you haven't tried at "None" - that's completely fine.
        </p>
        <div className="card-inset px-4 py-1 sm:px-5">
          {SKILL_TAGS.map((tag) => (
            <SkillLevelRow
              key={tag}
              tag={tag}
              value={a.skillLevels[tag] ?? "none"}
              onChange={set(`skillLevels.${tag}`)}
            />
          ))}
        </div>
      </div>

      <ChipCheckboxGroup
        name="roles"
        legend="Which roles interest you?"
        hint={`Pick up to ${MAX_ROLES}.`}
        required
        max={MAX_ROLES}
        options={ROLES}
        values={a.roles}
        onChange={set("roles")}
        error={e.roles}
      />

      <RadioCards
        name="projectType"
        legend="What kind of project are you looking for?"
        required
        options={PROJECT_TYPES}
        value={a.projectType}
        onChange={set("projectType")}
        error={e.projectType}
      />

      <TextField
        id="curiousProjects"
        label="Projects you're curious about"
        hint="Have a look at our projects page and name any that caught your eye."
        value={a.curiousProjects}
        onChange={set("curiousProjects")}
      />
    </div>
  );
}

// ── 5. Skills & experience ───────────────────────────────────────────────
export function SkillsStep({ answers: a, set, errors: e, cvFile, setCvFile }) {
  const hasSecond = Boolean(a.secondSkillArea);
  const maxBytes = applicationForm.cvMaxSizeMb * 1024 * 1024;
  const cvTooLarge = cvFile && cvFile.size > maxBytes;

  return (
    <div className="flex flex-col gap-6">
      <div className="card-inset flex flex-col gap-4 p-4 sm:p-5">
        <div className={grid2}>
          <SelectField
            id="mainSkillArea"
            label="Main skill area"
            required
            options={SKILL_AREAS}
            value={a.mainSkillArea}
            onChange={set("mainSkillArea")}
            error={e.mainSkillArea}
          />
        </div>
        <LongAnswerField
          id="mainSkillStory"
          label={SKILL_FOLLOW_UP}
          hint={SKILL_FOLLOW_UP_HINT}
          required
          value={a.mainSkillStory}
          onChange={set("mainSkillStory")}
          error={e.mainSkillStory}
        />
      </div>

      <div className="card-inset flex flex-col gap-4 p-4 sm:p-5">
        <div className={grid2}>
          <SelectField
            id="secondSkillArea"
            label="Second skill area"
            placeholder="None"
            options={SKILL_AREAS}
            value={a.secondSkillArea}
            onChange={set("secondSkillArea")}
            error={e.secondSkillArea}
          />
        </div>
        {hasSecond && (
          <LongAnswerField
            id="secondSkillStory"
            label={SKILL_FOLLOW_UP}
            hint={SKILL_FOLLOW_UP_HINT}
            value={a.secondSkillStory}
            onChange={set("secondSkillStory")}
            error={e.secondSkillStory}
          />
        )}
      </div>

      <FieldShell
        id="cv"
        label="CV"
        hint={`PDF, max. ${applicationForm.cvMaxSizeMb} MB.`}
        error={cvTooLarge ? "This file is too large." : undefined}
      >
        <input
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf"
          onChange={(ev) => {
            const file = ev.target.files?.[0] ?? null;
            setCvFile(file);
            set("cvFileName")(file?.name ?? "");
          }}
          className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20"
        />
        {!cvFile && a.cvFileName && (
          <p className="text-xs text-white/50">
            Previously chosen: {a.cvFileName} - please select it again.
          </p>
        )}
      </FieldShell>

      <TextField
        id="links"
        label="Links"
        hint="LinkedIn, GitHub, portfolio - separate several with commas."
        value={a.links}
        onChange={set("links")}
      />
    </div>
  );
}

export const STEP_COMPONENTS = {
  about: AboutStep,
  availability: AvailabilityStep,
  work: WorkStep,
  interests: InterestsStep,
  skills: SkillsStep,
};
