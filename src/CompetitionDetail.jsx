import { useParams, useNavigate } from 'react-router-dom';
import { COMPETITIONS_DATA } from './data/competitionsData';
import dcImg  from '/digital_creatory.jpg';
import erpImg from '/ERPSIM.jpg';
import S_Challenge from '/S_challenge.jpg';
import AI4I from '/AI_in_Business.jpg';
import { useLanguage } from './LanguageContext';
import { getOrgLogo } from './data/orgLogos';
import { useNotifications } from './NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './CompetitionDetail.css';

// Map id → imported image
const POSTER_IMAGES = {
  1: dcImg,
  5: erpImg,
  7: AI4I,
};

const CompetitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const data = COMPETITIONS_DATA.find(item => item.id === Number(id));
  if (!data) return <div className="cd-error">Không tìm thấy cuộc thi!</div>;

  // Lấy ảnh đã import, fallback về poster string trong data
  const posterSrc = POSTER_IMAGES[data.id] || data.poster;

  return (
    <div className="cd-page">
      <Header />
      {/* ── NỀN BLUR TOÀN TRANG ── */}
      <div className="cd-page-blur-bg" style={{ backgroundImage: `url("${posterSrc}")` }} />
      <div className="cd-page-blur-overlay" />

      {/* ── CONTENT ── */}
      <div className="cd-wrapper">
        <button className="cd-back-btn" onClick={() => navigate(-1)}>{t('back_btn')}</button>

        {/* SECTION 1: HERO CARD */}
        <section className="cd-hero-card">
          <div className="cd-poster-box">
            {posterSrc && <img src={posterSrc} alt={data.title} className="cd-main-img" />}
            <div className="cd-action-group">
              <button className="cd-btn btn-ranking">{t('btn_ranking')}</button>

              {/* Theo dõi → thêm notification */}
              <button
                className="cd-btn btn-monitor"
                onClick={() => addNotification({
                  org: data.organizer,
                  title: data.title,
                  message: `Bạn đang theo dõi "${data.title}". Chúng tôi sẽ thông báo khi có cập nhật mới.`,
                  type: 'follow',
                  category: data.category,
                  faculty: null,
                  status: data.status,
                })}
              >
                {t('btn_monitor')}
              </button>

              {/* Đăng ký → mở link website thật */}
              {data.status === 'ongoing' && (
                <a
                  className="cd-btn btn-register"
                  href={data.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('btn_register')}
                </a>
              )}
            </div>
            {(data.website || data.fanpage || data.group) && (
              <div className="cd-links-box">
                <p className="cd-links-label">{t('links_title')}</p>
                {data.website && <a href={data.website} target="_blank" rel="noreferrer" className="cd-link">{t('link_website')}</a>}
                {data.booklet && <a href={data.booklet} target="_blank" rel="noreferrer" className="cd-link">{t('link_booklet')}</a>}
                {data.qna     && <a href={data.qna}     target="_blank" rel="noreferrer" className="cd-link">{t('link_qna')}</a>}
                {data.fanpage && <a href={data.fanpage} target="_blank" rel="noreferrer" className="cd-link">{t('link_fanpage')}</a>}
                {data.group   && <a href={data.group}   target="_blank" rel="noreferrer" className="cd-link">{t('link_group')}</a>}
              </div>
            )}
          </div>

          <div className="cd-main-info">
            <div className="cd-meta-top">
              <span className="cd-org-tag">
                {getOrgLogo(data.organizer) && (
                  <img src={getOrgLogo(data.organizer)} alt={data.organizer} className="cd-org-logo" />
                )}
                {t("organizer_label")} {data.organizer}
              </span>
              <span className={`cd-status-pill ${data.status}`}>
                {data.status === 'ongoing' ? t('status_ongoing') : data.status === 'upcoming' ? t('status_upcoming') : t('status_ended')}
              </span>
            </div>
            <h1 className="cd-main-title">{data.title}</h1>
            <p className="cd-summary">{data.description}</p>
            <div className="cd-quick-details">
              {data.fee && <div className="cd-detail-item"><strong>{t('detail_fee')}</strong>{data.fee}</div>}
              {data.format && <div className="cd-detail-item"><strong>{t('detail_format')}</strong>{data.format}</div>}
              {data.regPeriod && <div className="cd-detail-item"><strong>{t('detail_regperiod')}</strong>{data.regPeriod}</div>}
              {data.eligibility && <div className="cd-detail-item cd-detail-full"><strong>{t('detail_eligibility')}</strong>{data.eligibility}</div>}
            </div>
            {(data.email || data.phone) && (
              <div className="cd-contact">
                <strong>{t('detail_contact')}:</strong>
                {data.email && <span> {data.email}</span>}
                {data.phone && <span> · {data.phone}</span>}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: TIMELINE */}
        {data.timeline?.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">{t('section_timeline')}</h2>
            <div className="cd-timeline-container">
              {data.timeline.map((step, idx) => (
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

        {/* SECTION 3: PRIZES */}
        {data.prizes?.length > 0 && (
          <section className="cd-section">
            <h2 className="cd-section-title">{t('section_prizes')}</h2>
            <div className="cd-prize-grid">
              {data.prizes.map((p, idx) => (
                <div key={idx} className="cd-prize-card">
                  <div className="cd-prize-rank">{p.rank}</div>
                  <div className="cd-prize-val">{p.value}</div>
                  <p className="cd-prize-extra">{p.extra}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: RULES */}
        {data.rules?.length > 0 && (
          <section className="cd-section">
            <div className="cd-content-block">
              <h3>{t('section_rules')}</h3>
              <ul className="cd-list">
                {data.rules.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CompetitionDetail;