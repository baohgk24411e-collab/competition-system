import React from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "../auth.css";

const ROLE_KEYS = ["Student", "Mentor", "Organizer", "Union"];

export default function GuidelinesLanding() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const roleLabels = {
    Student: t("student"),
    Mentor: t("mentor"),
    Organizer: t("organizingUnits"),
    Union: t("unionOffice"),
  };

  return (
    <div className="auth-page" style={{ height: 'auto', minHeight: '100vh', position: 'relative' }}>
      {/* Background Images */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2 }}>
        <img src="/UEL_Building.jpg" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px)', transform: 'scale(1.05)' }} />
      </div>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: -1 }}></div>

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
          <h2 className="demo-card-title">GUIDELINES</h2>
          <div className="demo-card-content demo-guides-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', padding: '40px' }}>
            <div className="demo-guide-box" style={{ padding: '40px', gap: '20px' }}>
              <span className="demo-guide-icon" style={{ fontSize: '48px' }}>📄</span>
              <span style={{ fontSize: '18px' }}>Registration Guide</span>
            </div>
            <div className="demo-guide-box" style={{ padding: '40px', gap: '20px' }}>
              <span className="demo-guide-icon" style={{ fontSize: '48px' }}>📝</span>
              <span style={{ fontSize: '18px' }}>Competition Rules</span>
            </div>
            <div className="demo-guide-box" style={{ padding: '40px', gap: '20px' }}>
              <span className="demo-guide-icon" style={{ fontSize: '48px' }}>🔗</span>
              <span style={{ fontSize: '18px' }}>Project Submission Form</span>
            </div>
            <div className="demo-guide-box" style={{ padding: '40px', gap: '20px' }}>
              <span className="demo-guide-icon" style={{ fontSize: '48px' }}>📘</span>
              <span style={{ fontSize: '18px' }}>Mentor Handbook</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
