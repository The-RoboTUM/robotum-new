// src/components/admin/AdminAuthCard.jsx
// Centered logo card shared by the admin auth pages
// (login, sign-up, forgot password, reset password).
import { Link } from "react-router-dom";
import * as assets from "@assets";

export default function AdminAuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen w-full bg-canvas hero-orbit-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-card-lg p-6 sm:p-8 space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-6 py-3">
            <img src={assets.navLogo} alt="roboTUM logo" className="h-10 w-auto" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
          </div>
        </div>

        {children}

        {footer && <div className="space-y-2 text-center text-xs text-white/50">{footer}</div>}

        <p className="text-center text-xs text-white/50">
          ← Back to{" "}
          <Link
            to="/"
            className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            public site
          </Link>
        </p>
      </div>
    </main>
  );
}

/** Labelled input in the auth-card style. */
export function AuthField({ id, label, hint, ...inputProps }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}
      </label>
      <input id={id} className="field-input" {...inputProps} />
      {hint && <p className="text-xs text-white/50">{hint}</p>}
    </div>
  );
}

/** Inline text link used under the auth forms. */
export function AuthLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
    >
      {children}
    </Link>
  );
}
