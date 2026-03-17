import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { COMPETITIONS, CONFERENCES, getStatus, STATUS_LABELS } from "../data/competitionsData";
import "./HomePage.css";

/* ── Banner carousel data ── */
const BANNERS = [
  {
    id: 1,
    bg: "linear-gradient(135deg, #0a1628 0%, #1a3a6b 60%, #0d2444 100%)",
    tag: "DS2S · HACKATHON 2026",
    title: "DS2S\nHACKATHON\n2026",
    sub: "SÁNG TẠO Ý TƯỞNG – CHUYỂN ĐỔI SỐ TƯƠNG LAI",
    bullets: [
      "HỌC – LÀM – TRẢI NGHIỆM",
      "KẾT NỐI CHUYÊN GIA & DOANH NGHIỆP",
      "PHÁT TRIỂN KỸ NĂNG SỐ",
      "CƠ HỘI HỌC TẬP VÀ SHOWCASE",
    ],
    dates: [
      { range: "09/3 – 07/4", label: "ĐĂNG KÝ" },
      { range: "11/5 – 13/5", label: "HACKATHON" },
    ],
    cta:  "ĐĂNG KÝ NGAY!",
    image: "/websitelobby.png" 
  },
  {
    id: 2,
    bg: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
    tag: "SCHALLENGE XIII",
    title: "SCHALLENGE\nXIII",
    sub: "EMERALD CIRCULATION",
    bullets: [
      "GIẢI QUYẾT TÌNH HUỐNG THỰC TẾ",
      "CHUỖI CUNG ỨNG XANH",
      "TƯ DUY CHIẾN LƯỢC MỚI",
    ],
    dates: [
      { range: "15/3 – 15/4", label: "ĐĂNG KÝ" },
      { range: "10/5",        label: "CHUNG KẾT" },
    ],
    cta:  "XEM CHI TIẾT",
    image: "/HT_ICBF.png" 
  },
];

