import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import biImg       from '/BI.jpg'
import dcImg       from '/digital_creatory.jpg'
import scImg       from '/S challenge.jpg'
import aiImg       from '/AI_in_Business.jpg'
import erpImg      from '/ERPSIM.jpg'
import attackerImg from '/Attacker.jpg'
import feseImg     from '/FESE.jpg'
import wapaImg     from '/WAPA.jpg'
import sysImg      from '/Sail_Your_Ship.jpg'
import MarHive     from '/MArHive.jpg'
import CMO         from '/CMO.jpg'
import FTUDA       from '/FTU_DA.jpg'
import { useLanguage } from './LanguageContext';
import { getOrgLogo } from './data/orgLogos';
import Header from "./components/Header";
import Footer from "./components/Footer";
import './Competition.css'

const COMPETITIONS = [
  { id: 1,  title: 'Digital Creatory 2026 | Beyond the Limits',           org: 'Marketing UEL Club',          orgIcon: '📱', category: 'digital',   status: 'ongoing',  img: dcImg,       date: '12.3 – 31.3.2026',    location: 'UEL, HCMC', rounds: 4,    isExternal: false },
  { id: 2,  title: 'Business Intelligence Season 9 – Eternal Monarch',    org: 'ITB Club',                    orgIcon: '📊', category: 'business',  status: 'ended',    img: biImg,       date: '02.08.2025',          location: 'UEL, HCMC', rounds: 3,    isExternal: false },
  { id: 3,  title: 'Schallenge XIII – Emerald Circulation',               org: 'International Business Club', orgIcon: '🌐', category: 'strategy',  status: 'ended',    img: scImg,       date: '11.10 – 16.11',      location: null,        rounds: 4,    isExternal: false },
  { id: 4,  title: 'AI in Business Mùa 2 – Applied AI for User Growth',   org: 'AI4I Club UEL',               orgIcon: '🤖', category: 'digital',   status: 'ongoing',  img: aiImg,       date: '16.3 – 25.5.2025',   location: 'UEL, HCMC', rounds: 3,    isExternal: false },
  { id: 5,  title: 'Vietnam SAP ERPSim Student Competition 2024',         org: 'IS Times – HTTT UEL',         orgIcon: '💻', category: 'business',  status: 'ended',    img: erpImg,      date: '27.10 – 16.11.2024', location: 'UEL, HCMC', rounds: 2,    isExternal: false },
  { id: 6,  title: 'Attacker Competition',                                org: 'FinTech Club',                orgIcon: '🎯', category: 'digital',   status: 'ended',    img: attackerImg, date: '2023',               location: 'UEL',       rounds: null, isExternal: false },
  { id: 7,  title: 'FESE Competition',                                    org: 'FESE Club',                   orgIcon: '📈', category: 'business',  status: 'ended',    img: feseImg,     date: '2023',               location: 'UEL',       rounds: null, isExternal: false },
  { id: 8,  title: 'WAPA Competition',                                    org: 'WAPA',                        orgIcon: '📚', category: 'strategy',  status: 'ended',    img: wapaImg,     date: '2022',               location: 'UEL',       rounds: null, isExternal: false },
  { id: 9,  title: 'Sail Your Ship',                                      org: 'ESC Club',                    orgIcon: '⛵', category: 'business',  status: 'ended',    img: sysImg,      date: '2021',               location: 'UEL',       rounds: null, isExternal: false },
  { id: 11, title: 'Marketing Hive',                                      org: 'Marketing Hive',              orgIcon: '🐝', category: 'marketing', status: 'ended',    img: MarHive,     date: '2025',               location: 'HN',        rounds: null, isExternal: true  },
  { id: 12, title: 'CMO Think and Action',                                org: 'UEH',                         orgIcon: '📣', category: 'marketing', status: 'ended',    img: CMO,         date: '2025',               location: 'UEH',       rounds: null, isExternal: true  },
  { id: 13, title: 'DAZONE – Cuộc thi phân tích dữ liệu',                org: 'FTU',                         orgIcon: '📊', category: 'data',      status: 'ended',    img: FTUDA,       date: '2025',               location: 'FTU',       rounds: null, isExternal: true  },
]

