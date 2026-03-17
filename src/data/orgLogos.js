/**
 * Map tên tổ chức → đường dẫn logo (public/logos/)
 * Dùng chung cho Competition, CompetitionDetail, NotificationPopup
 * Những org chưa có logo sẽ fallback về null → hiển thị icon mặc định
 */
const ORG_LOGOS = {
  'Marketing UEL Club':          '/Logo_Digital_creatory.jpg',
  'AI4I Club UEL':               '/AI4I.jpg',
  'FinTech Club':                '/Logo_Attacker.jpg',
  'IS Times – HTTT UEL':         '/Logo_ISTimes.png',
  'ITB Club':                    '/Logo_ITB.jpg',
  'International Business Club': '/Logo_IBC.jpg',  
  'WAPA':                        '/Logo_WAPA.jpg',
  'ESC Club':                    '/Logo_ECS.jpg',
  'FESE Club':                   '/Logo_FESE.jpg',
  'UEL Club':                    '/logo.jpg',
  'Marketing Hive':              '/Logo_MarHive.jpg',
  'UEH':                         '/Logo_CMO.jpg',
  'FTU':                         '/Logo_DAZONE.jpg',
}

/**
 * Lấy logo của org, fallback về null nếu chưa có
 * @param {string} org - tên tổ chức
 * @returns {string|null}
 */
export function getOrgLogo(org) {
  return ORG_LOGOS[org] ?? null
}