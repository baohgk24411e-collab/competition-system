import { useState } from "react";
import { useLanguage } from '../LanguageContext';
import logoAcms from "/logo.png";
import logoUel  from "/UEL_Logo.png";
import "./Footer.css";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/uel.edu.vn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/school/uel-vnuhcm/posts/?feedView=all",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@uel.official",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/uel_vnuhcm/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@UELChannel",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1a3a6b"/>
      </svg>
    ),
  },
];

function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  const handleSend = () => {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className="site-footer">

      {/* ══ Body ══ */}
      <div className="footer-body">

        {/* Cột trái */}
        <div className="footer-left">

          {/* Logo */}
          <div className="footer-logo">
            <img
              src={logoAcms}
              alt="UEL-ACMS"
              className="footer-logo-img"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Mô tả */}
          <p className="footer-desc">
            {t("footerDesc")}{" "}
            <a href="#" className="footer-see-more">{t("seeMore")}</a>
          </p>

          {/* Contact */}
          <div className="footer-contact">
            <p className="footer-contact-title">{t("contactUs")}</p>
            <p>669 Do Muoi, Quarter 13, Linh Xuan Ward, Ho Chi Minh City, Vietnam.</p>
            <p>Phone: (028) 3 7244 555</p>
            <p>Fax: (028) 37244 500</p>
          </div>
        </div>

        {/* Cột phải: newsletter */}
        <div className="footer-right">
          <p className="footer-nl-title">{t("newsletterTitle")}</p>
          <hr className="footer-nl-divider"/>
          <p className="footer-nl-sub">
            {t("newsletterSub")}
          </p>
          <div className="footer-nl-row">
            <input
              type="email"
              className="footer-email-input"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="footer-send-btn" onClick={handleSend}>
              {sent ? t("sentBtn") : t("sendBtn")}
            </button>
          </div>
          {sent && (
            <p className="footer-sent-msg">
              {t("subscribeThanks")}
            </p>
          )}
        </div>
      </div>

      {/* ══ Đường kẻ ══ */}
      <hr className="footer-divider"/>

      {/* ══ Bottom: UEL brand + social ══ */}
      <div className="footer-bottom">

        {/* UEL logo chính thức */}
        <div className="footer-uel-brand">
          <img
            src={logoUel}
            alt="UEL"
            className="footer-uel-img"
          />
          <div className="footer-uel-text">
            <span>{t("universityName")}</span>
            <span>{t("universitySubName")}</span>
          </div>
        </div>

        {/* Social icons */}
        <div className="footer-social">
          <span className="footer-social-label">{t("getInTouch")}</span>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.url}
              className="footer-social-btn"
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ══ Copyright ══ */}
      <div className="footer-copyright">
        <em>
          {t("copyright")}
        </em>
      </div>

    </footer>
  );
}

export default Footer;