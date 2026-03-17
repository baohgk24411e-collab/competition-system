import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { getOrgLogo } from './data/orgLogos';
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Conference.css';

import { CONFERENCES_DATA } from './data/conferencesData';

const CATEGORIES = ['all', 'business', 'digital', 'marketing', 'data', 'skill', 'strategy', 'tech'];
const STATUSES   = ['all', 'ongoing', 'upcoming', 'ended'];

const HERO_SLIDES = [
  { img: '/HT_ICBF.png' },
  { img: '/HT_ICOB.png' },
  { img: '/HT_KH.jpg' },
  { img: '/HT_NHHN.jpg' },
  { img: '/HT_UEH.png' }
];

function HeroBanner() {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);

  const reset = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur(c => (c + 1) % HERO_SLIDES.length), 4500);
  }, []);

  useEffect(() => { 
    reset(); 
    return () => clearInterval(timer.current);
  }, [reset]);

  const go = (n) => { 
    setCur((n + HERO_SLIDES.length) % HERO_SLIDES.length); 
    reset(); 
  };

  return (
    <div className="conf-hero">
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className={`conf-hero-slide ${i === cur ? 'active' : ''}`}>
          <div className="conf-hero-bg-blurry" style={{ backgroundImage: `url(${s.img})` }}></div>
          <img src={s.img} alt={`Banner ${i}`} className="conf-hero-img-main" />
        </div>
      ))}
      <button className="conf-hero-btn prev" onClick={() => go(cur - 1)}>&#10094;</button>
      <button className="conf-hero-btn next" onClick={() => go(cur + 1)}>&#10095;</button>
      <div className="conf-hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`conf-dot ${i === cur ? 'active' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

