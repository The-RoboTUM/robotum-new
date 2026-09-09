/**
 * Slim scrolling announcement bar above the hero.
 * - `badge`: short label in the pill on the left ("Latest", "WS 2026/27 intake")
 * - `tone`: "default" (neutral) | "highlight" (accent bar for live campaigns)
 */
const NewsTicker = ({ messages = [], badge = "Latest", tone = "default" }) => {
  const tickerText = messages.join(" • ");

  return (
    <div
      className={`news-ticker${tone === "highlight" ? " news-ticker--highlight" : ""}`}
      role="status"
      aria-live="off"
    >
      <div className="news-ticker-content">
        <span className="news-ticker-badge">{badge}</span>
        <span>{tickerText}</span>
        <span className="mx-4">•</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
};

export default NewsTicker;
