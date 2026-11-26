// Read-only display of an application's answers, grouped by form step.
// Used on the applicant's review screen (with Edit buttons) and in
// /admin/applications (without). Labels come from buildApplicationSummary.
import clsx from "clsx";
import Button from "@components/ui/Button";
import { buildApplicationSummary } from "@utils/applicationSummary";

function AnswerRow({ label, value, long }) {
  const empty = value === undefined || value === null || value === "";
  return (
    <div
      className={clsx(
        "grid gap-1 py-2.5",
        long
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4",
      )}
    >
      <dt className="text-xs text-white/50">{label}</dt>
      <dd
        className={clsx(
          "whitespace-pre-line break-words text-sm leading-relaxed",
          empty ? "italic text-white/35" : "text-white/85",
        )}
      >
        {empty ? "Not answered" : value}
      </dd>
    </div>
  );
}

/**
 * @param {object} props
 * @param {object} props.answers
 * @param {string} [props.cvLabel]   what to show in the CV row
 * @param {(stepIndex: number) => void} [props.onEdit]  shows Edit buttons
 */
export default function ApplicationAnswers({ answers, cvLabel, onEdit }) {
  const sections = buildApplicationSummary(answers, { cvLabel });

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section.id} className="card-inset p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{section.title}</h3>
            {onEdit && (
              <Button
                variant="secondary"
                size="xs"
                onClick={() => onEdit(section.stepIndex)}
              >
                Edit
              </Button>
            )}
          </div>
          <dl className="divide-y divide-white/10">
            {section.rows.map((row, i) => (
              <AnswerRow key={`${section.id}-${i}`} {...row} />
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
