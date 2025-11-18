import * as assets from "@assets";
import ImageFrame from "@components/ui/ImageFrame";
import { useEffect, useRef, useState } from "react";

/** Smooth counter that starts when `inView` is true */
const Counter = ({ target, duration = 2000, inView = true }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const end = Number(target) || 0;
    const d = Math.max(600, duration);

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(1, elapsed / d);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [inView, target, duration]);

  return <span>{value}</span>;
};

export default function AboutHero() {
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  // Start counters when the stats block enters viewport
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="section-container text-white min-h-[70vh] lg:min-h-screen font-sans section-dark-primary surface-pattern"
      aria-labelledby="about-hero-heading"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 mb-12 md:mb-16">
        {/* Copy */}
        <div className="md:w-1/2">
          <h1
            id="about-hero-heading"
            className="heading heading-h1 leading-tight text-balance"
          >
            Built by <span className="text-gradient">Students</span> <br />{" "}
            Powered by <span className="text-gradient">Passion</span>
          </h1>
          <p className="mt-4 text-text2 md:text-text1 text-white/80 leading-relaxed">
            Where students become innovators, and ideas become robots
          </p>
        </div>

        {/* Visual */}
        <div className="md:w-1/2">
          <ImageFrame
            src={assets.auditoryImg}
            alt="RoboTUM students collaborating during a robotics session"
            aspect="3/2"
            fit="cover"
            variant="soft"
            rounded="xl"
            loading="eager"
            className="w-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div
        ref={statsRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 text-center"
        role="list"
        aria-label="RoboTUM key figures"
      >
        <div
          className="rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm"
          role="listitem"
        >
          <p className="text-[2.5rem] md:text-[3.25rem] font-semibold text-gradient leading-none">
            +<Counter target={100} inView={statsInView} />
          </p>
          <p className="mt-2 text-text2 text-white/75">active members</p>
        </div>

        <div
          className="rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm"
          role="listitem"
        >
          <p className="text-[2.5rem] md:text-[3.25rem] font-semibold text-gradient leading-none">
            +<Counter target={20} inView={statsInView} />
          </p>
          <p className="mt-2 text-text2 text-white/75">
            partners &amp; sponsors
          </p>
        </div>

        <div
          className="rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm"
          role="listitem"
        >
          <p className="text-[2.5rem] md:text-[3.25rem] font-semibold text-gradient leading-none">
            +<Counter target={10} inView={statsInView} />
          </p>
          <p className="mt-2 text-text2 text-white/75">
            projects in development
          </p>
        </div>
      </div>
    </section>
  );
}
