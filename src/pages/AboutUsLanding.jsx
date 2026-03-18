import React from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "../auth.css";

const ROLE_KEYS = ["Student", "Mentor", "Organizer", "Union"];

export default function AboutUsLanding() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const roleLabels = {
    Student: t("student"),
    Mentor: t("mentor"),
    Organizer: t("organizingUnits"),
    Union: t("unionOffice"),
  };

  return (
    <div className="auth-page" style={{ height: 'auto', minHeight: '100vh', background: '#f8fafc' }}>
      {/* ===== TOP NAVBAR ===== */}
      <nav className="top-navbar">
        <div className="top-navbar-left">
          <img src="/UEL_Logo.png" alt="UEL Logo" className="uel-logo-nav" />
          <div className="university-name">
            {t("universityName")}
            <span>{t("universitySubName")}</span>
          </div>
        </div>
        <div className="top-navbar-right">
          <div className="role-tabs">
            {ROLE_KEYS.map((role) => (
              <button key={role} className="role-tab">{roleLabels[role]}</button>
            ))}
          </div>
          <div className="lang-toggle">
            <button className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>EN</button>
            <span className="lang-separator">|</span>
            <button className={`lang-btn ${language === "vi" ? "active" : ""}`} onClick={() => setLanguage("vi")}>VI</button>
          </div>
          <button className="login-nav-btn" onClick={() => navigate("/login")}>{t("logIn")}</button>
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

      <div className="demo-page-container">
        <div className="demo-card full-page-card">
          <h2 className="demo-card-title">ABOUT US</h2>
          <div className="demo-card-content">
            <p className="demo-desc" style={{ maxWidth: '800px', margin: '0 auto 40px auto' }}>
              ACMS is Academic Competition Management System. A robust platform designed to centralize and streamline all academic competitions and events. It serves as your primary hub for discovering, organizing, and tracking academic excellence.
            </p>
            <div className="demo-about-images">
              <img src="/logo.png" alt="ACMS Logo" className="demo-about-logo" style={{ alignSelf: 'center', height: '80px', marginBottom: '20px' }} />
              <div className="demo-about-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
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
      </div>
    </div>
  );
}
