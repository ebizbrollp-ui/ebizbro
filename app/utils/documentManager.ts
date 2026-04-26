export const getDocs = (userData: any, key: string) => {
  return userData?.documents?.[key] || [];
};

export const isUploaded = (userData: any, key: string) => {
  const doc = userData?.documents?.[key];
  return Array.isArray(doc) ? doc.length > 0 : !!doc;
};