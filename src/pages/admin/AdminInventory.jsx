

import { useCallback, useEffect, useState } from "react";
import {
  adminFetchInventoryPage,
  adminUpsertInventoryItem,
  adminDeleteInventoryItem,
  adminFetchInventoryLoans,
  adminFetchActiveInventoryLoans,
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

  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusLabel(status) {
  const labels = {
    active: "Available",
    maintenance: "Under Maintenance",
    lost: "Lost",
    retired: "Retired",
  };

  return labels[status] || status;
}

function conditionLabel(condition) {
  const labels = {
    new: "New",
    good: "Good",
    fair: "Used",
    poor: "Damaged",
  };

  return labels[condition] || condition;
}

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loans, setLoans] = useState([]);
  const [currentLoans, setCurrentLoans] = useState([]);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [itemForm, setItemForm] = useState(emptyItem);
  const [loanForm, setLoanForm] = useState(emptyLoan);

  const [editingItemId, setEditingItemId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingCurrentLoans, setLoadingCurrentLoans] = useState(false);
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

      setItems(result.items || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load inventory.",
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

      setLoans(result || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load loan history.",
      );
    }
  }, [selectedItemId]);

  const loadActiveLoans = useCallback(async () => {
    setLoadingCurrentLoans(true);

    try {
      const result = await adminFetchActiveInventoryLoans();
      setCurrentLoans(result || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to load current loans.",
      );
    } finally {
      setLoadingCurrentLoans(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  useEffect(() => {
    loadActiveLoans();
  }, [loadActiveLoans]);

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
          ? "Item updated successfully."
          : "Item created successfully.",
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to save item.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`,
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
      await loadActiveLoans();

      setSuccess("Item deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Failed to delete item. There may still be existing loans.",
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
      await loadActiveLoans();

      setSuccess("Loan created successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to create loan.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleReturnLoan(loanId) {
    const confirmed = window.confirm(
      "Are you sure you want to confirm the return of this item?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await adminReturnInventoryLoan(loanId);

      await loadInventory();
      await loadLoans();
      await loadActiveLoans();

      setSuccess("Item returned successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to process item return.",
      );
    }
  }

  async function handleRetireItem() {
    if (!selectedItem) return;

    if (selectedItem.isBorrowed) {
      setError(
        "A borrowed item cannot be retired.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to retire "${selectedItem.name}"?`,
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
      await loadActiveLoans();

      setSuccess("Item retired successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to retire item.",
      );
    }
  }

  const selectedItemActiveLoans = loans.filter(
    (loan) => !loan.returned_at,
  );

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
            <p className="mb-2 text-sm text-white/50">
              Admin / Management
            </p>

            <h1 className="text-3xl font-bold">Inventory</h1>

            <p className="mt-2 text-sm text-white/60">
              Manage inventory items, loans and returns.
            </p>
          </div>

          <button
            type="button"
            onClick={startNewItem}
            className="rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/80"
          >
            + Add New Item
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
            <p className="text-sm text-white/50">Total Items</p>
            <p className="mt-2 text-3xl font-bold">{items.length}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Currently Borrowed
            </p>
            <p className="mt-2 text-3xl font-bold">
              {currentLoans.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Available</p>
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

        {/* Current loans overview */}
        <section className="mb-6 rounded-xl border border-amber-400/20 bg-white/5 p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Currently Borrowed Items
              </h2>

              <p className="mt-1 text-sm text-white/50">
                All items that are currently on loan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-200">
                {currentLoans.length} borrowed
              </span>

              <button
                type="button"
                onClick={loadActiveLoans}
                disabled={loadingCurrentLoans}
                className="text-sm text-white/60 hover:text-white disabled:opacity-50"
              >
                {loadingCurrentLoans ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loadingCurrentLoans ? (
            <p className="py-6 text-center text-white/50">
              Loading current loans...
            </p>
          ) : currentLoans.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-black/10 p-5 text-center text-sm text-white/50">
              No items are currently borrowed.
            </p>
          ) : (
            <div className="space-y-3">
              {currentLoans.map((loan) => (
                <div
                  key={loan.loan_id}
                  className="rounded-lg border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        {loan.item_name}
                      </h3>

                      <p className="mt-1 text-xs text-white/50">
                        {loan.inventory_number} · {loan.category}
                      </p>

                      <p className="mt-3 text-sm text-white/80">
                        <span className="text-white/50">
                          Borrowed by:
                        </span>{" "}
                        {loan.borrower_name}
                      </p>

                      <p className="mt-1 break-all text-sm text-white/50">
                        {loan.borrower_email}
                      </p>

                      <p className="mt-3 text-sm text-white/80">
                        <span className="text-white/50">
                          Due date:
                        </span>{" "}
                        {formatDate(loan.due_at)}
                      </p>

                      {loan.location && (
                        <p className="mt-1 text-xs text-white/40">
                          Location: {loan.location}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReturnLoan(loan.loan_id)}
                      className="rounded-lg border border-green-400/30 px-4 py-2 text-sm text-green-200 hover:bg-green-500/10"
                    >
                      Record Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or inventory number..."
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#171717] px-4 py-3 text-white"
          >
            <option value="">All Categories</option>
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
            <option value="">All Statuses</option>
            <option value="active">Available</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="lost">Lost</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <section className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">
                Inventory Items
              </h2>

              <button
                type="button"
                onClick={loadInventory}
                className="text-sm text-white/60 hover:text-white"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="py-8 text-center text-white/50">
                Loading inventory...
              </p>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-white/50">
                No items found.
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
                            ? "Borrowed"
                            : statusLabel(item.lifecycle_status)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/50">
                        Location: {item.location || "Not specified"} ·
                        Condition: {conditionLabel(item.condition)}
                      </p>
                    </button>

                    <div className="mt-3 flex gap-4 border-t border-white/10 pt-3">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item)}
                        className="text-sm text-red-300 hover:text-red-200"
                      >
                        Delete
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
                  ? "Edit Item"
                  : "Add New Item"}
              </h2>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-white/70">
                    Inventory Number *
                    <input
                      required
                      name="inventory_number"
                      value={itemForm.inventory_number}
                      onChange={updateItemField}
                      placeholder="e.g. RT-001"
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
                      placeholder="e.g. Arduino Uno"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Category *
                    <input
                      required
                      name="category"
                      value={itemForm.category}
                      onChange={updateItemField}
                      placeholder="e.g. Electronics"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Location
                    <input
                      name="location"
                      value={itemForm.location}
                      onChange={updateItemField}
                      placeholder="e.g. Storage Room A"
                      className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                    />
                  </label>

                  <label className="block text-sm text-white/70">
                    Condition
                    <select
                      name="condition"
                      value={itemForm.condition}
                      onChange={updateItemField}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#171717] px-3 py-2.5 text-white"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Used</option>
                      <option value="poor">Damaged</option>
                    </select>
                  </label>

                  <label className="block text-sm text-white/70">
                    Lifecycle Status
                    <select
                      name="lifecycle_status"
                      value={itemForm.lifecycle_status}
                      onChange={updateItemField}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#171717] px-3 py-2.5 text-white"
                    >
                      <option value="active">Available</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="lost">Lost</option>
                      <option value="retired">Retired</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm text-white/70">
                  Description
                  <textarea
                    name="description"
                    value={itemForm.description}
                    onChange={updateItemField}
                    rows={3}
                    placeholder="Additional information..."
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
                      ? "Saving..."
                      : editingItemId
                        ? "Save Changes"
                        : "Create Item"}
                  </button>

                  <button
                    type="button"
                    onClick={startNewItem}
                    className="rounded-lg border border-white/20 px-5 py-2.5 text-white/70 hover:bg-white/10"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            {selectedItem && (
              <>
                <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h2 className="mb-2 text-xl font-semibold">
                    Manage Loan
                  </h2>

                  <p className="mb-5 text-sm text-white/60">
                    Selected item: {selectedItem.name} (
                    {selectedItem.inventory_number})
                  </p>

                  {selectedItemIsAvailable ? (
                    <form
                      onSubmit={handleCreateLoan}
                      className="space-y-4"
                    >
                      <label className="block text-sm text-white/70">
                        Borrower Name *
                        <input
                          required
                          name="borrower_name"
                          value={loanForm.borrower_name}
                          onChange={updateLoanField}
                          placeholder="Full name"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2.5 text-white"
                        />
                      </label>

                      <label className="block text-sm text-white/70">
                        Email Address *
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
                        Due Date *
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
                        {saving
                          ? "Saving..."
                          : "Create Loan"}
                      </button>
                    </form>
                  ) : (
                    <p className="rounded-lg bg-amber-500/10 p-4 text-sm text-amber-200">
                      This item is currently unavailable for new loans.
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
                    Retire Item
                  </button>
                </section>

                <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h2 className="mb-4 text-xl font-semibold">
                    Loan History
                  </h2>

                  {loans.length === 0 ? (
                    <p className="text-sm text-white/50">
                      No loan history for this item yet.
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
                                ? "Returned"
                                : "Currently Borrowed"}
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-xs text-white/50">
                            <p>
                              Borrowed: {formatDate(loan.borrowed_at)}
                            </p>

                            <p>
                              Due Date: {formatDate(loan.due_at)}
                            </p>

                            {loan.returned_at && (
                              <p>
                                Returned on:{" "}
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
                              Record Return
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-xs text-white/40">
                    Active loans for this item:{" "}
                    {selectedItemActiveLoans.length}
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
