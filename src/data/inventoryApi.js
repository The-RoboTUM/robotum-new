import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import { pageRange } from "./pagination";


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
  created_at
`;


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
    throw new Error("Inventarnummer ist erforderlich.");
  }

  if (!payload.name) {
    throw new Error("Name ist erforderlich.");
  }

  if (!payload.category) {
    throw new Error("Kategorie ist erforderlich.");
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
}) {
  if (!item_id) {
    throw new Error("Bitte einen Gegenstand auswählen.");
  }

  if (!borrower_name?.trim()) {
    throw new Error("Name des Ausleihers ist erforderlich.");
  }

  if (!borrower_email?.trim()) {
    throw new Error("E-Mail-Adresse des Ausleihers ist erforderlich.");
  }

  if (!due_at) {
    throw new Error("Rückgabedatum ist erforderlich.");
  }

  const dueDate = new Date(due_at);

  if (Number.isNaN(dueDate.getTime()) || dueDate <= new Date()) {
    throw new Error("Das Rückgabedatum muss in der Zukunft liegen.");
  }

  // Nur Gegenstände im normalen Bestand dürfen ausgeliehen werden.
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
    throw new Error("Der ausgewählte Gegenstand wurde nicht gefunden.");
  }

  if (item.lifecycle_status !== "active") {
    throw new Error(
      "Dieser Gegenstand ist aktuell nicht zur Ausleihe verfügbar.",
    );
  }

  const { error } = await supabase.from("inventory_loans").insert({
    item_id,
    borrower_name: borrower_name.trim(),
    borrower_email: borrower_email.trim(),
    due_at: dueDate.toISOString(),
  });

  if (error) {
    logger.error("Error creating inventory loan:", error);

    if (error.code === "23505") {
      throw new Error("Dieser Gegenstand ist bereits ausgeliehen.");
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
      "Die Ausleihe wurde nicht gefunden oder bereits zurückgegeben.",
    );
  }
}