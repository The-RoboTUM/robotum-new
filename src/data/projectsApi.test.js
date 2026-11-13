import { beforeEach, describe, expect, it, vi } from "vitest";

// Chainable fake of the Supabase query builder that records every call.
const calls = [];
function builder(result) {
  const b = {
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };
  for (const m of ["select", "eq", "order", "limit", "contains", "or", "maybeSingle"]) {
    b[m] = (...args) => {
      calls.push([m, ...args]);
      return b;
    };
  }
  return b;
}

vi.mock("@lib/supabaseClient", () => ({
  supabase: { from: vi.fn(() => builder({ data: [], error: null })) },
}));

const { fetchProjects, fetchFeaturedProjects, fetchProjectBySlug } = await import("./projectsApi");

const hidesHidden = () => calls.some(([m, col, val]) => m === "eq" && col === "show_on_website" && val === true);

describe("public project queries exclude hidden projects", () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it("fetchProjects", async () => {
    await fetchProjects();
    expect(hidesHidden()).toBe(true);
  });
  it("fetchFeaturedProjects", async () => {
    await fetchFeaturedProjects();
    expect(hidesHidden()).toBe(true);
  });
  it("fetchProjectBySlug", async () => {
    await fetchProjectBySlug("atlas");
    expect(hidesHidden()).toBe(true);
  });
  it("selects the show_on_website column", async () => {
    await fetchProjects();
    const [, fields] = calls.find(([m]) => m === "select");
    expect(fields).toMatch(/show_on_website/);
  });
});
