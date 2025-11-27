import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "@lib/supabaseClient";
import Button from "@components/ui/Button";
import PageLoader from "@components/sections/common-sections/PageLoader";
import * as assets from "@assets";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [initialChecking, setInitialChecking] = useState(true);

  // If already logged in as admin, redirect straight to /admin
  useEffect(() => {
    let cancelled = false;

    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled || !session) {
        setInitialChecking(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!cancelled && !error && profile?.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        setInitialChecking(false);
      }
    };

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const fromPath = (location.state && location.state.from) || "/admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      // 1) Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setErrorMsg(error.message || "Failed to sign in. Please try again.");
        return;
      }

      const user = data.user;
      if (!user) {
        setErrorMsg("No user returned from sign-in.");
        return;
      }

      // 2) Check profile + is_admin flag
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error loading profile:", profileError);
        setErrorMsg("Could not load your profile. Please contact an admin.");
        return;
      }

      if (!profile?.is_admin) {
        // Not an admin → sign out for safety
        await supabase.auth.signOut();
        setErrorMsg("You don’t have admin permissions for this site.");
        return;
      }

      // 3) Success → go to /admin or previous target
      navigate(fromPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (initialChecking) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-screen w-full bg-[#020617] hero-orbit-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-8 space-y-8">
        {/* Logo / header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-6 py-3">
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="h-10 w-auto"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">RoboTUM Admin</h1>
            <p className="text-sm text-white/70 mt-1">
              Sign in with your admin credentials.
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition"
              placeholder="you@robotum.info"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent transition"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-center text-white/40">
          This area is restricted to authorized RoboTUM admins.
        </p>

        {/* Optional: link back to public site */}
        <p className="text-center text-xs text-white/50">
          ← Back to{" "}
          <Link to="/" className="text-accent hover:underline">
            public site
          </Link>
        </p>
      </div>
    </main>
  );
}
