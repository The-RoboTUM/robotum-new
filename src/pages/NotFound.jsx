import { useEffect } from "react";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import Button from "@components/ui/Button";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <main className="section-container hero-offset section-dark-primary surface-pattern flex min-h-screen flex-col items-center justify-center text-center text-white">
        <div className="card-surface max-w-lg px-8 py-12">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Error 404
          </p>
          <h1 className="heading heading-h1 mt-3 leading-tight">
            Page <span className="text-gradient">not found</span>
          </h1>
          <p className="text-text2 mt-4 text-white/70">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/" variant="primary">
              Back to Home
            </Button>
            <Button to="/projects" variant="secondary">
              Explore Projects
            </Button>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
