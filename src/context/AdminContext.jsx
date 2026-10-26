// ── Admin & Live CMS Context Store ─────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { homePackages as initialHomePackages, corporatePackages as initialCorpPackages, stats as initialStats, coverageData as initialCoverage } from '../data/constants';

const AdminContext = createContext();

// Initial Seed Data
const INITIAL_USERS = [
  { id: 'RL-001234', name: 'Mohammad Karim', nameBn: 'মোহাম্মদ করিম', mobile: '01712345678', email: 'karim@example.com', address: 'House 12, Road 5, Mirpur-1, Dhaka', package: 'Standard 50 Mbps', speed: 50, dueAmount: 900, status: 'Active', joinDate: '2024-03-15', ip: '103.237.79.11' },
  { id: 'RL-005678', name: 'Fatema Begum', nameBn: 'ফাতেমা বেগম', mobile: '01898765432', email: 'fatema@example.com', address: 'Sector 4, Uttara, Dhaka', package: 'Starter 20 Mbps', speed: 20, dueAmount: 500, status: 'Active', joinDate: '2024-05-10', ip: '103.237.79.44' },
  { id: 'RL-007890', name: 'Tanvir Ahmed', nameBn: 'তানভীর আহমেদ', mobile: '01911223344', email: 'tanvir@techbd.com', address: 'GEC Circle, Chittagong', package: 'Ultra 100 Mbps', speed: 100, dueAmount: 0, status: 'Active', joinDate: '2024-01-20', ip: '103.237.79.88' },
  { id: 'RL-009123', name: 'Shafiul Islam', nameBn: 'শফিউল ইসলাম', mobile: '01655667788', email: 'shafiul@corp.net', address: 'Agrabad C/A, Chittagong', package: 'Business Pro 500 Mbps', speed: 500, dueAmount: 8000, status: 'Suspended', joinDate: '2023-11-05', ip: '103.237.80.12' },
  { id: 'RL-003412', name: 'Nusrat Jahan', nameBn: 'নুসরাত জাহান', mobile: '01799887766', email: 'nusrat@gmail.com', address: 'Zindabazar, Sylhet', package: 'Standard 50 Mbps', speed: 50, dueAmount: 0, status: 'Active', joinDate: '2024-07-12', ip: '103.237.81.05' },
];

const INITIAL_PAYMENTS = [
  { id: 'TXN-9021', customerId: 'RL-001234', name: 'Mohammad Karim', amount: 900, method: 'bKash', date: '2026-10-26 21:15', status: 'Paid', trxId: 'BK9X77A102' },
  { id: 'TXN-9018', customerId: 'RL-007890', name: 'Tanvir Ahmed', amount: 1500, method: 'Nagad', date: '2026-10-26 19:40', status: 'Paid', trxId: 'NG4B11C908' },
  { id: 'TXN-9015', customerId: 'RL-003412', name: 'Nusrat Jahan', amount: 900, method: 'Card', date: '2026-10-26 14:20', status: 'Paid', trxId: 'CRD8812301' },
  { id: 'TXN-9009', customerId: 'RL-005678', name: 'Fatema Begum', amount: 500, method: 'bKash', date: '2026-10-25 18:05', status: 'Pending', trxId: 'BK7K89M432' },
  { id: 'TXN-8994', customerId: 'RL-009123', name: 'Shafiul Islam', amount: 8000, method: 'Rocket', date: '2026-10-24 11:30', status: 'Failed', trxId: 'RK2M55P781' },
];

const INITIAL_LEADS = [
  { id: 'LD-101', name: 'Rashid Khan', mobile: '01755123456', area: 'Dhanmondi, Dhaka', package: 'Standard 50 Mbps', date: '2026-10-26', status: 'New' },
  { id: 'LD-102', name: 'Priya Sen', mobile: '01844987654', area: 'Gulshan-2, Dhaka', package: 'Ultra 100 Mbps', date: '2026-10-25', status: 'Contacted' },
  { id: 'LD-103', name: 'Apex Logistics Ltd', mobile: '01933556677', area: 'Agrabad, Chittagong', package: 'Business Pro 500 Mbps', date: '2026-10-24', status: 'Scheduled' },
];

