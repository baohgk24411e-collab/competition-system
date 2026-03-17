import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/usersdata";
import { COMPETITIONS_DATA } from "../../data/competitionsData";
import { useLanguage } from "../../LanguageContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./OrganizerDashboard.css";

function OrganizerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("published");
  const [announcement, setAnnouncement] = useState(null);

  /* ── Current organizer ── */
  const stored   = JSON.parse(localStorage.getItem("uel_auth_user") || "null");
  const liveUser = users.find((u) => u.id === stored?.id) || stored;
  const profile  = liveUser?.profile || {};
  const orgName  = profile.clubName || profile.fullName || liveUser?.username || "Organizer";

  if (!liveUser) { navigate("/login"); return null; }

  /* ── Map myEvents ids to full competition data ── */
  const myEventIds  = (profile.myEvents || []).map((e) => e.competitionId || e.id);
  const allOrgEvents = myEventIds.length > 0
    ? COMPETITIONS_DATA.filter((c) => myEventIds.includes(c.id))
    : COMPETITIONS_DATA; /* fallback: show all for demo */

  /* ── Tab filter ── */
  const TABS = [
    { key: "published", label: t("org_tab_published") },
    { key: "draft",     label: t("org_tab_draft") },
    { key: "past",      label: t("org_tab_past") },
  ];

  const visibleEvents = allOrgEvents.filter((e) => {
    if (activeTab === "past")   return e.status === "ended";
    if (activeTab === "draft")  return e.status === "draft";
    return e.status !== "ended" && e.status !== "draft";
  });

  return (
    <div className="org-dashboard">
      {/* ── BLURRED FULL-PAGE BACKGROUND ── */}
      <div
        className="org-bg-blur"
        style={{ backgroundImage: `url(${profile.coverImage || "/UEL_Building.jpg"})` }}
      />

      <Header />

      <main className="org-main">

        {/* ── HERO CARD ── */}
        <div className="org-hero-card">
          <div
            className="org-cover"
            style={{ backgroundImage: `url(${profile.coverImage || "/3.jpg"})` }}
          />
          <div className="org-profile-row">
            <div className="org-identity">
              <div className="org-avatar-circle">
                {profile.avatar
                  ? <img src={profile.avatar} alt={orgName} className="org-avatar-img" />
                  : <span className="org-avatar-letter">{orgName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="org-name-block">
                <h1 className="org-name">{orgName}</h1>
                <p className="org-bio">{profile.bio}</p>
              </div>
            </div>
            <div className="org-hero-actions">
              <button className="org-btn-outline" onClick={() => navigate("/profile")}>
                👤 {t("org_view_profile")}
              </button>
              <button className="org-btn-outline" onClick={() => alert("Article Management — coming soon!")}>
                ⚙️ {t("org_article_mgmt")}
              </button>
              <button className="org-btn-solid" onClick={() => navigate("/create-event")}>
                ✏️ {t("org_create_event")}
              </button>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="org-tabs-bar">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`org-tab-btn ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── EVENT LIST ── */}
        <div className="org-event-list">
          {visibleEvents.length === 0 ? (
            <div className="org-empty">
              <span>💭</span>
              <p>{t("org_no_events")}</p>
              <button className="org-btn-solid" onClick={() => navigate("/create-event")}>
                + {t("org_create_event")}
              </button>
            </div>
          ) : (
            visibleEvents.map((event) => (
              <div key={event.id} className="org-event-card">
                <div className="org-event-poster">
                  <img
                    src={event.poster || event.image || "/DC_poster.jpg"}
                    alt={event.title}
                    onError={(e) => { e.target.src = "/DC_poster.jpg"; }}
                  />
                </div>
                <div className="org-event-body">
                  <h3 className="org-event-title">{event.title}</h3>
                  <p className="org-event-desc">
                    {event.description?.slice(0, 200)}
                    {event.description?.length > 200 ? "…" : ""}
                  </p>
                  <div className="org-event-meta">
                    {event.organizer && (
                      <span className="org-event-badge">{event.organizer}</span>
                    )}
                    <span className={`org-status-dot org-status-${event.status}`}>
                      {event.status === "ongoing"  ? `● ${t("org_status_ongoing")}`
                        : event.status === "ended" ? `● ${t("org_status_ended")}`
                        : `● ${t("org_status_upcoming")}`}
                    </span>
                  </div>
                  <div className="org-event-actions">
                    <button
                      className="org-action-btn"
                      onClick={() => navigate(`/competition/${event.id}`)}
                    >
                      {t("org_btn_view_detail")}
                    </button>
                    <button
                      className="org-action-btn"
                      onClick={() => alert(`Attendance Check: ${event.title}`)}
                    >
                      {t("org_btn_attendance")}
                    </button>
                    <button
                      className="org-action-btn outline"
                      onClick={() => setAnnouncement(event)}
                    >
                      {t("org_btn_announcement")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* ── ANNOUNCEMENT MODAL ── */}
      {announcement && (
        <div className="org-modal-overlay" onClick={() => setAnnouncement(null)}>
          <div className="org-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="org-modal-title">📢 {t("org_announcement")}</h3>
            <p className="org-modal-event">{announcement.title}</p>
            <textarea
              className="org-modal-textarea"
              placeholder={t("org_announcement_placeholder")}
              rows={5}
            />
            <div className="org-modal-actions">
              <button className="org-btn-solid" onClick={() => { alert(t("org_announcement_sent")); setAnnouncement(null); }}>
                {t("org_btn_send")}
              </button>
              <button className="org-btn-outline" onClick={() => setAnnouncement(null)}>
                {t("org_btn_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrganizerDashboard;