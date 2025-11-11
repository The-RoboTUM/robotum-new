/**
 * Smoothly scrolls to a specific section by ID.
 * @param {string} id - The ID of the target element.
 */
export const scrollToSection = (id) => {
  if (typeof window === 'undefined') return; // guard for SSR
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};