// src/components/admin/AdminTabs.jsx
// Accessible tab strip for admin pages (WAI-ARIA tabs: arrow keys / Home / End
// move between tabs). Pair each panel with <AdminTabPanel> using the same idPrefix.
import { useRef } from "react";
import clsx from "clsx";

export default function AdminTabs({ tabs, activeId, onChange, label, idPrefix }) {
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    const last = tabs.length - 1;
    const nextIndex = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (nextIndex === undefined) return;
    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    onChange(tabs[nextIndex].id);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab, index) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "bg-accent/90 border-blue-300/30 text-white shadow-[0_0_20px_rgba(59,130,246,.35)]"
                : "border-transparent text-white/70 hover:text-white hover:bg-white/10 hover:border-white/10",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={clsx(
                  "rounded-full px-1.5 text-[11px] tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-white/10 text-white/60",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function AdminTabPanel({ id, idPrefix, children }) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      tabIndex={0}
      className="focus-visible:outline-none"
    >
      {children}
    </div>
  );
}