function HomePage() {
  const navigate = useNavigate();

  const [slide,       setSlide]      = useState(0);
  const [tab,         setTab]        = useState("all");
  const [search,      setSearch]     = useState("");
  const [filterOpen,  setFilterOpen] = useState(false);
  
  // Mặc định BẬT hiển thị tất cả các trạng thái (ongoing, upcoming, ended)
  const initialFilters = Object.keys(STATUS_LABELS).reduce((acc, key) => {
    acc[key] = true; 
    return acc;
  }, {});
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  const timerRef  = useRef(null);
  const filterRef = useRef(null);

  /* Auto-slide */
  useEffect(() => {
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* Đóng filter popup khi click ra ngoài */
  useEffect(() => {
    const h = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const goSlide = (i) => {
    clearInterval(timerRef.current);
    setSlide(i);
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 5000);
  };

  const toggleFilter = (key) =>
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));

  // 1. FIX LỖI: Lấy dữ liệu an toàn, gom thẳng mảng từ file data
  let rawItems = [];
  if (tab === "all") {
    rawItems = [...COMPETITIONS, ...CONFERENCES];
  } else if (tab === "competitions") {
    rawItems = COMPETITIONS;
  } else if (tab === "conferences") {
    rawItems = CONFERENCES;
  }

  const keyword = search.trim().toLowerCase();

  // 2. Lọc dữ liệu hiển thị
  const filtered = rawItems.filter((item) => {
    const status = getStatus(item);
    
    // Lọc theo trạng thái
    if (!activeFilters[status]) return false;

    // Lọc theo từ khóa tìm kiếm
    if (keyword) {
      return (
        (item.title && item.title.toLowerCase().includes(keyword)) ||
        (item.organizer && item.organizer.toLowerCase().includes(keyword)) ||
        (item.faculty && item.faculty.toLowerCase().includes(keyword)) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(keyword)))
      );
    }
    return true;
  });

  const banner = BANNERS[slide];

  return (
    <div className="home-page">
      <Header />
      
      <div className="home-page-bg"></div>
      <div className="home-page-overlay"></div>

      <main className="home-main">

        {/* ══ BANNER CAROUSEL ══ */}
        <div className="home-carousel">
          <div className="carousel-track" style={{ background: banner.bg }}>
            
            <div className="carousel-content">
              <span className="carousel-tag">{banner.tag}</span>
              <h1 className="carousel-title">
                {banner.title.split("\n").map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </h1>
              <p className="carousel-sub">{banner.sub}</p>
              
              <ul className="carousel-bullets">
                {banner.bullets.map((b, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              
              <div className="carousel-dates">
                {banner.dates.map((d, i) => (
                  <div key={i} className="carousel-date-item">
                    <span className="date-range">{d.range}</span>
                    <span className="date-label">{d.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="carousel-bottom">
                <button className="carousel-cta">{banner.cta}</button>
              </div>
            </div>

            <div className="carousel-image-area">
              <img src={banner.image} alt="Banner" className="carousel-img" />
            </div>

          </div>

          <button className="carousel-arrow carousel-prev" onClick={() => goSlide((slide - 1 + BANNERS.length) % BANNERS.length)}>❮</button>
          <button className="carousel-arrow carousel-next" onClick={() => goSlide((slide + 1) % BANNERS.length)}>❯</button>
          
          <div className="carousel-dots">
            {BANNERS.map((_, i) => (
              <button key={i} className={`carousel-dot ${i === slide ? "active" : ""}`} onClick={() => goSlide(i)}/>
            ))}
          </div>
        </div>

        {/* ══ SEARCH + FILTER ══ */}
        <div className="home-search-row">
          <div className="home-search-wrap">
            <input
              className="home-search-input"
              type="text"
              placeholder="Tìm theo tên, đơn vị tổ chức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="home-search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>

          <div className="home-filter-wrap" ref={filterRef}>
            <button className={`home-filter-btn ${filterOpen ? "active" : ""}`} onClick={() => setFilterOpen(!filterOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
            </button>

            {filterOpen && (
              <div className="filter-dropdown">
                <p className="filter-title">Trạng thái</p>
                {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
                  <label key={key} className="filter-option">
                    <input type="checkbox" checked={activeFilters[key] || false} onChange={() => toggleFilter(key)} />
                    <span style={{ color }}>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ TABS ══ */}
        <div className="home-tabs">
          <button className={`home-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>Tất cả</button>
          <button className={`home-tab ${tab === "competitions" ? "active" : ""}`} onClick={() => setTab("competitions")}>Cuộc thi</button>
          <button className={`home-tab ${tab === "conferences" ? "active" : ""}`} onClick={() => setTab("conferences")}>Hội thảo</button>
        </div>

        {/* ══ CARDS ══ */}
        <div className="home-cards">
          {filtered.length === 0 ? (
            <div className="home-empty">
              <p>Không có sự kiện nào phù hợp.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const status = getStatus(item);
              const { label: statusLabel, color: statusColor } = STATUS_LABELS[status];
              const thumbImage = item.poster || item.image;

              return (
                <div key={item.id} className="home-card" onClick={() => {
                  // Tự động kiểm tra xem item thuộc Hội thảo hay Cuộc thi để chuyển trang
                  const isCompetition = COMPETITIONS.some(c => c.id === item.id);
                  navigate(`/${isCompetition ? 'competition' : 'conference'}/${item.id}`);
                }}>
                  <div className="card-thumb">
                    {thumbImage ? (
                      <img src={thumbImage} alt={item.title} className="card-thumb-img"/>
                    ) : (
                      <div className="card-thumb-placeholder">
                        <span style={{fontSize: '10px'}}>No Img</span>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="card-top">
                      <span className="card-status" style={{ color: statusColor, background: statusColor + "18" }}>
                        ● {statusLabel}
                      </span>
                      <span className="card-date">{item.startDate}</span>
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-org">{item.organizer}</p>
                  </div>

                  <svg className="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              );
            })
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default HomePage;