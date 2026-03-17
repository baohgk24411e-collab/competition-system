import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNotifications } from '../NotificationContext'
import { useLanguage } from '../LanguageContext'
import { getOrgLogo } from '../data/orgLogos'
import './NotificationPopup.css'

const FACULTIES = [
  'Economics', 'International Economics', 'Finance and Banking',
  'Accounting and Auditing', 'Information Systems', 'Business Administration',
  'Law', 'Economic Law', 'Economic Mathematics',
]
const CATEGORIES = ['business', 'digital', 'strategy', 'marketing', 'data']
const STATUS_PARTICIPATION = ['Competitions I joined', 'Competitions I follow', 'Open for team formation']

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  return `${days} ngày trước`
}

const TYPE_ICON = {
  register:     '✅',
  follow:       '🔔',
  announcement: '📢',
  result:       '🏆',
}

export default function NotificationPopup() {
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('all')          // 'all' | 'unread'
  const [showFilter, setShowFilter] = useState(false)
  const [expandedFilter, setExpandedFilter] = useState(null) // 'time'|'faculty'|'category'|'status'
  
  // Trạng thái mở/đóng của nhóm Internal
  const [expandInternal, setExpandInternal] = useState(true)

  const [filterTime, setFilterTime] = useState({
    ongoing: false, upcoming: false, ended: false,
  })
  const [filterFaculty, setFilterFaculty] = useState({})
  const [filterCategory, setFilterCategory] = useState({})
  const [filterStatus, setFilterStatus] = useState({
    ongoing: false, upcoming: false, ended: false,
  })

  const bellRef = useRef(null)
  const popupRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      const inBell = bellRef.current && bellRef.current.contains(e.target)
      const inPopup = popupRef.current && popupRef.current.contains(e.target)
      if (!inBell && !inPopup) {
        setOpen(false)
        setShowFilter(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Apply filters
  const activeTimeKeys     = Object.keys(filterTime).filter(k => filterTime[k])
  const activeFacultyKeys  = Object.keys(filterFaculty).filter(k => filterFaculty[k])
  const activeCategoryKeys = Object.keys(filterCategory).filter(k => filterCategory[k])
  const activeStatusKeys   = Object.keys(filterStatus).filter(k => filterStatus[k])

  const filtered = notifications.filter(n => {
    if (tab === 'unread' && n.read) return false
    
    if (activeTimeKeys.length     && !activeTimeKeys.includes(n.status))   return false
    if (activeCategoryKeys.length && !activeCategoryKeys.includes(n.category)) return false
    if (activeStatusKeys.length   && !activeStatusKeys.includes(n.status)) return false

    // Logic lọc riêng cho Faculty (Xử lý tách biệt Internal và External)
    if (activeFacultyKeys.length) {
      const isExt = n.isExternal || n.faculty === 'External'
      const matchExt = activeFacultyKeys.includes('External') && isExt
      const matchInt = activeFacultyKeys.includes(n.faculty)
      if (!matchExt && !matchInt) return false
    }

    return true
  })

  const hasActiveFilter = activeTimeKeys.length || activeFacultyKeys.length ||
                          activeCategoryKeys.length || activeStatusKeys.length

  const toggleFilter = (group, key) => {
    const setters = { time: setFilterTime, faculty: setFilterFaculty, category: setFilterCategory, status: setFilterStatus }
    setters[group](prev => ({ ...prev, [key]: !prev[key] }))
  }

  const resetFilters = () => {
    setFilterTime({ ongoing: false, upcoming: false, ended: false })
    setFilterFaculty({})
    setFilterCategory({})
    setFilterStatus({ ongoing: false, upcoming: false, ended: false })
  }

  return (
    <div className="notif-wrap" ref={bellRef}>
      {/* Bell button */}
      <button
        className="hdr-icon-btn notif-bell"
        onClick={() => { setOpen(v => !v); setShowFilter(false) }}
        type="button"
      >
        {unreadCount > 0 && (
          <span className="hdr-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>

      {/* Popup */}
      {open && createPortal((
        <div className="notif-popup" ref={popupRef}>
          {/* Header */}
          <div className="notif-header">
            <span className="notif-title">Thông báo</span>
            <div className="notif-header-actions">
              {unreadCount > 0 && (
                <button className="notif-mark-all" onClick={markAllRead} title="Đánh dấu tất cả đã đọc" type="button">
                  ✓
                </button>
              )}
              <button
                className={`notif-filter-toggle ${showFilter ? 'active' : ''} ${hasActiveFilter ? 'has-filter' : ''}`}
                onClick={() => setShowFilter(v => !v)}
                title="Lọc thông báo"
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                {hasActiveFilter && <span className="notif-filter-dot"/>}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="notif-tabs">
            <button className={`notif-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')} type="button">
              Tất cả
            </button>
            <button className={`notif-tab ${tab === 'unread' ? 'active' : ''}`} onClick={() => setTab('unread')} type="button">
              Chưa đọc {unreadCount > 0 && <span className="notif-tab-badge">{unreadCount}</span>}
            </button>
          </div>

          <div className="notif-body">
            {/* Filter panel */}
            {showFilter && (
              <div className="notif-filter-panel">
                <div className="notif-filter-head">
                  <span>Bộ lọc</span>
                  {hasActiveFilter && (
                    <button className="notif-filter-reset" onClick={resetFilters} type="button">Xóa lọc</button>
                  )}
                </div>

                {/* Time */}
                <div className="notif-filter-group">
                  <button
                    className={`notif-filter-row ${expandedFilter === 'time' ? 'expanded' : ''}`}
                    onClick={() => setExpandedFilter(expandedFilter === 'time' ? null : 'time')}
                    type="button"
                  >
                    <span>⏱ Time</span>
                    <span className="notif-chevron">{expandedFilter === 'time' ? '▲' : '▼'}</span>
                  </button>
                  {expandedFilter === 'time' && (
                    <div className="notif-filter-items">
                      {[['ongoing','Ongoing (Đang diễn ra)'], ['upcoming','Upcoming (Sắp diễn ra)'], ['ended','Past Competitions']].map(([k, label]) => (
                        <label key={k} className="notif-toggle-row">
                          <span>{label}</span>
                          <input type="checkbox" className="notif-toggle"
                            checked={!!filterTime[k]} onChange={() => toggleFilter('time', k)}/>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Source & Faculty */}
                <div className="notif-filter-group">
                  <button
                    className={`notif-filter-row ${expandedFilter === 'faculty' ? 'expanded' : ''}`}
                    onClick={() => setExpandedFilter(expandedFilter === 'faculty' ? null : 'faculty')}
                    type="button"
                  >
                    <span>🏫 Source & Faculty</span>
                    <span className="notif-chevron">{expandedFilter === 'faculty' ? '▲' : '▼'}</span>
                  </button>
                  
                  {expandedFilter === 'faculty' && (
                    <div className="notif-filter-items">
                      
                      {/* --- NÚT BẤM DÀNH CHO EXTERNAL --- */}
                      <label className="notif-toggle-row" style={{ paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: '700', color: '#15427d', fontSize: '13px' }}>External</span>
                        <input type="checkbox" className="notif-toggle"
                          checked={!!filterFaculty['External']} onChange={() => toggleFilter('faculty', 'External')}/>
                      </label>

                      {/* --- HEADER CỦA INTERNAL (UEL FACULTIES) --- */}
                      <div
                        className="notif-toggle-row"
                        onClick={() => setExpandInternal(!expandInternal)}
                        style={{ paddingTop: '10px', paddingBottom: '4px', userSelect: 'none' }}
                      >
                        <span style={{ fontWeight: '800', color: '#ea580c', fontSize: '13.5px' }}>
                          Internal (UEL Faculties)
                        </span>
                        <span className="notif-chevron" style={{ padding: '4px' }}>
                          {expandInternal ? '▲' : '▼'}
                        </span>
                      </div>

                      {/* --- DANH SÁCH 9 KHOA UEL NẰM BÊN TRONG --- */}
                      {expandInternal && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px', marginTop: '4px' }}>
                          {FACULTIES.map(f => (
                            <label key={f} className="notif-toggle-row">
                              <span style={{ fontSize: '12.5px', color: '#4b5563' }}>{f}</span>
                              <input type="checkbox" className="notif-toggle"
                                checked={!!filterFaculty[f]} onChange={() => toggleFilter('faculty', f)}/>
                            </label>
                          ))}
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="notif-filter-group">
                  <button
                    className={`notif-filter-row ${expandedFilter === 'category' ? 'expanded' : ''}`}
                    onClick={() => setExpandedFilter(expandedFilter === 'category' ? null : 'category')}
                    type="button"
                  >
                    <span>🗂 Category</span>
                    <span className="notif-chevron">{expandedFilter === 'category' ? '▲' : '▼'}</span>
                  </button>
                  {expandedFilter === 'category' && (
                    <div className="notif-filter-items">
                      {CATEGORIES.map(c => (
                        <label key={c} className="notif-toggle-row">
                          <span>{c[0].toUpperCase() + c.slice(1)}</span>
                          <input type="checkbox" className="notif-toggle"
                            checked={!!filterCategory[c]} onChange={() => toggleFilter('category', c)}/>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Participation */}
                <div className="notif-filter-group">
                  <button
                    className={`notif-filter-row ${expandedFilter === 'status' ? 'expanded' : ''}`}
                    onClick={() => setExpandedFilter(expandedFilter === 'status' ? null : 'status')}
                    type="button"
                  >
                    <span>📋 Status Participation</span>
                    <span className="notif-chevron">{expandedFilter === 'status' ? '▲' : '▼'}</span>
                  </button>
                  {expandedFilter === 'status' && (
                    <div className="notif-filter-items">
                      {STATUS_PARTICIPATION.map(s => (
                        <label key={s} className="notif-toggle-row">
                          <span>{s[0].toUpperCase() + s.slice(1)}</span>
                          <input type="checkbox" className="notif-toggle"
                            checked={!!filterStatus[s]} onChange={() => toggleFilter('status', s)}/>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notification list */}
            <div className="notif-list">
              {filtered.length === 0 ? (
                <div className="notif-empty">
                  <p>Không có thông báo nào.</p>
                </div>
              ) : (
                filtered.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-avatar">
                      {getOrgLogo(n.org)
                        ? <img src={getOrgLogo(n.org)} alt={n.org} className="notif-org-logo" />
                        : <span>{TYPE_ICON[n.type] || '🔔'}</span>
                      }
                    </div>
                    <div className="notif-content">
                      <p className="notif-text">
                        <strong>[{n.org.toUpperCase()}]</strong> {n.message}
                      </p>
                      <span className="notif-time">{timeAgo(n.timestamp)}</span>
                    </div>
                    {!n.read && <span className="notif-dot"/>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="notif-footer">
            <button className="notif-see-all" type="button">Xem tất cả thông báo</button>
          </div>
        </div>
      ), document.body)}
    </div>
  )
}