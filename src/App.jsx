import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToHashElement from "@components/ui/ScrollToHashElement";
import PageLoader from "@components/sections/common-sections/PageLoader";
import ErrorBoundary from "@components/ErrorBoundary";

// 🔐 Admin route guard
import AdminRoute from "@components/admin/AdminRoute";
import { applicationForm } from "@config/applicationForm";

// Lazy-load route components for better performance (code-splitting)
const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const Join = lazy(() => import("@pages/Join-us"));
const JoinApply = lazy(() => import("@pages/JoinApply"));

// On-site application form: local dev only until it goes live
// (see src/config/applicationForm.js).
const showApplicationForm = import.meta.env.DEV || applicationForm.liveOnSite;
const Events = lazy(() => import("@pages/Events"));
const EventDetail = lazy(() => import("@pages/EventDetail"));
const Partners = lazy(() => import("@pages/Partners"));
const Impressum = lazy(() => import("@pages/Impressum"));
const PrivacyPolicy = lazy(() => import("@pages/PrivacyPolicy"));
const GenderAndDiversity = lazy(() => import("@pages/GenderAndDiversity"));
const Projects = lazy(() => import("@pages/Projects"));
const ProjectDetail = lazy(() => import("@pages/ProjectDetail"));
const Robocast = lazy(() => import("@pages/Robocast"));
const Faqs = lazy(() => import("@pages/Faqs"));
const NotFound = lazy(() => import("@pages/NotFound"));

// 🔐 Admin pages
const AdminLogin = lazy(() => import("@pages/admin/AdminLogin"));
const AdminSignup = lazy(() => import("@pages/admin/AdminSignup"));
const AdminForgotPassword = lazy(() => import("@pages/admin/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("@pages/admin/AdminResetPassword"));
const AdminDashboard = lazy(() => import("@pages/admin/AdminDashboard"));
const AdminFaqs = lazy(() => import("@pages/admin/AdminFaqs"));
const AdminPartners = lazy(() => import("@pages/admin/AdminPartners"));
const AdminProjects = lazy(() => import("@pages/admin/AdminProjects"));
const AdminEvents = lazy(() => import("@pages/admin/AdminEvents"));
const AdminInventory = lazy(() => import("@pages/admin/AdminInventory"));
const AdminMembers = lazy(() => import("@pages/admin/AdminMembers"));
const AdminApplications = lazy(() => import("@pages/admin/AdminApplications"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ScrollToHashElement />
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          {showApplicationForm && (
            <Route path={applicationForm.path} element={<JoinApply />} />
          )}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/gender-and-diversity" element={<GenderAndDiversity />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/robocast" element={<Robocast />} />
          <Route path="/faqs" element={<Faqs />} />

          {/* 🔐 Admin auth (public login page) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* 🔐 Admin area (protected by AdminRoute) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/faqs" element={<AdminFaqs />} />
            <Route path="/admin/partners" element={<AdminPartners />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            {/* later: /admin/applications */}
          </Route>

          {/* 404 - must stay last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
