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
        <button className="nav-link" onClick={() => navigate("/")}>{t("home")}</button>
        <button className="nav-link" onClick={() => navigate("/about-us")}>{t("aboutUs")}</button>
        <button className="nav-link" onClick={() => navigate("/announcements")}>{t("announcements")}</button>
        <button className="nav-link" onClick={() => navigate("/guidelines")}>{t("guidelines")}</button>
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
    </div>
  );
}

export default Landing;