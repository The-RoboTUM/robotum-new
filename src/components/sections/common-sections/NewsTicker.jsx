const NewsTicker = ({ messages = [] }) => {
  const tickerText = messages.join(" • ");

  return (
    <div className="news-ticker">
      <div className="news-ticker-content">
        <span className="news-ticker-badge">Latest</span>
        <span>{tickerText}</span>
        <span className="mx-4">•</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
};

export default NewsTicker;