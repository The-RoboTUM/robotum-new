import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToHashElement from "@components/ui/ScrollToHashElement";

// Lazy-load route components for better performance (code-splitting)
const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const Join = lazy(() => import("@pages/Join-us"));
const Events = lazy(() => import("@pages/Events"));
const Partners = lazy(() => import("@pages/Partners"));
const Impressum = lazy(() => import("@pages/Impressum"));
const PrivacyPolicy = lazy(() => import("@pages/PrivacyPolicy"));
const GenderAndDiversity = lazy(() => import("@pages/GenderAndDiversity"));
const Projects = lazy(() => import("@pages/Projects"));
const ProjectDetail = lazy(() => import("@pages/ProjectDetail"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[40vh] flex items-center justify-center text-white/70">
          Loading…
        </div>
      }
    >
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/join" element={<Join />} />
        <Route path="/events" element={<Events />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/gender-and-diversity" element={<GenderAndDiversity />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
    </Suspense>
  );
}
