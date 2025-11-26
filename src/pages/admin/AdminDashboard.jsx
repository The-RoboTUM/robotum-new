import { supabase } from "@lib/supabaseClient";
import { Link } from "react-router-dom";
import AdminLayout from "@components/admin/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage RoboTUM content and internal data."
    >
      <div className="space-y-8">

        {/* Stats placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/60">Total FAQs</p>
            <p className="text-2xl font-semibold text-white mt-1">—</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/60">Total Partners</p>
            <p className="text-2xl font-semibold text-white mt-1">—</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/60">Total Projects</p>
            <p className="text-2xl font-semibold text-white mt-1">—</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/60">Pending Applications</p>
            <p className="text-2xl font-semibold text-white mt-1">—</p>
          </div>
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

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 opacity-40 cursor-not-allowed backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
            <p className="text-white/70 text-sm">Coming soon…</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 opacity-40 cursor-not-allowed backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">Events</h3>
            <p className="text-white/70 text-sm">Coming soon…</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 opacity-40 cursor-not-allowed backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white mb-2">Applications</h3>
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