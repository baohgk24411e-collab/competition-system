import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './LanguageContext'
import { NotificationProvider } from './NotificationContext'

import Landing           from './Landing'
import Login             from './Login'
import Register          from './Register'
import HomePage          from './pages/HomePage'
import ForumPage         from './pages/ForumPage'
import ResourcesPage     from './pages/ResourcesPage'
import Competition       from './Competition'
import CompetitionDetail from './CompetitionDetail'
import Conference        from './Conference'
import ConferenceDetail  from './ConferenceDetail'

// Chỉ giữ duy nhất 1 dòng import ProfilePage
import ProfilePage          from './pages/ProfilePage'
import OrganizerDashboard  from './pages/Organizer/OrganizerDashboard'
import CreateEvent         from './pages/Organizer/CreateEvent'
import UnionDashboard      from './pages/UnionOffice/UnionDashboard'
import AboutUsLanding       from './pages/AboutUsLanding'
import AnnouncementsLanding from './pages/AnnouncementsLanding'
import GuidelinesLanding    from './pages/GuidelinesLanding'
import './index.css'
import UnionDashboard      from './pages/UnionOffice/UnionDashboard'
import './index.css'

function RequireAuth({ children }) {
  const user = localStorage.getItem('uel_auth_user')
  if (!user) return <Navigate to="/login" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            {/* Public Routes */}
            <Route path="/"               element={<Landing />} />
            <Route path="/about-us"       element={<AboutUsLanding />} />
            <Route path="/announcements"  element={<AnnouncementsLanding />} />
            <Route path="/guidelines"     element={<GuidelinesLanding />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />

            {/* Protected Routes */}
            <Route path="/home"             element={<RequireAuth><HomePage /></RequireAuth>} />
            <Route path="/competitions"     element={<RequireAuth><Competition /></RequireAuth>} />
            <Route path="/competition/:id"  element={<RequireAuth><CompetitionDetail /></RequireAuth>} />
            <Route path="/conferences"      element={<RequireAuth><Conference /></RequireAuth>} />
            <Route path="/conference/:id"   element={<RequireAuth><ConferenceDetail /></RequireAuth>} />
            
            {/* Route Profile dùng chung cho mọi role */}
            <Route path="/profile"          element={<RequireAuth><ProfilePage /></RequireAuth>} />

            {/* Organizer routes */}
            <Route path="/organizer"        element={<RequireAuth><OrganizerDashboard /></RequireAuth>} />
            <Route path="/create-event"     element={<RequireAuth><CreateEvent /></RequireAuth>} />

            {/* Union Office routes */}
            <Route path="/union"            element={<RequireAuth><UnionDashboard /></RequireAuth>} />
            
            <Route path="/forum"            element={<RequireAuth><ForumPage /></RequireAuth>} />
            <Route path="/resources"        element={<RequireAuth><ResourcesPage /></RequireAuth>} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>,
)