import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import NotificationPopup from './NotificationPopup';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); 

  // Lấy thông tin user từ LocalStorage
  const authUserRaw = localStorage.getItem("uel_auth_user");
  const currentUser = authUserRaw ? JSON.parse(authUserRaw) : null;

  const isActive = (path) => location.pathname === path;
  const isOrganizer = currentUser?.role === 'organizer';
  const isUnion      = currentUser?.role === 'union';

  // ── HÀM XỬ LÝ ĐĂNG XUẤT ──
  const handleLogout = () => {
    localStorage.removeItem("uel_auth_user");
    localStorage.removeItem("uel_session_token");
    setShowUserMenu(false);
    navigate("/"); // Quay về trang Landing
  };

  return (
    <header className="site-header" style={{ position: 'relative' }}>
      <div className="hdr-logo-zone" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
        <img src="/logo.png" alt="UEL Logo" className="hdr-logo-img" />
      </div>

      <div className="hdr-right-zone">
        <div className="hdr-top-bar">
          <div className="hdr-utilities">
            <div className="hdr-lang">
              <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
              <span>|</span>
              <button className={language === 'vi' ? 'active' : ''} onClick={() => setLanguage('vi')}>VI</button>
            </div>

            {currentUser && <NotificationPopup />}

            {/* Avatar placeholder (giữ layout, không có dropdown) */}
            <div 
              className="hdr-avatar" 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ cursor: 'pointer', overflow: 'hidden' }}
            >
              {currentUser?.profile?.avatar ? (
                <img src={currentUser.profile.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="hdr-bottom-bar">
          <nav className={`hdr-nav ${mobileOpen ? 'open' : ''}`}>
            <button className={`hdr-nav-link ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>Home</button>
            
            {isUnion ? (
              <>
                <button className={`hdr-nav-link ${isActive('/union') ? 'active' : ''}`} onClick={() => navigate('/union')}>Event Approval Management</button>
                <button className={`hdr-nav-link ${isActive('/union/participation') ? 'active' : ''}`} onClick={() => navigate('/union')}>Participation Management</button>
                <button className={`hdr-nav-link ${isActive('/union/reports') ? 'active' : ''}`} onClick={() => navigate('/union')}>Reports</button>
              </>
            ) : isOrganizer ? (
              <>
                <button className={`hdr-nav-link ${isActive('/organizer') ? 'active' : ''}`} onClick={() => navigate('/organizer')}>Our Events</button>
                <button className={`hdr-nav-link ${isActive('/create-event') ? 'active' : ''}`} onClick={() => navigate('/create-event')}>Create Event</button>
                <button className={`hdr-nav-link ${isActive('/forum') ? 'active' : ''}`} onClick={() => navigate('/forum')}>Forum</button>
              </>
            ) : (
              <>
                <button className={`hdr-nav-link ${isActive('/competitions') ? 'active' : ''}`} onClick={() => navigate('/competitions')}>Competitions</button>
                <button className={`hdr-nav-link ${isActive('/conferences') ? 'active' : ''}`} onClick={() => navigate('/conferences')}>Conferences</button>
                <button className={`hdr-nav-link ${isActive('/forum') ? 'active' : ''}`} onClick={() => navigate('/forum')}>Forum</button>
                <button className={`hdr-nav-link ${isActive('/resources') ? 'active' : ''}`} onClick={() => navigate('/resources')}>Resources</button>
              </>
            )}
          </nav>

          <button className={`hdr-hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Dropdown Menu - render ngoài clip-path, gắn vào header */}
      {showUserMenu && (
        <div style={{
          position: 'absolute', top: '44px', right: '24px',
          background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
          borderRadius: '12px', padding: '8px 0', minWidth: '200px', zIndex: 9999
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#1a3a6b' }}>
              {currentUser?.profile?.fullName || currentUser?.username || 'User'}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280' }}>
              {currentUser?.role?.toUpperCase()}
            </p>
          </div>

          <button
            onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
            style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#374151' }}
          >
            👤 {t('profile') || 'Hồ sơ cá nhân'}
          </button>

          <button
            onClick={handleLogout}
            style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#e74c3c' }}
          >
            🚪 Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
}