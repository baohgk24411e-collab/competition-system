import { createContext, useContext, useState } from 'react'

/* ─── Translations ────────────────────────────────────────────
   Thêm key mới vào cả EN và VI cùng lúc để không bị thiếu.
   Dùng: const { t, language, setLanguage } = useLanguage()
         t('key') → trả về string theo ngôn ngữ hiện tại
─────────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    /* ── HEADER ── */
    nav_home:         'Home',
    nav_competitions: 'Competitions',
    nav_conferences:  'Conferences',
    nav_forum:        'Forum',
    nav_resources:    'Resources',

    /* ── COMPETITION PAGE ── */
    search_placeholder:   'Search competitions...',
    filter_btn:           'Filter',
    filter_category:      'Category',
    filter_status:        'Status',
    filter_source:        'Source',
    filter_all:           'All',
    filter_ongoing:       'Ongoing',
    filter_upcoming:      'Upcoming',
    filter_ended:         'Ended',
    filter_internal:      'Internal',
    filter_external:      'External',
    cat_business:         'Business',
    cat_digital:          'Digital',
    cat_strategy:         'Strategy',
    cat_marketing:        'Marketing',
    cat_data:             'Data',
    no_results:           'No competitions found.',
    badge_internal:       'INTERNAL',
    badge_external:       'EXTERNAL',
    status_badge_ongoing: 'ONGOING',
    status_badge_ended:   'ENDED',
    status_badge_upcoming:'UPCOMING',
    status_badge_soon:    'STARTS SOON',
    modal_view_detail:    'View full details →',
    modal_rounds:         'Rounds',

    /* ── CONFERENCE PAGE & DETAIL ── */
    search_conf_placeholder: 'Search conferences...',
    cat_tech:           'Technology',
    cat_career:         'Career',
    cat_skill:          'Skills',
    btn_interested:     'Follow',
    status_reg_open:    'REGISTRATION OPEN',
    section_agenda:     'Event Agenda',
    section_speakers:   'Guest Speakers',
    section_benefits:   'Benefits & Notes',
    msg_follow_event:   'You have turned on notifications for',

    /* ── COMPETITION DETAIL ── */
    back_btn:             '← Back',
    btn_ranking:          'Rankings',
    btn_monitor:          'Follow',
    btn_register:         'Register Now',
    links_title:          'Official Links',
    link_website:         '🌐 Official Website',
    link_booklet:         '📄 Contest Booklet',
    link_qna:             '❓ Q&A Padlet',
    link_fanpage:         '👍 Fanpage',
    link_group:           '💬 Contestant Group',
    status_ongoing:       'ONGOING',
    status_upcoming:      'COMING SOON',
    status_ended:         'ENDED',
    detail_fee:           '💰 Entry Fee',
    detail_format:        '👥 Format',
    detail_regperiod:     '📅 Registration Period',
    detail_eligibility:   '🎓 Eligibility',
    detail_contact:       '📬 Contact',
    section_timeline:     'Competition Journey',
    section_prizes:       'Prize Structure',
    section_rules:        '📋 Rules & Notes',
    organizer_label:      '🏢',

    /* ── FOOTER ── */
    footerDesc:
      'Academic Competition & Conference Management System of the University of Economics and Law, developed to manage, organize, and support registration for academic competitions and conferences for UEL students.',
    newsletterTitle:      'SUBSCRIBE TO OUR NEWSLETTER',
    newsletterSub:        'Sign up now for the latest updates on news, events, and admission.',
    emailPlaceholder:     'Enter your email...',
    sendBtn:              'SEND →',
    sentBtn:              '✓ SENT',
    subscribeThanks:      'Thanks for subscribing!',
    contactUs:            'CONTACT US',
    seeMore:              'See more »',
    universityName:       'VIET NAM NATIONAL UNIVERSITY HO CHI MINH CITY',
    universitySubName:    'UNIVERSITY OF ECONOMICS AND LAW',
    getInTouch:           'Get in touch',
    copyright:
      'Copyright © 2026 — University of Economics and Law, Vietnam National University Ho Chi Minh City',

    /* ── AUTH / LOGIN ── */
    home:               'Home',
    aboutUs:            'About Us',
    announcements:      'Announcements',
    guidelines:         'Guidelines',
    student:            'Student',
    mentor:             'Mentor',
    organizingUnits:    'Organizing Units',
    unionOffice:        'Union Office',
    logIn:              'Log In',
    usernameOrEmail:    'Username or email',
    password:           'Password',
    lostPassword:       'Forgot password?',
    loginWithAccount:   'Or continue with',
    noAccount:          'Don\'t have an account?',
    register:           'Register',
    backToHome:         'Back to Home',
    pleaseEnterInfo:    'Please fill in all fields.',
    loginSuccess:       'Login successful! Redirecting...',
    loginError:         'Incorrect username or password.',
    cookies:            'Cookie Settings',
    profile:            'My Profile',

    /* ── ORGANIZER DASHBOARD ── */
    org_tab_published:          'Approval / Published',
    org_tab_draft:              'Draft',
    org_tab_past:               'Past',
    org_view_profile:           'View Profile',
    org_article_mgmt:           'Article Management',
    org_create_event:           'Create New Event',
    org_no_events:              'No events in this category yet.',
    org_status_ongoing:         'Ongoing',
    org_status_ended:           'Ended',
    org_status_upcoming:        'Upcoming',
    org_btn_view_detail:        'View Detail',
    org_btn_attendance:         'Attendance Check',
    org_btn_announcement:       'Announcement',
    org_announcement:           'Announcement',
    org_announcement_placeholder:'Write your announcement here...',
    org_announcement_sent:      'Announcement sent!',
    org_btn_send:               'Send',
    org_btn_cancel:             'Cancel',

    /* ── UNION DASHBOARD ── */
    union_events_list:          'EVENTS LIST',
    union_filter_label:         'Filter by status:',
    union_nav_events:           'Event Approval Management',
    union_nav_participate:      'Participation Management',
    union_nav_reports:          'Reports',
    union_col_id:               'ID',
    union_col_title:            'Title',
    union_col_organizer:        'Organizer',
    union_col_date:             'Submission Date',
    union_col_status:           'Status',
    union_col_actions:          'Actions',
    union_btn_view:             'View Detail',
    union_btn_approve:          'Approve',
    union_btn_reject:           'Reject',

    /* ── REPORTS ── */
    reports_comp_managed:       'Competitions Managed',
    reports_conf_organized:     'Conferences Organized',
    reports_active:             'Currently Active',
    reports_completed:          'Completed Events',
    reports_monthly_chart:      '📅 Competitions by Month',
    reports_status_chart:       '📊 Competition Status',
    reports_category_chart:     '🗂️ Competitions by Category',
    reports_recent:             '🏆 Recent Competitions',
  },

  vi: {
    /* ── HEADER ── */
    nav_home:         'Trang chủ',
    nav_competitions: 'Cuộc thi',
    nav_conferences:  'Hội thảo',
    nav_forum:        'Diễn đàn',
    nav_resources:    'Tài nguyên',

    /* ── COMPETITION PAGE ── */
    search_placeholder:   'Tìm kiếm cuộc thi...',
    filter_btn:           'Lọc',
    filter_category:      'Lĩnh vực',
    filter_status:        'Trạng thái',
    filter_source:        'Nguồn gốc',
    filter_all:           'Tất cả',
    filter_ongoing:       'Đang diễn ra',
    filter_upcoming:      'Sắp diễn ra',
    filter_ended:         'Đã kết thúc',
    filter_internal:      'Nội bộ UEL',
    filter_external:      'Ngoài trường',
    cat_business:         'Kinh doanh',
    cat_digital:          'Kỹ thuật số',
    cat_strategy:         'Chiến lược',
    cat_marketing:        'Marketing',
    cat_data:             'Dữ liệu',
    no_results:           'Không tìm thấy cuộc thi.',
    badge_internal:       'NỘI BỘ',
    badge_external:       'NGOÀI TRƯỜNG',
    status_badge_ongoing: 'ĐANG DIỄN RA',
    status_badge_ended:   'ĐÃ KẾT THÚC',
    status_badge_upcoming:'SẮP DIỄN RA',
    status_badge_soon:    'SẮP MỞ',
    modal_view_detail:    'Xem chi tiết đầy đủ →',
    modal_rounds:         'Vòng',

    /* ── CONFERENCE PAGE & DETAIL ── */
    search_conf_placeholder: 'Tìm kiếm hội thảo...',
    cat_tech:           'Công nghệ',
    cat_career:         'Nghề nghiệp',
    cat_skill:          'Kỹ năng',
    btn_interested:     'Quan tâm',
    status_reg_open:    'ĐANG MỞ ĐĂNG KÝ',
    section_agenda:     'Lịch trình sự kiện',
    section_speakers:   'Diễn giả khách mời',
    section_benefits:   'Quyền lợi & Lưu ý',
    msg_follow_event:   'Bạn đã bật thông báo cho sự kiện',

    /* ── COMPETITION DETAIL ── */
    back_btn:             '← Quay lại',
    btn_ranking:          'Bảng xếp hạng',
    btn_monitor:          'Theo dõi',
    btn_register:         'Đăng ký ngay',
    links_title:          'Liên kết chính thức',
    link_website:         '🌐 Website cuộc thi',
    link_booklet:         '📄 Booklet thể lệ',
    link_qna:             '❓ Padlet Q&A',
    link_fanpage:         '👍 Fanpage',
    link_group:           '💬 Group thí sinh',
    status_ongoing:       'ĐANG DIỄN RA',
    status_upcoming:      'SẮP DIỄN RA',
    status_ended:         'ĐÃ KẾT THÚC',
    detail_fee:           '💰 Lệ phí',
    detail_format:        '👥 Hình thức',
    detail_regperiod:     '📅 Thời gian đăng ký',
    detail_eligibility:   '🎓 Đối tượng',
    detail_contact:       '📬 Liên hệ',
    section_timeline:     'Hành trình cuộc thi',
    section_prizes:       'Cơ cấu giải thưởng',
    section_rules:        '📋 Lưu ý & Quy định',
    organizer_label:      '🏢',

    /* ── FOOTER ── */
    footerDesc:
      'Hệ thống Quản lý Cuộc thi và Hội thảo Học thuật của Trường Đại học Kinh tế – Luật, được phát triển nhằm quản lý, tổ chức và hỗ trợ đăng ký tham gia các cuộc thi và hội thảo học thuật cho sinh viên UEL.',
    newsletterTitle:      'ĐĂNG KÝ NHẬN BẢN TIN',
    newsletterSub:        'Đăng ký ngay để nhận thông tin mới nhất về tin tức, sự kiện và tuyển sinh.',
    emailPlaceholder:     'Nhập email của bạn...',
    sendBtn:              'GỬI →',
    sentBtn:              '✓ ĐÃ GỬI',
    subscribeThanks:      'Cảm ơn bạn đã đăng ký!',
    contactUs:            'LIÊN HỆ',
    seeMore:              'Xem thêm »',
    universityName:       'ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH',
    universitySubName:    'TRƯỜNG ĐẠI HỌC KINH TẾ – LUẬT',
    getInTouch:           'Kết nối với chúng tôi',
    copyright:
      'Bản quyền © 2026 — Trường Đại học Kinh tế – Luật, Đại học Quốc gia TP. Hồ Chí Minh',

    /* ── AUTH / LOGIN ── */
    home:               'Trang chủ',
    aboutUs:            'Về chúng tôi',
    announcements:      'Thông báo',
    guidelines:         'Hướng dẫn',
    student:            'Sinh viên',
    mentor:             'Giảng viên',
    organizingUnits:    'Đơn vị tổ chức',
    unionOffice:        'Văn phòng Đoàn',
    logIn:              'Đăng nhập',
    usernameOrEmail:    'Tên đăng nhập hoặc email',
    password:           'Mật khẩu',
    lostPassword:       'Quên mật khẩu?',
    loginWithAccount:   'Hoặc tiếp tục bằng',
    noAccount:          'Chưa có tài khoản?',
    register:           'Đăng ký',
    backToHome:         'Quay lại trang chủ',
    pleaseEnterInfo:    'Vui lòng nhập đầy đủ thông tin.',
    loginSuccess:       'Đăng nhập thành công! Đang chuyển hướng...',
    loginError:         'Sai tên đăng nhập hoặc mật khẩu.',
    cookies:            'Cài đặt Cookie',
    profile:            'Hồ sơ cá nhân',

    /* ── ORGANIZER DASHBOARD ── */
    org_tab_published:          'Đã duyệt / Đã đăng',
    org_tab_draft:              'Bản nháp',
    org_tab_past:               'Đã qua',
    org_view_profile:           'Xem hồ sơ',
    org_article_mgmt:           'Quản lý bài viết',
    org_create_event:           'Tạo sự kiện mới',
    org_no_events:              'Chưa có sự kiện nào trong mục này.',
    org_status_ongoing:         'Đang diễn ra',
    org_status_ended:           'Đã kết thúc',
    org_status_upcoming:        'Sắp diễn ra',
    org_btn_view_detail:        'Xem chi tiết',
    org_btn_attendance:         'Điểm danh',
    org_btn_announcement:       'Thông báo',
    org_announcement:           'Thông báo',
    org_announcement_placeholder:'Viết thông báo của bạn tại đây...',
    org_announcement_sent:      'Đã gửi thông báo!',
    org_btn_send:               'Gửi',
    org_btn_cancel:             'Hủy',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('vi')

  const t = (key) =>
    TRANSLATIONS[language][key] ??
    TRANSLATIONS['en'][key] ??
    key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}