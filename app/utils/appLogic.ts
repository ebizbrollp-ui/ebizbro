export const hasAccess = (userData: any, service: string) => {
  if (!userData) return false;

  const s = userData.services || {};

  // 🔥 VCFO OVERRIDE (MASTER ACCESS)
  if (s.vcfo === true) return true;

  switch (service) {
    case "itr":
      return s.itr === true;

    case "gst":
      return s.gst === true;

    case "legal":
      return s.legal === true;

    case "vcfo":
      return s.vcfo === true;

    default:
      return false;
  }
};

// ================= DOCUMENT FETCH =================
export const getDoc = (userData: any, key: string) => {
  if (!userData) return [];
  return userData.documents?.[key] || [];
};

// ================= UPLOAD CHECK =================
export const isUploaded = (userData: any, key: string) => {
  const doc = userData?.documents?.[key];

  if (Array.isArray(doc)) {
    return doc.length > 0;
  }

  return !!doc;
};