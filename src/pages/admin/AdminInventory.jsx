
import { useCallback, useEffect, useState } from "react";
import {
  adminFetchInventoryPage,
  adminUpsertInventoryItem,
  adminDeleteInventoryItem,
  adminFetchInventoryLoans,
  adminCreateInventoryLoan,
  adminReturnInventoryLoan,
} from "@data";

const emptyItem = {
  inventory_number: "",
  name: "",
  category: "",
  location: "",
  condition: "good",
  description: "",
  lifecycle_status: "active",
};

const emptyLoan = {
  borrower_name: "",
  borrower_email: "",
  due_at: "",
};

function formatDate(value) {
  if (!value) return "–";

  return new Date(value).toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusLabel(status) {
  const labels = {
    active: "Im Bestand",
    maintenance: "In Wartung",
    lost: "Verloren",
    retired: "Ausgemustert",
  };

  return labels[status] || status;
}

function conditionLabel(condition) {
  const labels = {
    new: "Neu",
    good: "Gut",
    fair: "Gebraucht",
    poor: "Beschädigt",
  };

  return labels[condition] || condition;
}

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [itemForm, setItemForm] = useState(emptyItem);
  const [loanForm, setLoanForm] = useState(emptyLoan);

  const [editingItemId, setEditingItemId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedItem = items.find(
    (item) => item.id === selectedItemId,
  );

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminFetchInventoryPage({
        page: 1,
        pageSize: 100,
        search,
        category: categoryFilter,
        lifecycleStatus: statusFilter,
      });

      setItems(result.items);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Der Inventarbestand konnte nicht geladen werden.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  const loadLoans = useCallback(async () => {
    if (!selectedItemId) {
      setLoans([]);
      return;
    }

    try {
      const result = await adminFetchInventoryLoans({
        itemId: selectedItemId,
      });

      setLoans(result);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Die Ausleihhistorie konnte nicht geladen werden.",
      );
    }
  }, [selectedItemId]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  function updateItemField(event) {
    const { name, value } = event.target;

    setItemForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateLoanField(event) {
    const { name, value } = event.target;

    setLoanForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startNewItem() {
    setEditingItemId(null);
    setItemForm(emptyItem);
    setError("");
    setSuccess("");
  }

  function startEdit(item) {
    setEditingItemId(item.id);
    setItemForm({
      inventory_number: item.inventory_number || "",
      name: item.name || "",
      category: item.category || "",
      location: item.location || "",
      condition: item.condition || "good",
      description: item.description || "",
      lifecycle_status: item.lifecycle_status || "active",
    });

    setSelectedItemId(item.id);
    setError("");
    setSuccess("");
  }

  async function handleSaveItem(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await adminUpsertInventoryItem({
        ...itemForm,
        id: editingItemId,
      });

      await loadInventory();

      setEditingItemId(null);
      setItemForm(emptyItem);
      setSuccess(
        editingItemId
          ? "Gegenstand wurde aktualisiert."
          : "Gegenstand wurde angelegt.",
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Der Gegenstand konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(item) {
    const confirmed = window.confirm(
      `Möchtest du "${item.name}" wirklich löschen?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await adminDeleteInventoryItem(item.id);

      if (selectedItemId === item.id) {
        setSelectedItemId(null);
      }

      if (editingItemId === item.id) {
        startNewItem();
      }

      await loadInventory();
      setSuccess("Gegenstand wurde gelöscht.");
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Der Gegenstand konnte nicht gelöscht werden. Möglicherweise existieren noch Ausleihen.",
      );
    }
  }

  async function handleCreateLoan(event) {
    event.preventDefault();

    if (!selectedItem) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await adminCreateInventoryLoan({
        item_id: selectedItem.id,
        borrower_name: loanForm.borrower_name,
        borrower_email: loanForm.borrower_email,
        due_at: new Date(loanForm.due_at).toISOString(),
      });

      setLoanForm(emptyLoan);

      await loadInventory();
      await loadLoans();

      setSuccess("Ausleihe wurde erfolgreich eingetragen.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Die Ausleihe konnte nicht angelegt werden.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReturnLoan(loanId) {
    const confirmed = window.confirm(
      "Möchtest du die Rückgabe dieses Gegenstands bestätigen?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await adminReturnInventoryLoan(loanId);

      await loadInventory();
      await loadLoans();

      setSuccess("Rückgabe wurde erfolgreich verbucht.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Die Rückgabe konnte nicht verbucht werden.");
    }
  }

  async function handleRetireItem() {
    if (!selectedItem) return;

    if (selectedItem.isBorrowed) {
      setError(
        "Ein ausgeliehener Gegenstand kann nicht ausgemustert werden.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du "${selectedItem.name}" wirklich ausmustern?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await adminUpsertInventoryItem({
        ...selectedItem,
        lifecycle_status: "retired",
      });

      await loadInventory();

      setSuccess("Gegenstand wurde ausgemustert.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Der Gegenstand konnte nicht ausgemustert werden.");
    }
  }

  const activeLoans = loans.filter((loan) => !loan.returned_at);
  const selectedItemIsAvailable =
    selectedItem &&
    selectedItem.lifecycle_status === "active" &&
    !selectedItem.isBorrowed;

  const categories = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ].sort();

  return (
    <div className="min-h-screen px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-white/50">Admin / Verwaltung</p>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="mt-2 text-sm text-white/60">
              Inventargegenstände, Ausleihen und Rückgaben verwalten.
            </p>
          </div>

          <button
            type="button"
            onClick={startNewItem}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/80"
          >
            + Neuer Gegenstand
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-400/30 bg-green-500/10 p-4 text-green-200">
            {success}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Gegenstände</p>
            <p className="mt-2 text-3xl font-bold">{items.length}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Aktuell ausgeliehen</p>
            <p className="mt-2 text-3xl font-bold">
              {items.filter((item) => item.isBorrowed).length}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Verfügbar</p>
            <p className="mt-2 text-3xl font-bold">
              {
                items.filter(
                  (item) =>
                    item.lifecycle_status === "active" &&
                    !item.isBorrowed,
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name oder Inventarnummer suchen..."
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#171717] px-4 py-3 text-white"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#171717] px-4 py-3 text-white"
          >
            <option value="">Alle Status</option>
            <option value="active">Im Bestand</option>
            <option value="maintenance">In Wartung</option>
            <option value="lost">Verloren</option>
            <option value="retired">Ausgemustert</option>
          </select>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <section className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Inventarbestand</h2>
              <button
                type="button"
                onClick={loadInventory}
                className="text-sm text-white/60 hover:text-white"
              >
                Aktualisieren
              </button>
            </div>

            {loading ? (
              <p className="py-8 text-center text-white/50">
                Inventar wird geladen...
              </p>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-white/50">
                Keine Gegenstände gefunden.
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-4 transition ${
                      selectedItemId === item.id
                        ? "border-white/50 bg-white/10"
                        : "border-white/10 bg-black/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItemId(item.id)}
                      className="w-full text-left"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="mt-1 text-xs text-white/50">
                            {item.inventory_number} · {item.category}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            item.isBorrowed
                              ? "bg-amber-500/20 text-amber-200"
                              : item.lifecycle_status === "active"
                                ? "bg-green-500/20 text-green-200"
                                : "bg-white/10 text-white/60"
                          }`}
                        >
                          {item.isBorrowed
                            ? "Ausgeliehen"
                            : statusLabel(item.lifecycle_status)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/50">
                        Standort: {item.location || "Nicht angegeben"} ·
                        Zustand: {conditionLabel(item.condition)}
                      </p>
                    </button>

                    <div className="mt-3 flex gap-4 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        Bearbeiten
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item)}
                        className="text-sm text-red-300 hover:text-red-200"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-5 text-xl font-semibold">
                {editingItemId
                  ? "Gegenstand bearbeiten"
                  : "Neuen Gegenstand anlegen"}
              </h2>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-white/70">
                    Inventarnummer *
                    <input
                      required
                      name="inventory_number"
                      value={itemForm.inventory_number}
                      onChange={updateItemField}
                      placeholder="z. B. RT-001"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Name *
                    <input
                      required
                      name="name"
                      value={itemForm.name}
                      onChange={updateItemField}
                      placeholder="z. B. Arduino Uno"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Kategorie *
                    <input
                      required
                      name="category"
                      value={itemForm.category}
                      onChange={updateItemField}
                      placeholder="z. B. Elektronik"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Standort
                    <input
                      name="location"
                      value={itemForm.location}
                      onChange={updateItemField}
                      placeholder="z. B. Lager A"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Zustand
                    <select
                      name="condition"
                      value={itemForm.condition}
                      onChange={updateItemField}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#171717] px-3 py-2.5 text-white"
                    >
                      <option value="new">Neu</option>
                      <option value="good">Gut</option>
                      <option value="fair">Gebraucht</option>
                      <option value="poor">Beschädigt</option>
                    </select>
                  </label>

                  <label className="block text-sm text-white/70">
                    Lebenszyklus-Status
                    <select
                      name="lifecycle_status"
                      value={itemForm.lifecycle_status}
                      onChange={updateItemField}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#171717] px-3 py-2.5 text-white"
                    >
                      <option value="active">Im Bestand</option>
                      <option value="maintenance">In Wartung</option>
                      <option value="lost">Verloren</option>
                      <option value="retired">Ausgemustert</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm text-white/70">
                  Beschreibung
                  <textarea
                    name="description"
                    value={itemForm.description}
                    onChange={updateItemField}
                    rows={3}
                    placeholder="Weitere Informationen..."
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-white px-5 py-2.5 font-semibold text-black hover:bg-white/80 disabled:opacity-50"
                  >
                    {saving
                      ? "Wird gespeichert..."
                      : editingItemId
                        ? "Änderungen speichern"
                        : "Gegenstand anlegen"}
                  </button>

                  <button
                    type="button"
                    onClick={startNewItem}
                    className="rounded-lg border border-white/20 px-5 py-2.5 text-white/70 hover:bg-white/10"
                  >
                    Zurücksetzen
                  </button>
                </div>
              </form>
            </section>

            {selectedItem && (
              <>
                <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h2 className="mb-2 text-xl font-semibold">
                    Ausleihe verwalten
                  </h2>

                  <p className="mb-5 text-sm text-white/60">
                    Ausgewählt: {selectedItem.name} (
                    {selectedItem.inventory_number})
                  </p>

                  {selectedItemIsAvailable ? (
                    <form onSubmit={handleCreateLoan} className="space-y-4">
                      <label className="block text-sm text-white/70">
                        Name des Ausleihers *
                        <input
                          required
                          name="borrower_name"
                          value={loanForm.borrower_name}
                          onChange={updateLoanField}
                          placeholder="Vor- und Nachname"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                        />
                      </label>

                      <label className="block text-sm text-white/70">
                        E-Mail-Adresse *
                        <input
                          required
                          type="email"
                          name="borrower_email"
                          value={loanForm.borrower_email}
                          onChange={updateLoanField}
                          placeholder="name@example.com"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                        />
                      </label>

                      <label className="block text-sm text-white/70">
                        Geplantes Rückgabedatum *
                        <input
                          required
                          type="datetime-local"
                          name="due_at"
                          value={loanForm.due_at}
                          onChange={updateLoanField}
                          min={new Date().toISOString().slice(0, 16)}
                          className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-white px-5 py-2.5 font-semibold text-black hover:bg-white/80 disabled:opacity-50"
                      >
                        {saving ? "Wird gespeichert..." : "Ausleihe eintragen"}
                      </button>
                    </form>
                  ) : (
                    <p className="rounded-lg bg-amber-500/10 p-4 text-sm text-amber-200">
                      Dieser Gegenstand ist derzeit nicht für eine neue
                      Ausleihe verfügbar.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleRetireItem}
                    disabled={
                      selectedItem.isBorrowed ||
                      selectedItem.lifecycle_status === "retired"
                    }
                    className="mt-5 text-sm text-red-300 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Gegenstand ausmustern
                  </button>
                </section>

                <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h2 className="mb-4 text-xl font-semibold">
                    Ausleihhistorie
                  </h2>

                  {loans.length === 0 ? (
                    <p className="text-sm text-white/50">
                      Für diesen Gegenstand gibt es noch keine Ausleihen.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {loans.map((loan) => (
                        <div
                          key={loan.id}
                          className="rounded-lg border border-white/10 bg-black/10 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">
                                {loan.borrower_name}
                              </p>
                              <p className="mt-1 break-all text-sm text-white/50">
                                {loan.borrower_email}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                loan.returned_at
                                  ? "bg-green-500/20 text-green-200"
                                  : "bg-amber-500/20 text-amber-200"
                              }`}
                            >
                              {loan.returned_at
                                ? "Zurückgegeben"
                                : "Aktiv ausgeliehen"}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-xs text-white/50">
                            <p>Ausgeliehen: {formatDate(loan.borrowed_at)}</p>
                            <p>Rückgabe geplant: {formatDate(loan.due_at)}</p>
                            {loan.returned_at && (
                              <p>
                                Zurückgegeben am:{" "}
                                {formatDate(loan.returned_at)}
                              </p>
                            )}
                          </div>

                          {!loan.returned_at && (
                            <button
                              type="button"
                              onClick={() => handleReturnLoan(loan.id)}
                              className="mt-4 rounded-lg border border-green-400/30 px-4 py-2 text-sm text-green-200 hover:bg-green-500/10"
                            >
                              Rückgabe verbuchen
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-xs text-white/40">
                    Aktive Ausleihen: {activeLoans.length}
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
