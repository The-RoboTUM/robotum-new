import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { submitRoboticsWeekPreregistration } from "@data";

// ============================================================================
// DESIGN SYSTEM & COLORS
// ============================================================================

const COLORS = {
  bg: "#05050a",
  bgPanel: "rgba(5, 5, 10, 0.7)",
  cyan: "#00f2fe",
  blue: "#4facfe",
  magenta: "#ff3df0",
  amber: "#ffb547",
  lime: "#a3ff3d",
  text: "#f8fafc",
  textMuted: "rgba(248, 250, 252, 0.65)",
  border: "rgba(255, 255, 255, 0.12)",
};

const TRACKS = [
  {
    id: "track-1",
    number: "01",
    title: "Data & Model Building",
    accent: COLORS.cyan,
    summary: "Overcoming the immense difficulty and cost of acquiring high-quality physical demonstration data.",
    long: "From teleoperation rigs to synthetic worlds — explore how teams are sourcing, generating, and refining the physical-world data that trains the next generation of robotic foundation models.",
    keywords: ["Foundation models", "Sim-to-real", "Teleop data", "VLA"],
  },
  {
    id: "track-2",
    number: "02",
    title: "Real-World Robotics Uses",
    accent: COLORS.magenta,
    summary: "Redesigning human workflows for maximum robotic ROI and proving commercial viability.",
    long: "Where do robots actually earn their keep today? Logistics, manufacturing, healthcare, services — and the workflow redesign that makes deployment work.",
    keywords: ["Logistics", "Manufacturing", "Healthcare", "Field robotics"],
  },
  {
    id: "track-3",
    number: "03",
    title: "Talent, Funding & Community",
    accent: COLORS.amber,
    summary: "Bridging the gap between academic AI research and commercial deployment while retaining top-tier engineering talent.",
    long: "Founders, VCs, and labs — how Europe builds and keeps the people, capital, and community needed to win in physical AI.",
    keywords: ["Founders", "VCs", "Hiring", "Ecosystem"],
  },
  {
    id: "track-4",
    number: "04",
    title: "Hardware, Operations & Scaling",
    accent: COLORS.lime,
    summary: "Overcoming supply chain bottlenecks for critical robotic hardware and adapting legacy factories.",
    long: "Actuators, sensors, batteries, supply chains, and brownfield factories — the unglamorous problems standing between a working prototype and a fleet at scale.",
    keywords: ["Actuators", "Supply chain", "Brownfield", "Fleet ops"],
  },
];

// ============================================================================
// GLOBAL STYLES WITH ANIMATIONS
// ============================================================================

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: #05050a;
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
  }

  @keyframes prismShimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 242, 254, 0.3); }
    50% { box-shadow: 0 0 40px rgba(0, 242, 254, 0.6); }
  }

  @keyframes gradientBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .prism-hero {
    position: relative;
    background: linear-gradient(135deg, #05050a 0%, #1a0033 50%, #05050a 100%);
    overflow: hidden;
  }

  .prism-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(0, 242, 254, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(79, 172, 254, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 90%, rgba(255, 61, 240, 0.12) 0%, transparent 50%);
    animation: prismShimmer 8s ease-in-out infinite;
    pointer-events: none;
  }

  .film-grain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.3;
  }

  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 242, 254, 0.03) 0px,
      rgba(0, 242, 254, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    animation: scanlines 0.15s linear infinite;
    pointer-events: none;
    opacity: 0.5;
  }

  .observe-fade {
    opacity: 0;
    transform: translateY(30px);
  }

  .observe-fade.active {
    animation: fadeInUp 0.7s ease-out forwards;
  }

  .observe-slide {
    opacity: 0;
    transform: translateX(-40px);
  }

  .observe-slide.active {
    animation: slideInLeft 0.7s ease-out forwards;
  }

  .card-hover {
    transition: all 0.3s ease;
  }

  .card-hover:hover {
    transform: translateY(-4px);
  }

  .glow-on-hover:hover {
    box-shadow: 0 0 30px rgba(0, 242, 254, 0.4), inset 0 0 20px rgba(0, 242, 254, 0.1);
  }
