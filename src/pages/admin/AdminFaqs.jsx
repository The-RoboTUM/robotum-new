import { useEffect, useState } from "react";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";

import { adminFetchFaqs, adminUpsertFaq, adminDeleteFaq } from "@data/faqsApi";

const FAQ_CATEGORIES = [
  { value: "About RoboTUM", label: "About RoboTUM" },
  { value: "Membership & Recruitment", label: "Membership & Recruitment" },
  {
    value: "Collaboration & Partnerships",
    label: "Collaboration & Partnerships",
  },
  { value: "Contact", label: "Contact" },
];

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [editingFaq, setEditingFaq] = useState(null); // null = new
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: FAQ_CATEGORIES[0].value, // 👈 default to first enum value
  });

  const loadFaqs = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await adminFetchFaqs();
      setFaqs(data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      setErrorMsg("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const startNew = () => {
    setEditingFaq(null);
    setForm({
      question: "",
      answer: "",
      category: FAQ_CATEGORIES[0].value, // 👈 same default
    });
  };

  const startEdit = (faq) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      await adminUpsertFaq({
        id: editingFaq?.id,
        ...form,
      });
      await loadFaqs();
      startNew();
    } catch (err) {
      console.error("Error saving FAQ:", err);
      setErrorMsg(err.message || "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await adminDeleteFaq(faq.id);
      await loadFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      setErrorMsg("Failed to delete FAQ.");
    }
  };

  return (
    <AdminLayout
      title="FAQs"
      description="Manage questions and answers shown on the public FAQ page."
    >
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)] items-start">
        {/* List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">
              Existing FAQs
            </h2>
            <Button size="sm" variant="secondary" onClick={startNew}>
              + New FAQ
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : faqs.length === 0 ? (
            <p className="text-sm text-white/60">
              No FAQs yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {faqs.map((faq) => (
                <li
                  key={faq.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {faq.question}
                    </p>
                    {faq.category && (
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                        {faq.category}
                      </span>
                    )}
                    <p className="text-xs text-white/60 line-clamp-2">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => startEdit(faq)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(faq)}
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
            {editingFaq ? "Edit FAQ" : "New FAQ"}
          </h2>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-question">
                Question
              </label>
              <input
                id="faq-question"
                name="question"
                type="text"
                required
                value={form.question}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="What is RoboTUM?"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-answer">
                Answer
              </label>
              <textarea
                id="faq-answer"
                name="answer"
                required
                rows={4}
                value={form.answer}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent resize-y"
                placeholder="RoboTUM is the official robotics student team at TUM…"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-category">
                Category
              </label>
              <select
                id="faq-category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {editingFaq && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={startNew}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save FAQ"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
