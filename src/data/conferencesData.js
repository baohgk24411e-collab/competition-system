// src/data/conferencesData.js

export const CONFERENCES_DATA = [
  {
    id: 1,
    title: "ICBF 2025 – International Conference on Business and Finance",
    organizer: "UEH University",
    status: "upcoming",
    category: "business",
    poster: "/HT_ICBF.png",
    startDate: "2025-11-01",
    location: "Cơ sở B, UEH University, TP.HCM",
    website: "https://icbf.ueh.edu.vn",
    description:
      "Hội thảo Quốc tế về Kinh doanh và Tài chính (ICBF 2025) là diễn đàn học thuật thường niên nhằm chia sẻ các nghiên cứu mới nhất, thảo luận về xu hướng tài chính toàn cầu và các mô hình kinh doanh đổi mới sáng tạo trong bối cảnh hội nhập quốc tế.",
    fee: "2.500.000 VNĐ (Tác giả) / Miễn phí (Sinh viên dự thính)",
    format: "Hybrid (Trực tiếp kết hợp Trực tuyến)",
    regPeriod: "01/08/2025 - 15/10/2025",
    eligibility: "Giảng viên, Nhà nghiên cứu, Chuyên gia và Sinh viên toàn quốc",
    email: "icbf@ueh.edu.vn",
    isExternal: true,
    agenda: [
      {
        phase: "Opening Ceremony",
        date: "08:00 - 09:00",
        desc: "Phát biểu khai mạc và Keynote Speech 1 từ Giáo sư khách mời.",
      },
      {
        phase: "Parallel Sessions",
        date: "09:30 - 11:30",
        desc: "Trình bày tham luận tại các tiểu ban Kinh doanh, Tài chính, Kế toán.",
      },
      {
        phase: "Networking Lunch",
        date: "11:30 - 13:30",
        desc: "Giao lưu kết nối mạng lưới học thuật.",
      },
    ],
    speakers: [
      {
        role: "Keynote Speaker",
        name: "Prof. David Smith",
        title: "Giáo sư Kinh tế, University of Oxford",
        avatar: null,
      },
      {
        role: "Guest Speaker",
        name: "Dr. Nguyen Van A",
        title: "Chuyên gia Tài chính, UEH",
        avatar: null,
      },
    ],
    benefits: [
      "Được cấp Giấy chứng nhận tham gia Hội thảo Quốc tế.",
      "Cơ hội xuất bản bài báo trên các tạp chí thuộc danh mục ISI/Scopus.",
      "Giao lưu với các học giả hàng đầu trong và ngoài nước.",
    ],
  },
  {
    id: 2,
    title: "ICOB 2025 – International Conference of Business Theories & Practices",
    organizer: "UEH College of Business",
    status: "upcoming",
    category: "business",
    poster: "/HT_ICOB.png",
    startDate: "2025-11-17",
    location: "Cơ sở A, UEH, TP.HCM",
    description:
      "ICOB 2025 tập trung vào việc thu hẹp khoảng cách giữa lý thuyết học thuật và thực tiễn doanh nghiệp. Hội thảo mở ra không gian tranh luận về các mô hình quản trị hiện đại, marketing số và chiến lược phát triển bền vững.",
    fee: "Miễn phí dự thính",
    format: "Trực tiếp (Offline)",
    regPeriod: "01/09/2025 - 10/11/2025",
    eligibility: "Sinh viên, học viên cao học khối ngành Kinh tế",
    isExternal: true,
    agenda: [
      {
        phase: "Plenary Session",
        date: "08:30 - 10:00",
        desc: "Phiên toàn thể: Chuyển đổi số trong thực tiễn doanh nghiệp.",
      },
      {
        phase: "Workshop",
        date: "10:15 - 12:00",
        desc: "Thực hành giải quyết Case Study thực tế từ đối tác doanh nghiệp.",
      },
    ],
    speakers: [
      {
        role: "Speaker",
        name: "Mr. Tran Bao",
        title: "CEO Business Solutions",
        avatar: null,
      },
    ],
    benefits: [
      "Nhận tài liệu độc quyền từ các diễn giả.",
      "Cơ hội trở thành Management Trainee tại các công ty đối tác.",
    ],
  },
  {
    id: 3,
    title:
      "Vận hành mô hình chính quyền địa phương 02 cấp – Thực trạng tại TP.HCM và giải pháp",
    organizer: "Trường Đại học Kinh tế - Luật (UEL)",
    status: "upcoming",
    category: "strategy",
    poster: "/HT_KH.jpg",
    startDate: "2025-12-05",
    location: "Hội trường A, Trường ĐH Kinh tế - Luật",
    website: "https://uel.edu.vn/hoithao",
    description:
      "Hội thảo khoa học cấp Quốc gia phân tích chuyên sâu về mô hình chính quyền đô thị, tổ chức bộ máy và cơ chế vận hành của chính quyền địa phương 2 cấp tại TP.HCM. Mục tiêu nhằm đề xuất các giải pháp nâng cao hiệu quả quản lý nhà nước.",
    fee: "Miễn phí",
    format: "Trực tiếp (Offline)",
    regPeriod: "01/11/2025 - 30/11/2025",
    eligibility:
      "Cán bộ quản lý nhà nước, Giảng viên, Nghiên cứu sinh và Sinh viên Luật",
    email: "khoaluat@uel.edu.vn",
    isExternal: false,
    agenda: [
      {
        phase: "Đón khách & Phát biểu",
        date: "07:30 - 08:30",
        desc: "Đón tiếp đại biểu và phát biểu đề dẫn.",
      },
      {
        phase: "Tham luận 1",
        date: "08:30 - 09:30",
        desc: "Thực trạng mô hình chính quyền đô thị tại TP.HCM.",
      },
      {
        phase: "Thảo luận bàn tròn",
        date: "09:45 - 11:30",
        desc: "Phân tích vướng mắc pháp lý và đề xuất sửa đổi Luật.",
      },
    ],
    speakers: [
      {
        role: "Chủ tọa",
        name: "PGS.TS. Lê Tuấn Lộc",
        title: "Bí thư Đảng ủy, Chủ tịch Hội đồng trường UEL",
        avatar: null,
      },
      {
        role: "Diễn giả",
        name: "TS. Nguyễn Văn B",
        title: "Đại diện Sở Nội vụ TP.HCM",
        avatar: null,
      },
    ],
    benefits: [
      "Cập nhật kiến thức thực tiễn nhất về Luật Hành chính và chính quyền đô thị.",
      "Được cộng điểm rèn luyện (đối với sinh viên UEL).",
      "Cơ hội nhận kỷ yếu hội thảo.",
    ],
  },
  {
    id: 4,
    title:
      "Hội thảo khoa học quốc gia: Hướng tới mục tiêu tiếng Anh trở thành ngôn ngữ thứ hai",
    organizer: "REK Institute & Thanh Do University",
    status: "ended",
    category: "skill",
    poster: "/HT_KHQG.jpg",
    startDate: "2024-12-01",
    location: "Trường Đại học Thành Đô, Hà Nội",
    description:
      "Sự kiện khoa học thảo luận về lộ trình, chính sách và phương pháp giáo dục nhằm hiện thực hóa mục tiêu đưa tiếng Anh trở thành ngôn ngữ thứ hai tại Việt Nam theo định hướng của chính phủ.",
    fee: "Không thu phí",
    format: "Trực tiếp (Offline)",
    regPeriod: "Đã kết thúc",
    eligibility:
      "Nhà hoạch định chính sách, Giáo viên, Giảng viên ngôn ngữ",
    isExternal: true,
    agenda: [
      {
        phase: "Khai mạc",
        date: "08:00 - 08:30",
        desc: "Tuyên bố lý do và định hướng hội thảo.",
      },
      {
        phase: "Trình bày báo cáo",
        date: "08:30 - 11:00",
        desc: "Các tham luận về phương pháp giảng dạy tiếng Anh chuẩn quốc tế.",
      },
    ],
    speakers: [],
    benefits: ["Kỷ yếu hội thảo", "Chứng nhận tham gia cấp Quốc gia"],
  },
  {
    id: 5,
    title:
      "Chính sách pháp luật về trí tuệ nhân tạo – Cơ hội và thách thức",
    organizer: "Đại học Tài chính – Ngân hàng Hà Nội",
    status: "upcoming",
    category: "tech",
    poster: "/HT_NHHN.jpg",
    startDate: "2026-03-18",
    location: "Trực tuyến qua Zoom & Offline tại Hà Nội",
    description:
      "AI đang len lỏi vào mọi mặt của đời sống nhưng khung pháp lý vẫn còn bỏ ngỏ. Hội thảo này sẽ phân tích các rủi ro pháp lý, bảo mật dữ liệu, bản quyền và trách nhiệm hình sự/dân sự liên quan đến AI.",
    fee: "Miễn phí",
    format: "Hybrid",
    regPeriod: "01/02/2026 - 15/03/2026",
    eligibility: "Sinh viên Luật, CNTT, Chuyên gia pháp lý",
    isExternal: true,
    agenda: [
      {
        phase: "Keynote",
        date: "08:30 - 09:30",
        desc: "Tổng quan về AI Act của Châu Âu và bài học cho Việt Nam.",
      },
      {
        phase: "Q&A",
        date: "10:00 - 11:30",
        desc: "Hỏi đáp cùng các luật sư công nghệ.",
      },
    ],
    speakers: [
      {
        role: "Chuyên gia",
        name: "LS. Phạm Văn C",
        title: "Luật sư mảng Công nghệ - Viễn thông",
        avatar: null,
      },
    ],
    benefits: [
      "Hiểu rõ xu hướng lập pháp công nghệ tương lai.",
      "Giao lưu cùng chuyên gia hàng đầu về Cyber Law.",
    ],
  },
  {
    id: 6,
    title:
      "Hướng đến bản án nữ quyền Việt Nam – VFJ 2025",
    organizer: "Trường Đại học Kinh tế - Luật (UEL)",
    status: "ended",
    category: "strategy",
    poster: "/HT_NQ.jpg",
    startDate: "2025-08-01",
    location: "Phòng Hội thảo cơ sở Bình Triệu, UEL",
    description:
      "Dự án Bản án nữ quyền Việt Nam (VFJ) là sáng kiến học thuật nhằm xem xét lại và viết lại các bản án đã có hiệu lực dưới lăng kính giới và nữ quyền, hướng tới sự công bằng và bình đẳng thực chất trong tư pháp.",
    fee: "Miễn phí",
    format: "Trực tiếp",
    regPeriod: "Đã kết thúc",
    eligibility:
      "Sinh viên Khoa Luật, những người quan tâm đến bình đẳng giới",
    isExternal: false,
    agenda: [
      {
        phase: "Mở đầu",
        date: "08:00 - 08:30",
        desc: "Giới thiệu về phong trào Feminist Judgments trên thế giới.",
      },
      {
        phase: "Trình bày bản án",
        date: "08:30 - 10:30",
        desc: "Công bố các bản án được viết lại và lập luận tư pháp.",
      },
    ],
    speakers: [],
    benefits: [],
  },
  {
    id: 7,
    title:
      "Pháp luật và Trí tuệ nhân tạo – Le Droit et l’Intelligence Artificielle",
    organizer: "Trường Đại học Kinh tế - Luật (UEL)",
    status: "upcoming",
    category: "tech",
    poster: "/HT_QT.jpeg",
    startDate: "2025-11-27",
    location:
      "Trường ĐH Kinh tế - Luật (Kết nối trực tuyến với Pháp)",
    description:
      "Hội thảo quốc tế Việt - Pháp với sự phối hợp của các trường Đại học luật tại Pháp. Thảo luận các vấn đề hóc búa nhất: Trí tuệ nhân tạo có thể là chủ thể của pháp luật hay không? Trách nhiệm bồi thường thiệt hại khi AI gây lỗi.",
    fee: "Miễn phí",
    format: "Hybrid (Việt Nam & Pháp)",
    regPeriod: "01/10/2025 - 20/11/2025",
    eligibility:
      "Chuyên gia pháp lý, Giảng viên, Nghiên cứu sinh",
    isExternal: false,
    agenda: [
      {
        phase: "Session 1",
        date: "14:00 - 15:30",
        desc: "Trình bày của các giáo sư từ Đại học Panthéon-Assas (Paris II).",
      },
      {
        phase: "Session 2",
        date: "15:45 - 17:00",
        desc: "Quan điểm từ hệ thống pháp luật Việt Nam.",
      },
    ],
    speakers: [
      {
        role: "Keynote (Pháp)",
        name: "Prof. Jean Dubois",
        title: "Professor of Law, Paris II",
        avatar: null,
      },
      {
        role: "Moderator",
        name: "TS. Nguyễn Minh D",
        title: "Giảng viên Luật UEL",
        avatar: null,
      },
    ],
    benefits: [
      "Nghe dịch cabin trực tiếp Việt - Pháp.",
      "Tiếp cận tư duy lập pháp tiên tiến của Châu Âu.",
    ],
  },
  {
    id: 8,
    title:
      "UEL SEBL 2025 – Sustainability in Economics, Business and Law",
    organizer: "University of Economics and Law",
    status: "upcoming",
    category: "business",
    poster: "/HT_SEBL.jpg",
    startDate: "2025-11-21",
    location: "Hội trường A, UEL, TP.HCM",
    description:
      "Hội thảo quốc tế SEBL 2025 do UEL tổ chức, tập trung vào mô hình kinh tế tuần hoàn, tín chỉ carbon, tiêu chuẩn ESG (Môi trường, Xã hội, Quản trị) và các khung pháp lý để phát triển bền vững trong thập kỷ tới.",
    fee: "Miễn phí sinh viên UEL",
    format: "Trực tiếp",
    regPeriod: "Từ nay đến 10/11/2025",
    eligibility: "Toàn bộ sinh viên, chuyên gia",
    isExternal: false,
    agenda: [
      {
        phase: "Khai mạc",
        date: "08:00 - 08:30",
        desc: "Welcome address from the Board of Rectors.",
      },
      {
        phase: "Keynote ESG",
        date: "08:30 - 09:30",
        desc: "Tiêu chuẩn ESG trong báo cáo tài chính doanh nghiệp.",
      },
    ],
    speakers: [],
    benefits: ["Được cộng 02 điểm rèn luyện.", "Nhận E-certificate cấp bởi UEL."],
  },
  {
    id: 9,
    title:
      "IASC-ARS 2025 – International Association for Statistical Computing",
    organizer: "VIASM & UEH University",
    status: "upcoming",
    category: "data",
    poster: "/HT_UEH.png",
    startDate: "2025-12-04",
    location: "Cơ sở B, UEH, TP.HCM",
    website: "https://iascars2025.ueh.edu.vn",
    description:
      "Hội nghị Hiệp hội Máy tính Thống kê Quốc tế (Khu vực Châu Á - Thái Bình Dương). Nơi quy tụ các nhà khoa học dữ liệu, toán học ứng dụng và thống kê để chia sẻ về Machine Learning, Big Data và mô hình dự báo kinh tế.",
    fee: "Theo quy định ban tổ chức",
    format: "Trực tiếp",
    regPeriod: "01/06/2025 - 30/10/2025",
    eligibility:
      "Nhà nghiên cứu Data Science, Thống kê, Sinh viên",
    isExternal: true,
    agenda: [
      {
        phase: "Data Workshop",
        date: "Dec 04, 09:00",
        desc: "Advanced R and Python for Statistical Computing.",
      },
      {
        phase: "Main Conference",
        date: "Dec 05-06",
        desc: "Presentations and Poster Sessions.",
      },
    ],
    speakers: [
      {
        role: "President IASC",
        name: "Prof. E",
        title: "Chuyên gia Thống kê",
        avatar: null,
      },
    ],
    benefits: [
      "Xuất bản bài nghiên cứu quốc tế.",
      "Giao lưu cộng đồng Khoa học dữ liệu.",
    ],
  },
];