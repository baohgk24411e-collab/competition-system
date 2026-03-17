import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/usersdata";
import { COMPETITIONS_DATA } from "../../data/competitionsData";
import { useNotifications } from "../../NotificationContext";
import { useLanguage } from "../../LanguageContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UnionReports from "./UnionReports";
import "./UnionDashboard.css";

/* ── Seed mock submissions ── */
const STATUSES_SEED = ["pending","pending","approved","rejected","published","pending","approved","approved","published"];
const MOCK_EVENTS = COMPETITIONS_DATA.map((c, i) => ({
  id:            100000 + c.id,
  competitionId: c.id,
  title:         c.title,
  organizer:     c.organizer,
  submittedDate: `${String(3 + (i % 5)).padStart(2,"0")}/0${1 + (i % 3)}/2026`,
  status:        STATUSES_SEED[i % STATUSES_SEED.length],
  description:   c.description,
  poster:        c.poster || c.image,
  fee:           c.fee,
  format:        c.format,
  timeline:      c.timeline,
  prizes:        c.prizes,
  rules:         c.rules,
}));

const STATUS_META = {
  pending:   { label: "Pending",   cls: "s-pending"  },
  approved:  { label: "Approved",  cls: "s-approved" },
  rejected:  { label: "Rejected",  cls: "s-rejected" },
  published: { label: "Published", cls: "s-published"},
};

const PAGE_SIZE = 8;

const NAV_TABS = [
  { key: "events",     label: "Event Approval Management" },
  { key: "participate",label: "Participation Management" },
  { key: "reports",    label: "Reports" },
];