`;

// ============================================================================
// COMPONENT: Hero Section
// ============================================================================

function HeroSection({ onExploreClick }) {
  return (
    <section className="prism-hero" style={styles.hero}>
      <div className="film-grain" />
      <div className="scanline" />
      <div style={styles.heroContent}>
        <div style={styles.eyebrow}>22 — 26 / JUNE / 2026 · MÜNCHEN</div>
        <h1 style={styles.heroTitle}>Europe Embodied</h1>
        <p style={styles.heroSubtitle}>
          The future of physical AI is being written across labs, garages and studios in Europe. For one week, Munich becomes the lens that focuses it.
        </p>
        <div style={styles.heroButtons}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={() => {
              document.getElementById("register-section").scrollIntoView({ behavior: "smooth" });
            }}
          >
            Pre-register
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={onExploreClick}
          >
            Explore Tracks
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: Stats Strip
// ============================================================================

function StatsSection() {
  const stats = [
    { label: "12+ Universities", value: "" },
    { label: "5 Days", value: "" },
    { label: "4 Tracks", value: "" },
    { label: "1 City", value: "" },
  ];

  return (
    <section style={styles.statsSection}>
      <div style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.statItem} className="observe-fade">
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: Highlights Section (Hackathon + Summit)
// ============================================================================

function HighlightsSection() {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>The Week at a Glance</h2>
      <div style={styles.highlightsGrid}>
        <div style={styles.highlightCard} className="observe-fade glow-on-hover">
          <div style={{ ...styles.highlightIcon, color: COLORS.magenta }}>🏁</div>
          <h3 style={styles.highlightTitle}>The Hackathon</h3>
          <p style={styles.highlightText}>
            Two days of building against real industry problem statements. Team up across universities and disciplines, get mentorship from founders and researchers, and pitch your solution at the Ecosystem Summit.
          </p>
        </div>
        <div style={styles.highlightCard} className="observe-fade glow-on-hover">
          <div style={{ ...styles.highlightIcon, color: COLORS.amber }}>🌟</div>
          <h3 style={styles.highlightTitle}>Ecosystem Summit</h3>
          <p style={styles.highlightText}>
            Workshops, keynote talks, hackathon pitches, and booths from sponsors, start-ups, and student robotics clubs from across Europe. The single venue where the whole community meets.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: Tracks Teaser
// ============================================================================

function TracksSection({ scrollToRegister }) {
  return (
    <section style={styles.section} id="tracks-teaser">
      <h2 style={styles.sectionTitle}>Four Tracks of Innovation</h2>
      <p style={styles.sectionDescription}>
        Each track is a working room for the people turning robotics from research demos into deployed systems: data, use-cases, talent, capital, and hardware at scale.
      </p>
      <div style={styles.tracksGrid}>
        {TRACKS.map((track) => (
          <div
            key={track.id}
            style={{
              ...styles.trackCard,
              borderTop: `3px solid ${track.accent}`,
            }}
            className="observe-slide glow-on-hover"
          >
            <div style={{ ...styles.trackNumber, color: track.accent }}>{track.number}</div>
            <h3 style={styles.trackTitle}>{track.title}</h3>
            <p style={styles.trackSummary}>{track.summary}</p>
            <p style={styles.trackLong}>{track.long}</p>
            <div style={styles.trackKeywords}>
              {track.keywords.map((k) => (
                <span key={k} style={styles.keyword}>/ {k}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMPONENT: CTA Banner
// ============================================================================

function CTABanner({ onRegisterClick }) {
  return (
    <section style={styles.ctaBanner} className="observe-fade">
      <h2 style={styles.ctaTitle}>Ready to Shape the Future?</h2>
      <p style={styles.ctaSubtitle}>Pre-register now and secure your spot at Europe Embodied.</p>
      <button
        style={{ ...styles.button, ...styles.buttonPrimary }}
        onClick={onRegisterClick}
      >
        Pre-register Now
      </button>
    </section>
  );
}

// ============================================================================
// COMPONENT: Pre-Registration Form
// ============================================================================

function RegistrationForm({ selectedTrack = null }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    field_of_study: "",
    background: "",
  });

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitRoboticsWeekPreregistration({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        field_of_study: form.field_of_study,
        background: form.background,
      });
      setStatus("success");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        field_of_study: "",
        background: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Registration failed. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div style={styles.successContainer}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✨</div>
        <h2 style={styles.successTitle}>You're on the inside track.</h2>
        <p style={styles.successText}>
          Check your email for next steps. See you at CARBON & CODE.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Row 1: First + Last Name */}
      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.label}>First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleInputChange}
            placeholder="First name"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleInputChange}
            placeholder="Last name"
            required
            style={styles.input}
          />
        </div>
      </div>

      {/* Row 2: Email */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          required
          style={styles.input}
        />
      </div>

      {/* Row 3: Field of Study (Optional) */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Field of Study (optional)</label>
        <input
          type="text"
          name="field_of_study"
          value={form.field_of_study}
          onChange={handleInputChange}
          placeholder="e.g., Computer Science, Mechanical Engineering"
          style={styles.input}
        />
      </div>

      {/* Row 4: Background (Optional) */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Background (optional)</label>
        <textarea
          name="background"
          value={form.background}
          onChange={handleInputChange}
          placeholder="Tell us about your experience with robotics, AI, or relevant fields..."
          rows={4}
          style={{ ...styles.input, resize: "vertical", minHeight: "100px" }}
        />
      </div>

      {/* Error Message */}
      {status === "error" && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          ...styles.button,
          ...styles.buttonPrimary,
          width: "100%",
          opacity: status === "loading" ? 0.7 : 1,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          marginTop: "24px",
        }}
      >
        {status === "loading" ? "Registering..." : "Complete Registration"}
      </button>
    </form>
  );
}

// ============================================================================
// COMPONENT: Footer
// ============================================================================

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, opacity: 0.4, marginBottom: "32px" }} />
      
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "40px",
        marginBottom: "40px",
      }}>
        
        {/* Main Info */}
        <div style={{ gridColumn: "1 / 3" }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            marginBottom: "8px",
          }}>
            <span style={{ color: COLORS.cyan }}>Europe</span>
            <span style={{ color: COLORS.text }}> Embodied</span>
          </div>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.175em",
            color: COLORS.textMuted,
            margin: "4px 0 0 0",
          }}>
            Robotics Week · Munich 2026
          </p>
          <p style={{
            marginTop: "20px",
            maxWidth: "320px",
            fontSize: "0.875rem",
            color: COLORS.textMuted,
            lineHeight: 1.6,
          }}>
            A city-wide robotics summit in Munich, 22–26 June 2026. Hosted by RoboTUM &amp; START Munich, in cooperation with ESRA.
          </p>
          <p style={{
            marginTop: "24px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(248, 250, 252, 0.4)",
          }}>
            Munich · 22 — 26 June 2026
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 style={{
            marginBottom: "16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: COLORS.text,
          }}>
            Explore
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <button
                onClick={() => document.getElementById("tracks-teaser")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.textMuted,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  padding: 0,
                  textAlign: "left",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = COLORS.text}
                onMouseLeave={(e) => e.target.style.color = COLORS.textMuted}
              >
                Tracks
              </button>
            </li>
            <li>
              <button
                onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.textMuted,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  padding: 0,
                  textAlign: "left",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = COLORS.text}
                onMouseLeave={(e) => e.target.style.color = COLORS.textMuted}
              >
                Pre-register
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            marginBottom: "16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: COLORS.text,
          }}>
            Contact
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <li>
              <a
                href="mailto:contact@robotum.info"
                style={{
                  color: COLORS.textMuted,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  display: "block",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = COLORS.text}
                onMouseLeave={(e) => e.target.style.color = COLORS.textMuted}
              >
                contact@robotum.info
              </a>
              <span style={{
                display: "block",
                fontSize: "0.7rem",
                color: "rgba(248, 250, 252, 0.4)",
                marginTop: "2px",
              }}>
                RoboTUM
              </span>
            </li>
            <li>
              <a
                href="mailto:info@studentrobotics.eu"
                style={{
                  color: COLORS.textMuted,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  display: "block",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = COLORS.text}
                onMouseLeave={(e) => e.target.style.color = COLORS.textMuted}
              >
                info@studentrobotics.eu
              </a>
              <span style={{
                display: "block",
                fontSize: "0.7rem",
                color: "rgba(248, 250, 252, 0.4)",
                marginTop: "2px",
              }}>
                ESRA
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: COLORS.textMuted,
          gap: "8px",
        }}>
          <span>© 2026 Europe Embodied · RoboTUM &amp; START Munich.</span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            // bringing european robotics together
          </span>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function RoboticsWeekStandalone() {
  const [searchParams] = useSearchParams();
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".observe-fade, .observe-slide").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Europe Embodied — Robotics Week, Munich 2026";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToRegister = () => {
    document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTracks = () => {
    document.getElementById("tracks-teaser")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.page}>
      <style>{globalStyles}</style>

      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>EUROPE EMBODIED</div>
          <nav style={styles.nav}>
            <button onClick={scrollToTracks} style={styles.navLink}>
              Tracks
            </button>
            <button
              onClick={scrollToRegister}
              style={styles.navLink}
            >
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <HeroSection onExploreClick={scrollToTracks} />
        <StatsSection />
        <HighlightsSection />
        <TracksSection scrollToRegister={scrollToRegister} />
        <CTABanner onRegisterClick={scrollToRegister} />

        {/* Registration Section */}
        <section id="register-section" style={styles.section}>
          <h2 style={styles.sectionTitle}>Pre-Register for Europe Embodied</h2>
          <div style={styles.formContainer}>
            <RegistrationForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ============================================================================
// INLINE STYLES OBJECT
// ============================================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },

  // Header / Navigation
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(5, 5, 10, 0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${COLORS.border}`,
    padding: "16px 0",
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    fontFamily: "'Space Grotesk', sans-serif",
    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.blue})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  nav: {
    display: "flex",
    gap: "32px",
  },

  navLink: {
    background: "none",
    border: "none",
    color: COLORS.textMuted,
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 0.2s ease",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    padding: "0",
  },

  // Main Content
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },

  // Hero Section
  hero: {
    position: "relative",
    minHeight: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "80px",
    paddingBottom: "80px",
    marginBottom: "80px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    textAlign: "center",
  },

  eyebrow: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: COLORS.cyan,
    marginBottom: "24px",
  },

  heroTitle: {
    margin: "0 0 24px 0",
    fontSize: "clamp(3rem, 10vw, 5.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1.1,
    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.magenta})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  heroSubtitle: {
    margin: "0 0 48px 0",
    fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
    lineHeight: 1.6,
    color: COLORS.textMuted,
    maxWidth: "650px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  heroButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  // Stats Section
  statsSection: {
    marginBottom: "100px",
    paddingBottom: "80px",
    borderBottom: `1px solid ${COLORS.border}`,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "32px",
  },

  statItem: {
    textAlign: "center",
  },

  statLabel: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
    fontWeight: 700,
    color: COLORS.text,
    fontFamily: "'Space Grotesk', sans-serif",
  },

  // Section Styles
  section: {
    marginBottom: "120px",
  },

  sectionTitle: {
    margin: "0 0 48px 0",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.01em",
  },

  sectionDescription: {
    fontSize: "1.1rem",
    color: COLORS.textMuted,
    maxWidth: "600px",
    marginBottom: "48px",
    lineHeight: 1.6,
  },

  // Highlights Section
  highlightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "32px",
  },

  highlightCard: {
    padding: "40px 32px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    background: `linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 27, 50, 0.2) 100%)`,
    backdropFilter: "blur(10px)",
  },

  highlightIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },

  highlightTitle: {
    margin: "0 0 16px 0",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },

  highlightText: {
    margin: 0,
    fontSize: "1rem",
    color: COLORS.textMuted,
    lineHeight: 1.6,
  },

  // Tracks Section
  tracksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },

  trackCard: {
    padding: "32px 24px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "12px",
    background: `linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(20, 30, 50, 0.3) 100%)`,
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  },

  trackIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },

  trackNumber: {
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "12px",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  trackTitle: {
    margin: "0 0 12px 0",
    fontSize: "1.1rem",
    fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif",
  },

  trackSummary: {
    margin: "0 0 12px 0",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: COLORS.text,
    lineHeight: 1.5,
  },

  trackLong: {
    margin: "0 0 16px 0",
    fontSize: "0.85rem",
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },

  trackKeywords: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },

  keyword: {
    fontSize: "0.75rem",
    fontFamily: "'Space Grotesk', sans-serif",
    color: COLORS.textMuted,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },

  trackDescription: {
    margin: "0",
    fontSize: "0.9rem",
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },

  // CTA Banner
  ctaBanner: {
    padding: "60px 40px",
    marginBottom: "100px",
    borderRadius: "16px",
    background: `linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(255, 61, 240, 0.08) 100%)`,
    border: `2px solid ${COLORS.border}`,
    textAlign: "center",
  },

  ctaTitle: {
    margin: "0 0 16px 0",
    fontSize: "2rem",
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
  },

  ctaSubtitle: {
    margin: "0 0 32px 0",
    fontSize: "1.1rem",
    color: COLORS.textMuted,
  },

  // Form Section
  formContainer: {
    maxWidth: "600px",
    margin: "0 auto",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "40px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    background: `linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(20, 30, 50, 0.2) 100%)`,
    backdropFilter: "blur(10px)",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },

  input: {
    padding: "12px 16px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "8px",
    background: "rgba(15, 23, 42, 0.6)",
    color: COLORS.text,
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    outline: "none",
  },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "1rem",
    color: COLORS.text,
    cursor: "pointer",
    transition: "color 0.2s ease",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: COLORS.cyan,
  },

  errorBox: {
    padding: "16px",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.15)",
    border: `1px solid rgba(239, 68, 68, 0.5)`,
    color: "#fca5a5",
    fontSize: "0.95rem",
  },

  // Buttons
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPrimary: {
    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.blue})`,
    color: "#000",
    boxShadow: `0 10px 30px rgba(0, 242, 254, 0.3)`,
  },

  buttonSecondary: {
    background: "rgba(255, 255, 255, 0.08)",
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
  },

  // Success State
  successContainer: {
    padding: "60px 40px",
    textAlign: "center",
    borderRadius: "12px",
    background: `linear-gradient(135deg, rgba(163, 255, 61, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)`,
    border: `1px solid ${COLORS.border}`,
  },

  successTitle: {
    margin: "0 0 16px 0",
    fontSize: "2rem",
    fontWeight: 800,
    fontFamily: "'Space Grotesk', sans-serif",
    background: `linear-gradient(135deg, ${COLORS.lime}, ${COLORS.cyan})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  successText: {
    margin: 0,
    fontSize: "1.1rem",
    color: COLORS.textMuted,
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    marginTop: "120px",
    paddingTop: "40px",
    paddingBottom: "0",
    backgroundColor: COLORS.bg,
    color: COLORS.text,
  },

  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
  },

  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  footerTitle: {
    margin: 0,
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: COLORS.text,
  },

  footerText: {
    margin: 0,
    fontSize: "0.95rem",
    color: COLORS.textMuted,
  },

  footerLink: {
    color: COLORS.cyan,
    textDecoration: "none",
    transition: "color 0.2s ease",
  },

  footerBottom: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: "24px",
    textAlign: "center",
  },

  footerMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "rgba(248, 250, 252, 0.5)",
    letterSpacing: "0.01em",
  },
};
