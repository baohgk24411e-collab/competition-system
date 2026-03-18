import React from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "../auth.css";

const ROLE_KEYS = ["Student", "Mentor", "Organizer", "Union"];

export default function AnnouncementsLanding() {
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
          <h2 className="demo-card-title">ANNOUNCEMENTS</h2>
          <div className="demo-card-content" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <div className="demo-anno-item" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '30px', alignItems: 'center' }}>
              <img src="/HT_ICBF.png" alt="ICBF" className="demo-anno-img" style={{ width: '200px', height: '140px' }} />
              <div className="demo-anno-text" style={{ flex: 1, paddingLeft: '20px' }}>
                <span className="demo-anno-date" style={{ fontSize: '15px' }}>10 Apr 2026</span>
                <h4 style={{ fontSize: '24px', margin: '14px 0' }}>Registration Open for ICBF 2026</h4>
                <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '14px' }}>
                  Join us for the International Conference on Business and Finance. Submissions are now open for all researchers and students.
                </p>
                <a href="#" style={{ fontSize: '15px' }}>Read More &gt;</a>
              </div>
            </div>

            <div className="demo-anno-item" style={{ borderBottom: 'none', paddingBottom: '0', alignItems: 'center' }}>
              <img src="/HT_UEH.png" alt="UEH Event" className="demo-anno-img" style={{ width: '200px', height: '140px' }} />
              <div className="demo-anno-text" style={{ flex: 1, paddingLeft: '20px' }}>
                <span className="demo-anno-date" style={{ fontSize: '15px' }}>21 Apr 2026</span>
                <h4 style={{ fontSize: '24px', margin: '14px 0' }}>UEH Economic Conference 2026</h4>
                <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.6', marginBottom: '14px' }}>
                  An exciting opportunity to present your economic models and papers to a panel of distinguished judges and university professors.
                </p>
                <a href="#" style={{ fontSize: '15px' }}>Read More &gt;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
