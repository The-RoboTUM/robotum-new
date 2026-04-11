import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@components/ui/Button";
import { supabase } from "@lib/supabaseClient";
import * as assets from "@assets";

export default function AdminLayout({ children, title, description }) {
  const location = useLocation();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSessionEmail = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to load admin session:", error);
        return;
      }

      if (mounted) {
        setAdminEmail(data.session?.user?.email || "");
      }
    };

    loadSessionEmail();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminEmail(session?.user?.email || "");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const truncatedEmail = useMemo(() => {
    if (!adminEmail) return "No email available";
    return adminEmail.length > 26
      ? `${adminEmail.slice(0, 23)}...`
      : adminEmail;
  }, [adminEmail]);

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
    <div className="min-h-screen bg-[#020617] text-white md:flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <img src={assets.navLogo} alt="RoboTUM" className="h-9 w-auto" />
          <div>
            <p className="text-sm font-semibold">RoboTUM Admin</p>
            <p className="text-[11px] text-white/60">Internal dashboard</p>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
              Navigation
            </p>
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block px-3 py-2 rounded-lg border text-sm transition-all ${
                    active
                      ? "bg-accent/90 border-blue-300/30 text-white shadow-[0_0_20px_rgba(59,130,246,.35)]"
                      : "border-transparent text-white/80 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-white/10 bg-black/25">
            <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                Signed in as
              </p>
              <p className="mt-1 text-sm font-medium text-white truncate" title={adminEmail || "No email available"}>
                {truncatedEmail}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        {/* Top bar (mobile / general) */}
        <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-xl">
          <Link to="/admin" className="flex items-center gap-2 shrink-0">
            <img src={assets.navLogo} alt="RoboTUM" className="h-7 w-auto" />
            <span className="text-sm font-semibold">RoboTUM Admin</span>
          </Link>
          <div className="min-w-0 flex items-center gap-2">
            <p
              className="max-w-[140px] truncate text-xs text-white/70"
              title={adminEmail || "No email available"}
            >
              {truncatedEmail}
            </p>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
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