function ConferenceCoverflow({ items, onSelect }) {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();
  const n = items.length;
  const touchX = useRef(null);

  const getOff = (idx) => {
    let d = ((idx - active) % n + n) % n;
    if (d > Math.floor(n / 2)) d -= n;
    return d;
  };

  const shift = (dir) => setActive(a => (a + dir + n) % n);
  
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) shift(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const slots = items
    .map((conf, idx) => ({ conf, idx, off: getOff(idx) }))
    .filter(x => Math.abs(x.off) <= 2)
    .sort((a, b) => Math.abs(b.off) - Math.abs(a.off));

  return (
    <div className="hz-3d-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="hz-3d-stage">
        {slots.map(({ conf, idx, off }) => {
          const abs = Math.abs(off);
          const isCenter = off === 0;
          const sign = off > 0 ? 'pos' : 'neg';
          const posClass = off !== 0 ? `hz-off-${sign}-${abs}` : '';

          return (
            <div key={conf.id}
              className={`hz-3d-card hz-abs-${abs} ${posClass}`}
              onClick={() => isCenter ? onSelect(conf) : setActive(idx)}>
              
              <div className="hz-card-inner">
                <div className="hz-poster-wrap">
                  <img src={conf.poster} alt={conf.title} className="hz-poster" draggable={false} loading="lazy" />
                  <div className="hz-badges">
                    <span className={`cf-source-badge ${conf.isExternal ? 'ext' : 'uel'}`}>
                      {conf.isExternal ? t('badge_external') : t('badge_internal')}
                    </span>
                    <span className={`cf-status-badge ${conf.status}`}>
                      {conf.status === 'ongoing' ? t('status_badge_ongoing') : conf.status === 'upcoming' ? t('status_badge_upcoming') : t('status_badge_ended')}
                    </span>
                  </div>
                </div>
                
                <div className="hz-info">
                  <p className="hz-org">
                    {getOrgLogo(conf.organizer) && <img src={getOrgLogo(conf.organizer)} alt={conf.organizer} className="hz-logo" />}
                    {conf.organizer}
                  </p>
                  <h3 className="hz-title">{conf.title}</h3>
                  <div className="hz-meta">
                    <span>📅 {conf.startDate}</span>
                    <span>📍 {conf.location}</span>
                  </div>
                  {isCenter && (
                    <button className="hz-detail-btn">{t('modal_view_detail')}</button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <button className="hz-arrow left" onClick={() => shift(-1)}>&#10094;</button>
      <button className="hz-arrow right" onClick={() => shift(1)}>&#10095;</button>

      <div className="hz-pill-dots">
        {items.map((_, i) => (
          <button key={i} className={`pill-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
}

export default function Conference() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [search,   setSearch]   = useState('');
  const [filterOn, setFilterOn] = useState(false);
  const [cat,      setCat]      = useState('all');
  const [status,   setStatus]   = useState('all');
  const [source,   setSource]   = useState('all');
  const [modal,    setModal]    = useState(null);

  const filtered = CONFERENCES_DATA.filter(c => {
    const q = search.trim().toLowerCase();
    return (cat    === 'all' || c.category === cat)
        && (status === 'all' || c.status   === status)
        && (source === 'all' || (source === 'external' ? c.isExternal : !c.isExternal))
        && (!q || c.title.toLowerCase().includes(q) || (c.organizer && c.organizer.toLowerCase().includes(q)));
  });

  return (
    <>
      <Header />
      <HeroBanner />
      
      <section className="competitions-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="cf-bg" style={{ backgroundImage: "url('/uel-bg.jpg')" }} />
        <div className="cf-overlay" />

        <div className="search-section">
          <div className="search-row">
            <div className="search-box">
              <input type="text" placeholder={t("search_conf_placeholder")}
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="search-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
            <button className={`filter-btn ${filterOn ? 'on' : ''}`} onClick={() => setFilterOn(v => !v)}>
              {t('filter_btn')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
          </div>

          {filterOn && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>{t('filter_category')}</label>
                <div className="tags">
                  {CATEGORIES.map(c => (
                    <button key={c} className={`tag ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                      {c === 'all' ? t('filter_all') : t('cat_' + c) || (c[0].toUpperCase() + c.slice(1))}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>{t('filter_status')}</label>
                <div className="tags">
                  {STATUSES.map(s => (
                    <button key={s} className={`tag ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
                      {s === 'all' ? t('filter_all') : s === 'ongoing' ? t('filter_ongoing') : s === 'upcoming' ? t('filter_upcoming') : t('filter_ended')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>{t('filter_source')}</label>
                <div className="tags">
                  <button className={`tag ${source === 'all' ? 'active' : ''}`} onClick={() => setSource('all')}>{t('filter_all')}</button>
                  <button className={`tag tag-uel ${source === 'uel' ? 'active' : ''}`} onClick={() => setSource('uel')}>{t('filter_internal')}</button>
                  <button className={`tag tag-ext ${source === 'external' ? 'active' : ''}`} onClick={() => setSource('external')}>{t('filter_external')}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, paddingBottom: '40px' }}>
          {filtered.length > 0
            ? <ConferenceCoverflow items={filtered} onSelect={setModal} />
            : <div className="empty-state"><p>{t('no_results')}</p></div>
          }
        </div>
      </section>

      {modal && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className={`modal-box ${modal.isExternal ? 'modal-box--ext' : ''}`} onClick={e => e.stopPropagation()}>
            {modal.poster && <img src={modal.poster} alt={modal.title} className="modal-cover" />}
            <div className="modal-body">
              <div className="modal-badges">
                <span className={`badge badge-${modal.status}`}>
                    {modal.status === 'ongoing' ? t('status_badge_ongoing') : modal.status === 'upcoming' ? t('status_badge_upcoming') : t('status_badge_ended')}
                </span>
                <span className={`badge ${modal.isExternal ? 'badge-ext' : 'badge-uel'}`}>
                  {modal.isExternal ? t('filter_external') : t('filter_internal')}
                </span>
              </div>

              <h2>{modal.title}</h2>
              <p className="modal-org">{modal.organizer}</p>
              <div className="modal-meta">
                <span>📅 {modal.startDate}</span>
                {modal.location && <span>📍 {modal.location}</span>}
              </div>
              <button className="modal-detail-btn"
                onClick={() => { setModal(null); navigate(`/conference/${modal.id}`); }}>
                {t('modal_view_detail')}
              </button>
            </div>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}s