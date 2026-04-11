import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@components/admin/AdminLayout";
import AdminErrorBanner from "@components/admin/AdminErrorBanner";
import {
  adminFetchEvents,
  adminFetchFaqs,
  adminFetchPartners,
  adminFetchProjects,
} from "@data";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    faqs: null,
    partners: null,
    projects: null,
    events: null,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboardCounts = async () => {
      setLoadingCounts(true);
      setErrorMsg("");

      try {
        const [faqs, partners, projects, events] = await Promise.all([
          adminFetchFaqs(),
          adminFetchPartners(),
          adminFetchProjects(),
          adminFetchEvents(),
        ]);

        if (!mounted) return;

        setCounts({
          faqs: faqs.length,
          partners: partners.length,
          projects: projects.length,
          events: events.length,
        });
      } catch (err) {
        console.error("Error loading admin dashboard counts:", err);
        if (!mounted) return;

        setCounts({ faqs: null, partners: null, projects: null, events: null });
        setErrorMsg("Failed to load dashboard stats. Please try again.");
      } finally {
        if (mounted) {
          setLoadingCounts(false);
        }
      }
    };

    loadDashboardCounts();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    { label: "Total FAQs", value: counts.faqs },
    { label: "Total Partners", value: counts.partners },
    { label: "Total Projects", value: counts.projects },
    { label: "Total Events", value: counts.events },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage RoboTUM content and internal data."
    >
      <div className="space-y-8">
        {errorMsg && <AdminErrorBanner message={errorMsg} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <p className="text-xs text-white/60">{item.label}</p>
              <p
                className={`text-2xl font-semibold text-white mt-1 ${
                  loadingCounts ? "animate-pulse" : ""
                }`}
              >
                {loadingCounts ? "..." : item.value ?? "-"}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/admin/faqs"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md block"
          >
            <h3 className="text-lg font-semibold text-white mb-2">FAQs</h3>
            <p className="text-white/70 text-sm">
              Manage FAQ entries shown on the public site.
            </p>
          </Link>

          <Link
            to="/admin/partners"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md block"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Partners</h3>
            <p className="text-white/70 text-sm">
              Manage partner logos and links shown on the site.
            </p>
          </Link>
          <Link
            to="/admin/projects"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md block"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
            <p className="text-white/70 text-sm">
              Manage project entries shown on the site.
            </p>
          </Link>

          <Link
            to="/admin/events"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md block"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Events</h3>
            <p className="text-white/70 text-sm">
              Manage event entries shown on the site.
            </p>
          </Link>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 opacity-40 cursor-not-allowed backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">
              Applications
            </h3>
            <p className="text-white/70 text-sm">Coming soon…</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 opacity-40 cursor-not-allowed backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">Members</h3>
            <p className="text-white/70 text-sm">Coming soon…</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
