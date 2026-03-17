import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/usersdata";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("uel_auth_user") || "null");
  const liveUser = users.find((u) => u.id === storedUser?.id) || storedUser;

  const [profile, setProfile] = useState(liveUser?.profile || {});
  const [showMore, setShowMore] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  // ── FUNCTION LOGOUT ──
  const handleLogout = () => {
    localStorage.removeItem("uel_auth_user");
    localStorage.removeItem("uel_session_token");
    navigate("/"); // Quay về Landing Page
  };

  if (!liveUser) { navigate("/login"); return null; }

  const isOrganizer = liveUser.role === 'organizer' || liveUser.role === 'union';
  const displayName = profile.fullName || profile.clubName || liveUser.username;

  return (
    <div className="profile-page">
      <Header />

      {/* Nút Logout nhanh trên trang Profile */}
      <div style={{ position: 'absolute', top: '100px', right: '20px', zIndex: 10 }}>
        <button className="btn-cancel" onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '20px' }}>
          Đăng xuất 👋
        </button>
      </div>

      <main className="profile-main">
        {isOrganizer ? (
          /* ══════════════════════════════════════════
             GIAO DIỆN DÀNH CHO ĐƠN VỊ TỔ CHỨC (ORGANIZER)
             ══════════════════════════════════════════ */
          <div className="org-section">
            <div className="org-hero">
              <img src={profile.cover || "/5.jpg"} alt="Cover" className="org-cover" />
              <div className="org-info-row">
                <div className="org-avatar-wrap">
                  <img src={profile.avatar || "/UEL_Logo.png"} alt="Logo" className="org-avatar" />
                  <div className="org-text">
                    <h1 className="org-name">{displayName}</h1>
                    <p className="org-bio">{profile.bio}</p>
                  </div>
                </div>
                <div className="org-actions">
                  <button className="org-btn">⚙️ Article Management</button>
                  <button className="org-btn" onClick={() => navigate('/create-event')}>✏️ Create New Event</button>
                </div>
              </div>
            </div>

            <div className="org-tabs">
              <button className="org-tab active">Approval Published</button>
              <button className="org-tab">Draft</button>
              <button className="org-tab">Past</button>
            </div>

            <div className="org-event-list">
              <div className="org-event-card">
                <img src="/websitelobby.png" alt="Event" className="org-event-img" />
                <div className="org-event-body">
                  <h3>{profile.fullName} Competition Season 9</h3>
                  <p>Quản lý và theo dõi tiến độ cuộc thi của đơn vị bạn.</p>
                  <div className="org-event-btns">
                    <button className="org-action-btn">View Detail</button>
                    <button className="org-action-btn">Attendance Check</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════
             GIAO DIỆN DÀNH CHO SINH VIÊN (STUDENT)
             ══════════════════════════════════════════ */
          <div className="student-section">
            {/* HERO: cover + avatar + name */}
            <div className="profile-hero">
              <label className="profile-cover" style={{ backgroundImage: `url(${profile.coverImage || '/5.jpg'})` }}>
                <input type="file" style={{ display: 'none' }} />
              </label>
              <div className="profile-identity">
                <div className="profile-avatar-wrap">
                  {profile.avatar
                    ? <img src={profile.avatar} className="profile-avatar-img" alt={displayName} />
                    : <div className="profile-avatar-placeholder">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                  }
                </div>
                <div className="profile-name-block">
                  <h1 className="profile-name">{displayName}</h1>
                  <p className="profile-bio">{profile.bio}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', paddingBottom: '12px' }}>
                  <button className="profile-edit-btn" onClick={() => setEditInfo(true)}>
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="profile-grid">
              {/* LEFT */}
              <div className="profile-col-left">

                {/* About */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h2 className="profile-card-title">About</h2>
                    <button className="profile-card-edit-btn">✏️</button>
                  </div>
                  <p className="profile-about-text">
                    {profile.about || profile.bio || 'Chưa có thông tin giới thiệu.'}
                  </p>
                </div>

                {/* Experience */}
                {profile.experience?.length > 0 && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <h2 className="profile-card-title">Experience</h2>
                      <button className="profile-card-edit-btn">✏️</button>
                    </div>
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="profile-exp-item">
                        <div className="profile-exp-dot" />
                        <div className="profile-exp-body">
                          <p className="profile-exp-title">{exp.title}</p>
                          <p className="profile-exp-org">{exp.org}</p>
                          {exp.desc && <p className="profile-exp-desc">"{exp.desc}"</p>}
                          {exp.year && <span className="profile-exp-year">{exp.year}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Competitions */}
                {profile.competitions?.length > 0 && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <h2 className="profile-card-title">Competitions</h2>
                      <button className="profile-card-edit-btn">✏️</button>
                    </div>
                    {profile.competitions.map((c, i) => (
                      <div key={i} className="profile-exp-item">
                        <div className="profile-exp-dot" style={{ background: '#e55a1c' }} />
                        <div className="profile-exp-body">
                          <p className="profile-exp-title">{c.name}</p>
                          <p className="profile-exp-org">{c.role} · {c.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* RIGHT — Personal Information */}
              <div className="profile-col-right">
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h2 className="profile-card-title">Personal Information</h2>
                  </div>
                  <div className="profile-info-table">
                    {[
                      { label: 'Student ID',     value: profile.studentId },
                      { label: 'Full name',      value: profile.fullName },
                      { label: 'Class',          value: profile.class },
                      { label: 'Field of study', value: profile.fieldOfStudy || profile.major },
                      { label: 'Faculty',        value: profile.faculty },
                      { label: 'E-mail',         value: profile.email || liveUser.email },
                    ].filter(r => r.value).map(({ label, value }) => (
                      <div key={label} className="profile-info-row">
                        <span className="profile-info-label">{label}</span>
                        <span className="profile-info-value">{value}</span>
                      </div>
                    ))}
                    {showMore && [
                      { label: 'Phone',   value: profile.phone },
                      { label: 'Birthday', value: profile.dob },
                      { label: 'Gender',  value: profile.gender },
                      { label: 'GPA',     value: profile.gpa },
                      { label: 'Address', value: profile.address },
                    ].filter(r => r.value).map(({ label, value }) => (
                      <div key={label} className="profile-info-row">
                        <span className="profile-info-label">{label}</span>
                        <span className="profile-info-value">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="profile-seemore-btn" onClick={() => setShowMore(v => !v)}>
                    {showMore ? 'Ẩn bớt' : 'See more'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;