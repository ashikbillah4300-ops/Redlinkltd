// ── Auth Context — Customer Portal Dual-Method Authentication ────────────────
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('redlink_portal_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync session changes to localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('redlink_portal_user', JSON.stringify(user));
      } catch (err) {
        console.warn('Failed to save session to localStorage', err);
      }
    } else {
      localStorage.removeItem('redlink_portal_user');
    }
  }, [user]);

  // Lookup latest customer record from Admin Users store
  const findCustomerInStorage = (identifier) => {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();

    try {
      const raw = localStorage.getItem('redlink_admin_users');
      if (raw) {
        const users = JSON.parse(raw);
        const match = users.find((u) => {
          const idMatch = u.id && u.id.trim().toLowerCase() === clean;
          const emailMatch = u.email && u.email.trim().toLowerCase() === clean;
          const mobileMatch = u.mobile && u.mobile.trim() === clean;
          return idMatch || emailMatch || mobileMatch;
        });
        if (match) return match;
      }
    } catch (e) {
      console.warn('Error reading redlink_admin_users:', e);
    }

    // Built-in seed fallback
    const seedKarim = {
      id: 'RL-001234',
      name: 'Mohammad Karim',
      nameBn: 'মোহাম্মদ করিম',
      mobile: '01712345678',
      email: 'karim@gmail.com',
      password: '1234',
      address: 'House 12, Road 5, Mirpur-1, Dhaka',
      package: 'Standard 50 Mbps',
      speed: 50,
      monthlyFee: 900,
      dueAmount: 900,
      status: 'Active',
      joinDate: '2024-03-15',
      billingDate: '05',
      ip: '103.237.79.11',
      mac: 'E4:8D:8C:44:91:02',
      opticalPower: '-18.4 dBm',
      invoices: [
        { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: '2026-10-05', amount: 900, status: 'Due', period: '01 Oct 2026 - 31 Oct 2026' },
        { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: '2026-09-05', amount: 900, status: 'Paid', paidDate: '2026-09-04 14:20', method: 'bKash', trxId: 'BK9X77A102', period: '01 Sep 2026 - 30 Sep 2026' },
        { id: 'INV-2026-08', month: 'August 2026', monthBn: 'আগস্ট ২০২৬', dueDate: '2026-08-05', amount: 900, status: 'Paid', paidDate: '2026-08-03 18:11', method: 'Nagad', trxId: 'NG4B11C908', period: '01 Aug 2026 - 31 Aug 2026' },
      ],
      upcomingBill: {
        id: 'INV-2026-11-NEXT',
        month: 'November 2026',
        monthBn: 'নভেম্বর ২০২৬',
        cycleStart: '2026-11-01',
        dueDate: '2026-11-05',
        estimatedAmount: 900,
        status: 'Upcoming Cycle',
        description: 'Monthly broadband recurring charges'
      },
      upgradeRequest: null
    };

    if (clean === 'rl-001234' || clean === 'karim@gmail.com' || clean === 'karim@example.com' || clean === '01712345678') {
      return seedKarim;
    }

    return null;
  };

  // Synchronize updates back to redlink_admin_users
  const syncToAdminStorage = (updatedCustomer) => {
    try {
      const raw = localStorage.getItem('redlink_admin_users');
      if (raw) {
        const list = JSON.parse(raw);
        const index = list.findIndex((u) => u.id === updatedCustomer.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updatedCustomer };
          localStorage.setItem('redlink_admin_users', JSON.stringify(list));
        } else {
          list.unshift(updatedCustomer);
          localStorage.setItem('redlink_admin_users', JSON.stringify(list));
        }
      }
    } catch (e) {
      console.warn('Sync to admin failed:', e);
    }
  };

  // Dual-Method Authentication: Email OR Customer ID
  const loginWithCredentials = async ({ identifier, password, method = 'id' }) => {
    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      const msg = method === 'email' ? 'Please enter your Gmail / Email address' : 'Please enter your Customer ID (e.g. RL-001234)';
      throw new Error(msg);
    }
    if (!cleanPass) {
      throw new Error('Please enter your password or PIN (Demo: 1234)');
    }

    const matched = findCustomerInStorage(cleanId);
    if (!matched) {
      if (method === 'email') {
        throw new Error(`No customer found with Email "${cleanId}". Make sure this user exists or was created in the Admin Panel.`);
      } else {
        throw new Error(`Customer ID "${cleanId}" not found. Please check your ID or create it from the Admin Panel.`);
      }
    }

    // Verify Password: match exact user.password OR default demo '1234'
    const isPassValid = (matched.password && matched.password === cleanPass) || cleanPass === '1234';
    if (!isPassValid) {
      throw new Error('Incorrect password or PIN! (Default demo PIN is 1234)');
    }

    setUser(matched);
    return matched;
  };

  // Legacy single-arg login for backwards compatibility
  const login = (userData) => {
    if (userData?.customerId) {
      const found = findCustomerInStorage(userData.customerId) || {
        id: userData.customerId,
        name: 'Subscriber',
        status: 'Active',
        package: 'Standard 50 Mbps',
        speed: 50,
        dueAmount: 900,
        monthlyFee: 900,
        invoices: []
      };
      setUser(found);
    } else {
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('redlink_portal_user');
  };

  // Customer bill payment inside portal
  const payPortalBill = (amount, paymentMethod = 'bKash', trxId = '') => {
    if (!user) return;
    const finalTrx = trxId || `BK${Math.floor(100000 + Math.random() * 900000)}`;
    const nowTime = new Date().toLocaleString();

    setUser((prev) => {
      if (!prev) return null;
      const newDue = Math.max(0, (prev.dueAmount || 0) - Number(amount));
      const updatedInvoices = (prev.invoices || []).map((inv, idx) => {
        if (idx === 0 || inv.status === 'Due') {
          return {
            ...inv,
            status: 'Paid',
            paidDate: nowTime,
            method: paymentMethod,
            trxId: finalTrx,
          };
        }
        return inv;
      });

      const updated = {
        ...prev,
        dueAmount: newDue,
        invoices: updatedInvoices
      };

      syncToAdminStorage(updated);

      // Also record in admin payments ledger
      try {
        const rawPayments = localStorage.getItem('redlink_admin_payments');
        const paymentsList = rawPayments ? JSON.parse(rawPayments) : [];
        paymentsList.unshift({
          id: finalTrx,
          customerId: prev.id,
          name: prev.name,
          amount: Number(amount),
          method: paymentMethod,
          date: nowTime,
          status: 'Paid',
          trxId: finalTrx
        });
        localStorage.setItem('redlink_admin_payments', JSON.stringify(paymentsList));
      } catch (err) {
        console.warn('Failed recording payment to admin storage:', err);
      }

      return updated;
    });

    toast.success(`Payment of ৳${amount} successful via ${paymentMethod}! (TrxID: ${finalTrx})`, { icon: '🎉' });
  };

  // Customer package upgrade request
  const requestPortalUpgrade = (targetPkg) => {
    if (!user) return;
    const req = {
      targetPackage: targetPkg.name,
      targetSpeed: Number(targetPkg.speed),
      targetPrice: Number(targetPkg.price),
      requestedAt: new Date().toLocaleString(),
      status: 'Pending Approval'
    };

    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        upgradeRequest: req
      };
      syncToAdminStorage(updated);

      // Create a support ticket in Admin Helpdesk
      try {
        const rawTickets = localStorage.getItem('redlink_admin_tickets');
        const ticketsList = rawTickets ? JSON.parse(rawTickets) : [];
        ticketsList.unshift({
          id: `TKT-${Math.floor(500 + Math.random() * 500)}`,
          customerId: prev.id,
          customerName: prev.name,
          subject: `Package Upgrade Request: ${targetPkg.name} (${targetPkg.speed} Mbps)`,
          priority: 'High',
          status: 'Open',
          date: new Date().toLocaleString(),
          category: 'Package Upgrade'
        });
        localStorage.setItem('redlink_admin_tickets', JSON.stringify(ticketsList));
      } catch (err) {
        console.warn('Failed recording ticket to admin storage:', err);
      }

      return updated;
    });

    toast.success(`Upgrade request for ${targetPkg.name} submitted! Our team will activate it shortly.`, { icon: '🚀' });
  };

  // Refresh current customer data from storage
  const refreshUserData = () => {
    if (!user?.id) return;
    const latest = findCustomerInStorage(user.id);
    if (latest) {
      setUser(latest);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        loginWithCredentials,
        logout,
        payPortalBill,
        requestPortalUpgrade,
        refreshUserData,
        isLoggedIn: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