const INITIAL_TICKETS = [
  { id: 'TKT-501', customerId: 'RL-001234', customerName: 'Mohammad Karim', subject: 'Optical Fiber Loss / Red LOS Light blinking', priority: 'High', status: 'Open', date: '2026-10-26 20:30', category: 'Fiber Line' },
  { id: 'TKT-498', customerId: 'RL-005678', customerName: 'Fatema Begum', subject: 'Upgrade to 50 Mbps package request', priority: 'Low', status: 'In Progress', date: '2026-10-25 15:10', category: 'Package Upgrade' },
  { id: 'TKT-489', customerId: 'RL-007890', customerName: 'Tanvir Ahmed', subject: 'WiFi 6 dual-band configuration assistance', priority: 'Medium', status: 'Resolved', date: '2026-10-23 11:45', category: 'Technical Support' },
];

const INITIAL_SITE_SETTINGS = {
  companyName: 'RedLink Ltd',
  tagline: 'The service company',
  hotline: '16500',
  whatsapp: '+880 1700-000000',
  supportEmail: 'support@redlink.com.bd',
  salesEmail: 'sales@redlink.com.bd',
  headOffice: 'Level 8, Concord Tower, Gulshan-1, Dhaka-1212',
  facebookUrl: 'https://facebook.com/redlinkbd',
  youtubeUrl: 'https://youtube.com/@redlinkisp',
  portalEnabled: true,
  liveSpeedTestEnabled: true,
};

const INITIAL_NOTICE = {
  enabled: true,
  badge: 'Special Announcement',
  badgeBn: 'বিশেষ ঘোষণা',
  text: '⚡ Super Fiber Promo: Enjoy 50% extra bandwidth on all 50 Mbps+ packages this month! 24/7 BDIX 100 Mbps included.',
  textBn: '⚡ সুপার ফাইবার অফার: এই মাসে ৫০+ এমবিপিএস প্যাকেজে ৫০% অতিরিক্ত ব্যান্ডউইথ এবং ফ্রি বিডিআইএক্স উপভোগ করুন!',
  type: 'urgent', // 'urgent' | 'promo' | 'info'
  link: '/packages',
};

const INITIAL_NETWORK_NODES = [
  { id: 'DAC-CORE-1', name: 'Dhaka Core BDIX 100G Ring', status: 'Operational', load: '64%', ping: '3 ms', uptime: '99.99%' },
  { id: 'CTG-HUB-1', name: 'Chittagong Coastal Subsea Link', status: 'Operational', load: '52%', ping: '8 ms', uptime: '99.98%' },
  { id: 'SYL-METRO', name: 'Sylhet Metro Optical Ring', status: 'Operational', load: '41%', ping: '12 ms', uptime: '99.95%' },
  { id: 'RAJ-EDGE', name: 'Rajshahi Regional POP', status: 'Operational', load: '38%', ping: '14 ms', uptime: '99.96%' },
];

