import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RESOURCES, RESOURCE_CATEGORIES, FILE_TYPE_CONFIG } from "../data/resourcesdata";
import "./ResourcesPage.css";

/* ── Helpers ── */
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 86400) return "Hôm nay";
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function Avatar({ name, size = 36 }) {
  const initials = name?.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase() || "?";
  const colors = ["#1a3a6b","#e67e22","#16a34a","#9333ea","#dc2626","#0891b2"];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

const LS_LIKES      = "resources_likes_v1";
const LS_BOOKMARKS  = "resources_bookmarks_v1";
const LS_UPLOADS    = "resources_uploads_v1";

function loadLikes()     { try { return JSON.parse(localStorage.getItem(LS_LIKES))     || {}; } catch { return {}; } }
function loadBookmarks() { try { return JSON.parse(localStorage.getItem(LS_BOOKMARKS)) || {}; } catch { return {}; } }
function loadUploads()   { try { return JSON.parse(localStorage.getItem(LS_UPLOADS))   || []; } catch { return []; } }

/* ── File type badge ── */
function FileTypeBadge({ type }) {
  const cfg = FILE_TYPE_CONFIG[type] || { label: type?.toUpperCase(), color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span className="file-type-badge" style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

/* ── Resource Card ── */
function ResourceCard({ res, liked, bookmarked, onLike, onBookmark, onView }) {
  return (
    <div className="res-card" onClick={onView}>
      {/* Thumbnail */}
      <div className="res-card-thumb">
        {res.image
          ? <img src={res.image} alt={res.title}/>
          : <div className="res-thumb-placeholder">
              {res.type === "paper" ? "🔬" : res.type === "guide" ? "🏆" : "📖"}
            </div>
        }
        <FileTypeBadge type={res.fileType}/>
      </div>

      {/* Body */}
      <div className="res-card-body">
        <div className="res-card-meta">
          <span className="res-category-tag">
            {RESOURCE_CATEGORIES.find((c) => c.id === res.category)?.label || res.category}
          </span>
          <span className="res-year">{res.year}</span>
        </div>

        <h3 className="res-card-title">{res.title}</h3>
        <p className="res-card-author">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {res.author}
        </p>
        <p className="res-card-abstract">{res.abstract}</p>

        <div className="res-card-tags">
          {res.tags.slice(0,3).map((t) => <span key={t} className="res-tag">#{t}</span>)}
        </div>

        <div className="res-card-footer">
          <div className="res-card-stats">
            <span>⬇ {res.downloads.toLocaleString()}</span>
            <span>· {res.fileSize}</span>
          </div>
          <div className="res-card-actions" onClick={(e) => e.stopPropagation()}>
            <button className={`res-action-btn ${liked?"active":""}`} onClick={onLike} title="Thích">
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked?"currentColor":"none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {res.likes + (liked ? 1 : 0)}
            </button>
            <button className={`res-action-btn ${bookmarked?"active bookmark":""}`} onClick={onBookmark} title="Lưu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked?"currentColor":"none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Resource Detail Modal ── */
function ResourceModal({ res, liked, bookmarked, onLike, onBookmark, onClose }) {
  const relatedItems = RESOURCES.filter((r) =>
    r.id !== res.id && r.tags.some((t) => res.tags.includes(t))
  ).slice(0,3);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="res-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="res-modal-header">
          <div className="res-modal-thumb">
            {res.image
              ? <img src={res.image} alt={res.title}/>
              : <div className="res-modal-thumb-placeholder">
                  <span style={{ fontSize: 48 }}>
                    {res.type === "paper" ? "🔬" : res.type === "guide" ? "🏆" : "📖"}
                  </span>
                </div>
            }
          </div>
          <div className="res-modal-info">
            <div className="res-modal-badges">
              <span className="res-category-tag">
                {RESOURCE_CATEGORIES.find((c) => c.id === res.category)?.label}
              </span>
              <FileTypeBadge type={res.fileType}/>
            </div>
            <h2 className="res-modal-title">{res.title}</h2>
            <p className="res-modal-author">
              <Avatar name={res.author} size={28}/>
              <span>{res.author}</span>
              <span className="res-modal-faculty">· {res.faculty}</span>
            </p>
            <div className="res-modal-stats">
              <span>⬇ {res.downloads.toLocaleString()} lượt tải</span>
              <span>·</span>
              <span>❤ {res.likes + (liked?1:0)} lượt thích</span>
              <span>·</span>
              <span>📁 {res.fileSize}</span>
              <span>·</span>
              <span>🕐 {timeAgo(res.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Abstract */}
        <div className="res-modal-body">
          <h3 className="res-modal-section-title">Tóm tắt</h3>
          <p className="res-modal-abstract">{res.abstract}</p>

          <div className="res-card-tags" style={{ marginBottom: 20 }}>
            {res.tags.map((t) => <span key={t} className="res-tag">#{t}</span>)}
          </div>

          {/* Action buttons */}
          <div className="res-modal-actions">
            <a href={res.downloadUrl} className="res-download-btn" onClick={(e) => e.preventDefault()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Tải xuống
            </a>
            <a href={res.viewUrl} className="res-view-btn" onClick={(e) => e.preventDefault()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Xem trực tuyến
            </a>
            <button className={`res-like-modal-btn ${liked?"active":""}`} onClick={onLike}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked?"currentColor":"none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {liked ? "Đã thích" : "Thích"}
            </button>
            <button className={`res-bookmark-modal-btn ${bookmarked?"active":""}`} onClick={onBookmark}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked?"currentColor":"none"}
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {bookmarked ? "Đã lưu" : "Lưu lại"}
            </button>
          </div>

          {/* Related */}
          {relatedItems.length > 0 && (
            <>
              <h3 className="res-modal-section-title" style={{ marginTop: 24 }}>Tài liệu liên quan</h3>
              <div className="res-related-list">
                {relatedItems.map((r) => (
                  <div key={r.id} className="res-related-item" onClick={() => {}}>
                    <span style={{ fontSize: 20 }}>
                      {r.type === "paper" ? "🔬" : r.type === "guide" ? "🏆" : "📖"}
                    </span>
                    <div>
                      <p className="res-related-title">{r.title}</p>
                      <p className="res-related-author">{r.author}</p>
                    </div>
                    <FileTypeBadge type={r.fileType}/>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Upload Modal ── */
function UploadModal({ onClose, onUpload }) {
  const [form, setForm] = useState({
    title: "", author: "", faculty: "", abstract: "",
    type: "paper", fileType: "pdf", tags: "", year: new Date().getFullYear(),
  });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.author.trim()) return;
    onUpload({
      id: `RES_U${Date.now()}`,
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      year: Number(form.year),
      downloads: 0,
      likes: 0,
      downloadUrl: "#",
      viewUrl: "#",
      fileSize: "—",
      image: null,
      publishedAt: new Date().toISOString(),
      category: form.type === "paper" ? "academic" : form.type === "guide" ? "guide" : "study",
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal-header">
          <h3>Đăng tải tài liệu</h3>
          <button className="modal-close-btn" style={{ position: "static" }} onClick={onClose}>✕</button>
        </div>
        <div className="upload-modal-body">
          <div className="upload-grid">
            <div className="upload-field upload-field-full">
              <label className="upload-label">Tên tài liệu *</label>
              <input className="upload-input" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Nhập tên tài liệu..."/>
            </div>
            <div className="upload-field">
              <label className="upload-label">Tác giả *</label>
              <input className="upload-input" value={form.author} onChange={(e) => setField("author", e.target.value)} placeholder="Tên tác giả"/>
            </div>
            <div className="upload-field">
              <label className="upload-label">Khoa / Đơn vị</label>
              <input className="upload-input" value={form.faculty} onChange={(e) => setField("faculty", e.target.value)} placeholder="VD: Khoa HTTT"/>
            </div>
            <div className="upload-field">
              <label className="upload-label">Loại tài liệu</label>
              <select className="upload-input" value={form.type} onChange={(e) => setField("type", e.target.value)}>
                <option value="paper">Bài báo khoa học</option>
                <option value="guide">Cẩm nang cuộc thi</option>
                <option value="study">Tài liệu học tập</option>
              </select>
            </div>
            <div className="upload-field">
              <label className="upload-label">Định dạng file</label>
              <select className="upload-input" value={form.fileType} onChange={(e) => setField("fileType", e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="pptx">PPTX</option>
                <option value="xlsx">XLSX</option>
              </select>
            </div>
            <div className="upload-field">
              <label className="upload-label">Năm</label>
              <input className="upload-input" type="number" value={form.year} onChange={(e) => setField("year", e.target.value)}/>
            </div>
            <div className="upload-field upload-field-full">
              <label className="upload-label">Tóm tắt</label>
              <textarea className="upload-input upload-textarea" rows={4} value={form.abstract} onChange={(e) => setField("abstract", e.target.value)} placeholder="Mô tả ngắn về nội dung tài liệu..."/>
            </div>
            <div className="upload-field upload-field-full">
              <label className="upload-label">Tags (cách nhau bằng dấu phẩy)</label>
              <input className="upload-input" value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="VD: AI, machine learning, python"/>
            </div>
            {/* File upload placeholder */}
            <div className="upload-field upload-field-full">
              <label className="upload-label">File đính kèm</label>
              <div className="upload-file-zone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Kéo thả file vào đây hoặc <span>chọn file</span></p>
                <p className="upload-file-hint">PDF, DOCX, PPTX, XLSX · Tối đa 50MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="upload-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="btn-save" onClick={handleSubmit}>Đăng tải</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   RESOURCES PAGE MAIN
══════════════════════════════ */
export default function ResourcesPage() {
  const navigate = useNavigate();

  const [activeTab,      setActiveTab]      = useState("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search,         setSearch]         = useState("");
  const [sortBy,         setSortBy]         = useState("latest");
  const [selectedRes,    setSelectedRes]    = useState(null);
  const [showUpload,     setShowUpload]      = useState(false);
  const [likes,          setLikes]           = useState(loadLikes);
  const [bookmarks,      setBookmarks]       = useState(loadBookmarks);
  const [uploads,        setUploads]         = useState(loadUploads);

  const searchRef = useRef(null);
  const [showSearchDd, setShowSearchDd] = useState(false);

  const allResources = [...RESOURCES, ...uploads];

  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDd(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    const updated = { ...likes, [id]: !likes[id] };
    setLikes(updated);
    localStorage.setItem(LS_LIKES, JSON.stringify(updated));
  };

  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    const updated = { ...bookmarks, [id]: !bookmarks[id] };
    setBookmarks(updated);
    localStorage.setItem(LS_BOOKMARKS, JSON.stringify(updated));
  };

  const handleUpload = (item) => {
    const updated = [item, ...uploads];
    setUploads(updated);
    localStorage.setItem(LS_UPLOADS, JSON.stringify(updated));
  };

  const keyword = search.trim().toLowerCase();

  const filtered = allResources
    .filter((r) => {
      if (activeCategory !== "all" && r.category !== activeCategory) return false;
      if (activeTab === "bookmarks") return bookmarks[r.id];
      if (keyword) return (
        r.title.toLowerCase().includes(keyword) ||
        r.author.toLowerCase().includes(keyword) ||
        r.abstract.toLowerCase().includes(keyword) ||
        r.tags.some((t) => t.toLowerCase().includes(keyword)) ||
        r.faculty?.toLowerCase().includes(keyword)
      );
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "latest")    return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortBy === "popular")   return b.downloads - a.downloads;
      if (sortBy === "liked")     return b.likes - a.likes;
      return 0;
    });

  const searchResults = keyword
    ? allResources.filter((r) =>
        r.title.toLowerCase().includes(keyword) ||
        r.tags.some((t) => t.toLowerCase().includes(keyword)) ||
        r.author.toLowerCase().includes(keyword)
      ).slice(0,6)
    : [];

  const stats = {
    total: allResources.length,
    papers: allResources.filter((r) => r.category === "academic").length,
    guides:  allResources.filter((r) => r.category === "guide").length,
    studies: allResources.filter((r) => r.category === "study").length,
  };

  return (
    <div className="resources-page">
      <Header />

      {/* ══ HERO ══ */}
      <div className="res-hero">
        <div className="res-hero-bg"/>
        <div className="res-hero-content">
          <h1 className="res-hero-title">Boost Your Academic Journey</h1>
          <p className="res-hero-sub">Find useful documents, research guides, and competition resources.</p>

          {/* Search */}
          <div className="res-hero-search" ref={searchRef}>
            <input className="res-search-input"
              placeholder="Tìm kiếm tài liệu, tác giả, từ khóa..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSearchDd(true); }}
              onFocus={() => setShowSearchDd(true)}/>
            <button className="res-search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Search dropdown */}
            {showSearchDd && keyword && (
              <div className="res-search-dropdown">
                {searchResults.length === 0
                  ? <p className="res-search-empty">Không tìm thấy tài liệu nào cho "{search}"</p>
                  : searchResults.map((r) => (
                    <div key={r.id} className="res-search-item"
                      onClick={() => { setSelectedRes(r); setShowSearchDd(false); setSearch(""); }}>
                      <span style={{ fontSize: 20 }}>
                        {r.type === "paper" ? "🔬" : r.type === "guide" ? "🏆" : "📖"}
                      </span>
                      <div>
                        <p className="res-search-item-title">{r.title}</p>
                        <p className="res-search-item-sub">{r.author} · <FileTypeBadge type={r.fileType}/></p>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="res-hero-btns">
            <button className="res-hero-btn-primary"
              onClick={() => { setActiveTab("browse"); setActiveCategory("all"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Browse Resources
            </button>
            <button className="res-hero-btn-secondary"
              onClick={() => { setActiveTab("browse"); setActiveCategory("guide"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Explore Study Guides
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div className="res-main">

        {/* Stats bar */}
        <div className="res-stats-bar">
          <div className="res-stat-item">
            <span className="res-stat-num">{stats.total}</span>
            <span className="res-stat-label">Tài liệu</span>
          </div>
          <div className="res-stat-divider"/>
          <div className="res-stat-item">
            <span className="res-stat-num">{stats.papers}</span>
            <span className="res-stat-label">Bài báo</span>
          </div>
          <div className="res-stat-divider"/>
          <div className="res-stat-item">
            <span className="res-stat-num">{stats.guides}</span>
            <span className="res-stat-label">Cẩm nang</span>
          </div>
          <div className="res-stat-divider"/>
          <div className="res-stat-item">
            <span className="res-stat-num">{stats.studies}</span>
            <span className="res-stat-label">Học liệu</span>
          </div>
          <button className="res-upload-btn" onClick={() => setShowUpload(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Đăng tải tài liệu
          </button>
        </div>

        {/* Tabs */}
        <div className="res-tabs">
          {[["home","Home"],["browse","Academic Papers"],["guides","Competition & Research Guides"],["bookmarks","Đã lưu"]].map(([val,label]) => (
            <button key={val} className={`res-tab ${activeTab===val?"active":""}`}
              onClick={() => setActiveTab(val)}>{label}</button>
          ))}
        </div>

        <div className="res-body">

          {/* Left: content */}
          <div className="res-left">

            {/* Category filter */}
            <div className="res-filter-row">
              <div className="res-categories">
                {RESOURCE_CATEGORIES.map((cat) => (
                  <button key={cat.id}
                    className={`res-cat-btn ${activeCategory===cat.id?"active":""}`}
                    onClick={() => setActiveCategory(cat.id)}>
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              <div className="res-sort-wrap">
                <label className="res-sort-label">Sắp xếp:</label>
                <select className="res-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="latest">Mới nhất</option>
                  <option value="popular">Nhiều lượt tải</option>
                  <option value="liked">Nhiều lượt thích</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <p className="res-result-count">
              {filtered.length} tài liệu {keyword ? `cho "${search}"` : ""}
              {activeTab === "bookmarks" ? " đã lưu" : ""}
            </p>

            {/* Cards grid */}
            {filtered.length === 0 ? (
              <div className="res-empty">
                <span style={{ fontSize: 48 }}>{activeTab === "bookmarks" ? "🔖" : "📭"}</span>
                <p>{activeTab === "bookmarks" ? "Chưa có tài liệu nào được lưu" : "Không tìm thấy tài liệu nào"}</p>
                {activeTab === "bookmarks" && (
                  <button className="res-hero-btn-primary" style={{ marginTop: 8 }}
                    onClick={() => setActiveTab("browse")}>
                    Khám phá tài liệu
                  </button>
                )}
              </div>
            ) : (
              <div className="res-grid">
                {filtered.map((res) => (
                  <ResourceCard key={res.id} res={res}
                    liked={!!likes[res.id]}
                    bookmarked={!!bookmarks[res.id]}
                    onLike={(e) => toggleLike(res.id, e)}
                    onBookmark={(e) => toggleBookmark(res.id, e)}
                    onView={() => setSelectedRes(res)}/>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="res-sidebar">

            {/* Top downloaded */}
            <div className="res-sidebar-card">
              <h3 className="res-sidebar-title">🔥 Tải nhiều nhất</h3>
              {allResources
                .sort((a,b) => b.downloads - a.downloads)
                .slice(0,5)
                .map((r, i) => (
                  <div key={r.id} className="res-sidebar-item" onClick={() => setSelectedRes(r)}>
                    <span className="res-sidebar-rank">{i+1}</span>
                    <div className="res-sidebar-info">
                      <p className="res-sidebar-item-title">{r.title}</p>
                      <p className="res-sidebar-item-sub">⬇ {r.downloads.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Tags cloud */}
            <div className="res-sidebar-card">
              <h3 className="res-sidebar-title">🏷 Tags nổi bật</h3>
              <div className="res-tags-cloud">
                {Array.from(new Set(RESOURCES.flatMap((r) => r.tags))).slice(0,16).map((tag) => (
                  <span key={tag} className="res-tag-cloud-item"
                    onClick={() => { setSearch(tag); setActiveCategory("all"); }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Upload CTA */}
            <div className="res-sidebar-card res-upload-cta">
              <span style={{ fontSize: 32 }}>📤</span>
              <p>Bạn có tài liệu hữu ích?</p>
              <button className="res-upload-cta-btn" onClick={() => setShowUpload(true)}>
                Chia sẻ ngay
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {selectedRes && (
        <ResourceModal res={selectedRes}
          liked={!!likes[selectedRes.id]}
          bookmarked={!!bookmarks[selectedRes.id]}
          onLike={() => toggleLike(selectedRes.id)}
          onBookmark={() => toggleBookmark(selectedRes.id)}
          onClose={() => setSelectedRes(null)}/>
      )}

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload}/>
      )}

      <Footer />
    </div>
  );
}