const HERO_SLIDES = [
  { img: '/Digital_creatory_ngang.jpg' },
  { img: '/S_challenge_ngang.jpg' },
  { img: '/Sail_Your_Ship_ngang.jpg' },
  { img: '/ERPSIM_ngang.jpg' },
  { img: '/AI_in_Business_ngang.jpg' },
  { img: '/BI_ngang.jpg' },
  { img: '/MarHive_ngang.jpg' },
  { img: '/RMIT_BA.jpg' },
  { img: '/Attacker_ngang.jpg' },
  { img: '/CMO_ngang.jpg' },
  { img: '/FTU_DA_ngang.jpg' },
]

const CATEGORIES = ['all', 'business', 'digital', 'strategy', 'marketing', 'data']
const STATUSES   = ['all', 'ongoing', 'upcoming', 'ended']

function daysUntil(isoDate) {
  if (!isoDate) return null
  const target = new Date(isoDate)
  if (Number.isNaN(target.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getDisplayStatus(comp) {
  // comp.status: 'ongoing' | 'upcoming' | 'ended'
  if (comp.status === 'upcoming') {
    const d = daysUntil(comp.startDate)
    if (d !== null && d >= 0 && d <= 3) return 'soon'
    return 'upcoming'
  }
  return comp.status
}


function HeroBanner() {
  const [cur, setCur] = useState(0)
  const timer = useRef(null)
  const reset = useCallback(() => {
    clearInterval(timer.current)
    timer.current = setInterval(() => setCur(c => (c + 1) % HERO_SLIDES.length), 4500)
  }, [])
  useEffect(() => { reset(); return () => clearInterval(timer.current) }, [reset])
  const go = (n) => { setCur((n + HERO_SLIDES.length) % HERO_SLIDES.length); reset() }

  return (
    <div className="hero-banner">
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className={`hero-slide ${i === cur ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.img})` }} />
      ))}
      <button className="hero-btn prev" onClick={() => go(cur - 1)}>&#10094;</button>
      <button className="hero-btn next" onClick={() => go(cur + 1)}>&#10095;</button>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`dot ${i === cur ? 'active' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

function CoverflowCarousel({ items, onSelect }) {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const n = items.length
  const touchX = useRef(null)

  const getOff = (idx) => {
    let d = ((idx - active) % n + n) % n
    if (d > Math.floor(n / 2)) d -= n
    return d
  }

  const shift = (dir) => setActive(a => (a + dir + n) % n)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) shift(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const slots = items
    .map((comp, idx) => ({ comp, idx, off: getOff(idx) }))
    .filter(x => Math.abs(x.off) <= 2)
    .sort((a, b) => Math.abs(b.off) - Math.abs(a.off))

  return (
    <div className="cf-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="cf-stage">
        {slots.map(({ comp, idx, off }) => {
          const abs = Math.abs(off)
          const isCenter = off === 0
          const sign = off > 0 ? 'pos' : 'neg'
          const posClass = off !== 0 ? `off-${sign}-${abs}` : ''
          const ds = getDisplayStatus(comp)
          const statusLabelKey =
            ds === 'ongoing' ? 'status_badge_ongoing'
            : ds === 'ended' ? 'status_badge_ended'
            : ds === 'soon' ? 'status_badge_soon'
            : 'status_badge_upcoming'

          return (
            <div key={comp.id}
              className={`cf-card abs-${abs} ${posClass}`}
              onClick={() => isCenter ? onSelect(comp) : setActive(idx)}>
              <div className="cf-frame">
                <div className="cf-poster-wrap">
                  {comp.img && <div className="cf-poster-blur" style={{ backgroundImage: `url(${comp.img})` }} />}
                  {comp.img
                    ? <img src={comp.img} alt={comp.title} className="cf-poster" draggable={false} />
                    : <div className="cf-poster cf-empty-poster"><span>🏆</span><p>Coming Soon</p></div>
                  }
                </div>
                {/* Badges */}
                <div className="cf-badges">
                  <span className={`cf-source-badge ${comp.isExternal ? 'ext' : 'uel'}`}>
                    {comp.isExternal ? t('badge_external') : t('badge_internal')}
                  </span>
                  <span className={`cf-status-badge ${ds}`}>
                    {t(statusLabelKey)}
                  </span>
                </div>
                {isCenter && (
                  <div className="cf-info">
                    <p className="cf-title">{comp.title}</p>
                    <div className="cf-org">
                      {getOrgLogo(comp.org) && (
                        <img src={getOrgLogo(comp.org)} alt={comp.org} className="cf-logo" />
                      )}
                      <strong>{comp.org}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <button className="cf-arrow left"  onClick={() => shift(-1)}>&#10094;</button>
      <button className="cf-arrow right" onClick={() => shift(1)}>&#10095;</button>
      <div className="cf-dots">
        {items.map((_, i) => (
          <button key={i} className={`cf-dot ${i === active ? 'on' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [search,   setSearch]   = useState('')
  const [filterOn, setFilterOn] = useState(false)
  const [cat,      setCat]      = useState('all')
  const [status,   setStatus]   = useState('all')
  const [source,   setSource]   = useState('all')
  const [modal,    setModal]    = useState(null)

  const filtered = COMPETITIONS.filter(c => {
    const q = search.trim().toLowerCase()
    return (cat    === 'all' || c.category === cat)
        && (status === 'all' || c.status   === status)
        && (source === 'all' || (source === 'external' ? c.isExternal : !c.isExternal))
        && (!q || c.title.toLowerCase().includes(q) || c.org.toLowerCase().includes(q))
  })

  return (
    <>
      <Header />
      <HeroBanner />

      <section className="competitions-section">
        <div className="cf-bg" style={{ backgroundImage: "url('/uel-bg.jpg')" }} />
        <div className="cf-overlay" />

        <div className="search-section">
          <div className="search-row">
            <div className="search-box">
              <input type="text" placeholder={t("search_placeholder")}
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="search-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
            <button className={`filter-btn ${filterOn ? 'on' : ''}`} onClick={() => setFilterOn(v => !v)}>
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

        {filtered.length > 0
          ? <CoverflowCarousel items={filtered} onSelect={setModal} />
          : <div className="empty-state"><p>{t('no_results')}</p></div>
        }
      </section>

      {modal && (
        <div className="modal-mask" onClick={() => setModal(null)}>
          <div className={`modal-box ${modal.isExternal ? 'modal-box--ext' : ''}`} onClick={e => e.stopPropagation()}>
            {modal.img && <img src={modal.img} alt={modal.title} className="modal-cover" />}
            <div className="modal-body">
              <div className="modal-badges">
                <span className={`badge badge-${modal.status}`}>{modal.status}</span>
                <span className={`badge ${modal.isExternal ? 'badge-ext' : 'badge-uel'}`}>
                  {modal.isExternal ? t('filter_external') : t('filter_internal')}
                </span>
              </div>
              <h2>{modal.title}</h2>
              <p className="modal-org">{modal.org}</p>
              <div className="modal-meta">
                <span>📅 {modal.date}</span>
                {modal.location && <span>📍 {modal.location}</span>}
                {modal.rounds   && <span>🏆 {modal.rounds} Rounds</span>}
              </div>
              <button className="modal-detail-btn"
                onClick={() => { setModal(null); navigate(`/competition/${modal.id}`) }}>
                Xem chi tiết đầy đủ →
              </button>
            </div>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}