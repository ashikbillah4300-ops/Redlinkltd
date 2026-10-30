// ── Mock API Service Layer ────────────────────────────────────────────────────
// Replace these mock implementations with real API calls (bKash, SSLCommerz, etc.)

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Helper to retrieve customers from localStorage or fallback defaults
const getStoredCustomers = () => {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('redlink_admin_users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse redlink_admin_users:', e);
  }

  // Built-in fallback customer database
  return [
    {
      id: 'RL-001234',
      name: 'Mohammad Karim',
      nameBn: 'মোহাম্মদ করিম',
      mobile: '01712345678',
      email: 'karim@gmail.com',
      password: '1234',
      address: 'House 12, Road 5, Mirpur-1, Dhaka',
      package: 'Standard 50 Mbps',
      dueAmount: 900,
      monthlyFee: 900,
      dueDate: '2026-11-05',
      status: 'Active',
    },
    {
      id: 'RL-005678',
      name: 'Fatema Begum',
      nameBn: 'ফাতেমা বেগম',
      mobile: '01898765432',
      email: 'fatema@gmail.com',
      password: '1234',
      address: 'Sector 4, Uttara, Dhaka',
      package: 'Starter 20 Mbps',
      dueAmount: 500,
      monthlyFee: 500,
      dueDate: '2026-11-01',
      status: 'Active',
    },
    {
      id: 'RL-007890',
      name: 'Tanvir Ahmed',
      nameBn: 'তানভীর আহমেদ',
      mobile: '01911223344',
      email: 'tanvir@gmail.com',
      password: '1234',
      address: 'GEC Circle, Chittagong',
      package: 'Ultra 100 Mbps',
      dueAmount: 1500,
      monthlyFee: 1500,
      dueDate: '2026-11-10',
      status: 'Active',
    },
    {
      id: 'RL-009123',
      name: 'Shafiul Islam',
      nameBn: 'শফিউল ইসলাম',
      mobile: '01655667788',
      email: 'shafiul@gmail.com',
      password: '1234',
      address: 'Agrabad C/A, Chittagong',
      package: 'Business Pro 500 Mbps',
      dueAmount: 8000,
      monthlyFee: 8000,
      dueDate: '2026-11-15',
      status: 'Due',
    },
    {
      id: 'RL-003412',
      name: 'Nusrat Jahan',
      nameBn: 'নুসরাত জাহান',
      mobile: '01799887766',
      email: 'nusrat@gmail.com',
      password: '1234',
      address: 'Zindabazar, Sylhet',
      package: 'Standard 50 Mbps',
      dueAmount: 900,
      monthlyFee: 900,
      dueDate: '2026-11-05',
      status: 'Active',
    },
  ];
};

// Search customers helper: searches by name, id, mobile, email
export const searchCustomers = (query) => {
  if (!query || !query.trim()) return [];
  const clean = query.trim().toLowerCase();
  const cleanDigits = clean.replace(/\D/g, '');
  const cleanAlphanumeric = clean.replace(/[^a-z0-9]/g, '');

  const customers = getStoredCustomers();

  return customers.filter((u) => {
    const idLower = (u.id || '').toLowerCase();
    const idClean = idLower.replace(/[^a-z0-9]/g, '');
    const nameLower = (u.name || '').toLowerCase();
    const nameBnLower = (u.nameBn || '').toLowerCase();
    const mobileClean = (u.mobile || '').replace(/\D/g, '');
    const emailLower = (u.email || '').toLowerCase();

    // 1. Customer ID match (exact or stripped RL-)
    if (idLower === clean || idClean === cleanAlphanumeric || idClean.includes(cleanAlphanumeric)) return true;

    // 2. Name match (English or Bengali, exact or partial)
    if (nameLower.includes(clean) || nameBnLower.includes(clean)) return true;

    // 3. Mobile match
    if (cleanDigits.length >= 4 && mobileClean.includes(cleanDigits)) return true;

    // 4. Email match
    if (emailLower.includes(clean)) return true;

    return false;
  });
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const apiLogin = async (identifier, password) => {
  await delay(600);
  const clean = (identifier || '').trim().toLowerCase();
  const matched = searchCustomers(clean);
  const user = matched[0];

  if (user && (user.password === password || password === '1234')) {
    return { success: true, token: 'mock-jwt-token', customer: user, customerId: user.id };
  }
  throw new Error('Invalid credentials. Try your Name (e.g. Mohammad Karim) or ID (RL-001234) and password 1234');
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
export const apiFetchBill = async (query) => {
  await delay(500);
  if (!query || !query.trim()) {
    throw new Error('Please enter your Customer Name or ID (e.g. Mohammad Karim or RL-001234)');
  }

  const results = searchCustomers(query);
  if (!results || results.length === 0) {
    throw new Error(`No customer found for "${query}". Try searching by Name (e.g. Mohammad Karim) or ID (RL-001234).`);
  }

  // If exact or best match
  const customer = results[0];
  const dueDate = customer.invoices?.find((i) => i.status === 'Due')?.dueDate ||
                  customer.dueDate ||
                  customer.upcomingBill?.dueDate ||
                  '2026-11-05';

  const dueAmount = customer.dueAmount !== undefined ? Number(customer.dueAmount) : Number(customer.monthlyFee || 900);
  const billAmount = dueAmount > 0 ? dueAmount : Number(customer.monthlyFee || 900);

  return {
    customerId: customer.id,
    name: customer.name,
    nameBn: customer.nameBn,
    mobile: customer.mobile,
    email: customer.email,
    package: customer.package || 'Standard 50 Mbps',
    amount: billAmount,
    dueAmount: dueAmount,
    isAdvance: dueAmount === 0,
    dueDate,
    status: dueAmount > 0 ? 'Due' : 'Advance Pay Available',
    allMatches: results, // in case multiple accounts match
  };
};

export const apiPayBill = async (customerId, method, amount) => {
  await delay(1200);
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();

  // Synchronize payment with redlink_admin_users & redlink_admin_payments
  try {
    if (typeof window !== 'undefined') {
      const rawUsers = localStorage.getItem('redlink_admin_users');
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const updated = users.map((u) => {
          if (u.id === customerId) {
            const newDue = Math.max(0, (u.dueAmount || 0) - Number(amount));
            const updatedInvoices = (u.invoices || []).map((inv, idx) => {
              if (idx === 0 || inv.status === 'Due') {
                return {
                  ...inv,
                  status: 'Paid',
                  paidDate: new Date().toLocaleString(),
                  method,
                  trxId: transactionId
                };
              }
              return inv;
            });
            return { ...u, dueAmount: newDue, invoices: updatedInvoices };
          }
          return u;
        });
        localStorage.setItem('redlink_admin_users', JSON.stringify(updated));
      }

      const rawPayments = localStorage.getItem('redlink_admin_payments');
      const payments = rawPayments ? JSON.parse(rawPayments) : [];
      payments.unshift({
        id: transactionId,
        customerId,
        name: customerId,
        amount: Number(amount),
        method,
        date: new Date().toLocaleString(),
        status: 'Paid',
        trxId: transactionId
      });
      localStorage.setItem('redlink_admin_payments', JSON.stringify(payments));
    }
  } catch (err) {
    console.warn('Payment sync warning:', err);
  }

  return {
    success: true,
    transactionId,
    amount,
    method,
    timestamp,
  };
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
