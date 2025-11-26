import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@lib/supabaseClient";
import PageLoader from "@components/sections/common-sections/PageLoader";

export default function AdminRoute() {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // 'checking' | 'allowed' | 'denied'
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const checkAdmin = async () => {
      setStatus("checking");
      setErrorMsg("");

      // 1) Check current auth session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (isCancelled) return;

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setErrorMsg("Failed to verify session. Please log in again.");
        setStatus("denied");
        return;
      }

      if (!session) {
        // not logged in
        setStatus("denied");
        return;
      }

      // 2) Load profile and check is_admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (isCancelled) return;

      if (profileError) {
        console.error("Error loading profile:", profileError);
        setErrorMsg("Failed to load profile. Please contact an admin.");
        setStatus("denied");
        return;
      }

      if (!profile || !profile.is_admin) {
        console.warn("Non-admin tried to access admin area.");
        setErrorMsg("You don’t have permission to access the admin area.");
        setStatus("denied");
        return;
      }

      // All good 🎉
      setStatus("allowed");
    };

    checkAdmin();

    return () => {
      isCancelled = true;
    };
  }, [location.pathname]);

  // While checking: show full-page loader
  if (status === "checking") {
    return <PageLoader />;
  }

  // If denied: send to /admin/login, optionally pass a message
  if (status === "denied") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
          error: errorMsg || "Please log in as an admin.",
        }}
      />
    );
  }

  // Allowed → render whatever nested route matches (/admin, /admin/faqs, etc.)
  return <Outlet />;
}