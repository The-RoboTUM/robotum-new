import Button from "@components/ui/Button";

const TYPEFORM_APPLICATION_URL = "https://form.typeform.com/to/Uojt4r1b";

const ApplicationFormSection = () => {
  return (
    <section
      id="application"
      className="section-dark-secondary surface-pattern"
    >
      <div className="section-container">
        <div className="mx-auto max-w-4xl bg-[#0F1C3A]/80 border border-white/10 rounded-3xl px-5 py-6 sm:px-8 sm:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
                Join RoboTUM
              </p>
              <h2 className="heading heading-h2 text-3xl md:text-4xl mt-2">
                Application form
              </h2>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-[#101A34]/90 px-4 py-4 text-sm text-white/85 max-w-md">
              <p className="font-semibold text-white mb-2">Before you start:</p>
              <ul className="space-y-1 list-disc list-inside text-white/80">
                <li>The application takes around 30–45 minutes.</li>
                <li>Please answer the motivation questions thoughtfully.</li>
                <li>Use your university email if possible.</li>
                <li>Have your CV and transcript of records ready as PDF.</li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-6 lg:gap-8 items-stretch">
            <div className="rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 sm:p-6 text-sm text-white/75 leading-relaxed flex flex-col justify-between min-h-full">
              <div>
                <p className="text-sm font-medium text-white mb-3">
                  After submitting
                </p>
                <p>
                  Our team will review your application and get back to you via
                  email. If you have any questions, you can always reach us at{" "}
                  <a
                    href="mailto:operations@robotum.info"
                    className="underline hover:text-white"
                  >
                    operations@robotum.info
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-[#050A1A]/40 p-5 sm:p-6 min-h-full">
              {/*
              <div>
                <p className="text-sm font-medium text-white">Ready to apply?</p>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  The application will open in a new tab so you can return to the
                  website anytime.
                </p>
              </div>

              <Button
                as="a"
                href={TYPEFORM_APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="w-full justify-center"
              >
                Start application →
              </Button>

              <div className="pt-1 border-t border-white/10">
                <p className="text-[11px] text-white/45 leading-relaxed mb-2">
                  If the form does not open, copy this link into your browser:
                </p>
                <a
                  href={TYPEFORM_APPLICATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent break-all hover:underline"
                >
                  {TYPEFORM_APPLICATION_URL}
                </a>
              </div>
              */}

              <div>
                <p className="text-sm font-medium text-white">
                  Applications are currently closed
                </p>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  Thank you for your interest in joining RoboTUM. The current
                  application phase has ended, and new submissions are no longer
                  accepted at this time.
                </p>
              </div>

              <Button
                variant="secondaryStatic"
                disabled
                className="w-full justify-center"
              >
                Applications closed
              </Button>

              <div className="pt-1 border-t border-white/10">
                <p className="text-[11px] text-white/45 leading-relaxed">
                  Please check back during the next application phase or follow
                  RoboTUM announcements for reopening updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationFormSection;
