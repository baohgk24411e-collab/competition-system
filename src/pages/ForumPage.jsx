import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FORUM_POSTS, FORUM_COMMENTS, FOLLOWING_MENTORS, CATEGORIES } from "../data/forumdata";
import { COMPETITIONS, CONFERENCES, getStatus, STATUS_LABELS } from "../data/competitionsData";
import "./ForumPage.css";

/* ══════════════════════════════
   HELPERS
══════════════════════════════ */
function Avatar({ name, avatar, size = 40, onClick }) {
  const initials = name ? name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase() : "?";
  const colors = ["#1a3a6b","#e67e22","#16a34a","#9333ea","#dc2626","#0891b2"];
  const color  = colors[(name?.charCodeAt(0) || 0) % colors.length];
  const style  = { width: size, height: size, cursor: onClick ? "pointer" : "default" };
  if (avatar) return <img src={avatar} alt={name} className="avatar-img" style={style} onClick={onClick}/>;
  return <div className="avatar-placeholder" style={{ ...style, background: color }} onClick={onClick}>{initials}</div>;
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

const ROLE_BADGE = {
  mentor:    { label: "Mentor",    bg: "#dbeafe", color: "#1e40af" },
  student:   { label: "Sinh viên", bg: "#dcfce7", color: "#166534" },
  organizer: { label: "Tổ chức",   bg: "#fef3c7", color: "#92400e" },
  union:     { label: "Đoàn Hội",  bg: "#fce7f3", color: "#9d174d" },
};
function RoleBadge({ role }) {
  const { label, bg, color } = ROLE_BADGE[role] || ROLE_BADGE.student;
  return <span className="role-badge" style={{ background: bg, color }}>{label}</span>;
}

/* localStorage helpers */
const LS_POSTS    = "forum_posts_v1";
const LS_COMMENTS = "forum_comments_v1";
const LS_MSG      = "forum_messages_v1";

function loadPosts()    { try { return JSON.parse(localStorage.getItem(LS_POSTS))    || FORUM_POSTS;    } catch { return FORUM_POSTS; } }
function loadComments() { try { return JSON.parse(localStorage.getItem(LS_COMMENTS)) || FORUM_COMMENTS; } catch { return FORUM_COMMENTS; } }
function loadMessages() { try { return JSON.parse(localStorage.getItem(LS_MSG))      || {};              } catch { return {}; } }
function savePosts(p)    { localStorage.setItem(LS_POSTS,    JSON.stringify(p)); }
function saveComments(c) { localStorage.setItem(LS_COMMENTS, JSON.stringify(c)); }
function saveMessages(m) { localStorage.setItem(LS_MSG,      JSON.stringify(m)); }

const ALL_ITEMS = [...COMPETITIONS, ...CONFERENCES];

/* ══════════════════════════════
   POST CARD
══════════════════════════════ */
function PostCard({ post, onClick, onAvatarClick, onCompClick }) {
  const [liked, setLiked]   = useState(false);
  const [count, setCount]   = useState(post.likes);
  const preview = post.content.replace(/\*\*/g,"").split("\n")[0];

  const renderContent = (text) => {
    const parts = text.split(/\[COMP:(.*?)\]/g);
    return parts.map((p, i) => {
      if (i % 2 === 1) {
        const item = ALL_ITEMS.find((c) => c.id === p);
        return item ? (
          <span key={i} className="comp-link" onClick={(e) => { e.stopPropagation(); onCompClick(item); }}>
            🏆 {item.title}
          </span>
        ) : null;
      }
      return p;
    });
  };

  return (
    <div className="post-card" onClick={onClick}>
      <div className="post-card-header">
        <Avatar name={post.authorName} avatar={post.authorAvatar} size={44}
          onClick={(e) => { e.stopPropagation(); onAvatarClick(post); }}/>
        <div className="post-author-info">
          <div className="post-author-row">
            <span className="post-author-name">{post.authorName}</span>
            <RoleBadge role={post.authorRole}/>
          </div>
          <span className="post-author-title">{post.authorTitle}</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-preview">{renderContent(preview)}</p>
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.slice(0,3).map((t) => <span key={t} className="post-tag">#{t}</span>)}
        </div>
      )}
      <div className="post-actions">
        <button className={`post-action-btn ${liked?"liked":""}`}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); setCount((c) => liked?c-1:c+1); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked?"currentColor":"none"}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {count}
        </button>
        <button className="post-action-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post.comments}
        </button>
        <button className="post-action-btn" onClick={(e) => e.stopPropagation()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          {post.shares}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   POST DETAIL MODAL
══════════════════════════════ */
function PostModal({ post, allComments, onClose, onAvatarClick, onCompClick, onSaveComment }) {
  const comments = allComments.filter((c) => c.postId === post.id);
  const [newCmt, setNewCmt] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("uel_auth_user")||"null");

  const handleSubmit = () => {
    if (!newCmt.trim()) return;
    const cmt = {
      id: `CMT${Date.now()}`,
      postId: post.id,
      authorId: storedUser?.id || "guest",
      authorName: storedUser?.profile?.fullName || storedUser?.username || "Bạn",
      authorRole: storedUser?.role || "student",
      authorAvatar: storedUser?.profile?.avatar || null,
      content: newCmt,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    onSaveComment(cmt);
    setNewCmt("");
  };

  const renderContent = (text) =>
    text.split(/\[COMP:(.*?)\]/g).map((p, i) => {
      if (i % 2 === 1) {
        const item = ALL_ITEMS.find((c) => c.id === p);
        return item ? (
          <span key={i} className="comp-link" onClick={() => onCompClick(item)}>🏆 {item.title}</span>
        ) : null;
      }
      return p;
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="post-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div className="post-modal-header">
          <Avatar name={post.authorName} avatar={post.authorAvatar} size={48}
            onClick={() => { onClose(); onAvatarClick(post); }}/>
          <div>
            <div className="post-author-row">
              <span className="post-author-name">{post.authorName}</span>
              <RoleBadge role={post.authorRole}/>
            </div>
            <span className="post-author-title">{post.authorTitle}</span>
            <span className="post-time">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <h2 className="post-modal-title">{post.title}</h2>
        <div className="post-modal-content">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className={line.startsWith("•")||line.match(/^\d\./)?"content-bullet":""}>
              {renderContent(line.replace(/\*\*/g,""))}
            </p>
          ))}
        </div>
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => <span key={t} className="post-tag">#{t}</span>)}
          </div>
        )}
        <div className="comment-section">
          <h4 className="comment-title">Bình luận ({comments.length})</h4>
          <div className="comment-input-row">
            <Avatar name={storedUser?.profile?.fullName||"Bạn"} avatar={null} size={36}/>
            <div className="comment-input-wrap">
              <textarea className="comment-input" placeholder="Viết bình luận..."
                value={newCmt} onChange={(e) => setNewCmt(e.target.value)} rows={2}/>
              <button className="comment-submit-btn" onClick={handleSubmit}>Gửi</button>
            </div>
          </div>
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <Avatar name={c.authorName} avatar={c.authorAvatar} size={36}/>
              <div className="comment-bubble">
                <div className="comment-meta">
                  <span className="comment-author">{c.authorName}</span>
                  <RoleBadge role={c.authorRole}/>
                  <span className="post-time">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="comment-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   COMPETITION DETAIL MODAL
