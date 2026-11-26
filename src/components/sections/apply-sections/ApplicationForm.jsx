// Multi-step application form: 5 steps + a review screen.
// Answers are kept as a draft in this browser (localStorage) so a long form
// survives a reload. On submit, answers + CV go to Supabase via
// submitApplication (preview only while submissionEnabled is false).
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/solid";
import Button from "@components/ui/Button";
import {
  applicationForm,
  APPLICATION_STEPS,
  emptyApplication,
} from "@config/applicationForm";
import { applications } from "@config/applications";
import { submitApplication } from "@data";
import { validateStep } from "@utils/applicationValidation";
import { logger } from "@utils/logger";
import { STEP_COMPONENTS } from "./ApplicationSteps";
import ApplicationAnswers from "./ApplicationAnswers";

const REVIEW = APPLICATION_STEPS.length; // index of the review screen

function loadDraft() {
  try {
    const raw = window.localStorage.getItem(applicationForm.draftStorageKey);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const base = emptyApplication();
    // Merge so new fields added to the config get their defaults.
    return {
      ...base,
      ...saved,
      attendance: { ...base.attendance, ...saved.attendance },
      work: { ...base.work, ...saved.work },
      skillLevels: { ...base.skillLevels, ...saved.skillLevels },
      roles: Array.isArray(saved.roles) ? saved.roles : [],
    };
  } catch (err) {
    logger.warn("Could not read application draft", err);
    return null;
  }
}

function saveDraft(answers) {
  try {
    window.localStorage.setItem(
      applicationForm.draftStorageKey,
      JSON.stringify(answers),
    );
  } catch {
    // Storage blocked (private mode etc.) - the form still works.
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(applicationForm.draftStorageKey);
  } catch {
    // ignore
  }
}

/** Set a top-level key or one level deep ("work.teamwork"). */
function setPath(obj, path, value) {
  const dot = path.indexOf(".");
  if (dot === -1) return { ...obj, [path]: value };
  const head = path.slice(0, dot);
  const tail = path.slice(dot + 1);
  return { ...obj, [head]: { ...obj[head], [tail]: value } };
}

