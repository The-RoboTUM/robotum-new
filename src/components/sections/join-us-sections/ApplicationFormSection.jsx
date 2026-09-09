import {
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import ApplyButton from "@components/ui/ApplyButton";
import {
  applications,
  applicationsOpen,
  hasApplicationForm,
  formatApplicationDeadlineWithTime,
} from "@config/applications";

// Everything on this page is driven by src/config/applications.js -
// flip `isOpen` / paste the Google Form link there, no code changes needed.

const CHECKLIST = [
  "Your TUM (or university) email address",
  "An up-to-date CV and your transcript of records",
  "Which kind of project work you want to contribute to",
  "Time for the motivation section - it is the part we read closest",
];

const ApplicationFormSection = () => {
  const deadline = formatApplicationDeadlineWithTime();

  const facts = [
    {
      icon: DocumentTextIcon,
      label: "Format",
      value: "Google Form, submitted online",
    },
    {
      icon: ClockIcon,
      label: "Time needed",
      value: applications.durationLabel,
    },
    {
      icon: CalendarDaysIcon,
      label: "Deadline",
      value: deadline || "Rolling - we review as applications arrive",
    },
    {
      icon: MapPinIcon,
      label: "Requirement",
      value: applications.locationNote,
    },
  ];

  return (
    <section
      id="application"
      className="section-dark-secondary surface-pattern"
      aria-labelledby="application-form-heading"
    >
      <div className="section-container">
        <div className="mx-auto max-w-4xl bg-elevated-1/80 border border-white/10 rounded-3xl px-5 py-6 sm:px-8 sm:py-8 shadow-card-lg backdrop-blur-xl flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {applicationsOpen ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Applications open
                </span>
              ) : (
                <span className="chip">Applications closed</span>
              )}
              <span className="chip">{applications.semester}</span>
            </div>

            <h2
              id="application-form-heading"
              className="heading heading-h2 text-3xl md:text-4xl text-balance"
            >
              {applicationsOpen ? (
                <>
                  Apply for the{" "}
                  <span className="text-gradient">{applications.semester}</span>
                </>
              ) : (
                "Application form"
              )}
            </h2>

            <p className="text-text2 text-white/75 leading-relaxed max-w-2xl">
              {applicationsOpen
                ? `Set aside ${applications.durationLabel} and have your documents ready. We review applications as they arrive, so the earlier you apply, the sooner we can match you with a project.`
                : "Thank you for your interest in joining RoboTUM. The current application phase has ended and new submissions are not accepted at this time."}
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-6 lg:gap-8 items-stretch">
            {/* Checklist */}
            <div className="card-inset p-5 sm:p-6 flex flex-col gap-4">
              <p className="text-sm font-medium text-white">
                Have this ready before you start
              </p>
              <ul className="flex flex-col gap-3">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-white/75 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-2 text-[11px] text-white/45 leading-relaxed">
                You don't need to study robotics - we welcome applicants from
                every field, technical and non-technical alike.
              </p>
            </div>

            {/* Call to action */}
            <div className="rounded-2xl bg-linear-to-br from-accent/50 via-[#7C3AED]/45 to-[#22D3EE]/35 p-px shadow-card">
              <div className="flex h-full flex-col gap-5 rounded-2xl bg-elevated-2/95 p-5 sm:p-6">
                <div className="flex flex-col gap-3">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-white/45"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-white/45">
                          {label}
                        </p>
                        <p className="text-sm text-white/85 leading-snug">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <ApplyButton
                    label="Open application form"
                    fullWidth
                    className="justify-center"
                  />
                  <p className="text-center text-[11px] text-white/45 leading-relaxed">
                    {applicationsOpen && hasApplicationForm
                      ? "Opens Google Forms in a new tab."
                      : applicationsOpen
                        ? "The form goes live shortly - check back soon."
                        : "Follow our channels to hear when the next phase opens."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* After submitting */}
          <div className="card-inset p-5 sm:p-6 text-sm text-white/75 leading-relaxed">
            <p className="text-sm font-medium text-white mb-2">
              What happens after you submit
            </p>
            <p>
              You'll get a confirmation by email. Our team reviews every
              application and invites matching candidates to a short, informal
              interview. Questions at any point? Write to{" "}
              <a
                href={`mailto:${applications.contactEmail}`}
                className="underline underline-offset-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                {applications.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationFormSection;
