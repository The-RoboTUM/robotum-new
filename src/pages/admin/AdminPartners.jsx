// src/pages/admin/AdminPartners.jsx
import { useEffect, useState } from "react";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";
import {
  adminFetchPartners,
  adminUpsertPartner,
  adminDeletePartner,
} from "@data/partnersApi";

// ⚠️ MUST match your partner_category enum values in Supabase
const PARTNER_CATEGORIES = [
  { value: "Lead Sponsor", label: "Lead Sponsor" },
  { value: "Sponsor", label: "Sponsor" },
  { value: "Industry Collaborator", label: "Industry Collaborator" },
  { value: "Academic Collaborator", label: "Academic Collaborator" },
];

const emptyForm = () => ({
  name: "",
  category: PARTNER_CATEGORIES[0].value,
  logo_url: "",
  website_url: "",
  is_active: true,
  priority: "",
  slug: "",
});

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [editingPartner, setEditingPartner] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadPartners = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await adminFetchPartners();
      setPartners(data);
    } catch (error) {
      console.error("Error loading partners:", error);
      setErrorMsg("Failed to load partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const startNew = () => {
    setEditingPartner(null);
    setForm(emptyForm());
  };

  const startEdit = (partner) => {
    setEditingPartner(partner);
    setForm({
      name: partner.name || "",
      category: partner.category || PARTNER_CATEGORIES[0].value,
      logo_url: partner.logo_url || "",
      website_url: partner.website_url || "",
      is_active: partner.is_active ?? true,
      priority: partner.priority ?? "",
      slug: partner.slug || "",
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
      await adminUpsertPartner({
        id: editingPartner?.id,
        ...form,
      });
      await loadPartners();
      startNew();
    } catch (err) {
      console.error("Error saving partner:", err);
      setErrorMsg(err.message || "Failed to save partner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner) => {
    if (!window.confirm(`Delete partner "${partner.name}"?`)) return;

    try {
      await adminDeletePartner(partner.id);
      await loadPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
      setErrorMsg("Failed to delete partner.");
    }
  };

  return (
    <AdminLayout
      title="Partners"
      description="Manage RoboTUM partners shown on the public site."
    >
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[2fr_minmax(0,1.6fr)] items-start">
        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">
              Existing partners
            </h2>
            <Button size="sm" variant="secondary" onClick={startNew}>
              + New partner
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : partners.length === 0 ? (
            <p className="text-sm text-white/60">
              No partners yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex gap-3">
                    {partner.logo_url && (
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {partner.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${
                            partner.is_active
                              ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
                              : "border-zinc-400/40 text-zinc-200 bg-zinc-500/10"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {partner.is_active ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60">
                        Category: {partner.category} • Priority:{" "}
                        {partner.priority ?? "—"}
                      </p>
                      <p className="text-[11px] text-white/50">
                        Slug:{" "}
                        <code className="text-white/70">{partner.slug}</code>
                      </p>
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-accent hover:underline"
                        >
                          {partner.website_url}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => startEdit(partner)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(partner)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-5">
          <h2 className="text-sm font-semibold text-white/80 mb-3">
            {editingPartner ? "Edit partner" : "New partner"}
          </h2>
          <form className="space-y-4" onSubmit={handleSave}>
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-name">
                Name
              </label>
              <input
                id="partner-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="Company / organization name"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="partner-category"
              >
                Category
              </label>
              <select
                id="partner-category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                {PARTNER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo URL */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-logo">
                Logo URL
              </label>
              <input
                id="partner-logo"
                name="logo_url"
                type="url"
                value={form.logo_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://…"
              />
            </div>

            {/* Website URL */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="partner-website"
              >
                Website URL
              </label>
              <input
                id="partner-website"
                name="website_url"
                type="url"
                value={form.website_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://…"
              />
            </div>

            {/* Priority + active */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 space-y-1">
                <label
                  className="text-xs text-white/70"
                  htmlFor="partner-priority"
                >
                  Priority (lower = shown first)
                </label>
                <input
                  id="partner-priority"
                  name="priority"
                  type="number"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                  placeholder="100"
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  id="partner-active"
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/40 bg-black/40"
                />
                <label
                  htmlFor="partner-active"
                  className="text-xs text-white/80"
                >
                  Visible on site
                </label>
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-slug">
                Slug (URL identifier)
              </label>
              <input
                id="partner-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="e.g. bosch, tum-ics, robotics-lab"
              />
              <p className="text-[11px] text-white/40">
                Used to uniquely identify this partner; must be unique.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              {editingPartner && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={startNew}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? "Saving…" : "Save partner"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}