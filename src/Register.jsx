import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { users } from "./data/usersdata";
import "./auth.css";

const ROLE_KEYS = ["student", "mentor", "organizer", "union"];

function Register() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [activeRole, setActiveRole] = useState("student");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const roleLabels = {
    student: t("student"),
    mentor: t("mentor"),
    organizer: t("organizingUnits"),
    union: t("unionOffice"),
  };

  const handleRegister = () => {
    // Validate all fields
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage({ type: "error", text: t("fillAllFields") });
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: t("passwordMismatch") });
      return;
    }

    // Check if username exists in the role dataset
    const usernameExists = users.find((u) => u.role === activeRole && u.username === username);
    if (usernameExists) {
      setMessage({ type: "error", text: t("usernameExists") });
      return;
    }

    // Check if email exists
    const emailExists = users.find((u) => u.role === activeRole && u.email === email);
    if (emailExists) {
      setMessage({ type: "error", text: t("emailExists") });
      return;
    }

    // Add new user to the dataset (in-memory)
    const rolePrefix = activeRole === "student" ? "S" : activeRole === "mentor" ? "M" : activeRole === "organizer" ? "O" : "U";
    const newId = rolePrefix + String(users.filter(u => u.role === activeRole).length + 1).padStart(3, "0");

    users.push({
      id: newId,
      username: username,
      email: email,
      password: password,
      role: activeRole,
      profile: {},
    });

    setMessage({ type: "success", text: t("registerSuccess") });
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
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
            onError={(e) => e.target.src = '/src/assets/competitions/UEL_Logo.png'}
          />
          <div className="university-name">
            {t("universityName")}
            <span>{t("universitySubName")}</span>
          </div>
        </div>

        <div className="top-navbar-right">
          <div className="role-tabs">
            {ROLE_KEYS.map((role) => (
              <button
                key={role}
                className={`role-tab ${activeRole === role ? "active" : ""}`}
                onClick={() => {
                  setActiveRole(role);
                  setMessage(null);
                }}
              >
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

      {/* ===== REGISTER CONTENT ===== */}
      <div
        className="auth-content"
        style={{
          backgroundImage: `url('/Login.png')`,
        }}
      >
        <div className="auth-card">
          <div className="auth-card-logo">
            <img
              src="/UEL_Logo.png"
              alt="UEL Logo"
              onError={(e) => e.target.src = '/src/assets/competitions/UEL_Logo.png'}
            />
          </div>

          <h2 className="auth-card-title">{t("registerTitle")}</h2>

          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="text"
              placeholder={t("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="auth-input-group">
            <input
              className="auth-input"
              type="password"
              placeholder={t("confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="register-submit-btn" onClick={handleRegister}>
            {t("registerBtn")}
          </button>

          <div className="back-to-login">
            <p>{t("alreadyHaveAccount")}</p>
            <button
              className="back-to-login-link"
              onClick={() => navigate("/login")}
            >
              {t("backToLogin")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;