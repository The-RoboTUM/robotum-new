import { describe, expect, it } from "vitest";
import {
  filterProjects,
  resolveActiveTab,
  splitByStatus,
} from "./projectFilters";

const TABS = [{ value: "technical" }, { value: "operations" }];

const PROJECTS = [
  { name: "Hestia", category: "technical", status: "active", tags: ["robotics"] },
  { name: "ATLAS", category: "technical", status: null, tags: ["ai"] },
  { name: "Reply Puma Collab", category: "technical", status: "completed", tags: ["ros2"] },
  { name: "Workshop Wednesdays", category: "technical", status: "paused", tags: ["community"] },
  { name: "Recruitment", category: "operations", status: "active", summary: "Hiring", tags: ["community"] },
];

describe("resolveActiveTab", () => {
  it("uses ?type= when it is a known tab", () => {
    expect(resolveActiveTab("operations", TABS, false)).toBe("operations");
  });
  it("falls back to the first tab for unknown or missing ?type=", () => {
    expect(resolveActiveTab("nope", TABS, false)).toBe("technical");
    expect(resolveActiveTab("", TABS, false)).toBe("technical");
  });
  it("trusts an unknown ?type= while the enum is still loading", () => {
    expect(resolveActiveTab("new-db-only", TABS, true)).toBe("new-db-only");
  });
});

describe("filterProjects", () => {
  it("filters by category", () => {
    const names = filterProjects(PROJECTS, { category: "operations" }).map((p) => p.name);
    expect(names).toEqual(["Recruitment"]);
  });
  it("finds projects by name (previously broken: searched p.title)", () => {
    const names = filterProjects(PROJECTS, { category: "technical", query: "hestia" }).map((p) => p.name);
    expect(names).toEqual(["Hestia"]);
  });
  it("searches summary and tags too, case-insensitively", () => {
    expect(filterProjects(PROJECTS, { category: "operations", query: "HIRING" })).toHaveLength(1);
    expect(filterProjects(PROJECTS, { category: "technical", query: "ros2" })).toHaveLength(1);
  });
  it("filters by curated tag", () => {
    const names = filterProjects(PROJECTS, { category: "technical", tag: "ai" }).map((p) => p.name);
    expect(names).toEqual(["ATLAS"]);
  });
});

describe("splitByStatus", () => {
  it("puts active and status-less projects in current, others in history", () => {
    const { current, past } = splitByStatus(PROJECTS.filter((p) => p.category === "technical"));
    expect(current.map((p) => p.name)).toEqual(["Hestia", "ATLAS"]);
    expect(past.map((p) => p.name)).toEqual(["Reply Puma Collab", "Workshop Wednesdays"]);
  });
});
