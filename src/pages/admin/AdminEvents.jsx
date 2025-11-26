import { useEffect, useState } from "react";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";
import {
  adminFetchEvents,
  adminUpsertEvent,
  adminDeleteEvent,
} from "@data";
import { formatEventDateRange } from "@utils/date-range";

// Adjust these to match your Supabase enums
const EVENT_CATEGORY_OPTIONS = [
  { value: "Hackathon", label: "Hackathon" },
  { value: "Workshop", label: "Workshop" },
  { value: "Meetup", label: "Meetup" },
  { value: "Conference", label: "Conference" },
  { value: "Info Event", label: "Info Event" },
];

const EVENT_FORMAT_OPTIONS = [
  { value: "Offline", label: "Offline" },
  { value: "Online", label: "Online" },
];

// helper to convert ISO (or timestamptz string) -> datetime-local value
function toLocalInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DDTHH:mm (browser local)
  return d.toISOString().slice(0, 16);
}

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [editing, setEditing] = useState(null); // null = new

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: EVENT_CATEGORY_OPTIONS[0].value,
    format: EVENT_FORMAT_OPTIONS[0].value,
    start_at: "",
    end_at: "",
    location_name: "",
    location_url: "",
    is_featured: false,
    registration_url: "",
    summary: "",
    description: "",
    cover_url: "",
  });

  // Load events
  const loadEvents = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await adminFetchEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error loading events (admin):", err);
      setErrorMsg("Failed to load events. Please try again or contact an admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      category: EVENT_CATEGORY_OPTIONS[0].value,
      format: EVENT_FORMAT_OPTIONS[0].value,
      start_at: "",
      end_at: "",
      location_name: "",
      location_url: "",
      is_featured: false,
      registration_url: "",
      summary: "",
      description: "",
      cover_url: "",
    });
  };

  const handleEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || "",
      slug: ev.slug || "",
      category: ev.category || EVENT_CATEGORY_OPTIONS[0].value,
      format: ev.format || EVENT_FORMAT_OPTIONS[0].value,
      start_at: toLocalInputValue(ev.start_at),
      end_at: toLocalInputValue(ev.end_at),
      location_name: ev.location_name || "",
      location_url: ev.location_url || "",
      is_featured: !!ev.is_featured,
      registration_url: ev.registration_url || "",
      summary: ev.summary || "",
      description: ev.description || "",
      cover_url: ev.cover_url || "",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      await adminUpsertEvent({
        ...(editing ? { id: editing.id } : {}),
        ...form,
      });

      await loadEvents();
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err);
      setErrorMsg(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm(`Delete event "${ev.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminDeleteEvent(ev.id);
      await loadEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setErrorMsg("Failed to delete event.");
    }
  };

  return (
    <AdminLayout
      title="Events"
      description="Create, edit, and organize RoboTUM events."
    >
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[2fr_minmax(0,1.4fr)] items-start">
        {/* LEFT: list of events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">
              Existing events
            </h2>
            <Button size="sm" variant="secondary" onClick={resetForm}>
              + New event
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-white/60">
              No events yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => {
                const isPast = new Date(ev.end_at) < new Date();
                return (
                  <li
                    key={ev.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {ev.title}
                        </p>
                        {ev.is_featured && (
                          <span className="inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-500/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            Featured
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center rounded-full bg-white/10 text-white/70 border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            Past
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60">
                        {formatEventDateRange(ev.start_at, ev.end_at)} ·{" "}
                        {ev.location_name}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {ev.category && (
                          <span className="inline-flex items-center rounded-full bg-white/10 text-white/70 border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            {ev.category}
                          </span>
                        )}
                        {ev.format && (
                          <span className="inline-flex items-center rounded-full bg-white/5 text-white/60 border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            {ev.format}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {ev.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleEdit(ev)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="danger"
                        onClick={() => handleDelete(ev)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* RIGHT: form */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-5">
          <h2 className="text-sm font-semibold text-white/80 mb-3">
            {editing ? "Edit event" : "New event"}
          </h2>

          <form className="space-y-4" onSubmit={handleSave}>
            {/* Title + slug */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-title">
                Title
              </label>
              <input
                id="ev-title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="Robotics Kickoff 2025"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-slug">
                Slug (URL)
              </label>
              <input
                id="ev-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="robotics-kickoff-2025"
              />
              <p className="text-[11px] text-white/40">
                If empty, it will be generated from the title.
              </p>
            </div>

            {/* Category + format */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-category">
                  Category
                </label>
                <select
                  id="ev-category"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                >
                  {EVENT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-format">
                  Format
                </label>
                <select
                  id="ev-format"
                  name="format"
                  required
                  value={form.format}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                >
                  {EVENT_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-start">
                  Start (local time)
                </label>
                <input
                  id="ev-start"
                  name="start_at"
                  type="datetime-local"
                  required
                  value={form.start_at}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-end">
                  End (local time)
                </label>
                <input
                  id="ev-end"
                  name="end_at"
                  type="datetime-local"
                  required
                  value={form.end_at}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-location-name">
                Location name
              </label>
              <input
                id="ev-location-name"
                name="location_name"
                type="text"
                required
                value={form.location_name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="Walter-Gropius-Straße 17, Munich"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-location-url">
                Location URL (e.g. Google Maps)
              </label>
              <input
                id="ev-location-url"
                name="location_url"
                type="url"
                value={form.location_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://maps.google.com/…"
              />
            </div>

            {/* Registration & cover */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-registration">
                Registration URL
              </label>
              <input
                id="ev-registration"
                name="registration_url"
                type="url"
                required
                value={form.registration_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://…"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-cover">
                Cover image URL
              </label>
              <input
                id="ev-cover"
                name="cover_url"
                type="url"
                value={form.cover_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://…"
              />
            </div>

            {/* Summary & description */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-summary">
                Summary (short)
              </label>
              <textarea
                id="ev-summary"
                name="summary"
                rows={2}
                value={form.summary}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent resize-y"
                placeholder="One or two sentences shown on cards."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-description">
                Description (full)
              </label>
              <textarea
                id="ev-description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent resize-y"
                placeholder="Longer description for the event detail page."
              />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="ev-featured"
                name="is_featured"
                type="checkbox"
                checked={form.is_featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/30 bg-black/40 text-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              <label
                htmlFor="ev-featured"
                className="text-xs text-white/80 select-none"
              >
                Mark as featured (show in homepage events section)
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              {editing && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save event"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}