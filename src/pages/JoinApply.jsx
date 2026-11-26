import { Link } from "react-router-dom";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import ApplicationForm from "@components/sections/apply-sections/ApplicationForm";
import { applications } from "@config/applications";
import { applicationForm } from "@config/applicationForm";
import { usePageTitle } from "@hooks/usePageTitle";

const JoinApply = () => {
  usePageTitle("Apply | roboTUM");

  return (
    <>
      <Navbar />
      <main className="section-container hero-offset section-dark-primary surface-pattern font-sans text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Link
              to="/join"
              className="w-fit rounded-sm text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ← Back to Join us
            </Link>
            <span className="chip w-fit">{applications.semester}</span>
            <h1 className="heading heading-h1 leading-tight">
              Apply to <span className="text-gradient">roboTUM</span>
            </h1>
            <p className="text-text2 text-white/70 leading-relaxed">
              Five short sections, about {applications.durationLabel}. Fields
              marked <span className="text-accent">*</span> are required.
            </p>
            {!applicationForm.submissionEnabled && (
              <p
                role="note"
                className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100"
              >
                Preview: this form isn't accepting applications yet. Nothing
                you enter here is sent.
              </p>
            )}
          </div>

          <ApplicationForm />
        </div>
      </main>
      <FooterSection />
    </>
  );
};

export default JoinApply;
