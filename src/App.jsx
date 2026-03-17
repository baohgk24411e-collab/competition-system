import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { NotificationProvider } from './NotificationContext';

import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import HomePage from './pages/HomePage';
import StudentProfile from './profile/StudentProfile'; // Đảm bảo đường dẫn này đúng

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Route quan trọng */}
            <Route path="/profile" element={<StudentProfile />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;