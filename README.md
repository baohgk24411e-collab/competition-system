# Academic Competition Management System (ACMS)

Welcome to the **Academic Competition Management System (ACMS)** – a robust platform designed to centralize and streamline all academic competitions and events for the University of Economics and Law (UEL).

## 🌟 Overview

ACMS serves as a comprehensive hub connecting students, mentors, organizing units, and the Union Office. It simplifies the discovery, registration, organization, and approval processes for academic competitions and scientific research conferences.

## 🏗️ System Architecture

The application is built using a modern frontend architecture focused on performance, modularity, and user experience.

### Tech Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** React Context API (Custom Providers)
- **Styling:** Pure CSS with CSS Grid/Flexbox and responsive media queries
- **Internationalization:** Custom `LanguageContext` (English & Vietnamese)

### Directory Structure & Modules

```text
src/
├── components/          # Reusable UI components (Header, Footer)
├── contexts/            # Global state management
│   ├── LanguageContext.jsx     # i18n logic (EN/VI)
│   └── NotificationContext.jsx # Toast notification system
├── data/                # Mock data / Static assets (temporary DB)
│   ├── competitionsData.js
│   ├── eventData.js
│   └── usersdata.js
├── pages/               # Route-level components grouped by context
│   ├── UnionOffice/     # Union specific views (Dashboard, Reports)
│   ├── Organizer/       # Organizer specific views (Create Event, Dashboard)
│   ├── AboutUsLanding, AnnouncementsLanding, GuidelinesLanding # Info pages
│   ├── HomePage.jsx     # Main authenticated user dashboard
│   ├── ForumPage.jsx    # Discussion forum view
│   ├── ProfilePage.jsx  # User profile management
│   └── ...
├── Landing.jsx          # Public entry page
├── Login.jsx            # Authentication interface
└── main.jsx             # Application entry point and Router configuration
```

## 👥 Role-Based Access Control (RBAC)

The system defines four primary user roles, each with tailored interfaces and permissions:

1. **Sinh viên (Student):**
   - Can view and search for upcoming competitions and conferences.
   - Register for events.
   - Access the community forum and learning resources.
2. **Giảng viên (Mentor):**
   - Guide student projects.
   - Access specific mentor resources and dashboards.
3. **Đơn vị tổ chức (Organizer):**
   - Custom Organizer Dashboard.
   - Create, draft, and submit new events (competitions/conferences).
   - Track participant registrations.
4. **Văn phòng Đoàn (Union Office):**
   - Highest level of event moderation.
   - Approve or reject event proposals submitted by organizers.
   - View overarching statistical reports (charts) on event metrics.

## 🚀 Key Features

- **Dynamic Theming & Localization:** Instant toggle between Vietnamese and English across all system components.
- **Protected Routing:** `RequireAuth` wrapper ensures secure access to specialized dashboards based on active login state.
- **Event Lifecycle Management:** From draft creation by an Organizer to final approval by the Union Office.
- **Responsive Layout:** Engineered to work seamlessly across Desktop, Tablet, and Mobile views.
- **Interactive UI:** Smooth transitions, blurred hero backgrounds, hover states, and dynamic status badges.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 📝 Future Technical Roadmap
- Integration with a strict backend API (Node.js/Express or Spring Boot).
- Implementation of JWT for robust authentication.
- Persisting state with Redux Toolkit or React Query.
- Real-time notifications using WebSockets.
