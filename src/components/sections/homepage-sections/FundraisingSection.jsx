import Button from "@components/ui/Button";
import { fundraising } from "@config/fundraising";

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export default function FundraisingSection() {
  const { raisedAmount, goalAmount, currency, donateUrl } = fundraising;
  const pct =
    goalAmount > 0
      ? Math.min(100, Math.max(0, Math.round((raisedAmount / goalAmount) * 100)))
      : 0;

  return (
    <section
      id="fundraising"
      className="section-container section-dark-secondary surface-pattern text-white"
      aria-labelledby="fundraising-heading"
    >
      <div className="mx-auto max-w-3xl card-surface p-8 md:p-12">
        <div className="flex flex-col gap-7 text-center">
          <div>
            <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
              Support our mission
            </p>
            <h2
              id="fundraising-heading"
              className="heading heading-h2 leading-tight"
            >
              Help build Munich&rsquo;s{" "}
              <span className="text-gradient">robotics hub</span>
            </h2>
            <p className="mt-4 text-text2 text-white/70 max-w-xl mx-auto">
              Your contribution funds student-led robotics projects, events, and
              the next generation of engineers.
            </p>
          </div>

          {/* Progress */}
          <div className="text-left">
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gradient">
                  {formatCurrency(raisedAmount, currency)}
                </div>
                <div className="text-sm text-white/60">
                  raised of {formatCurrency(goalAmount, currency)} goal
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold leading-none text-white/90">
                {pct}
                <span className="align-top text-lg text-white/60">%</span>
              </div>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Fundraising progress"
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-accent to-[#7C3AED] shadow-[0_0_18px_rgba(124,58,237,0.45)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              as="a"
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              Donate on betterplace →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
