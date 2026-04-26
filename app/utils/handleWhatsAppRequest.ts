export const handleWhatsAppRequest = (
  user: any,
  type: string,
  message: string,
  key: string,
  phone: string
) => {
  // ⏱ Check 24-hour lock
  const lastRequest = localStorage.getItem(key);

  if (lastRequest) {
    const diff = Date.now() - Number(lastRequest);

    if (diff < 24 * 60 * 60 * 1000) {
      alert("⏳ You have already requested. Please try again after 24 hours.");
      return false;
    }
  }

  // 📩 Construct WhatsApp message
  const text = `Hi, I want to request ${type}.

Name: ${user.name}
Email: ${user.email}

Message: ${message}`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  // 🚀 Open WhatsApp
  window.open(url, "_blank");

  // 🔒 Lock for 24h
  localStorage.setItem(key, Date.now().toString());

  alert("✅ Request sent. We will respond within 24 hours.");

  return true;
};