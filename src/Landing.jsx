import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import "./auth.css";

const ROLE_KEYS = ["Student", "Mentor", "Organizer", "Union"];

function Landing() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const roleLabels = {
    Student: t("student"),
    Mentor: t("mentor"),
    Organizer: t("organizingUnits"),
    Union: t("unionOffice"),
  };

  return (
    <div className="auth-page">
      {/* ===== TOP NAVBAR ===== */}
      <nav className="top-navbar">
        <div className="top-navbar-left">
          <img
            src="/UEL_Logo.png"
            alt="UEL Logo"
            className="uel-logo-nav"
          />
          <div className="university-name">
            {t("universityName")}
            <span>{t("universitySubName")}</span>
          </div>
        </div>

        <div className="top-navbar-right">
          <div className="role-tabs">
            {ROLE_KEYS.map((role) => (
              <button key={role} className="role-tab">
                {roleLabels[role]}
              </button>
            ))}
          </div>

          <div className="lang-toggle">
            <button
              className={`lang-btn ${language === "en" ? "active" : ""}`}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <span className="lang-separator">|</span>
            <button
              className={`lang-btn ${language === "vi" ? "active" : ""}`}
              onClick={() => setLanguage("vi")}
            >
              VI
            </button>
          </div>

          <button className="login-nav-btn" onClick={() => navigate("/login")}>
            {t("logIn")}
          </button>
        </div>
      </nav>

      {/* ===== SECOND NAVBAR ===== */}
      <nav className="second-navbar">
        <button className="nav-link">{t("home")}</button>
        <button className="nav-link">{t("aboutUs")}</button>
        <button className="nav-link">{t("announcements")}</button>
        <button className="nav-link">{t("guidelines")}</button>
        <button className="search-icon-btn" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </nav>

      {/* ===== LANDING HERO ===== */}
      <div className="landing-hero">
        <img
          src="/UEL_Building.jpg"
          alt="UEL Building"
          className="landing-hero-bg"
          style={{ objectPosition: 'center center' }}
        />
        <div className="landing-hero-overlay"></div>
        <div className="landing-hero-content">
          <img
            src="/Cup.png"
            alt="ACMS Trophy"
            className="landing-acms-icon"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', borderRadius: '0', width: '100px', height: '100px', objectFit: 'contain' }}
          />
          <h1 className="landing-title">
            <span className="landing-title-accent">A</span>CADEMIC{" "}
            <span className="landing-title-accent">C</span>OMPETITION
            <br />
            <span className="landing-title-accent">M</span>ANAGEMENT{" "}
            <span className="landing-title-accent">S</span>YSTEM
          </h1>
          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            {t("logIn").toUpperCase()}
          </button>
        </div>
      </div>

      {/* ===== 3 CARDS ROW ===== */}
      <div className="demo-cards-container">
        {/* Card 1: ABOUT US */}
        <div className="demo-card">
          <h2 className="demo-card-title">1. ABOUT US</h2>
          <div className="demo-card-content">
            <p className="demo-desc">
              ACMS is Academic Competition Management System. A robust platform designed to centralize and streamline all academic competitions and events. It serves as your primary hub for discovering, organizing, and tracking academic excellence.
            </p>
            <button className="demo-btn">Learn more</button>
            <div className="demo-about-images">
              <img src="/logo.png" alt="ACMS Logo" className="demo-about-logo" />
              <div className="demo-about-grid">
                <img src="/NC_1.jpg" alt="Gallery 1" />
                <img src="/NC_2.jpg" alt="Gallery 2" />
                <img src="/NC_3.jpg" alt="Gallery 3" />
                <img src="/NC_4.jpg" alt="Gallery 4" />
                <img src="/NC_5.jpg" alt="Gallery 5" />
                <img src="/NC_6.jpg" alt="Gallery 6" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: ANNOUNCEMENTS */}
        <div className="demo-card">
          <h2 className="demo-card-title">2. ANNOUNCEMENTS</h2>
          <div className="demo-card-content">
            <div className="demo-anno-item">
              <img src="/HT_ICBF.png" alt="ICBF" className="demo-anno-img" />
              <div className="demo-anno-text">
                <span className="demo-anno-date">10 Apr 2026</span>
                <h4>Registration Open for ICBF 2026</h4>
                <a href="#">Read More &gt;</a>
              </div>
            </div>
            <div className="demo-anno-item">
              <img src="/HT_UEH.png" alt="UEH Event" className="demo-anno-img" />
              <div className="demo-anno-text">
                <span className="demo-anno-date">21 Apr 2026</span>
                <h4>UEH Economic Conference 2026</h4>
                <a href="#">Read More &gt;</a>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: GUIDELINES */}
        <div className="demo-card">
          <h2 className="demo-card-title">3. GUIDELINES</h2>
          <div className="demo-card-content demo-guides-grid">
            <div className="demo-guide-box">
              <span className="demo-guide-icon">📄</span>
              <span>Registration Guide</span>
            </div>
            <div className="demo-guide-box">
              <span className="demo-guide-icon">📝</span>
              <span>Competition Rules</span>
            </div>
            <div className="demo-guide-box">
              <span className="demo-guide-icon">🔗</span>
              <span>Project Submission Form</span>
            </div>
            <div className="demo-guide-box">
              <span className="demo-guide-icon">📘</span>
              <span>Mentor Handbook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;