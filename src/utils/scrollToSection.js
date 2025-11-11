/**
 * Smoothly scrolls to a section by its element ID.
 * Example: scrollToSection("contact")
 */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
