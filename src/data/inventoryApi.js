

import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import { pageRange } from "./pagination";

export const INVENTORY_CATEGORIES = {
  Electronics: "EL",
  Printer: "PR",
  Devices: "DV",
  Hardware: "HW",
  "Office Stationery": "OS",
};

const INVENTORY_FIELDS = `
  id,
  inventory_number,
  name,
  category,
  location,
  condition,
  description,
  lifecycle_status,
  created_at,
  updated_at
`;

const INVENTORY_LOAN_FIELDS = `
  id,
  item_id,
  borrower_name,
  borrower_email,
  borrowed_at,
  due_at,
  returned_at,
  comment,
  created_at
`;

export async function generateInventoryNumber(category) {
  const prefix = INVENTORY_CATEGORIES[category];

  if (!prefix) {
    throw new Error("Please select a valid category first.");
  }

  const { data, error } = await supabase
    .from("inventory_items")
    .select("inventory_number")
    .ilike("inventory_number", `${prefix}-%`);

  if (error) {
    logger.error("Error generating inventory number:", error);
    throw error;
  }

  const usedNumbers = new Set(
    (data ?? [])
      .map((item) => {
        const match = item.inventory_number?.match(
          new RegExp(`^${prefix}-(\\d+)$`),
        );

        return match ? Number(match[1]) : null;
      })
      .filter((number) => number !== null),
  );

  let nextNumber = 1;

  while (usedNumbers.has(nextNumber)) {
    nextNumber += 1;
  }

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
}

export async function fetchPublicInventoryCatalog() {
  const { data, error } = await supabase
    .from("inventory_catalog")
    .select(`
      id,
      inventory_number,
      name,
      category,
      location,
      condition,
      description,
      lifecycle_status,
      created_at,
      is_borrowed
    `)
    .order("name", { ascending: true });

  if (error) {
    logger.error("Error loading public inventory catalog:", error);
    throw error;
  }

  return data ?? [];
}

export async function adminFetchInventoryPage({
  page = 1,
  pageSize = 10,
  search = "",
  category = "",
  lifecycleStatus = "",
} = {}) {
  const [from, to] = pageRange(page, pageSize);

  let query = supabase
    .from("inventory_items")
    .select(INVENTORY_FIELDS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) {
    query = query.eq("category", category);
  }

  if (lifecycleStatus) {
    query = query.eq("lifecycle_status", lifecycleStatus);
  }

  if (search.trim()) {
    const pattern = `%${search.trim()}%`;

    query = query.or(
      `name.ilike.${pattern},inventory_number.ilike.${pattern},category.ilike.${pattern}`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    logger.error("Error fetching inventory page (admin):", error);
    throw error;
  }

  const items = data ?? [];
  const itemIds = items.map((item) => item.id);

  let activeLoans = [];

  if (itemIds.length > 0) {
    const { data: loanData, error: loanError } = await supabase
      .from("inventory_loans")
      .select(INVENTORY_LOAN_FIELDS)
      .in("item_id", itemIds)
      .is("returned_at", null);

    if (loanError) {
      logger.error("Error fetching active inventory loans:", loanError);
      throw loanError;
    }

    activeLoans = loanData ?? [];
  }

  const activeLoanByItemId = new Map(
    activeLoans.map((loan) => [loan.item_id, loan]),
  );

  return {
    items: items.map((item) => ({
      ...item,
      activeLoan: activeLoanByItemId.get(item.id) ?? null,
      isBorrowed: activeLoanByItemId.has(item.id),
    })),
    total: count ?? 0,
  };
}

export async function adminFetchActiveInventoryLoans() {
  const { data, error } = await supabase
    .from("inventory_active_loans")
    .select(`
      loan_id,
      item_id,
      inventory_number,
      item_name,
      category,
      location,
      borrower_name,
      borrower_email,
      borrowed_at,
      due_at
    `)
    .order("due_at", { ascending: true });

  if (error) {
    logger.error("Error fetching all active inventory loans:", error);
    throw error;
  }

  return data ?? [];
}

export async function adminUpsertInventoryItem(item) {
  const payload = {
    inventory_number: item.inventory_number?.trim(),
    name: item.name?.trim(),
    category: item.category?.trim(),
    location: item.location?.trim() || null,
    condition: item.condition?.trim() || "good",
    description: item.description?.trim() || null,
    lifecycle_status: item.lifecycle_status || "active",
  };

  if (!payload.inventory_number) {
    throw new Error("Inventory number is required.");
  }

  if (!payload.name) {
    throw new Error("Item name is required.");
  }

  if (!payload.category) {
    throw new Error("Category is required.");
  }

  if (item.id) {
    const { error } = await supabase
      .from("inventory_items")
      .update(payload)
      .eq("id", item.id);

    if (error) {
      logger.error("Error updating inventory item:", error);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from("inventory_items")
      .insert(payload);

    if (error) {
      logger.error("Error inserting inventory item:", error);
      throw error;
    }
  }
}

export async function adminDeleteInventoryItem(id) {
  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    logger.error("Error deleting inventory item:", error);
    throw error;
  }
}

export async function adminFetchInventoryLoans({ itemId } = {}) {
  let query = supabase
    .from("inventory_loans")
    .select(`
      ${INVENTORY_LOAN_FIELDS},
      inventory_items (
        inventory_number,
        name
      )
    `)
    .order("borrowed_at", { ascending: false });

  if (itemId) {
    query = query.eq("item_id", itemId);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("Error fetching inventory loans:", error);
    throw error;
  }

  return data ?? [];
}

export async function adminCreateInventoryLoan({
  item_id,
  borrower_name,
  borrower_email,
  due_at,
  comment = "",
}) {
  if (!item_id) {
    throw new Error("Please select an item.");
  }

  if (!borrower_name?.trim()) {
    throw new Error("Borrower name is required.");
  }

  if (!borrower_email?.trim()) {
    throw new Error("Borrower email address is required.");
  }

  if (!due_at) {
    throw new Error("Due date is required.");
  }

  const dueDate = new Date(due_at);

  if (Number.isNaN(dueDate.getTime()) || dueDate <= new Date()) {
    throw new Error("The due date must be in the future.");
  }

  const { data: item, error: itemError } = await supabase
    .from("inventory_items")
    .select("id, lifecycle_status")
    .eq("id", item_id)
    .maybeSingle();

  if (itemError) {
    logger.error("Error checking inventory item:", itemError);
    throw itemError;
  }

  if (!item) {
    throw new Error("The selected item could not be found.");
  }

  if (item.lifecycle_status !== "active") {
    throw new Error("This item is currently unavailable for borrowing.");
  }

  const { error } = await supabase.from("inventory_loans").insert({
    item_id,
    borrower_name: borrower_name.trim(),
    borrower_email: borrower_email.trim(),
    due_at: dueDate.toISOString(),
    comment: comment.trim() || null,
  });

  if (error) {
    logger.error("Error creating inventory loan:", error);

    if (error.code === "23505") {
      throw new Error("This item is already borrowed.");
    }

    throw error;
  }
}

export async function adminReturnInventoryLoan(id) {
  const { data, error } = await supabase
    .from("inventory_loans")
    .update({ returned_at: new Date().toISOString() })
    .eq("id", id)
    .is("returned_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    logger.error("Error returning inventory loan:", error);
    throw error;
  }

  if (!data) {
    throw new Error(
      "The loan could not be found or has already been returned.",
    );
  }
}
