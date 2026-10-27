// ── Customer Portal — Full Dashboard (Billing Ledger, Upgrades & Diagnostics) ──
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wifi, CreditCard, Clock, Ticket, User, LogOut, ChevronRight,
  CheckCircle, AlertCircle, Download, Printer, Zap, Sparkles,
  ShieldCheck, ArrowUpRight, Activity, FileText, Check, X,
  Copy, Radio, TrendingUp, RefreshCw, Smartphone, Laptop, PhoneCall
} from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, LoadingSkeleton, FadeUp } from '../../components/ui/index';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

// Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-static p-3 text-xs rounded-xl shadow-xl border border-white/10">
      <div className="text-[#B8B8C0] mb-1 font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value} GB
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { isBn } = useLang();
  const { user, logout, payPortalBill, requestPortalUpgrade, refreshUserData } = useAuth();
  const { packages = [] } = useAdmin();
  const navigate = useNavigate();

  // Active portal tab: 'billing' | 'upgrade' | 'network' | 'usage' | 'tickets' | 'profile'
  const [activeTab, setActiveTab] = useState('billing');

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedUpgradePkg, setSelectedUpgradePkg] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Payment Form State
  const [payMethod, setPayMethod] = useState('bkash');
  const [payTrxId, setPayTrxId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Speed Test State
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedTestResults, setSpeedTestResults] = useState({
    download: null,
    upload: null,
    ping: 4,
    jitter: 1
  });

  // Ticket Form State
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', category: 'technical' });
  const [ticketList, setTicketList] = useState(() => [
    { id: 'TKT-104', subject: 'Optical Fiber Line Check & DB Reading', status: 'Resolved', date: '2026-10-18', category: 'Technical' },
    { id: 'TKT-102', subject: 'Speed Test Latency Verification', status: 'Resolved', date: '2026-09-22', category: 'Network' },
  ]);

  // Usage Data
  const usageData = [
    { day: 'Mon', download: 12.4, upload: 3.2 },
    { day: 'Tue', download: 18.6, upload: 4.8 },
    { day: 'Wed', download: 15.2, upload: 3.9 },
    { day: 'Thu', download: 22.8, upload: 6.1 },
    { day: 'Fri', download: 28.4, upload: 7.9 },
    { day: 'Sat', download: 34.2, upload: 9.5 },
    { day: 'Sun', download: 31.0, upload: 8.4 },
  ];

  // Refresh user data on mount
  useEffect(() => {
    refreshUserData();
  }, []);

  if (!user) {
    return (
      <div className="py-20 text-center">
        <LoadingSkeleton lines={4} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out from Customer Portal');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}: ${text}`, { icon: '📋' });
  };

  // Run live speed test
  const runSpeedTest = () => {
    setIsTestingSpeed(true);
    setSpeedTestResults({ download: null, upload: null, ping: 4, jitter: 1 });
    const targetSpeed = Number(user.speed) || 50;

    setTimeout(() => {
      setSpeedTestResults((prev) => ({
        ...prev,
        download: Math.round(targetSpeed * (0.95 + Math.random() * 0.08)),
        ping: Math.floor(2 + Math.random() * 4)
      }));
    }, 1400);

    setTimeout(() => {
      setSpeedTestResults((prev) => ({
        ...prev,
        upload: Math.round(targetSpeed * (0.92 + Math.random() * 0.06)),
        jitter: Math.floor(1 + Math.random() * 2)
      }));
      setIsTestingSpeed(false);
      toast.success(`Speed test complete! Optical gigabit connection verified.`, { icon: '⚡' });
    }, 2800);
  };

  // Handle Bill Payment Submit
  const handlePaySubmit = (e) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      payPortalBill(user.dueAmount || user.monthlyFee || 900, payMethod, payTrxId);
      setIsPaying(false);
      setShowPayModal(false);
      setPayTrxId('');
    }, 1000);
  };

  // Handle Upgrade Request Submit
  const handleConfirmUpgrade = () => {
    if (!selectedUpgradePkg) return;
    requestPortalUpgrade(selectedUpgradePkg);
    setShowUpgradeModal(false);
    setSelectedUpgradePkg(null);
  };

  // Handle New Ticket Submit
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    const created = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      subject: newTicket.subject,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      category: newTicket.category
    };
    setTicketList([created, ...ticketList]);
    setNewTicket({ subject: '', message: '', category: 'technical' });
    toast.success(`Support ticket ${created.id} submitted! Our team will contact you shortly.`);
  };

  const navTabs = [
    { id: 'billing', label: 'Bills & Invoices', labelBn: 'বিল ও ইনভয়েসসমূহ', icon: CreditCard },
    { id: 'upgrade', label: 'Upgrade Package', labelBn: 'প্যাকেজ আপগ্রেড', icon: Zap },
    { id: 'network', label: 'Speed & Diagnostics', labelBn: 'স্পিড টেস্ট ও রাউটার', icon: Wifi },
    { id: 'usage', label: 'Bandwidth Usage', labelBn: 'ডেটা ব্যবহার', icon: TrendingUp },
    { id: 'tickets', label: 'Support Tickets', labelBn: 'হেল্পডেস্ক টিকেট', icon: Ticket },
    { id: 'profile', label: 'My Account', labelBn: 'অ্যাকাউন্ট প্রোফাইল', icon: User },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-poppins selection:bg-red-500 selection:text-white">
      {/* ── Top Header Profile Strip ── */}
      <FadeUp>
        <div className="glass-card-static p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Customer Avatar & Bio */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-[#990000] border-2 border-white/20 flex items-center justify-center text-white font-extrabold text-2xl shadow-red-glow">
                {user.name?.charAt(0) || 'R'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {isBn ? (user.nameBn || user.name) : user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {user.status || 'Active'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#B8B8C0] mt-1.5 flex-wrap">
                  <span className="font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1.5">
                    ID: <strong className="text-white">{user.id}</strong>
                    <button
                      onClick={() => copyToClipboard(user.id, 'Customer ID')}
                      className="hover:text-red-400 cursor-pointer"
                      title="Copy Customer ID"
                    >
                      <Copy size={11} />
                    </button>
                  </span>
                  <span>•</span>
                  <span>{user.email || 'customer@gmail.com'}</span>
                  <span>•</span>
                  <span>{user.mobile}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={runSpeedTest}
                disabled={isTestingSpeed}
                className="btn-outline text-xs px-3.5 py-2.5 flex items-center gap-1.5 cursor-pointer"
              >
                <Activity size={14} className={isTestingSpeed ? 'animate-spin text-red-400' : 'text-red-400'} />
                <span>{isTestingSpeed ? 'Testing Speed...' : (isBn ? 'স্পিড টেস্ট চালান' : 'Run Speed Test')}</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-[#B8B8C0] hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
            <div>
              <span className="text-[#B8B8C0] text-[10px] block uppercase font-medium">Current Package</span>
              <span className="font-bold text-white text-sm">{user.package || 'Standard 50 Mbps'}</span>
            </div>
            <div>
              <span className="text-[#B8B8C0] text-[10px] block uppercase font-medium">Assigned Static IP</span>
              <span className="font-mono text-emerald-400 text-sm font-semibold">{user.ip || '103.237.79.11'}</span>
            </div>
            <div>
              <span className="text-[#B8B8C0] text-[10px] block uppercase font-medium">Optical Signal (RX)</span>
              <span className="font-mono text-white text-sm">{user.opticalPower || '-18.4 dBm'} (Normal)</span>
            </div>
            <div>
              <span className="text-[#B8B8C0] text-[10px] block uppercase font-medium">Current Bill Status</span>
              {user.dueAmount > 0 ? (
                <span className="font-bold text-red-400 text-sm">৳{user.dueAmount} Due</span>
              ) : (
                <span className="font-bold text-emerald-400 text-sm">All Bills Paid ✓</span>
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Active Upgrade Request Alert (If any) ── */}
      {user.upgradeRequest && (
        <FadeUp>
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-purple-950/60 border border-red-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 animate-bounce">
                <Zap size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {isBn ? 'প্যাকেজ আপগ্রেড প্রক্রিয়াধীন রয়েছে' : 'Package Upgrade In Progress'}
                </span>
                <span className="text-[11px] text-[#B8B8C0]">
                  Requested: <strong className="text-white">{user.upgradeRequest.targetPackage} ({user.upgradeRequest.targetSpeed} Mbps)</strong> • Status: <span className="text-yellow-400 font-semibold">{user.upgradeRequest.status}</span>
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30 whitespace-nowrap">
              Pending Activation
            </span>
          </div>
        </FadeUp>
      )}

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-[#B30F1F] text-white shadow-red-glow font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white border border-white/10'
              }`}
            >
              <Icon size={16} />
              <span>{isBn ? tab.labelBn : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: BILLING & INVOICES (আগের ও পরের সকল বিল) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Top Cards: Current Due & Upcoming Cycle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Month Bill Card */}
            <GlassCard className="p-6 relative overflow-hidden border border-white/15">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-[#B8B8C0] font-semibold uppercase tracking-wider block">
                    {isBn ? 'চলতি মাসের বিল' : 'Current Billing Month'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {user.invoices?.[0]?.month || 'October 2026'}
                  </h3>
                  <span className="text-[11px] text-[#B8B8C0]">
                    Invoice No: <strong className="text-white font-mono">{user.invoices?.[0]?.id || 'INV-2026-10'}</strong>
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.dueAmount > 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {user.dueAmount > 0 ? (isBn ? 'বকেয়া বিল' : 'Payment Due') : (isBn ? 'পরিশোধিত' : 'Paid in Full')}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ৳{user.dueAmount > 0 ? user.dueAmount : (user.monthlyFee || 900)}
                </span>
                <span className="text-xs text-[#B8B8C0]">
                  Due date: <strong className="text-white">{user.invoices?.[0]?.dueDate || '05 October 2026'}</strong>
                </span>
              </div>

              {user.dueAmount > 0 ? (
                <div className="pt-2">
                  <GlassButton
                    onClick={() => setShowPayModal(true)}
                    variant="primary"
                    className="w-full justify-center py-3 text-xs sm:text-sm font-bold shadow-red-glow cursor-pointer"
                  >
                    <CreditCard size={16} />
                    <span>{isBn ? 'এখনই বিল পরিশোধ করুন (bKash/Nagad)' : 'Pay Now via bKash / Nagad / Card'}</span>
                  </GlassButton>
                </div>
              ) : (
                <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle size={15} />
                    {isBn ? 'এই মাসের সকল বিল পরিশোধিত হয়েছে' : 'No dues pending for current billing cycle.'}
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(user.invoices?.[0])}
                    className="underline hover:text-white font-semibold cursor-pointer"
                  >
                    {isBn ? 'রশিদ দেখুন' : 'View Receipt'}
                  </button>
                </div>
              )}
            </GlassCard>

            {/* Upcoming Next Cycle Bill */}
            <GlassCard className="p-6 relative overflow-hidden border border-white/15">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block flex items-center gap-1.5">
                    <Clock size={13} />
                    {isBn ? 'পরের মাসের বিল (আগামী সাইকেল)' : 'Upcoming Next Billing Cycle'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {user.upcomingBill?.month || 'November 2026'}
                  </h3>
                  <span className="text-[11px] text-[#B8B8C0]">
                    Cycle starts: <strong className="text-white">{user.upcomingBill?.cycleStart || '01 Nov 2026'}</strong>
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {user.upcomingBill?.status || 'Upcoming'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ৳{user.upcomingBill?.estimatedAmount || user.monthlyFee || 900}
                </span>
                <span className="text-xs text-[#B8B8C0]">
                  Scheduled due: <strong className="text-white">{user.upcomingBill?.dueDate || '05 Nov 2026'}</strong>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#B8B8C0] leading-relaxed">
                {isBn
                  ? 'আপনার পরবর্তী মাসের বিল স্বয়ংক্রিয়ভাবে মাসের ১ তারিখে জেনারেট হবে। প্যাকেজ আপগ্রেড করলে নতুন প্যাকেজের চার্জ প্রযোজ্য হবে।'
                  : 'Your upcoming invoice is automatically generated on the 1st of every month. Upgrades requested now will apply to this cycle.'}
              </div>
            </GlassCard>
          </div>

          {/* Previous Bills & Payment Ledger */}
          <GlassCard className="p-6 overflow-hidden border border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-red-400" />
                  {isBn ? 'আগের ও বর্তমান সকল বিলসমূহ (Billing Ledger)' : 'All Past & Current Invoices'}
                </h3>
                <p className="text-xs text-[#B8B8C0] mt-0.5">
                  Complete official payment history, transaction references, and downloadable receipts
                </p>
              </div>

              <span className="text-xs font-mono text-[#B8B8C0] bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                Customer: <strong className="text-white">{user.id}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Invoice / Cycle</th>
                    <th className="p-3.5">Billing Period</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Method & TrxID</th>
                    <th className="p-3.5">Paid On</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(user.invoices || []).map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono">
                        <span className="text-white font-bold block">{inv.id}</span>
                        <span className="text-[10px] text-[#B8B8C0]">{inv.month}</span>
                      </td>
                      <td className="p-3.5 text-[#B8B8C0]">
                        {inv.period || 'Monthly recurring'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white text-sm">
                        ৳{inv.amount}
                      </td>
                      <td className="p-3.5">
                        {inv.trxId ? (
                          <div>
                            <span className="text-white font-medium block">{inv.method || 'bKash'}</span>
                            <span className="text-[10px] font-mono text-[#B8B8C0]">{inv.trxId}</span>
                          </div>
                        ) : (
                          <span className="text-[#6B6B78]">Pending payment</span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#B8B8C0]">
                        {inv.paidDate || '-'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {inv.status === 'Paid' ? (
                          <button
                            onClick={() => setSelectedReceipt(inv)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-[#B8B8C0] hover:text-white border border-white/10 hover:border-red-500/30 transition-all cursor-pointer font-semibold inline-flex items-center gap-1.5"
                          >
                            <FileText size={12} />
                            <span>{isBn ? 'রশিদ' : 'Receipt'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowPayModal(true)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold shadow-red-glow transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <CreditCard size={12} />
                            <span>{isBn ? 'পরিশোধ' : 'Pay'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: PACKAGE UPGRADE SYSTEM (প্যাকেজ ও স্পিড আপগ্রেড) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          {/* Current Package Banner */}
          <GlassCard className="p-6 border border-white/15 bg-gradient-to-r from-red-950/30 to-black">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider block">
                  {isBn ? 'আপনার বর্তমান সক্রিয় প্যাকেজ' : 'Your Currently Active Plan'}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {user.package || 'Standard 50 Mbps'}
                </h2>
                <p className="text-xs text-[#B8B8C0] mt-1">
                  Speed: <strong className="text-white">{user.speed || 50} Mbps Fiber</strong> • Monthly Bill: <strong className="text-white">৳{user.monthlyFee || 900}/month</strong>
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] text-[#B8B8C0] block uppercase">Optical Bandwidth</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{user.speed || 50} Mbps</span>
              </div>
            </div>
          </GlassCard>

          {/* Available Higher Packages */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-red-400" />
                {isBn ? 'উচ্চগতির প্যাকেজে আপগ্রেড করুন' : 'Upgrade to High-Speed Gigabit Fiber'}
              </h3>
              <p className="text-xs text-[#B8B8C0] mt-0.5">
                Select a higher speed plan to instantly boost your browsing, 4K streaming, and gaming performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {packages
                .filter((p) => Number(p.speed) > (Number(user.speed) || 50))
                .concat(
                  // Fallbacks if current user has the highest speed in list
                  packages.length === 0 || packages.every(p => Number(p.speed) <= (Number(user.speed) || 50))
                    ? [
                        { id: 'up-100', name: 'Ultra 100 Mbps', speed: 100, price: 1500, features: ['Unlimited Fiber', 'Wi-Fi 6 Router', 'Priority BDIX 100M', '24/7 VIP NOC Support'] },
                        { id: 'up-150', name: 'Turbo 150 Mbps', speed: 150, price: 2000, features: ['Unlimited Fiber', 'Wi-Fi 6 Mesh', 'Zero Ping Gaming Routing', 'Static IP Included'] },
                        { id: 'up-200', name: 'Gigabit Pro 200 Mbps', speed: 200, price: 2800, features: ['Gigabit Symmetrical', 'Real Static IP', 'Dedicated NOC Account Mgr', '99.99% SLA Uptime'] },
                      ]
                    : []
                )
                .map((pkg) => {
                  const currentSpeed = Number(user.speed) || 50;
                  const speedDiff = Number(pkg.speed) - currentSpeed;
                  const currentFee = Number(user.monthlyFee) || 900;
                  const priceDiff = Number(pkg.price) - currentFee;

                  return (
                    <GlassCard
                      key={pkg.id || pkg.name}
                      className="p-6 rounded-3xl border border-white/15 hover:border-red-500/40 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                            {pkg.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            +{speedDiff} Mbps Boost
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="text-3xl font-black text-white font-mono">
                            {pkg.speed}
                          </span>
                          <span className="text-xs text-[#B8B8C0]">Mbps Dedicated</span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-white/10">
                          <span className="text-xl font-bold text-white font-mono">
                            ৳{pkg.price}
                          </span>
                          <span className="text-[11px] text-[#B8B8C0]">/ month</span>
                          {priceDiff > 0 && (
                            <span className="text-[10px] text-yellow-400 font-mono font-semibold">
                              (+৳{priceDiff}/mo)
                            </span>
                          )}
                        </div>

                        {/* Features list */}
                        <ul className="space-y-2 text-xs text-[#B8B8C0] mb-6">
                          {(Array.isArray(pkg.features) ? pkg.features : (pkg.features ? pkg.features.split('\n') : [
                            'Unlimited Data Volume',
                            'BDIX / Local Cache 100M',
                            'Free Router Upgrade',
                            '24/7 Priority Support'
                          ])).slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check size={13} className="text-emerald-400 flex-shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <GlassButton
                        onClick={() => {
                          setSelectedUpgradePkg(pkg);
                          setShowUpgradeModal(true);
                        }}
                        className="w-full justify-center py-2.5 text-xs font-bold group-hover:bg-red-600 group-hover:text-white transition-colors cursor-pointer"
                      >
                        <Zap size={14} />
                        <span>{isBn ? 'আপগ্রেড রিকোয়েস্ট করুন' : 'Request This Upgrade'}</span>
                      </GlassButton>
                    </GlassCard>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: SPEED & ROUTER DIAGNOSTICS (স্পিড টেস্ট ও নেটওয়ার্ক) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          {/* Live Speed Test Dial */}
          <GlassCard className="p-6 sm:p-8 border border-white/15 text-center relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-2">
              {isBn ? 'রিয়েল-টাইম অপটিক্যাল স্পিড টেস্ট' : 'Real-Time Optical Speed & Latency Test'}
            </h3>
            <p className="text-xs text-[#B8B8C0] max-w-md mx-auto mb-6">
              Test your direct fiber throughput, BDIX local exchange latency, and packet stability
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#B8B8C0] uppercase font-semibold block mb-1">Download</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {speedTestResults.download !== null ? `${speedTestResults.download}` : `${user.speed || 50}`}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Mbps</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#B8B8C0] uppercase font-semibold block mb-1">Upload</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {speedTestResults.upload !== null ? `${speedTestResults.upload}` : `${user.speed || 50}`}
                </span>
                <span className="text-[10px] text-blue-400 block font-semibold">Mbps</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#B8B8C0] uppercase font-semibold block mb-1">Ping (BDIX)</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {speedTestResults.ping}
                </span>
                <span className="text-[10px] text-[#B8B8C0] block">ms</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#B8B8C0] uppercase font-semibold block mb-1">Jitter</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {speedTestResults.jitter}
                </span>
                <span className="text-[10px] text-[#B8B8C0] block">ms</span>
              </div>
            </div>

            <GlassButton
              onClick={runSpeedTest}
              disabled={isTestingSpeed}
              variant="primary"
              className="py-3 px-8 text-xs sm:text-sm font-bold shadow-red-glow cursor-pointer"
            >
              <Activity size={16} className={isTestingSpeed ? 'animate-spin' : ''} />
              <span>{isTestingSpeed ? 'Testing Fiber Throughput...' : (isBn ? 'পুনরায় স্পিড টেস্ট চালান' : 'Start Speed Test')}</span>
            </GlassButton>
          </GlassCard>

          {/* Router & Network Infrastructure Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <GlassCard className="p-6 border border-white/15">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Radio size={16} className="text-red-400" />
                <span>Optical Line & ONU Status</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Optical RX Signal Power</span>
                  <span className="font-mono text-emerald-400 font-bold">{user.opticalPower || '-18.4 dBm'} (Optimal)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Optical Line Terminal (OLT)</span>
                  <span className="text-white font-mono">DAC-CORE-OLT-03</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Connected POP Hub</span>
                  <span className="text-white">Mirpur Metro Optical Node</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#B8B8C0]">Router MAC Address</span>
                  <span className="text-white font-mono">{user.mac || 'E4:8D:8C:44:91:02'}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border border-white/15">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>IP & DNS Configuration</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Customer Public IP</span>
                  <span className="font-mono text-white font-bold">{user.ip || '103.237.79.11'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Gateway IP</span>
                  <span className="font-mono text-white">103.237.79.1</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#B8B8C0]">Primary DNS</span>
                  <span className="font-mono text-white">103.237.79.2 (RedLink Core)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#B8B8C0]">Secondary DNS</span>
                  <span className="font-mono text-white">1.1.1.1 (Cloudflare)</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: BANDWIDTH USAGE (ডেটা ব্যবহার) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'usage' && (
        <GlassCard className="p-6 border border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-red-400" />
                <span>Weekly Bandwidth Consumption (GB)</span>
              </h3>
              <p className="text-xs text-[#B8B8C0]">Unlimited true fiber optical bandwidth — Zero throttling</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Download
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Upload
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D2E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E11D2E" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#6B6B78" tick={{ fill: '#B8B8C0', fontSize: 12 }} />
              <YAxis stroke="#6B6B78" tick={{ fill: '#B8B8C0', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="download" name="Download" stroke="#E11D2E" fill="url(#dlGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="upload" name="Upload" stroke="#3B82F6" fill="url(#ulGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 5: SUPPORT TICKETS ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Ticket Form */}
          <GlassCard className="p-6 border border-white/15">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Ticket size={16} className="text-red-400" />
              <span>Create New Support Ticket</span>
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-[#B8B8C0] block mb-1">Issue Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="glass-input text-xs"
                >
                  <option value="technical" className="bg-[#111113]">Technical / Fiber Loss</option>
                  <option value="speed" className="bg-[#111113]">Speed & Latency Concern</option>
                  <option value="billing" className="bg-[#111113]">Billing & Invoicing</option>
                  <option value="router" className="bg-[#111113]">Router & Wi-Fi Configuration</option>
                </select>
              </div>

              <FormInput
                label="Subject"
                placeholder="Brief summary of the issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />

              <div>
                <label className="text-[#B8B8C0] block mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  className="glass-input text-xs resize-none"
                  placeholder="Describe what you are experiencing..."
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                />
              </div>

              <GlassButton type="submit" variant="primary" className="w-full justify-center py-2.5 text-xs font-bold shadow-red-glow">
                Submit Support Ticket
              </GlassButton>
            </form>
          </GlassCard>

          {/* Ticket List */}
          <GlassCard className="p-6 border border-white/15">
            <h3 className="text-base font-bold text-white mb-4">Your Recent Tickets</h3>
            <div className="space-y-3">
              {ticketList.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-white">{t.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#B8B8C0] font-mono">
                    {t.id} • {t.date} • {t.category}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 6: MY ACCOUNT & PROFILE ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <GlassCard className="p-6 sm:p-8 max-w-2xl border border-white/15">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-red-400" />
            <span>Account & Installation Details</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[#B8B8C0] block mb-1">Customer ID</span>
                <span className="font-mono font-bold text-white text-sm bg-white/5 p-2.5 rounded-xl border border-white/10 block">
                  {user.id}
                </span>
              </div>
              <div>
                <span className="text-[#B8B8C0] block mb-1">Registered Mobile</span>
                <span className="font-mono text-white text-sm bg-white/5 p-2.5 rounded-xl border border-white/10 block">
                  {user.mobile}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[#B8B8C0] block mb-1">Full Name</span>
              <span className="font-bold text-white text-sm bg-white/5 p-2.5 rounded-xl border border-white/10 block">
                {user.name} ({user.nameBn || user.name})
              </span>
            </div>

            <div>
              <span className="text-[#B8B8C0] block mb-1">Registered Email (Used for Gmail Login)</span>
              <span className="font-mono text-white text-sm bg-white/5 p-2.5 rounded-xl border border-white/10 block">
                {user.email || 'customer@gmail.com'}
              </span>
            </div>

            <div>
              <span className="text-[#B8B8C0] block mb-1">Installation Address</span>
              <span className="text-white text-sm bg-white/5 p-2.5 rounded-xl border border-white/10 block">
                {user.address}
              </span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: PRINTABLE OFFICIAL CASH RECEIPT ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F0F13] text-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Official Receipt Header */}
            <div className="text-center pb-5 mb-5 border-b border-dashed border-white/20">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <img src="/logo.png" alt="RedLink" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-lg font-black text-white tracking-tight">RedLink Technologies</span>
              </div>
              <p className="text-[11px] text-[#B8B8C0]">The service company • Level 8, Concord Tower, Gulshan-1, Dhaka</p>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mt-1">Official Money Receipt / Cash Voucher</p>
            </div>

            {/* Receipt Meta */}
            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Invoice Reference</span>
                <span className="font-mono text-white font-bold">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Customer ID</span>
                <span className="font-mono text-white font-bold">{user.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Customer Name</span>
                <span className="text-white font-bold">{user.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Billing Cycle / Month</span>
                <span className="text-white font-semibold">{selectedReceipt.month}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Package & Speed</span>
                <span className="text-white font-semibold">{user.package || 'Standard 50 Mbps'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Payment Method</span>
                <span className="text-white font-bold">{selectedReceipt.method || 'bKash'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Transaction ID (TrxID)</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedReceipt.trxId || 'BK9X77A102'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#B8B8C0]">Payment Date</span>
                <span className="text-white">{selectedReceipt.paidDate || 'Paid'}</span>
              </div>

              {/* Amount Highlight */}
              <div className="flex justify-between items-center pt-3 pb-1">
                <span className="text-sm font-bold text-white uppercase">Amount Paid</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">৳{selectedReceipt.amount}</span>
              </div>
            </div>

            {/* Paid Stamp & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/20">
              <div className="px-3 py-1 rounded-lg border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-widest bg-emerald-500/10">
                PAID & VERIFIED ✓
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer size={14} /> Print
                </button>
                <GlassButton
                  onClick={() => setSelectedReceipt(null)}
                  className="py-2 px-4 text-xs font-semibold cursor-pointer"
                >
                  Close
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: INSTANT BILL PAYMENT (bKash, Nagad, Card) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-md p-6 sm:p-7 rounded-3xl border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CreditCard size={18} className="text-red-400" />
                <span>Pay Broadband Bill Online</span>
              </h3>
              <button onClick={() => setShowPayModal(false)} className="text-[#B8B8C0] hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#B8B8C0] uppercase block">Customer Bill Due</span>
                  <span className="font-mono text-white text-xs font-bold">{user.id} ({user.name})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#B8B8C0] uppercase block">Total Payable</span>
                  <span className="text-xl font-black text-red-400 font-mono">
                    ৳{user.dueAmount > 0 ? user.dueAmount : (user.monthlyFee || 900)}
                  </span>
                </div>
              </div>

              {/* Method Selector */}
              <div>
                <label className="text-xs font-semibold text-[#B8B8C0] block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash', color: 'from-[#D12053] to-[#E2136E]' },
                    { id: 'Nagad', label: 'Nagad', color: 'from-[#EA580C] to-[#F97316]' },
                    { id: 'Card', label: 'Visa / MC', color: 'from-[#1E40AF] to-[#3B82F6]' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                        payMethod === m.id
                          ? 'border-red-500 bg-red-600/20 text-white shadow-red-glow'
                          : 'border-white/10 bg-white/5 text-[#B8B8C0] hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TrxID / Wallet Input */}
              <div>
                <label className="text-xs font-semibold text-[#B8B8C0] block mb-1">
                  Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BK9X77A102"
                  value={payTrxId}
                  onChange={(e) => setPayTrxId(e.target.value.toUpperCase())}
                  className="glass-input text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <GlassButton
                  type="submit"
                  loading={isPaying}
                  variant="primary"
                  className="py-2.5 px-6 text-xs font-bold shadow-red-glow cursor-pointer"
                >
                  Confirm & Pay ৳{user.dueAmount > 0 ? user.dueAmount : (user.monthlyFee || 900)}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: CONFIRM PACKAGE UPGRADE ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showUpgradeModal && selectedUpgradePkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-md p-6 sm:p-7 rounded-3xl border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Zap size={18} className="text-red-400" />
                <span>Confirm Package Upgrade</span>
              </h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-[#B8B8C0] hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#B8B8C0]">Current Plan:</span>
                  <span className="text-white font-bold">{user.package || 'Standard 50 Mbps'} (৳{user.monthlyFee || 900})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8B8C0]">Upgrading To:</span>
                  <span className="text-emerald-400 font-bold">{selectedUpgradePkg.name} (৳{selectedUpgradePkg.price})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                  <span className="text-white">Speed Delta:</span>
                  <span className="text-emerald-400">+{Number(selectedUpgradePkg.speed) - (Number(user.speed) || 50)} Mbps Boost</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-[#B8B8C0] leading-relaxed">
                <strong className="text-white">Note:</strong> Your upgrade request will be sent to our Network Operations Center (NOC). We will reconfigure your fiber line without any service interruption.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <GlassButton
                  onClick={handleConfirmUpgrade}
                  variant="primary"
                  className="py-2.5 px-6 text-xs font-bold shadow-red-glow cursor-pointer"
                >
                  Submit Upgrade Request
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
