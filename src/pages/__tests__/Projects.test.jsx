// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Projects from "@pages/Projects";

const PROJECTS = [
  { slug: "hestia", name: "Hestia", category: "technical", status: "active", tags: [] },
  { slug: "puma", name: "Reply Puma Collab", category: "technical", status: "completed", tags: [] },
  { slug: "recruitment", name: "Recruitment", category: "operations", status: "active", tags: [] },
];

vi.mock("@data", () => ({
  ENUM_TYPES: { PROJECT_CATEGORY: "project_category" },
  fetchProjects: vi.fn(async () => PROJECTS),
}));
vi.mock("@hooks/useEnumOptions", () => ({
  useEnumOptions: () => ({
    options: [
      { value: "technical", label: "Technical" },
      { value: "operations", label: "Operations" },
    ],
    loading: false,
  }),
}));
vi.mock("@components/sections/common-sections/Navbar", () => ({ default: () => null }));
vi.mock("@components/sections/common-sections/FooterSection", () => ({ default: () => null }));
vi.mock("@components/sections/common-sections/PageLoader", () => ({ default: () => null }));
vi.mock("@hooks/usePageTitle", () => ({ usePageTitle: () => {} }));

let navigate;
function NavCapture() {
  navigate = useNavigate();
  return null;
}

async function renderAt(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <NavCapture />
      <Projects />
    </MemoryRouter>,
  );
  await screen.findAllByRole("heading", { level: 3 });
}

const cardTitles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

afterEach(cleanup);

describe("Projects page", () => {
  it("switches category when the Navbar navigates to another ?type= (the reported bug)", async () => {
    await renderAt("/projects?type=operations");
    expect(cardTitles()).toEqual(["Recruitment"]);

    // What the Navbar projects dropdown does: navigate(`/projects?type=technical`)
    await act(async () => navigate("/projects?type=technical"));

    expect(cardTitles()).toContain("Hestia");
    expect(cardTitles()).not.toContain("Recruitment");
  });

  it("shows paused/completed projects in a Project history section", async () => {
    await renderAt("/projects?type=technical");
    const history = screen.getByRole("region", { name: "Project history" });
    expect(history.textContent).toContain("Reply Puma Collab");
    expect(history.textContent).not.toContain("Hestia");
  });
});
