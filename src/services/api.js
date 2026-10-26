// ── Mock API Service Layer ────────────────────────────────────────────────────
// Replace these mock implementations with real API calls (bKash, SSLCommerz, etc.)

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin = async (customerId, password) => {
  await delay(800);
  if (customerId === 'RL-001234' && password === '1234') {
    return { success: true, token: 'mock-jwt-token', customerId };
  }
  throw new Error('Invalid credentials. Try RL-001234 / 1234');
};

export const apiRequestOTP = async (mobile) => {
  await delay(500);
  return { success: true, message: `OTP sent to ${mobile}` };
};

export const apiVerifyOTP = async (mobile, otp) => {
  await delay(600);
  if (otp === '1234') return { success: true, token: 'mock-otp-token' };
  throw new Error('Invalid OTP');
};

// ── Billing ───────────────────────────────────────────────────────────────────
export const apiFetchBill = async (customerId) => {
  await delay(700);
  const bills = {
    'RL-001234': { customerId: 'RL-001234', name: 'Mohammad Karim', amount: 900, package: 'Standard 50 Mbps', dueDate: '2025-11-05', status: 'Due' },
    'RL-005678': { customerId: 'RL-005678', name: 'Fatema Begum', amount: 500, package: 'Starter 20 Mbps', dueDate: '2025-11-01', status: 'Due' },
  };
  if (bills[customerId]) return bills[customerId];
  throw new Error('Customer ID not found. Try RL-001234');
};

export const apiPayBill = async (customerId, method, amount) => {
  await delay(1500);
  if (Math.random() > 0.1) { // 90% success rate mock
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      amount,
      method,
      timestamp: new Date().toISOString(),
    };
  }
  throw new Error('Payment failed. Please try again.');
};

// ── Packages ──────────────────────────────────────────────────────────────────
export const apiGetPackages = async (type = 'home') => {
  await delay(400);
  const { homePackages, corporatePackages } = await import('../data/constants');
  return type === 'home' ? homePackages : corporatePackages;
};

export const apiApplyPackage = async (formData) => {
  await delay(1000);
  return { success: true, applicationId: `APP-${Date.now()}`, message: 'Application submitted successfully!' };
};

// ── Coverage ──────────────────────────────────────────────────────────────────
export const apiCheckCoverage = async (division, district, area) => {
  await delay(600);
  const { coverageData, uncoveredAreas } = await import('../data/constants');
  if (uncoveredAreas.includes(division)) return { available: false };
  const divData = coverageData[division];
  if (!divData) return { available: false };
  const distData = divData[district];
  if (!distData) return { available: false };
  const found = distData.includes(area);
  return { available: found };
};

export const apiRegisterInterest = async (data) => {
  await delay(800);
  return { success: true, message: 'Interest registered! We\'ll contact you when service is available.' };
};

// ── Support Tickets ───────────────────────────────────────────────────────────
export const apiCreateTicket = async (data) => {
  await delay(900);
  return { success: true, ticketId: `TKT-${Date.now()}`, message: 'Support ticket created.' };
};

export const apiGetTickets = async (customerId) => {
  await delay(500);
  const { mockTickets } = await import('../data/constants');
  return mockTickets;
};

// ── Customer ──────────────────────────────────────────────────────────────────
export const apiGetCustomer = async (customerId) => {
  await delay(400);
  const { mockCustomer } = await import('../data/constants');
  return mockCustomer;
};

export const apiGetUsage = async (customerId) => {
  await delay(500);
  const { mockUsageData } = await import('../data/constants');
  return mockUsageData;
};

export const apiGetPaymentHistory = async (customerId) => {
  await delay(500);
  const { mockPaymentHistory } = await import('../data/constants');
  return mockPaymentHistory;
};

export const apiUpdateProfile = async (data) => {
  await delay(700);
  return { success: true, message: 'Profile updated successfully.' };
};

export const apiChangePassword = async (oldPw, newPw) => {
  await delay(700);
  if (oldPw === '1234') return { success: true };
  throw new Error('Current password is incorrect.');
};

// ── Quote Request ──────────────────────────────────────────────────────────────
export const apiRequestQuote = async (data) => {
  await delay(800);
  return { success: true, quoteId: `QTE-${Date.now()}`, message: 'Quote request submitted. Our team will contact you within 24 hours.' };
};
