import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/usersdata";
import { useLanguage } from "../../LanguageContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./CreateEvent.css";

const EVENT_TYPES  = ["Competition", "Conference", "Workshop", "Seminar", "Other"];
const EVENT_LEVELS = ["University Level", "Regional Level", "National Level", "International Level"];
const FORMATS      = ["Online", "Offline", "Hybrid (Online & Offline)"];
const FIELDS       = [
  "Business Intelligence / Data Analytics",
  "Marketing & Communications",
  "Finance & Banking",
  "Information Technology",
  "Law & Governance",
  "Economics & Trade",
  "Other",
];

function CreateEvent() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const imgRef   = useRef();

  const stored   = JSON.parse(localStorage.getItem("uel_auth_user") || "null");
  const liveUser = users.find((u) => u.id === stored?.id) || stored;
  const profile  = liveUser?.profile || {};
  const orgName  = profile.clubName || profile.fullName || liveUser?.username || "";

  const [form, setForm] = useState({
    title:        "",
    type:         "Competition",
    organizer:    orgName,
    faculty:      profile.faculty || "Faculty of Information Systems, UEL",
    field:        FIELDS[0],
    level:        EVENT_LEVELS[0],
    format:       FORMATS[2],
    location:     "University of Economics and Law (UEL), Ho Chi Minh City",
    startDate:    "",
    endDate:      "",
    limitNumber:  "",
    description:  "",
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [submitted,  setSubmitted]  = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (action) => {
    setSubmitted(true);
    if (!form.title || !form.startDate || !form.endDate) return;
    alert(`Event "${form.title}" has been ${action === "submit" ? "submitted for approval" : action === "draft" ? "saved as draft" : "previewed"}!`);
    if (action === "submit") navigate("/organizer");
  };

  const field = (label, key, type = "text", extraProps = {}) => (
    <div className="ce-field" key={key}>
      <label className="ce-label">{label}</label>
      <input
        type={type}
        className={`ce-input ${submitted && !form[key] ? "error" : ""}`}
        value={form[key]}
        onChange={handleChange(key)}
        {...extraProps}
      />
    </div>
  );

  const selectField = (label, key, options) => (
    <div className="ce-field" key={key}>
      <label className="ce-label">{label}</label>
      <select className="ce-input ce-select" value={form[key]} onChange={handleChange(key)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="create-event-page">
      {/* Blurred UEL background */}
      <div className="ce-bg-blur" />
      <Header />
      <main className="ce-main">

        {/* ── ORG HERO (mini) ── */}
        <div className="ce-org-hero">
          <div
            className="ce-cover"
            style={{ backgroundImage: `url(${profile.coverImage || "/5.jpg"})` }}
          />
          <div className="ce-org-row">
            <div className="ce-org-identity">
              <div className="ce-avatar-circle">
                {profile.avatar
                  ? <img src={profile.avatar} alt={orgName} className="ce-avatar-img" />
                  : <span className="ce-avatar-letter">{orgName.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="ce-org-name-block">
                <h1 className="ce-org-name">{orgName}</h1>
                <p className="ce-org-bio">{profile.bio}</p>
              </div>
            </div>
            <div className="ce-org-btns">
              <button className="ce-btn-outline" onClick={() => navigate("/organizer")}>⚙️ {t("org_article_mgmt")}</button>
              <button className="ce-btn-solid">✏️ {t("org_create_event")}</button>
            </div>
          </div>
        </div>

        {/* ── FORM ── */}
        <section className="ce-section">
          <h2 className="ce-section-heading">CREATE NEW EVENT</h2>

          <div className="ce-form-card">

            {/* BASIC INFORMATION */}
            <div className="ce-block">
              <h3 className="ce-block-title">BASIC INFORMATION</h3>
              <div className="ce-form-layout">

                {/* Image upload */}
                <div className="ce-img-upload" onClick={() => imgRef.current.click()}>
                  {previewImg
                    ? <img src={previewImg} alt="Event poster" className="ce-img-preview" />
                    : <div className="ce-img-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="3"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                  }
                  <input ref={imgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                  <p className="ce-img-label">Upload Image<br/>(.png / .jpg)</p>
                </div>

                {/* Fields grid */}
                <div className="ce-fields-grid">
                  {field("Event Title",          "title",     "text", { placeholder: "E.g. BUSINESS INTELLIGENCE COMPETITION SEASON 9" })}
                  {selectField("Event Type",         "type",     EVENT_TYPES)}
                  {field("Organizer Name",        "organizer")}
                  {field("Faculty / Organization","faculty")}
                  {selectField("Field / Discipline",  "field",    FIELDS)}
                  {selectField("Event Level",         "level",    EVENT_LEVELS)}
                  {selectField("Format",              "format",   FORMATS)}
                  {field("Location",             "location")}
                </div>
              </div>
            </div>

            {/* TIMELINE + PARTICIPATION */}
            <div className="ce-two-col">
              <div className="ce-block">
                <h3 className="ce-block-title">TIMELINE</h3>
                <div className="ce-inline-fields">
                  {field("Start Date", "startDate", "date")}
                  {field("End Date",   "endDate",   "date")}
                </div>
              </div>
              <div className="ce-block">
                <h3 className="ce-block-title">PARTICIPATION</h3>
                {field("Limit Number", "limitNumber", "number", { min: 1 })}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="ce-block">
              <h3 className="ce-block-title">DESCRIPTION</h3>
              <textarea
                className="ce-textarea"
                placeholder="Describe the event, objectives, target audience, prizes, etc."
                value={form.description}
                onChange={handleChange("description")}
                rows={6}
              />
            </div>

            {/* ACTIONS */}
            <div className="ce-footer-actions">
              <button className="ce-action-btn preview"  onClick={() => handleSubmit("preview")}>Preview</button>
              <button className="ce-action-btn draft"    onClick={() => handleSubmit("draft")}>Save Draft</button>
              <button className="ce-action-btn submit"   onClick={() => handleSubmit("submit")}>Submit for Approval</button>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default CreateEvent;