// ── Customer Portal — Dashboard ───────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Wifi, CreditCard, Clock, Ticket, User, LogOut, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, LoadingSkeleton, FadeUp, Tabs } from '../../components/ui/index';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { apiGetCustomer, apiGetUsage, apiGetPaymentHistory, apiGetTickets, apiCreateTicket, apiChangePassword, apiUpdateProfile } from '../../services/api';

// ── Ticket Badge ───────────────────────────────────────────────────────────────
const ticketStatusColor = {
  'Resolved': 'text-green-400 bg-green-400/10',
  'In Progress': 'text-yellow-400 bg-yellow-400/10',
  'Open': 'text-red-400 bg-red-400/10',
};

// ── Custom Tooltip for chart ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-static p-3 text-sm">
      <div className="text-[#B8B8C0] mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value} GB
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { isBn } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [usage, setUsage] = useState([]);
  const [history, setHistory] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview'); // overview | profile | password | tickets
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', category: 'technical' });
  const [pwForm, setPwForm] = useState({ old: '', new1: '', new2: '' });
  const [profileForm, setProfileForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/portal/login'); return; }
    Promise.all([
      apiGetCustomer(user.customerId),
      apiGetUsage(user.customerId),
      apiGetPaymentHistory(user.customerId),
      apiGetTickets(user.customerId),
    ]).then(([c, u, h, t]) => {
      setCustomer(c);
      setUsage(u);
      setHistory(h);
      setTickets(t);
      setProfileForm({ name: c.name, email: c.email, address: c.address });
    }).finally(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); toast.success('Logged out.'); };

  const handleNewTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) { toast.error('Subject and message are required.'); return; }
    setActionLoading(true);
    try {
      const res = await apiCreateTicket({ ...newTicket, customerId: user.customerId });
      toast.success(`Ticket created: ${res.ticketId}`, { icon: '🎫' });
      setTickets(prev => [{ id: res.ticketId, subject: newTicket.subject, status: 'Open', created: new Date().toISOString().slice(0,10), category: newTicket.category }, ...prev]);
      setNewTicket({ subject: '', message: '', category: 'technical' });
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new1 !== pwForm.new2) { toast.error('Passwords do not match.'); return; }
    setActionLoading(true);
    try {
      await apiChangePassword(pwForm.old, pwForm.new1);
      toast.success('Password changed successfully.');
      setPwForm({ old: '', new1: '', new2: '' });
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiUpdateProfile(profileForm);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton lines={4} />
        <div className="grid md:grid-cols-3 gap-4">
          <LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton />
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', labelBn: 'সংক্ষিপ্ত' },
    { id: 'tickets', label: 'Support Tickets', labelBn: 'টিকেট' },
    { id: 'profile', label: 'Profile', labelBn: 'প্রোফাইল' },
    { id: 'password', label: 'Change Password', labelBn: 'পাসওয়ার্ড' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeUp>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={`text-2xl font-bold text-white ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? `স্বাগতম, ${customer?.nameBn}!` : `Welcome, ${customer?.name}!`}
              </h1>
              <p className="text-[#B8B8C0] text-sm">{customer?.id} • {isBn ? customer?.package : customer?.package}</p>
            </div>
            <button onClick={handleLogout} className="btn-outline text-sm self-start sm:self-auto flex items-center gap-2">
              <LogOut size={14} /> {isBn ? 'লগআউট' : 'Logout'}
            </button>
          </div>
        </FadeUp>

        {/* Section Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === item.id ? 'tab-active' : 'tab-inactive'}`}
            >
              {isBn ? item.labelBn : item.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Status Widgets */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Wifi, label: 'Package', labelBn: 'প্যাকেজ', value: customer?.package, color: 'text-blue-400' },
                { icon: CheckCircle, label: 'Status', labelBn: 'স্ট্যাটাস', value: customer?.status, color: 'text-green-400', badge: true },
                { icon: CreditCard, label: 'Due Amount', labelBn: 'বকেয়া', value: `৳${customer?.dueAmount}`, color: 'text-red-400' },
                { icon: Clock, label: 'Due Date', labelBn: 'দেয় তারিখ', value: customer?.dueDate, color: 'text-yellow-400' },
              ].map((w, i) => (
                <FadeUp key={w.label} delay={i * 0.08}>
                  <GlassCard className="p-5" hover={false}>
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-3`}>
                      <w.icon size={18} className={w.color} />
                    </div>
                    <div className={`text-[#B8B8C0] text-xs mb-1 ${isBn ? 'font-bangla' : ''}`}>{isBn ? w.labelBn : w.label}</div>
                    {w.badge
                      ? <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer?.status === 'Active' ? 'status-active' : 'status-suspended'}`}>{customer?.status}</span>
                      : <div className={`text-white font-bold text-base ${isBn ? 'font-bangla' : ''}`}>{w.value}</div>
                    }
                  </GlassCard>
                </FadeUp>
              ))}
            </div>

            {/* Usage Chart */}
            <FadeUp delay={0.2}>
              <GlassCard className="p-6" hover={false}>
                <h3 className={`text-white font-bold mb-4 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? 'সাপ্তাহিক ব্যবহার (GB)' : 'Weekly Usage (GB)'}
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={usage} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E11D2E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E11D2E" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="day" stroke="#6B6B78" tick={{ fill: '#B8B8C0', fontSize: 12 }} />
                    <YAxis stroke="#6B6B78" tick={{ fill: '#B8B8C0', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="download" name="Download" stroke="#E11D2E" fill="url(#dlGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="upload" name="Upload" stroke="#3B82F6" fill="url(#ulGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </FadeUp>

            {/* Payment History */}
            <FadeUp delay={0.3}>
              <GlassCard className="p-6 overflow-hidden" hover={false}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-white font-bold ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? 'পেমেন্ট ইতিহাস' : 'Payment History'}
                  </h3>
                  <Link to="/pay-bill" className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">
                    {isBn ? 'বিল দিন' : 'Pay Now'} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="comparison-table min-w-[500px]">
                    <thead>
                      <tr>
                        <th>{isBn ? 'ট্রানজেকশন' : 'Transaction ID'}</th>
                        <th>{isBn ? 'তারিখ' : 'Date'}</th>
                        <th>{isBn ? 'পরিমাণ' : 'Amount'}</th>
                        <th>{isBn ? 'পদ্ধতি' : 'Method'}</th>
                        <th>{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => (
                        <tr key={h.id}>
                          <td className="text-white font-mono text-xs">{h.id}</td>
                          <td className="text-[#B8B8C0]">{h.date}</td>
                          <td className="text-white font-semibold">৳{h.amount}</td>
                          <td className="text-[#B8B8C0]">{h.method}</td>
                          <td>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${h.status === 'Success' ? 'status-active' : 'status-suspended'}`}>
                              {h.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </FadeUp>
          </div>
        )}

        {/* ── Tickets ── */}
        {activeSection === 'tickets' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <FadeUp>
              <GlassCard className="p-6" hover={false}>
                <h3 className={`text-white font-bold mb-5 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? 'নতুন টিকেট তৈরি করুন' : 'Create New Ticket'}
                </h3>
                <form onSubmit={handleNewTicket} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#B8B8C0] block mb-1.5">Category</label>
                    <select className="glass-input" style={{ background: 'rgba(17,17,19,0.95)' }} value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="hardware">Hardware</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <FormInput label="Subject" placeholder="Brief description" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} />
                  <div>
                    <label className="text-sm font-medium text-[#B8B8C0] block mb-1.5">Message</label>
                    <textarea className="glass-input resize-none" rows={4} placeholder="Describe your issue..." value={newTicket.message} onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })} />
                  </div>
                  <GlassButton type="submit" variant="primary" loading={actionLoading} className="w-full justify-center">
                    <Ticket size={15} /> Submit Ticket
                  </GlassButton>
                </form>
              </GlassCard>
            </FadeUp>

            <FadeUp delay={0.1}>
              <GlassCard className="p-6" hover={false}>
                <h3 className={`text-white font-bold mb-5 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? 'আপনার টিকেটসমূহ' : 'Your Tickets'}
                </h3>
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="glass-card-static p-4 rounded-2xl">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div className="text-white font-semibold text-sm">{t.subject}</div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${ticketStatusColor[t.status] || 'text-[#B8B8C0] bg-white/10'}`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="text-[#6B6B78] text-xs">{t.id} • {t.created} • {t.category}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeUp>
          </div>
        )}

        {/* ── Profile ── */}
        {activeSection === 'profile' && (
          <FadeUp>
            <GlassCard className="p-6 max-w-lg" hover={false}>
              <h3 className={`text-white font-bold mb-5 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'প্রোফাইল আপডেট করুন' : 'Update Profile'}
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <FormInput label="Full Name" value={profileForm.name || ''} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                <FormInput label="Email" type="email" value={profileForm.email || ''} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                <FormInput label="Address" value={profileForm.address || ''} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                <GlassButton type="submit" variant="primary" loading={actionLoading} className="w-full justify-center">
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </GlassButton>
              </form>
            </GlassCard>
          </FadeUp>
        )}

        {/* ── Change Password ── */}
        {activeSection === 'password' && (
          <FadeUp>
            <GlassCard className="p-6 max-w-lg" hover={false}>
              <h3 className={`text-white font-bold mb-5 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <FormInput label="Current Password" type="password" placeholder="Current password (demo: 1234)" value={pwForm.old} onChange={(e) => setPwForm({ ...pwForm, old: e.target.value })} />
                <FormInput label="New Password" type="password" placeholder="New password" value={pwForm.new1} onChange={(e) => setPwForm({ ...pwForm, new1: e.target.value })} />
                <FormInput label="Confirm New Password" type="password" placeholder="Repeat new password" value={pwForm.new2} onChange={(e) => setPwForm({ ...pwForm, new2: e.target.value })} />
                <GlassButton type="submit" variant="primary" loading={actionLoading} className="w-full justify-center">
                  {isBn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
                </GlassButton>
              </form>
            </GlassCard>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
