// src/ConferenceDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { CONFERENCES_DATA } from './data/conferencesData';
import { useLanguage } from './LanguageContext';
import { getOrgLogo } from './data/orgLogos';
import { useNotifications } from './NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Import file CSS riêng cho Hội thảo (đã kế thừa CompetitionDetail.css)
import './ConferenceDetail.css'; 

const ConferenceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  
  const data = CONFERENCES_DATA.find(item => item.id === Number(id));
  
  if (!data) return <div className="cd-error">Không tìm thấy hội thảo!</div>;

  const posterSrc = data.poster;

  return (
    <div className="cd-page">
      <Header />
      {/* ── NỀN BLUR TOÀN TRANG ── */}
      <div className="cd-page-blur-bg" style={{ backgroundImage: `url(${posterSrc})` }} />
      <div className="cd-page-blur-overlay" />

      {/* ── CONTENT ── */}
      <div className="cd-wrapper">
        <button className="cd-back-btn" onClick={() => navigate(-1)}>{t('back_btn')}</button>

        {/* SECTION 1: HERO CARD (Thêm class conference-hero để chỉnh ảnh ngang) */}
        <section className="cd-hero-card conference-hero">
          <div className="cd-poster-box">
            {posterSrc && <img src={posterSrc} alt={data.title} className="cd-main-img" />}
            <div className="cd-action-group">
              <button
                className="cd-btn btn-monitor"
                onClick={() => addNotification({
                  org: data.organizer,
                  title: data.title,
                  message: `Bạn đã bật thông báo cho sự kiện "${data.title}".`,
                  type: 'follow',
                  category: data.category,
                  status: data.status,
                })}
              >
                Theo dõi sự kiện
              </button>

              {data.status !== 'ended' && (
                <a className="cd-btn btn-register" href={data.website || '#'} target="_blank" rel="noreferrer" style={{ gridColumn: 'span 2' }}>
                  Đăng ký tham gia
                </a>
              )}
            </div>
          </div>

          <div className="cd-main-info">
            <div className="cd-meta-top">
              <span className="cd-org-tag">
                {getOrgLogo(data.organizer) && (
                  <img src={getOrgLogo(data.organizer)} alt={data.organizer} className="cd-org-logo" />
                )}
                {data.organizer}
              </span>
              <span className={`cd-status-pill ${data.status}`}>
                {data.status === 'ongoing' ? 'ĐANG MỞ ĐĂNG KÝ' : data.status === 'upcoming' ? 'SẮP DIỄN RA' : 'ĐÃ KẾT THÚC'}
              </span>
            </div>
            <h1 className="cd-main-title">{data.title}</h1>
            <p className="cd-summary">{data.description}</p>
            <div className="cd-quick-details">
              {data.fee && <div className="cd-detail-item"><strong>Lệ phí</strong>{data.fee}</div>}
              {data.format && <div className="cd-detail-item"><strong>Hình thức</strong>{data.format}</div>}
              {data.regPeriod && <div className="cd-detail-item"><strong>Thời gian đăng ký</strong>{data.regPeriod}</div>}
              {data.eligibility && <div className="cd-detail-item cd-detail-full"><strong>Đối tượng</strong>{data.eligibility}</div>}
            </div>
          </div>
        </section>

        {/* SECTION 2: AGENDA (Sử dụng lại UI của Timeline) */}
        {data.agenda?.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">Lịch trình sự kiện</h2>
            <div className="cd-timeline-container">
              {data.agenda.map((step, idx) => (
                <div key={idx} className="cd-timeline-item">
                  <div className="cd-time-circle">{idx + 1}</div>
                  <div className="cd-time-content">
                    <h3>{step.phase}</h3>
                    <span className="cd-time-date">{step.date}</span>
                    {step.desc && <p>{step.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: SPEAKERS (Sử dụng lại UI của Prizes) */}
        {data.speakers?.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">Diễn giả khách mời</h2>
            <div className="cd-prize-grid">
              {data.speakers.map((s, idx) => (
                <div key={idx} className="cd-prize-card">
                  {/* Thêm avatar nếu có */}
                  {s.avatar ? (
                    <img src={s.avatar} alt={s.name} className="cd-speaker-avatar" />
                  ) : (
                    <div className="cd-speaker-avatar" style={{ background: '#e2e8f0' }} />
                  )}
                  <div className="cd-prize-rank" style={{ color: '#15427d' }}>{s.role}</div>
                  <div className="cd-prize-val" style={{ fontSize: '18px' }}>{s.name}</div>
                  <p className="cd-prize-extra" style={{ textAlign: 'center' }}>{s.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: BENEFITS & NOTES (Sử dụng lại UI của Rules) */}
        {data.benefits?.length > 0 && (
          <section className="cd-section">
            <div className="cd-content-block">
              <h3>Quyền lợi & Lưu ý</h3>
              <ul className="cd-list">
                {data.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ConferenceDetail;