import { createContext, useContext, useState } from 'react'

const DEMO_NOTIFICATIONS = [
  // ── THÔNG BÁO CUỘC THI ──
  {
    id: 1,
    org: 'Khoa Hệ thống thông tin',
    orgAvatar: null,
    title: 'DS2S Hackathon',
    message: 'Bạn đã theo dõi cuộc thi "DS2S Hackathon 2024 | Beyond the Limits". Đăng ký trước 31/3/2026.',
    type: 'follow',
    category: 'digital',
    faculty: null,
    status: 'ongoing',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
  },
  {
    id: 2,
    org: 'IS Times – HTTT UEL',
    orgAvatar: null,
    title: 'Vietnam SAP ERPSim 2024',
    message: 'Đăng ký của bạn cho "Vietnam SAP ERPSim Student Competition 2024" đã được ghi nhận thành công.',
    type: 'register',
    category: 'business',
    faculty: 'Information Systems',
    status: 'ended',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  
  // ── THÔNG BÁO HỘI THẢO (MỚI THÊM) ──
  {
    id: 4,
    org: 'Viện Pháp luật Kinh tế',
    orgAvatar: null,
    title: 'Hội thảo Trí tuệ nhân tạo',
    message: 'Bạn đã đăng ký tham dự Hội thảo "Chính sách pháp luật về AI" thành công. Vé điện tử đã được gửi qua email.',
    type: 'register',
    category: 'skill',
    faculty: 'Economic Law',
    status: 'upcoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 5,
    org: 'Khoa Kinh tế Quốc tế',
    orgAvatar: null,
    title: 'ICBF 2026',
    message: '📢 Lời nhắc: Hội thảo Quốc tế ICBF 2026 sẽ chính thức bắt đầu vào ngày mai. Đừng quên tham dự nhé!',
    type: 'announcement',
    category: 'business',
    faculty: 'International Economics',
    status: 'upcoming',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: 6,
    org: 'Khoa Quản trị Kinh doanh',
    orgAvatar: null,
    title: 'ICOB 2026',
    message: 'Bạn đã bật thông báo cho Hội thảo Quốc tế ICOB 2026. Chúng tôi sẽ cập nhật cho bạn khi sự kiện mở đăng ký.',
    type: 'follow',
    category: 'strategy',
    faculty: 'Business Administration',
    status: 'ongoing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
  }
]

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS)

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notif,
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => setNotifications([])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications, addNotification, markRead, markAllRead, clearAll, unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>')
  return ctx
}