export default function UnionDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const stored   = JSON.parse(localStorage.getItem("uel_auth_user") || "null");
  const liveUser = users.find((u) => u.id === stored?.id) || stored;
  if (!liveUser) { navigate("/login"); return null; }

  const [activeNav, setActiveNav] = useState("events");
  const [events, setEvents]             = useState(MOCK_EVENTS);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage]                 = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* modal: null | "confirm-approve" | "approve-success" | "reject-form" | "reject-success" */
  const [modal, setModal]               = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSuggestion, setRejectSuggestion] = useState("");

  /* ── Filtered + paginated ── */
  const filtered = useMemo(() =>
    filterStatus === "all" ? events : events.filter(e => e.status === filterStatus),
    [events, filterStatus]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSlice  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Helpers ── */
  const openDetail  = (ev) => setSelectedEvent(ev);
  const closeDetail = () => setSelectedEvent(null);
  const closeModal  = () => { setModal(null); setRejectReason(""); setRejectSuggestion(""); };

  const doApprove = () => {
    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, status: "approved" } : e));
    setSelectedEvent(prev => ({ ...prev, status: "approved" }));
    /* ── Push notification to organizer ── */
    addNotification({
      org:      "Union Office",
      title:    selectedEvent.title,
      message:  `✅ Sự kiện "${selectedEvent.title}" đã được Văn phòng Đoàn phê duyệt. Thông tin sự kiện sẽ sớm được đăng lên hệ thống.`,
      type:     "approval",
      category: "system",
      status:   "approved",
    });
    setModal("approve-success");
  };

  const doReject = () => {
    if (!rejectReason.trim()) return;
    setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, status: "rejected" } : e));
    setSelectedEvent(prev => ({ ...prev, status: "rejected" }));
    /* ── Push rejection notification ── */
    addNotification({
      org:      "Union Office",
      title:    selectedEvent.title,
      message:  `❌ Sự kiện "${selectedEvent.title}" đã bị từ chối. Lý do: ${rejectReason}${rejectSuggestion ? ". Góp ý: " + rejectSuggestion : ""}`,
      type:     "rejection",
      category: "system",
      status:   "rejected",
    });
    setModal("reject-success");
  };

  return (
    <div className="union-page">
      <div className="union-bg-blur" />
      <Header />

      {/* ── TOP NAV TABS ── */}
      <div className="union-nav-tabs">
        {NAV_TABS.map(tab => (
          <button
            key={tab.key}
            className={`union-nav-tab ${activeNav === tab.key ? "active" : ""}`}
            onClick={() => setActiveNav(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="union-main">

        {/* ── REPORTS TAB ── */}
        {activeNav === "reports" && <UnionReports />}

        {/* ── PARTICIPATION TAB (placeholder) ── */}
        {activeNav === "participate" && (
          <div className="union-placeholder">
            <span>📋</span>
            <p>Participation Management — coming soon.</p>
          </div>
        )}

        {/* ── EVENTS LIST TAB ── */}
        {activeNav === "events" && (<>

          {/* ── HEADER ROW ── */}
          <div className="union-header-row">
            <h1 className="union-title">EVENTS LIST</h1>
            <div className="union-filter-row">
              <span className="union-filter-label">Filter by status:</span>
              {["all","pending","approved","rejected","published"].map(s => (
                <button
                  key={s}
                  className={`union-filter-btn ${filterStatus === s ? "active" : ""}`}
                  onClick={() => { setFilterStatus(s); setPage(1); }}
                >
                  {s === "all" ? "All" : STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="union-table-wrap">
            <table className="union-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>ID</th>
                  <th>Title</th>
                  <th>Organizer</th>
                  <th>Submission Date ▼</th>
                  <th style={{ width: 110 }}>Status ▼</th>
                  <th style={{ width: 200 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageSlice.map(ev => (
                  <tr key={ev.id}>
                    <td className="td-id">{ev.id}</td>

                    {/* Clickable title */}
                    <td
                      className="td-title td-clickable"
                      onClick={() => openDetail(ev)}
                      title="Click to view details"
                    >
                      {ev.title}
                    </td>

                    <td>{ev.organizer}</td>
                    <td>{ev.submittedDate}</td>
                    <td>
                      <span className={`union-badge ${STATUS_META[ev.status].cls}`}>
                        {STATUS_META[ev.status].label}
                      </span>
                    </td>

                    {/* Actions column */}
                    <td className="td-actions">
                      <button className="act-view" onClick={() => openDetail(ev)}>
                        View Detail
                      </button>
                      {ev.status === "pending" && (
                        <div className="act-pending-btns">
                          <button className="act-approve"
                            onClick={() => { setSelectedEvent(ev); setModal("confirm-approve"); }}>
                            Approve
                          </button>
                          <button className="act-reject"
                            onClick={() => { setSelectedEvent(ev); setModal("reject-form"); }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div className="union-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`union-page-btn ${page === p ? "active" : ""}`}
                onClick={() => setPage(p)}>{p}</button>
            ))}
            {page < totalPages && (
              <button className="union-page-btn"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}>›››</button>
            )}
          </div>

        </>)}

      </main>

      {/* ════ EVENT DETAIL PANEL ════ */}
      {selectedEvent && !modal && (
        <div className="union-detail-overlay" onClick={closeDetail}>
          <div className="union-detail-panel" onClick={e => e.stopPropagation()}>

            <div className="union-detail-header">
              <h2 className="union-detail-heading">EVENT DETAIL VIEW</h2>
              <div className="union-detail-hdr-right">
                {selectedEvent.status === "pending" && (
                  <>
                    <button className="detail-approve-btn"
                      onClick={() => setModal("confirm-approve")}>✓ Approve</button>
                    <button className="detail-reject-btn"
                      onClick={() => setModal("reject-form")}>✕ Reject</button>
                  </>
                )}
                <button className="union-close-btn" onClick={closeDetail}>✕</button>
              </div>
            </div>

            <div className="union-detail-body">
              <div className="union-detail-org-row">
                <div className="union-detail-org-avatar">
                  {selectedEvent.organizer?.charAt(0) ?? "O"}
                </div>
                <span className="union-detail-org-name">{selectedEvent.organizer}</span>
              </div>

              <div className="union-detail-content">
                {selectedEvent.poster && (
                  <div className="union-detail-poster">
                    <img src={selectedEvent.poster} alt={selectedEvent.title}
                      onError={e => { e.target.style.display = "none"; }} />
                  </div>
                )}
                <div className="union-detail-info">
                  <h3 className="union-detail-title">{selectedEvent.title}</h3>
                  <p className="union-detail-desc">{selectedEvent.description}</p>
                  {selectedEvent.fee    && <p><strong>💰 Fee:</strong> {selectedEvent.fee}</p>}
                  {selectedEvent.format && <p><strong>👥 Format:</strong> {selectedEvent.format}</p>}
                </div>
              </div>

              {selectedEvent.timeline?.length > 0 && (
                <div className="union-detail-section">
                  <h4 className="union-section-label">THE COMPETITION JOURNEY</h4>
                  {selectedEvent.timeline.map((tl, i) => (
                    <div key={i} className="union-timeline-item">
                      <span className="union-tl-dot" />
                      <div>
                        <strong>{tl.phase}</strong>
                        <span className="union-tl-date"> ({tl.date})</span>
                        {tl.desc && <p style={{ margin: "4px 0 0", fontSize: 13 }}>{tl.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedEvent.prizes?.length > 0 && (
                <div className="union-detail-section">
                  <h4 className="union-section-label">PRIZE STRUCTURE</h4>
                  {selectedEvent.prizes.map((p, i) => (
                    <p key={i} style={{ fontSize: 13, margin: "4px 0" }}>
                      • <strong>{p.rank}:</strong> {p.value} — {p.extra}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════ MODALS ════ */}

      {modal === "confirm-approve" && (
        <div className="union-modal-overlay">
          <div className="union-modal">
            <button className="union-modal-close" onClick={closeModal}>✕</button>
            <h3 className="union-modal-title orange">CONFIRM APPROVAL</h3>
            <p className="union-modal-sub">Are you sure you want to approve this event?</p>
            <p className="union-modal-sub">The event will be published on the system and visible to students.</p>
            <div className="union-modal-actions">
              <button className="um-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="um-btn approve" onClick={doApprove}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {modal === "approve-success" && (
        <div className="union-modal-overlay">
          <div className="union-modal">
            <button className="union-modal-close" onClick={closeModal}>✕</button>
            <div className="um-icon-success">✓</div>
            <h3 className="union-modal-title orange">APPROVAL SUCCESSFUL</h3>
            <p className="union-modal-sub">Event has been approved and a notification has been sent to the organizer.</p>
            <div className="union-modal-actions">
              <button className="um-btn cancel" onClick={() => { closeModal(); closeDetail(); }}>Back to homepage</button>
            </div>
          </div>
        </div>
      )}

      {modal === "reject-form" && (
        <div className="union-modal-overlay">
          <div className="union-modal wide">
            <button className="union-modal-close" onClick={closeModal}>✕</button>
            <h3 className="union-modal-title orange">REJECT EVENT</h3>
            <div className="um-form">
              <div className="um-field">
                <label>Rejection Reason *</label>
                <input className="um-input" placeholder="Missing details for timeline, etc."
                  value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              </div>
              <div className="um-field">
                <label>Suggestions for Revision</label>
                <textarea className="um-textarea" rows={5}
                  placeholder="Please provide a more detailed event timeline including the schedule of each competition round, submission deadlines, evaluation periods, winner announcement dates…"
                  value={rejectSuggestion} onChange={e => setRejectSuggestion(e.target.value)} />
              </div>
            </div>
            <div className="union-modal-actions">
              <button className="um-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="um-btn" style={{ background: "#2196f3", color: "#fff" }}
                onClick={doReject}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {modal === "reject-success" && (
        <div className="union-modal-overlay">
          <div className="union-modal">
            <button className="union-modal-close" onClick={closeModal}>✕</button>
            <div className="um-icon-success">✓</div>
            <h3 className="union-modal-title orange">EVENT REJECTED</h3>
            <p className="union-modal-sub">Feedback has been sent to the organizer via notification.</p>
            <div className="union-modal-actions">
              <button className="um-btn cancel" onClick={() => { closeModal(); closeDetail(); }}>Back to homepage</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
