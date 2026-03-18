import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { users } from "./data/usersdata";
import "./auth.css";

const ROLE_KEYS = ["student", "mentor", "organizer", "union"];

function Login() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [activeRole, setActiveRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const roleLabels = {
    student:  t("student"),
    mentor:   t("mentor"),
    organizer: t("organizingUnits"),
    union:    t("unionOffice"),
  };

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setMessage({ type: "error", text: t("pleaseEnterInfo") });
      return;
    }

    const found = users.find(
      (u) =>
        (u.username === username.trim() || u.email === username.trim()) &&
        u.password === password
    );

    if (found) {
      localStorage.setItem("uel_auth_user", JSON.stringify(found));
      localStorage.setItem("uel_session_token", `token_${Date.now()}`);
      setMessage({ type: "success", text: t("loginSuccess") });

      setTimeout(() => {
        if (found.role === "union") {
          navigate("/union");
        } else if (found.role === "organizer") {
          navigate("/organizer");
        } else {
          navigate("/home");
        }
      }, 1200);
    } else {
      setMessage({ type: "error", text: t("loginError") });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const scrollToSection = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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

          <button className="login-nav-btn" onClick={handleLogin}>
            {t("logIn")}
          </button>
        </div>
      </nav>

      {/* ===== SECOND NAVBAR ===== */}
      <nav className="second-navbar">
        <button className="nav-link" onClick={() => scrollToSection('top')}>{t("home")}</button>
        <button className="nav-link" onClick={() => scrollToSection('about-us')}>{t("aboutUs")}</button>
        <button className="nav-link" onClick={() => scrollToSection('announcements')}>{t("announcements")}</button>
        <button className="nav-link" onClick={() => scrollToSection('guidelines')}>{t("guidelines")}</button>
        <button className="search-icon-btn" aria-label="Search">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </nav>

      {/* ===== MAIN: background image + split layout ===== */}
      <div
        className="auth-content"
        style={{ backgroundImage: `url('/Login.png')` }}
      >
        <div className="auth-split">
          {/* ── LEFT: Brand panel (only visible on wide screens) ── */}
          <div className="auth-brand-panel">
            <img src="/UEL_Logo.png" alt="UEL Logo" className="auth-brand-logo" />
            <div className="auth-brand-title">
              Academic <span>Competition</span><br />
              Management System
            </div>
            <p className="auth-brand-sub">
              Nền tảng quản lý các cuộc thi học thuật của Trường Đại học Kinh tế – Luật.
            </p>
          </div>

          {/* ── RIGHT: Login card ── */}
          <div className="auth-card">
            <div className="auth-card-logo">
              <img
                src="/UEL_Logo.png"
                alt="UEL Logo"
              />
            </div>

            <h2 className="auth-card-heading">Đăng nhập</h2>
            <p className="auth-card-subheading">
              Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.
            </p>

            {message && (
              <div className={`auth-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-input-label">Tên đăng nhập / Email</label>
              <input
                className="auth-input"
                type="text"
                placeholder={t("usernameOrEmail")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Mật khẩu</label>
              <input
                className="auth-input"
                type="password"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="auth-actions-row">
              <button className="lost-password-link">{t("lostPassword")}</button>
              <button className="auth-submit-btn" onClick={handleLogin}>
                {t("logIn")}
              </button>
            </div>

            <hr className="auth-divider" />

            <p className="social-login-label">{t("loginWithAccount")}</p>
            <button className="google-login-btn">
              <svg className="google-icon" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Google
            </button>

            <hr className="auth-divider" />

            <div className="register-section">
              <p>{t("noAccount")}</p>
              <button
                className="register-link"
                onClick={() => navigate("/register")}
              >
                {t("register")}
              </button>
            </div>

            <button
              className="back-to-home-btn"
              onClick={() => navigate("/")}
            >
              ← {t("backToHome") || "Quay lại trang chủ"}
            </button>
          </div>
        </div>
      </div>

      {/* ===== LANDING SECTIONS ===== */}
      <div id="about-us" className="landing-section">
        <h2 className="section-title">{t("aboutUs")}</h2>
        <div className="about-content">
          <p>
            Academic Competition Management System (ACMS) là hệ thống được phát triển nhằm hỗ trợ sinh viên và giảng viên Trường Đại học Kinh tế – Luật trong việc tiếp cận, đăng ký và quản lý các cuộc thi học thuật, nghiên cứu khoa học.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <h3>Tầm nhìn</h3>
              <p>Trở thành nền tảng trung tâm kết nối tri thức và khơi nguồn sáng tạo cho cộng đồng UEL.</p>
            </div>
            <div className="about-card">
              <h3>Sứ mệnh</h3>
              <p>Đơn giản hóa quy trình, tối ưu hóa trải nghiệm tham gia thi đấu học thuật và nghiên cứu.</p>
            </div>
            <div className="about-card">
              <h3>Giá trị</h3>
              <p>Minh bạch, Công bằng, Sáng tạo và Trách nhiệm cộng đồng.</p>
            </div>
          </div>
        </div>
      </div>

      <div id="announcements" className="landing-section bg-light">
        <h2 className="section-title">{t("announcements")}</h2>
        <div className="announcement-cards">
          <div className="anno-card">
            <span className="anno-date">10/05/2026</span>
            <h4>Khai mạc Hackathon 2026</h4>
            <p>Sự kiện đánh dấu bước khởi đầu cho chuỗi ngày tranh tài gay cấn với nhiều ý tưởng chuyển đổi số.</p>
          </div>
          <div className="anno-card">
            <span className="anno-date">02/05/2026</span>
            <h4>Công bố thể lệ NCKH cấp trường</h4>
            <p>Sinh viên vui lòng cập nhật quy định mới nhất cho đợt thi bảo vệ luận án năm nay trên hệ thống.</p>
          </div>
          <div className="anno-card">
            <span className="anno-date">25/04/2026</span>
            <h4>Mở cổng đăng ký SCHALLENGE XIII</h4>
            <p>Đăng ký sớm nhất ngay hôm nay để nhận được sự tư vấn, định hướng từ các mentor hàng đầu.</p>
          </div>
        </div>
      </div>

      <div id="guidelines" className="landing-section">
        <h2 className="section-title">{t("guidelines")}</h2>
        <div className="guideline-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Đăng nhập</h4>
            <p>Sử dụng tài khoản email sinh viên hoặc giảng viên UEL để truy cập hệ thống.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Tìm cuộc thi</h4>
            <p>Khám phá các cuộc thi học thuật phù hợp với chuyên ngành đang mở đăng ký.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Nộp hồ sơ</h4>
            <p>Làm theo hướng dẫn và nộp bài dự thi trực tiếp thông qua nền tảng ACMS.</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <h4>Theo dõi</h4>
            <p>Nhận thông báo cập nhật kết quả và phản hồi từ Ban tổ chức nhanh chóng.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;