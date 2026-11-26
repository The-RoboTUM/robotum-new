// ─────────────────────────────────────────────────────────────────────────
// APPLICATION FORM - questions + dropdown options for the on-site
// application form at /join/apply (replaces the Google Form).
//
// Edit the lists here; the form renders whatever is in this file.
// `rated` / `reviewer` on each step is metadata for the CV screening tool
// later - it is never shown to applicants.
//
// STATUS: draft. `submissionEnabled` is true: answers + CV are saved to
// Supabase (table `applications`, private bucket `applications-cv`; set up
// by supabase/migrations/0008_applications.sql). false = preview only.
// `liveOnSite` is false, so /join/apply only exists in local development
// (npm run dev) - on robotum.info the URL shows the 404 page.
// `useOwnForm` decides whether the "Apply" buttons on /join point here
// (true) or to the Google Form in src/config/applications.js (false).
//
// TO GO LIVE: run migration 0008 in Supabase, then liveOnSite → true and
// useOwnForm → true. Commit + redeploy.
// ─────────────────────────────────────────────────────────────────────────

export const applicationForm = {
  path: "/join/apply",
  liveOnSite: false, // ← false = page only exists locally (npm run dev)
  useOwnForm: false, // ← flip to true once submissions are saved
  submissionEnabled: true, // ← sends to Supabase (needs migration 0008)
  draftStorageKey: "robotum-application-draft-v1",
  targetWords: 150, // guidance shown under long answers
  maxWords: 250, // hard limit per long answer
  cvMaxSizeMb: 5,
};

/** The five steps, in order. */
export const APPLICATION_STEPS = [
  {
    id: "about",
    title: "About you",
    intro: "The basics, so we know who you are and how to reach you.",
    rated: "degree + semester only",
  },
  {
    id: "availability",
    title: "Availability",
    intro: "Helps us plan interviews and onboarding.",
    rated: false,
  },
  {
    id: "work",
    title: "How you work",
    intro:
      "This is the part we read closest. Aim for about 150 words per answer - honest and specific beats polished.",
    rated: true,
    reviewer: "soft-skill",
  },
  {
    id: "interests",
    title: "Interests",
    intro: "Tells us which teams and projects to match you with.",
    rated: false,
  },
  {
    id: "skills",
    title: "Skills & experience",
    intro:
      "Coursework, hobby projects and jobs all count - tell us what you actually did.",
    rated: true,
    reviewer: "hard-skill",
  },
];

// ── Step 1: About you ────────────────────────────────────────────────────

export const UNIVERSITIES = [
  "Technical University of Munich (TUM)",
  "Ludwig Maximilian University (LMU)",
  "Munich University of Applied Sciences (HM)",
  "Other",
];

export const DEGREES = ["Bachelor", "Master", "PhD", "Exchange", "Other"];

export const SEMESTERS = [
  ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
  "13+",
];

export const LIVING_OPTIONS = [
  { value: "munich", label: "Munich area" },
  { value: "moving", label: "Moving to Munich before the semester starts" },
  { value: "other", label: "Other" },
];

export const HEARD_ABOUT_OPTIONS = [
  "Instagram",
  "LinkedIn",
  "Friend or roboTUM member",
  "University event or fair",
  "Lecture or professor",
  "roboTUM website",
  "Other",
];

// ── Step 2: Availability ─────────────────────────────────────────────────

/** Dates applicants confirm they can attend. Replace before going live. */
export const ATTENDANCE_DATES = [
  { id: "interview", label: "Interview week", date: "TBD" },
  { id: "onboarding", label: "Onboarding day", date: "TBD" },
];

export const HOURS_PER_WEEK = [
  "Less than 8",
  ...Array.from({ length: 18 }, (_, i) => String(i + 8)), // 8 … 25
  "25+",
];

// ── Step 3: How you work (rated: soft skills) ───────────────────────────

export const WORK_QUESTIONS = [
  { id: "whyRobotum", label: "Why roboTUM, and why now?" },
  {
    id: "curiosity",
    label:
      "Curiosity: tell us about something you built, fixed, or took apart just to understand it.",
    hint: "It doesn't have to be technical.",
  },
  {
    id: "teamwork",
    label:
      "Teamwork: describe a group project that didn't go well, and what you did.",
  },
  {
    id: "commitment",
    label:
      "Commitment: what would make you stay in a student club for more than one semester?",
  },
  {
    id: "experience",
    label: "Experience outside your studies",
    hint: "Volunteering, clubs, jobs, side projects.",
  },
];

// ── Step 4: Interests (routing only) ────────────────────────────────────

export const SKILL_LEVELS = [
  { value: "none", label: "None" },
  { value: "some", label: "Some" },
  { value: "a_lot", label: "A lot" },
];

export const SKILL_TAGS = [
  "CAD",
  "3D printing",
  "Manufacturing / machining",
  "PCB design",
  "Embedded C/C++",
  "Python",
  "C++",
  "ROS",
  "Control systems",
  "Computer vision",
  "Machine learning",
  "Web development",
  "Project management",
  "Marketing & social media",
  "Graphic / UI design",
  "Video & photography",
];

export const ROLES = [
  "Mechanical engineering",
  "Electronics",
  "Embedded software",
  "Robotics software",
  "AI / ML",
  "Perception & SLAM",
  "Project management",
  "Partnerships & fundraising",
  "Marketing & communications",
  "Design",
  "Events",
  "Finance & legal",
];

export const MAX_ROLES = 3;

export const PROJECT_TYPES = [
  {
    value: "advanced",
    label: "Advanced technical project",
    hint: "You already have solid hands-on experience.",
  },
  {
    value: "entry",
    label: "Entry-level technical project",
    hint: "You want to learn by building.",
  },
  {
    value: "non_technical",
    label: "Non-technical",
    hint: "Operations, marketing, partnerships, events.",
  },
];

// ── Step 5: Skills & experience (rated: hard skills) ────────────────────

export const SKILL_AREAS = [
  "Mechanical",
  "Electronics",
  "Software",
  "AI/ML",
  "SLAM",
  "Business",
  "Design",
  "Other",
];

export const SKILL_FOLLOW_UP =
  "Tell us about a project where you used this skill. What was it, what was your part, and what was one problem you ran into?";

export const SKILL_FOLLOW_UP_HINT =
  "Coursework, hobby projects, or a job all count.";

// ── Initial (empty) answers ─────────────────────────────────────────────

export function emptyApplication() {
  return {
    // 1. About you
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    matriculationNumber: "",
    university: "",
    universityOther: "",
    degree: "",
    fieldOfStudy: "",
    semester: "",
    living: "",
    livingOther: "",
    heardAbout: "",
    // 2. Availability
    attendance: Object.fromEntries(ATTENDANCE_DATES.map((d) => [d.id, ""])),
    hoursPerWeek: "",
    otherCommitments: "",
    // 3. How you work
    work: Object.fromEntries(WORK_QUESTIONS.map((q) => [q.id, ""])),
    // 4. Interests
    skillLevels: Object.fromEntries(SKILL_TAGS.map((t) => [t, "none"])),
    roles: [],
    projectType: "",
    curiousProjects: "",
    // 5. Skills & experience
    mainSkillArea: "",
    mainSkillStory: "",
    secondSkillArea: "",
    secondSkillStory: "",
    cvFileName: "", // file itself is not stored in the draft
    links: "",
  };
}
