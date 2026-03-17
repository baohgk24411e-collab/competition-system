import { useMemo } from "react";
import { COMPETITIONS_DATA, COMPETITIONS, CONFERENCES } from "../../data/competitionsData";
import "./UnionReports.css";

/* ── Combine all event data for charts ── */
const ALL_COMPETITIONS = COMPETITIONS_DATA;
const ALL_CONFERENCES  = CONFERENCES;

/* Stat helpers */
const countByCategory = (items) =>
  items.reduce((acc, item) => {
    const cat = item.category || item.tags?.[0] || "other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

const countByStatus = (items) =>
  items.reduce((acc, item) => {
    const s = item.status || "unknown";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

/* Monthly helper — group competitions by month from startDateISO */
const countByMonth = (items) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const map = {};
  months.forEach(m => { map[m] = 0; });
  items.forEach(item => {
    if (!item.startDateISO) return;
    const d = new Date(item.startDateISO);
    map[months[d.getMonth()]] = (map[months[d.getMonth()]] || 0) + 1;
  });
  return months.map(m => ({ month: m, count: map[m] }));
};

/* ── Simple SVG bar chart ── */
function BarChart({ data, color = "#15427d" }) {
  const maxVal = Math.max(...data.map(d => d.count), 1);
  const W = 480, H = 160, PAD = 32;
  const barW = Math.floor((W - PAD * 2) / data.length) - 6;

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="ur-svg">
      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i}
          x1={PAD} y1={PAD + (H - PAD) * f}
          x2={W - PAD} y2={PAD + (H - PAD) * f}
          stroke="#e2e8f0" strokeWidth="1"
        />
      ))}
      {data.map((d, i) => {
        const barH = ((d.count / maxVal) * (H - PAD));
        const x = PAD + i * ((W - PAD * 2) / data.length) + 3;
        const y = H - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              rx="4" fill={color} opacity="0.85" />
            {d.count > 0 && (
              <text x={x + barW / 2} y={y - 4}
                textAnchor="middle" fontSize="10" fill={color} fontWeight="700">
                {d.count}
              </text>
            )}
            <text x={x + barW / 2} y={H + 18}
              textAnchor="middle" fontSize="9.5" fill="#64748b">
              {d.month || d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Donut / pie chart SVG ── */
function DonutChart({ segments }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const R = 60, cx = 80, cy = 80;
  let startAngle = -Math.PI / 2;
  const slices = segments.map(({ label, value, color }) => {
    const angle = (value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    startAngle += angle;
    const x2 = cx + R * Math.cos(startAngle);
    const y2 = cy + R * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { path: `M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`, color, label, value };
  });

  return (
    <svg viewBox="0 0 160 160" className="ur-donut">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r={R * 0.55} fill="#fff" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#15427d" fontWeight="800">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#64748b">Total</text>
    </svg>
  );
}

export default function UnionReports() {
  const monthlyComp = useMemo(() => countByMonth(COMPETITIONS), []);
  const monthlyConf = useMemo(() => countByMonth(ALL_CONFERENCES.map(c => ({ ...c, startDateISO: c.startDateISO }))), []);

  const catComp  = useMemo(() => countByCategory(ALL_COMPETITIONS), []);
  const statComp = useMemo(() => countByStatus(ALL_COMPETITIONS), []);

  const catColors   = ["#15427d","#e55a1c","#16a34a","#0ea5e9","#d97706","#7c3aed","#64748b"];
  const catKeys     = Object.keys(catComp);
  const statSegs    = [
    { label: "Ongoing",  value: statComp["ongoing"]  || 0, color: "#16a34a" },
    { label: "Ended",    value: statComp["ended"]     || 0, color: "#dc2626" },
    { label: "Upcoming", value: statComp["upcoming"]  || 0, color: "#d97706" },
    { label: "Draft",    value: statComp["draft"]     || 0, color: "#94a3b8" },
  ].filter(s => s.value > 0);

  const totalComp = ALL_COMPETITIONS.length;
  const totalConf = ALL_CONFERENCES.length;

  return (
    <div className="ur-container">
      {/* ── STAT CARDS ── */}
      <div className="ur-stat-row">
        <div className="ur-stat-card blue">
          <span className="ur-stat-num">{totalComp}</span>
          <span className="ur-stat-label">Competitions Managed</span>
        </div>
        <div className="ur-stat-card orange">
          <span className="ur-stat-num">{totalConf}</span>
          <span className="ur-stat-label">Conferences Organized</span>
        </div>
        <div className="ur-stat-card green">
          <span className="ur-stat-num">{statComp["ongoing"] || 0}</span>
          <span className="ur-stat-label">Currently Active</span>
        </div>
        <div className="ur-stat-card gray">
          <span className="ur-stat-num">{statComp["ended"] || 0}</span>
          <span className="ur-stat-label">Completed Events</span>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="ur-charts-row">
        {/* Monthly competitions bar chart */}
        <div className="ur-chart-card">
          <h4 className="ur-chart-title">📅 Competitions by Month</h4>
          <BarChart data={monthlyComp} color="#15427d" />
        </div>

        {/* Status donut */}
        <div className="ur-chart-card compact">
          <h4 className="ur-chart-title">📊 Competition Status</h4>
          <div className="ur-donut-wrap">
            <DonutChart segments={statSegs} />
            <ul className="ur-legend">
              {statSegs.map((s, i) => (
                <li key={i}>
                  <span className="ur-legend-dot" style={{ background: s.color }} />
                  {s.label}: <strong>{s.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── CATEGORY TABLE ── */}
      <div className="ur-chart-card">
        <h4 className="ur-chart-title">🗂️ Competitions by Category</h4>
        <BarChart
          data={catKeys.map((k, i) => ({ month: k, count: catComp[k], color: catColors[i % catColors.length] }))}
          color="#e55a1c"
        />
      </div>

      {/* ── RECENT COMPETITIONS TABLE ── */}
      <div className="ur-chart-card">
        <h4 className="ur-chart-title">🏆 Recent Competitions</h4>
        <table className="ur-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Organizer</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ALL_COMPETITIONS.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.organizer}</td>
                <td><span className="ur-cat-badge">{c.category}</span></td>
                <td>
                  <span className={`ur-status-badge ur-s-${c.status}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {ALL_CONFERENCES.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.organizer}</td>
                <td><span className="ur-cat-badge">conference</span></td>
                <td><span className="ur-status-badge ur-s-upcoming">upcoming</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
