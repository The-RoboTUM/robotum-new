const NewsTicker = ({ messages }) => {
  return (
    <div className="news-ticker">
      <div className="news-ticker-content">
        <span className="news-ticker-badge">ATTENTION!</span>
        {messages.join("   •   ")}
        {"   •   "}
        {messages.join("   •   ")}
      </div>
    </div>
  );
};

export default NewsTicker;
