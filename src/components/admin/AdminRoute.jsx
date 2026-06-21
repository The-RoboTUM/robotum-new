import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { verifyAdminAccess } from "@data";
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

      const { allowed, error } = await verifyAdminAccess();
      if (isCancelled) return;

      if (allowed) {
        setStatus("allowed");
      } else {
        setErrorMsg(error);
        setStatus("denied");
      }
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
