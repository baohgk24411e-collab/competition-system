import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function StudentProfile() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f6f8' }}>
      <Header />
      
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#1a3a6b', marginBottom: '10px' }}>Trang Hồ sơ Sinh viên</h2>
          <p style={{ color: '#6b7280' }}>Giao diện Profile đang được xây dựng...</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default StudentProfile;