export function AdminProvider({ children }) {
  // Load state from localStorage or initial seed
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('redlink_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_user');
    return saved ? JSON.parse(saved) : { name: 'Super Admin', email: 'admin@redlink.com', role: 'Chief Network Officer' };
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_packages');
    return saved ? JSON.parse(saved) : initialHomePackages;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
  });

  const [notice, setNotice] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_notice');
    return saved ? JSON.parse(saved) : INITIAL_NOTICE;
  });

  const [networkNodes, setNetworkNodes] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NETWORK_NODES;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_audit');
    return saved ? JSON.parse(saved) : [
      { id: 1, action: 'System Initialized', user: 'System Core', time: 'Just now' },
      { id: 2, action: 'Package Standard 50M verified', user: 'Admin', time: '10 mins ago' },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('redlink_admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_notice', JSON.stringify(notice));
  }, [notice]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_nodes', JSON.stringify(networkNodes));
  }, [networkNodes]);

  useEffect(() => {
    localStorage.setItem('redlink_admin_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Log an audit action
  const logAction = (action) => {
    const newLog = {
      id: Date.now(),
      action,
      user: adminUser.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 40)]);
  };

  // ── Authentication Methods ──
  const adminLogin = (email, password) => {
    const cleanUser = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (
      (cleanUser === 'ashik' && cleanPass === 'ashik@2008') ||
      (cleanUser === 'admin' && cleanPass === 'admin123')
    ) {
      const user = { name: 'Ashik', email: 'ashik@redlink.com', role: 'Master Administrator' };
      setIsAdminLoggedIn(true);
      setAdminUser(user);
      localStorage.setItem('redlink_admin_auth', 'true');
      localStorage.setItem('redlink_admin_user', JSON.stringify(user));
      logAction('Ashik Logged In');
      toast.success('Welcome back, Ashik! Access Granted.', { icon: '🛡️' });
      return true;
    }
    toast.error('Invalid credentials! Username: ashik / Password: ashik@2008');
    return false;
  };

  const adminLogout = () => {
    logAction('Admin Logged Out');
    setIsAdminLoggedIn(false);
    localStorage.removeItem('redlink_admin_auth');
    localStorage.removeItem('redlink_admin_user');
    toast.success('Admin session ended');
  };

  // ── User Management ──
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `RL-${Math.floor(100000 + Math.random() * 900000)}`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setUsers((prev) => [newUser, ...prev]);
    logAction(`Created customer account for ${newUser.name} (${newUser.id})`);
    toast.success(`User ${newUser.name} added successfully!`);
  };

  const updateUser = (id, updatedFields) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...updatedFields } : u));
    logAction(`Updated customer ${id}`);
    toast.success(`Customer ${id} updated!`);
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        logAction(`Changed ${id} status to ${nextStatus}`);
        toast.success(`User ${id} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logAction(`Deleted customer account ${id}`);
    toast.success(`Customer ${id} removed`);
  };

  // ── Payment Management ──
  const recordPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      status: 'Paid'
    };
    setPayments((prev) => [newPayment, ...prev]);
    // Also deduct customer due amount if matches
    if (newPayment.customerId) {
      setUsers((prev) => prev.map((u) => {
        if (u.id === newPayment.customerId) {
          const newDue = Math.max(0, (u.dueAmount || 0) - Number(newPayment.amount));
          return { ...u, dueAmount: newDue };
        }
        return u;
      }));
    }
    logAction(`Processed payment ৳${newPayment.amount} for ${newPayment.customerId} via ${newPayment.method}`);
    toast.success('Payment recorded successfully!');
  };

  const updatePaymentStatus = (id, newStatus) => {
    setPayments((prev) => prev.map((p) => {
      if (p.id === id) {
        logAction(`Updated payment ${id} status to ${newStatus}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
    toast.success(`Payment ${id} marked as ${newStatus}`);
  };

  // ── Package CMS ──
  const updatePackage = (id, updatedData) => {
    setPackages((prev) => prev.map((pkg) => pkg.id === id ? { ...pkg, ...updatedData } : pkg));
    logAction(`Updated plan ${id} (${updatedData.name || ''})`);
    toast.success('Package saved and published live on website!');
  };

  const addPackage = (newPkg) => {
    const pkg = {
      ...newPkg,
      id: `h${Date.now()}`,
      speed: Number(newPkg.speed),
      price: Number(newPkg.price)
    };
    setPackages((prev) => [...prev, pkg]);
    logAction(`Created new package ${pkg.name} (${pkg.speed} Mbps)`);
    toast.success('New package created and published live!');
  };

  const deletePackage = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    logAction(`Removed package ${id}`);
    toast.success('Package removed from website');
  };

  // ── Lead Management ──
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setLeads((prev) => [newLead, ...prev]);
    logAction(`New connection lead from ${newLead.name}`);
  };

  const updateLeadStatus = (id, status) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    logAction(`Lead ${id} marked as ${status}`);
    toast.success(`Lead status updated to ${status}`);
  };

  // ── Tickets ──
  const updateTicketStatus = (id, status) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    logAction(`Support ticket ${id} marked as ${status}`);
    toast.success(`Ticket ${id} is now ${status}`);
  };

  // ── Site Settings & Live Notice ──
  const updateSiteSettings = (newSettings) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('Updated Live Website Brand & Contact Settings');
    toast.success('Website settings updated live!');
  };

  const updateNotice = (newNotice) => {
    setNotice((prev) => ({ ...prev, ...newNotice }));
    logAction(`Updated Live Announcement Banner (Enabled: ${newNotice.enabled})`);
    toast.success('Live announcement banner updated on site!');
  };

  // ── Network Nodes ──
  const updateNodeStatus = (id, status) => {
    setNetworkNodes((prev) => prev.map((n) => n.id === id ? { ...n, status } : n));
    logAction(`Network Node ${id} status set to ${status}`);
    toast.success(`Node ${id} is now ${status}`);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        adminLogin,
        adminLogout,
        users,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        payments,
        recordPayment,
        updatePaymentStatus,
        packages,
        updatePackage,
        addPackage,
        deletePackage,
        leads,
        addLead,
        updateLeadStatus,
        tickets,
        updateTicketStatus,
        siteSettings,
        updateSiteSettings,
        notice,
        updateNotice,
        networkNodes,
        updateNodeStatus,
        auditLogs
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