══════════════════════════════ */
function CompDetailModal({ item, onClose, onJoinForum }) {
  const status = getStatus(item);
  const { label: statusLabel, color: statusColor } = STATUS_LABELS[status];
  const relatedPosts = loadPosts().filter((p) =>
    p.tags?.some((t) => item.tags?.includes(t)) || p.content.includes(item.id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="comp-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Cover image placeholder */}
        <div className="comp-detail-cover">
          {item.image
            ? <img src={item.image} alt={item.title} className="comp-detail-cover-img"/>
            : <div className="comp-detail-cover-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>Hình ảnh sẽ được cập nhật</span>
              </div>
          }
          <div className="comp-detail-cover-overlay">
            <span className="comp-detail-status" style={{ background: statusColor+"22", color: statusColor, border: `1px solid ${statusColor}` }}>
              ● {statusLabel}
            </span>
            <h2 className="comp-detail-title">{item.title}</h2>
            <p className="comp-detail-subtitle">{item.subtitle}</p>
          </div>
        </div>

        <div className="comp-detail-body">
          <div className="comp-detail-grid">
            {/* Left info */}
            <div className="comp-detail-left">
              <p className="comp-detail-desc">{item.description}</p>

              <div className="comp-detail-info-list">
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Thời gian</span>
                    <span className="comp-info-val">{item.startDate} {item.endDate !== item.startDate ? `– ${item.endDate}` : ""}</span>
                  </div>
                </div>
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Địa điểm</span>
                    <span className="comp-info-val">{item.location}</span>
                  </div>
                </div>
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Đơn vị tổ chức</span>
                    <span className="comp-info-val">{item.organizer}</span>
                  </div>
                </div>
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Giải thưởng</span>
                    <span className="comp-info-val" style={{ color: "#e67e22", fontWeight: 700 }}>{item.prize || "—"}</span>
                  </div>
                </div>
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Hạn đăng ký</span>
                    <span className="comp-info-val">{item.registrationDeadline}</span>
                  </div>
                </div>
                <div className="comp-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  <div>
                    <span className="comp-info-label">Số lượng</span>
                    <span className="comp-info-val">Tối đa {item.maxParticipants} người</span>
                  </div>
                </div>
              </div>

              {item.tags?.length > 0 && (
                <div className="post-tags" style={{ marginTop: 12 }}>
                  {item.tags.map((t) => <span key={t} className="post-tag">#{t}</span>)}
                </div>
              )}
            </div>

            {/* Right: related forum posts */}
            <div className="comp-detail-right">
              <h4 className="comp-related-title">💬 Thảo luận liên quan</h4>
              {relatedPosts.length === 0
                ? <p className="comp-no-related">Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
                : relatedPosts.slice(0,3).map((p) => (
                  <div key={p.id} className="comp-related-post">
                    <Avatar name={p.authorName} size={32}/>
                    <div>
                      <p className="comp-related-post-title">{p.title}</p>
                      <span className="post-time">{timeAgo(p.createdAt)}</span>
                    </div>
                  </div>
                ))
              }
              <button className="comp-join-forum-btn" onClick={() => onJoinForum(item)}>
                💬 Tham gia diễn đàn về cuộc thi này
              </button>
            </div>
          </div>
        </div>

        <div className="comp-detail-footer">
          {item.website && (
            <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className="comp-website-btn">
              🌐 Xem website
            </a>
          )}
          {status === "open" && (
            <button className="comp-register-btn">Đăng ký tham gia</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   MENTOR PROFILE MODAL
══════════════════════════════ */
function MentorModal({ post, messages, onClose, onSendMessage }) {
  const [msg, setMsg] = useState("");
  const convKey = `conv_${post.authorId}`;
  const conv = messages[convKey] || [];

  const handleSend = () => {
    if (!msg.trim()) return;
    onSendMessage(convKey, {
      id: `MSG${Date.now()}`,
      from: "me",
      text: msg,
      time: new Date().toISOString(),
    });
    setMsg("");
  };

  const mentorPosts = loadPosts().filter((p) => p.authorId === post.authorId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mentor-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Profile header */}
        <div className="mentor-profile-header">
          <Avatar name={post.authorName} avatar={post.authorAvatar} size={72}/>
          <div className="mentor-profile-info">
            <h3 className="mentor-profile-name">{post.authorName}</h3>
            <RoleBadge role={post.authorRole}/>
            <p className="mentor-profile-title">{post.authorTitle}</p>
          </div>
          <button className="mentor-follow-btn">+ Theo dõi</button>
        </div>

        <div className="mentor-modal-body">
          {/* Posts */}
          <div className="mentor-posts-section">
            <h4 className="mentor-section-title">Bài viết ({mentorPosts.length})</h4>
            {mentorPosts.slice(0,3).map((p) => (
              <div key={p.id} className="mentor-post-item">
                <p className="mentor-post-title">{p.title}</p>
                <span className="post-time">{timeAgo(p.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* Chat */}
          <div className="mentor-chat-section">
            <h4 className="mentor-section-title">💬 Nhắn tin riêng</h4>
            <div className="mentor-chat-messages">
              {conv.length === 0
                ? <p className="mentor-chat-empty">Bắt đầu cuộc trò chuyện với {post.authorName}!</p>
                : conv.map((m) => (
                  <div key={m.id} className={`chat-bubble ${m.from === "me" ? "chat-me" : "chat-them"}`}>
                    <p>{m.text}</p>
                    <span className="chat-time">{timeAgo(m.time)}</span>
                  </div>
                ))
              }
            </div>
            <div className="mentor-chat-input-row">
              <input className="mentor-chat-input" placeholder="Nhập tin nhắn..."
                value={msg} onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}/>
              <button className="mentor-chat-send-btn" onClick={handleSend}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   SEARCH RESULTS
══════════════════════════════ */
function SearchResults({ keyword, onCompClick, onPostClick }) {
  if (!keyword.trim()) return null;
  const kw = keyword.toLowerCase();
  const matchedComps = ALL_ITEMS.filter((c) =>
    c.title.toLowerCase().includes(kw) ||
    c.organizer.toLowerCase().includes(kw) ||
    c.tags?.some((t) => t.toLowerCase().includes(kw)) ||
    c.category.toLowerCase().includes(kw)
  );
  const matchedPosts = loadPosts().filter((p) =>
    p.title.toLowerCase().includes(kw) ||
    p.content.toLowerCase().includes(kw) ||
    p.authorName.toLowerCase().includes(kw) ||
    p.tags?.some((t) => t.toLowerCase().includes(kw))
  );

  if (matchedComps.length === 0 && matchedPosts.length === 0) {
    return <div className="search-results-box"><p className="search-no-result">Không tìm thấy kết quả nào cho "{keyword}"</p></div>;
  }

  return (
    <div className="search-results-box">
      {matchedComps.length > 0 && (
        <>
          <p className="search-results-label">🏆 Cuộc thi / Hội thảo ({matchedComps.length})</p>
          {matchedComps.map((c) => {
            const { label, color } = STATUS_LABELS[getStatus(c)];
            return (
              <div key={c.id} className="search-result-item" onClick={() => onCompClick(c)}>
                <div className="search-result-thumb">
                  {c.image ? <img src={c.image} alt=""/> : <span>🏆</span>}
                </div>
                <div className="search-result-info">
                  <p className="search-result-title">{c.title}</p>
                  <p className="search-result-sub">{c.organizer} · <span style={{ color }}>{label}</span></p>
                </div>
              </div>
            );
          })}
        </>
      )}
      {matchedPosts.length > 0 && (
        <>
          <p className="search-results-label">💬 Bài viết ({matchedPosts.length})</p>
          {matchedPosts.map((p) => (
            <div key={p.id} className="search-result-item" onClick={() => onPostClick(p)}>
              <Avatar name={p.authorName} size={36}/>
              <div className="search-result-info">
                <p className="search-result-title">{p.title}</p>
                <p className="search-result-sub">{p.authorName} · {timeAgo(p.createdAt)}</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════
   FORUM PAGE MAIN
══════════════════════════════ */
export default function ForumPage() {
  const navigate = useNavigate();

  const [activeTab,      setActiveTab]      = useState("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search,         setSearch]         = useState("");
  const [showSearch,     setShowSearch]     = useState(false);
  const [feedSort,       setFeedSort]       = useState("latest");
  const [selectedPost,   setSelectedPost]   = useState(null);
  const [selectedComp,   setSelectedComp]   = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [newPostOpen,    setNewPostOpen]     = useState(false);
  const [newPostTitle,   setNewPostTitle]    = useState("");
  const [newPostText,    setNewPostText]     = useState("");
  const [carouselIdx,    setCarouselIdx]     = useState(0);
  const [allPosts,       setAllPosts]        = useState(loadPosts);
  const [allComments,    setAllComments]     = useState(loadComments);
  const [messages,       setMessages]        = useState(loadMessages);

  const searchRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("uel_auth_user")||"null");

  /* Close search on outside click */
  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const whatsNewPosts = allPosts.filter((p) => p.authorRole === "mentor").slice(0,8);

  const handleSaveComment = (cmt) => {
    const updated = [...allComments, cmt];
    setAllComments(updated);
    saveComments(updated);
    setAllPosts((prev) => {
      const up = prev.map((p) => p.id === cmt.postId ? { ...p, comments: p.comments + 1 } : p);
      savePosts(up);
      return up;
    });
  };

  const handleSendMessage = (key, msg) => {
    const updated = { ...messages, [key]: [...(messages[key]||[]), msg] };
    setMessages(updated);
    saveMessages(updated);
  };

  const handleNewPost = () => {
    if (!newPostTitle.trim() || !newPostText.trim()) return;
    const post = {
      id: `POST${Date.now()}`,
      authorId: storedUser?.id || "guest",
      authorName: storedUser?.profile?.fullName || storedUser?.username || "Bạn",
      authorRole: storedUser?.role || "student",
      authorAvatar: storedUser?.profile?.avatar || null,
      authorTitle: storedUser?.profile?.fieldOfStudy || "",
      title: newPostTitle,
      content: newPostText,
      likes: 0, comments: 0, shares: 0,
      createdAt: new Date().toISOString(),
      tags: [],
      category: "experience",
    };
    const updated = [post, ...allPosts];
    setAllPosts(updated);
    savePosts(updated);
    setNewPostOpen(false);
    setNewPostTitle("");
    setNewPostText("");
  };

  const handleJoinForum = (item) => {
    setSelectedComp(null);
    setNewPostTitle(`Thảo luận về: ${item.title}`);
    setNewPostOpen(true);
  };

  const keyword = search.trim().toLowerCase();
  const filtered = allPosts
    .filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (keyword) return (
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword) ||
        p.authorName.toLowerCase().includes(keyword) ||
        p.tags?.some((t) => t.toLowerCase().includes(keyword))
      );
      return true;
    })
    .sort((a, b) => feedSort === "latest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : b.likes - a.likes
    );

  return (
    <div className="forum-page">
      <Header />

      {/* ══ HERO ══ */}
      <div className="forum-hero">
        <div className="forum-hero-bg"/>
        <div className="forum-hero-content">
          <h1 className="forum-hero-title">Welcome to UEL-ACMS Forum</h1>
          <p className="forum-hero-sub">Connect — Discuss — Grow in Academic Excellence</p>
          <p className="forum-hero-desc">
            Discover research ideas, share competition experiences,<br/>
            and collaborate with students across UEL.
          </p>

          {/* Search với autocomplete */}
          <div className="forum-hero-search" ref={searchRef}>
            <input className="forum-search-input" placeholder="Tìm kiếm cuộc thi, lĩnh vực, bài viết..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}/>
            <button className="forum-search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            {showSearch && search && (
              <div className="search-dropdown">
                <SearchResults
                  keyword={search}
                  onCompClick={(c) => { setSelectedComp(c); setShowSearch(false); setSearch(""); }}
                  onPostClick={(p) => { setSelectedPost(p); setShowSearch(false); setSearch(""); }}
                />
              </div>
            )}
          </div>

          <div className="forum-hero-btns">
            <button className="forum-hero-btn-primary" onClick={() => setActiveTab("categories")}>
              Explore Topics
            </button>
            <button className="forum-hero-btn-secondary" onClick={() => setNewPostOpen(true)}>
              Join Discussion
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div className="forum-main">

        {/* Tabs */}
        <div className="forum-tabs">
          {[["home","Home"],["categories","Categories"],["feed","Feed"]].map(([val,label]) => (
            <button key={val} className={`forum-tab ${activeTab===val?"active":""}`}
              onClick={() => setActiveTab(val)}>{label}</button>
          ))}
        </div>

        <div className="forum-body">

          {/* Left */}
          <div className="forum-left">

            {/* WHAT'S NEW */}
            {(activeTab === "home" || activeTab === "feed") && (
              <section className="forum-section">
                <div className="section-header">
                  <h2 className="section-title">WHAT'S NEW?</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab("feed")}>View all</button>
                </div>
                <div className="whats-new-carousel">
                  <button className="wn-arrow" onClick={() => setCarouselIdx((i) => (i-1+whatsNewPosts.length)%whatsNewPosts.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div className="wn-track">
                    {[0,1].map((offset) => {
                      const post = whatsNewPosts[(carouselIdx + offset) % whatsNewPosts.length];
                      if (!post) return null;
                      return (
                        <div key={post.id} className="wn-card" onClick={() => setSelectedPost(post)}>
                          <div className="wn-quote-icon">❝</div>
                          <div className="wn-card-header">
                            <Avatar name={post.authorName} avatar={post.authorAvatar} size={38}
                              onClick={(e) => { e.stopPropagation(); setSelectedMentor(post); }}/>
                            <div>
                              <span className="wn-author">{post.authorName}</span>
                              <span className="wn-time">{timeAgo(post.createdAt)}</span>
                            </div>
                          </div>
                          <h4 className="wn-title">{post.title}</h4>
                          <p className="wn-preview">{post.content.replace(/\*\*/g,"").split("\n")[0].slice(0,120)}...</p>
                          <div className="wn-stats">
                            <span>🤍 {post.likes}</span>
                            <span>💬 {post.comments}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="wn-arrow" onClick={() => setCarouselIdx((i) => (i+1)%whatsNewPosts.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <div className="wn-dots">
                  {whatsNewPosts.map((_,i) => (
                    <button key={i} className={`wn-dot ${i===carouselIdx?"active":""}`} onClick={() => setCarouselIdx(i)}/>
                  ))}
                </div>
              </section>
            )}

            <div className="forum-divider"/>

            {/* YOUR FEED */}
            <section className="forum-section">
              <div className="section-header">
                <h2 className="section-title">YOUR FEED</h2>
              </div>

              <div className="feed-sort-row">
                <button className={`feed-sort-btn ${feedSort==="latest"?"active":""}`} onClick={() => setFeedSort("latest")}>Latest</button>
                <button className={`feed-sort-btn ${feedSort==="popular"?"active":""}`} onClick={() => setFeedSort("popular")}>Most liked</button>
              </div>

              {activeTab === "categories" && (
                <div className="category-filter">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id}
                      className={`category-btn ${activeCategory===cat.id?"active":""}`}
                      onClick={() => setActiveCategory(cat.id)}>
                      {cat.label} <span className="cat-count">{cat.count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* New post box */}
              <div className="new-post-box" onClick={() => setNewPostOpen(true)}>
                <Avatar name={storedUser?.profile?.fullName||"Bạn"} avatar={null} size={40}/>
                <div className="new-post-placeholder">Chia sẻ điều gì đó với cộng đồng...</div>
              </div>

              <div className="feed-posts">
                {filtered.length === 0
                  ? <div className="feed-empty"><p>Không tìm thấy bài viết nào.</p></div>
                  : filtered.map((post) => (
                    <PostCard key={post.id} post={post}
                      onClick={() => setSelectedPost(post)}
                      onAvatarClick={(p) => setSelectedMentor(p)}
                      onCompClick={(c) => setSelectedComp(c)}/>
                  ))
                }
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="forum-sidebar">

            {/* Following */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <h3 className="sidebar-title">Following</h3>
              </div>
              <div className="following-list">
                {FOLLOWING_MENTORS.map((m, i) => {
                  const mentorPost = allPosts.find((p) => p.authorId === m.id);
                  return (
                    <div key={m.id} className="following-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => mentorPost && setSelectedMentor(mentorPost)}>
                      <span className="following-rank">{i+1}</span>
                      <Avatar name={m.name} avatar={m.avatar} size={36}/>
                      <div className="following-info">
                        <span className="following-name">{m.name}</span>
                        <span className="following-title">{m.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hot topics — bấm được */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Chủ đề nổi bật</h3>
              <div className="topic-tags">
                {["hackathon","research","AI","startup","marketing","data","career","competition"].map((tag) => (
                  <span key={tag} className="topic-tag"
                    onClick={() => { setSearch(tag); setActiveTab("feed"); setShowSearch(false); }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Competitions nổi bật */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Cuộc thi đang mở</h3>
              {ALL_ITEMS.filter((c) => getStatus(c) === "open").slice(0,3).map((c) => (
                <div key={c.id} className="sidebar-comp-item" onClick={() => setSelectedComp(c)}>
                  <p className="sidebar-comp-title">{c.title}</p>
                  <p className="sidebar-comp-org">{c.organizer}</p>
                </div>
              ))}
            </div>

          </aside>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {selectedPost && (
        <PostModal post={selectedPost} allComments={allComments} onClose={() => setSelectedPost(null)}
          onAvatarClick={(p) => { setSelectedPost(null); setSelectedMentor(p); }}
          onCompClick={(c) => setSelectedComp(c)}
          onSaveComment={handleSaveComment}/>
      )}

      {selectedComp && (
        <CompDetailModal item={selectedComp} onClose={() => setSelectedComp(null)}
          onJoinForum={handleJoinForum}/>
      )}

      {selectedMentor && (
        <MentorModal post={selectedMentor} messages={messages} onClose={() => setSelectedMentor(null)}
          onSendMessage={handleSendMessage}/>
      )}

      {/* New Post Modal */}
      {newPostOpen && (
        <div className="modal-overlay" onClick={() => setNewPostOpen(false)}>
          <div className="new-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Tạo bài viết mới</h3>
              <button className="modal-close-btn" onClick={() => setNewPostOpen(false)}>✕</button>
            </div>
            <div className="new-post-author">
              <Avatar name={storedUser?.profile?.fullName||"Bạn"} avatar={null} size={44}/>
              <div>
                <span className="post-author-name">{storedUser?.profile?.fullName || storedUser?.username || "Bạn"}</span>
                <RoleBadge role={storedUser?.role || "student"}/>
              </div>
            </div>
            <input className="new-post-title-input" placeholder="Tiêu đề bài viết..."
              value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)}/>
            <textarea className="new-post-textarea"
              placeholder="Chia sẻ kinh nghiệm, đặt câu hỏi, hoặc thảo luận về cuộc thi..."
              value={newPostText} onChange={(e) => setNewPostText(e.target.value)} rows={6}/>
            <div className="new-post-footer">
              <button className="btn-cancel" onClick={() => setNewPostOpen(false)}>Huỷ</button>
              <button className="btn-save" onClick={handleNewPost}>Đăng bài</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