// ── Stepper ──────────────────────────────────────────────────────────────
function Stepper({ current, completed, onJump }) {
  const items = [...APPLICATION_STEPS, { id: "review", title: "Review" }];
  return (
    <nav aria-label="Application progress">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {items.map((step, i) => {
          const isCurrent = i === current;
          const isDone = completed.has(i) && !isCurrent;
          const reachable = i <= Math.max(current, ...completed, 0) + 1;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-current={isCurrent ? "step" : undefined}
                className={clsx(
                  "h-1.5 w-full rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isCurrent
                    ? "bg-accent"
                    : isDone
                      ? "bg-accent/50 hover:bg-accent/70"
                      : "bg-white/15",
                  reachable ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span className="sr-only">
                  Step {i + 1}: {step.title}
                  {isDone ? " (done)" : ""}
                </span>
              </button>
              <span
                aria-hidden="true"
                className={clsx(
                  "hidden truncate text-[11px] md:block",
                  isCurrent ? "text-white" : "text-white/45",
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────
export default function ApplicationForm() {
  const [answers, setAnswers] = useState(() => loadDraft() ?? emptyApplication());
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(() => new Set());
  const [errors, setErrors] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const topRef = useRef(null);

  useEffect(() => {
    // After a real submit the draft was cleared on purpose - don't re-create it.
    if (submitted && applicationForm.submissionEnabled) return;
    saveDraft(answers);
  }, [answers, submitted]);

  const set = (path) => (value) => {
    setAnswers((prev) => setPath(prev, path, value));
    // Clear that field's error as soon as the applicant fixes it.
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const goTo = (i) => {
    setStep(i);
    setErrors({});
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateCurrent = () => {
    const stepErrors = validateStep(APPLICATION_STEPS[step].id, answers);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      // Move focus to the first invalid field.
      requestAnimationFrame(() => {
        const first = document.querySelector('[aria-invalid="true"], [role="alert"]');
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (first?.focus) first.focus({ preventScroll: true });
      });
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateCurrent()) return;
    setCompleted((prev) => new Set(prev).add(step));
    goTo(step + 1);
  };

  const submit = async () => {
    if (sending) return;
    setSendError("");

    // Re-check every step; jump to the first one with problems.
    const firstBad = APPLICATION_STEPS.findIndex(
      (s) => Object.keys(validateStep(s.id, answers)).length > 0,
    );
    if (firstBad !== -1) {
      goTo(firstBad);
      setErrors(validateStep(APPLICATION_STEPS[firstBad].id, answers));
      return;
    }

    if (cvFile && cvFile.size > applicationForm.cvMaxSizeMb * 1024 * 1024) {
      setSendError(
        `Your CV is larger than ${applicationForm.cvMaxSizeMb} MB. Please choose a smaller PDF.`,
      );
      return;
    }

    if (applicationForm.submissionEnabled) {
      setSending(true);
      try {
        await submitApplication({
          answers,
          round: applications.semester,
          cvFile,
        });
      } catch (err) {
        setSendError(err.message);
        setSending(false);
        return;
      }
      setSending(false);
      // Sent - don't leave personal data behind in this browser.
      clearDraft();
      setAnswers(emptyApplication());
      setCvFile(null);
      setCompleted(new Set());
    }

    setSubmitted(true);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startOver = () => {
    clearDraft();
    setAnswers(emptyApplication());
    setCvFile(null);
    setCompleted(new Set());
    setSubmitted(false);
    goTo(0);
  };

  if (submitted) {
    return (
      <div ref={topRef} className="card-surface flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="heading heading-h2 text-white">
          {applicationForm.submissionEnabled
            ? "Application received"
            : "All answers look complete"}
        </h2>
        <p className="max-w-lg text-sm text-white/70 leading-relaxed">
          {applicationForm.submissionEnabled
            ? "Thanks for applying to roboTUM! You'll get a confirmation by email."
            : "Preview mode: this form isn't connected yet, so nothing was sent. Your answers stay saved in this browser."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {applicationForm.submissionEnabled ? (
            <Button variant="secondary" to="/join">
              Back to Join us
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                Back to review
              </Button>
              <Button variant="secondary" onClick={startOver}>
                Clear answers
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  const isReview = step === REVIEW;
  const current = APPLICATION_STEPS[step];
  const StepComponent = current && STEP_COMPONENTS[current.id];

  return (
    <div ref={topRef} className="flex scroll-mt-28 flex-col gap-6">
      <Stepper current={step} completed={completed} onJump={goTo} />

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isReview) submit();
          else next();
        }}
        className="card-surface flex flex-col gap-6 p-5 sm:p-8"
      >
        <header className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-wide text-white/45">
            {isReview
              ? "Last step"
              : `Step ${step + 1} of ${APPLICATION_STEPS.length}`}
          </p>
          <h2 className="heading heading-h2 text-white">
            {isReview ? "Review your application" : current.title}
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            {isReview
              ? "Check your answers before you submit. You can still edit any section."
              : current.intro}
          </p>
        </header>

        {isReview ? (
          <ApplicationAnswers
            answers={answers}
            cvLabel={cvFile?.name ?? ""}
            onEdit={goTo}
          />
        ) : (
          <StepComponent
            answers={answers}
            set={set}
            errors={errors}
            cvFile={cvFile}
            setCvFile={setCvFile}
          />
        )}

        {Object.keys(errors).length > 0 && (
          <p role="status" className="text-sm text-red-300">
            Some answers need your attention before you can continue.
          </p>
        )}

        {isReview && sendError && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {sendError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className={clsx(step === 0 && "invisible")}
          >
            ← Back
          </Button>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Button type="submit" variant="primary" loading={sending}>
              {isReview
                ? applicationForm.submissionEnabled
                  ? "Submit application"
                  : "Check & finish (preview)"
                : "Continue →"}
            </Button>
          </div>
        </div>
      </form>

      <p className="text-center text-xs text-white/45">
        Your answers are saved in this browser as you go.
      </p>
    </div>
  );
}
