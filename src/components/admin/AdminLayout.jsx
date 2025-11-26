import { Link, useLocation } from "react-router-dom";
import Button from "@components/ui/Button";
import { supabase } from "@lib/supabaseClient";
import * as assets from "@assets";

export default function AdminLayout({ children, title, description }) {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const navItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/faqs", label: "FAQs" },
    { to: "/admin/partners", label: "Partners" },
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/events", label: "Events" },
    // later:
    // { to: "/admin/members", label: "Members" },
    // { to: "/admin/applications", label: "Applications" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <img src={assets.navLogo} alt="RoboTUM" className="h-9 w-auto" />
          <div>
            <p className="text-sm font-semibold">RoboTUM Admin</p>
            <p className="text-[11px] text-white/60">Internal dashboard</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,.35)]"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-white/10">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Top bar (mobile / general) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2">
            <img src={assets.navLogo} alt="RoboTUM" className="h-7 w-auto" />
            <span className="text-sm font-semibold">RoboTUM Admin</span>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </header>

        <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">
          {title && (
            <div className="mb-6">
              <h1 className="heading heading-h2">{title}</h1>
              {description && (
                <p className="text-sm text-white/70 mt-2">{description}</p>
              )}
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}