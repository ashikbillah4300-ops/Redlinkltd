// ── Master Admin Dashboard with 11 Comprehensive Management Sections ──────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, Package, UserPlus, LifeBuoy,
  MapPin, Megaphone, Activity, Settings, Shield, LogOut, Search,
  Plus, Filter, CheckCircle2, AlertTriangle, Clock, RefreshCw,
  Edit2, Trash2, Eye, ArrowUpRight, TrendingUp, Download, Globe,
  Phone, Mail, Server, Menu, X, Sparkles, Check
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard, GlassButton, FormInput } from '../../components/ui/index';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const {
    adminUser, adminLogout,
    users, addUser, updateUser, toggleUserStatus, deleteUser,
    payments, recordPayment, updatePaymentStatus,
    packages, updatePackage, addPackage, deletePackage,
    leads, updateLeadStatus,
    tickets, updateTicketStatus,
    siteSettings, updateSiteSettings,
    notice, updateNotice,
    networkNodes, updateNodeStatus,
    auditLogs
  } = useAdmin();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    name: '', nameBn: '', mobile: '', email: '', address: '', package: 'Standard 50 Mbps', speed: 50, dueAmount: 900
  });

  // Record Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    customerId: '', name: '', amount: '', method: 'bKash', trxId: ''
  });

  // Package Form State
  const [pkgForm, setPkgForm] = useState({
    name: '', nameBn: '', speed: 60, price: 1000, originalPrice: 1300, popular: false,
    features: 'Unlimited Data, Free Dual-band Router, 24/7 Priority Support, BDIX 100 Mbps'
  });

  // Calculate live KPI metrics
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const activeSubscribers = users.filter(u => u.status === 'Active').length;
  const totalDues = users.reduce((sum, u) => sum + Number(u.dueAmount || 0), 0);
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
    { id: 'users', label: 'Subscribers / Users', icon: Users, badge: users.length },
    { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
    { id: 'packages', label: 'Live Packages CMS', icon: Package, badge: packages.length },
    { id: 'leads', label: 'Connection Leads', icon: UserPlus, badge: newLeadsCount ? `${newLeadsCount} new` : null, badgeColor: 'bg-emerald-500' },
    { id: 'tickets', label: 'Support Helpdesk', icon: LifeBuoy, badge: openTicketsCount ? `${openTicketsCount} open` : null, badgeColor: 'bg-red-500' },
    { id: 'coverage', label: 'Coverage & POP Nodes', icon: MapPin },
    { id: 'announcements', label: 'Live Notice Banner', icon: Megaphone, badge: notice.enabled ? 'Live' : 'Off', badgeColor: notice.enabled ? 'bg-emerald-500' : 'bg-gray-500' },
    { id: 'noc', label: 'Network & NOC Health', icon: Activity },
    { id: 'settings', label: 'Website Settings CMS', icon: Settings },
    { id: 'audit', label: 'Staff & Audit Logs', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col lg:flex-row font-poppins selection:bg-red-500 selection:text-white">
      {/* ── Mobile Admin Header ── */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0D0D11] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="RedLink Logo" className="w-8 h-8 rounded-lg object-cover border border-white/10" />
          <span className="font-bold text-white text-base">RedLink Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#B8B8C0]">
            Site
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white"
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Sidebar (Desktop & Mobile Drawer) ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 w-72 bg-[#0C0C10] border-r border-white/10 flex flex-col justify-between transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RedLink Logo" className="w-10 h-10 rounded-xl object-cover shadow-red-glow border border-white/15" />
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">
                  Red<span className="gradient-text">Link</span>
                </span>
                <span className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">
                  NOC Admin v2.4
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/5 text-[#B8B8C0] flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items (11 sections) */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-[#B30F1F] text-white shadow-red-glow font-semibold'
                      : 'text-[#B8B8C0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-red-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-white/15'} text-white`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#09090C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                SA
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{adminUser?.name || 'Super Admin'}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Session
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-[#B8B8C0] flex items-center justify-center transition-all cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#B8B8C0] mt-1">
              Live Content & Network Operations Management for RedLink Ltd
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Globe size={14} />
              <span>View Public Website</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW & ANALYTICS ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#B8B8C0] font-medium">Monthly Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-poppins">
                  ৳{totalRevenue.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  ↑ 14.8% vs last cycle
                </span>
              </GlassCard>

              <GlassCard className="p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#B8B8C0] font-medium">Active Subscribers</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-poppins">
                  {activeSubscribers}
                </div>
                <span className="text-[10px] text-blue-400 font-medium flex items-center gap-1 mt-1">
                  {users.length} total registered
                </span>
              </GlassCard>

              <GlassCard className="p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#B8B8C0] font-medium">Pending Dues</span>
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-poppins">
                  ৳{totalDues.toLocaleString()}
                </div>
                <span className="text-[10px] text-yellow-400 font-medium flex items-center gap-1 mt-1">
                  Across accounts with pending bills
                </span>
              </GlassCard>

              <GlassCard className="p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#B8B8C0] font-medium">NOC Uptime</span>
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-poppins">
                  99.98%
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  Zero major packet drops
                </span>
              </GlassCard>
            </div>

            {/* Live Announcements & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions Panel */}
              <GlassCard className="p-6">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-red-400" />
                  Quick Control Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setActiveTab('users'); setShowAddUserModal(true); }}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-left transition-all cursor-pointer group"
                  >
                    <Plus size={16} className="text-red-400 mb-2 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-white block">Add Subscriber</span>
                    <span className="text-[10px] text-[#B8B8C0]">Create new user</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('payments'); setShowRecordPaymentModal(true); }}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
                  >
                    <CreditCard size={16} className="text-emerald-400 mb-2 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-white block">Record Bill</span>
                    <span className="text-[10px] text-[#B8B8C0]">Manual bKash/Nagad</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('packages'); setShowAddPackageModal(true); }}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/30 text-left transition-all cursor-pointer group"
                  >
                    <Package size={16} className="text-purple-400 mb-2 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-white block">Create Plan</span>
                    <span className="text-[10px] text-[#B8B8C0]">Publish new package</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-yellow-500/15 border border-white/10 hover:border-yellow-500/30 text-left transition-all cursor-pointer group"
                  >
                    <Megaphone size={16} className="text-yellow-400 mb-2 group-hover:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-white block">Live Notice</span>
                    <span className="text-[10px] text-[#B8B8C0]">Broadcast marquee</span>
                  </button>
                </div>
              </GlassCard>

              {/* Recent Transactions Stream */}
              <GlassCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <CreditCard size={16} className="text-emerald-400" />
                    Recent Live Transactions
                  </h3>
                  <button onClick={() => setActiveTab('payments')} className="text-xs text-red-400 hover:underline">
                    View all payments →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {payments.slice(0, 4).map((pay) => (
                    <div key={pay.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                          ৳
                        </div>
                        <div>
                          <span className="font-bold text-white block">{pay.name}</span>
                          <span className="text-[10px] text-[#B8B8C0]">{pay.customerId} • {pay.method} ({pay.trxId})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400 block">+৳{pay.amount}</span>
                        <span className="text-[10px] text-[#B8B8C0]">{pay.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── TAB 2: SUBSCRIBERS / USERS MANAGEMENT ── */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by ID, Name, Mobile, IP..."
                    className="glass-input pl-10 text-xs py-2.5 w-full"
                  />
                </div>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <GlassButton
                onClick={() => setShowAddUserModal(true)}
                className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                Add New Customer
              </GlassButton>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card-static">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Package & Speed</th>
                    <th className="p-4">Assigned IP</th>
                    <th className="p-4">Due Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users
                    .filter(u => {
                      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.id.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.mobile.includes(userSearch) ||
                        (u.ip && u.ip.includes(userSearch));
                      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white block">{user.name}</span>
                          <span className="text-[10px] font-mono text-red-400">{user.id}</span>
                        </td>
                        <td className="p-4 text-[#B8B8C0]">
                          <div>{user.mobile}</div>
                          <div className="text-[10px] truncate max-w-[150px]">{user.address}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{user.package}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">{user.speed} Mbps Fiber</span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#B8B8C0]">
                          {user.ip || '103.237.79.xx'}
                        </td>
                        <td className="p-4">
                          {user.dueAmount > 0 ? (
                            <span className="text-red-400 font-bold font-mono">৳{user.dueAmount}</span>
                          ) : (
                            <span className="text-emerald-400 font-medium">Paid</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                user.status === 'Active'
                                  ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                              }`}
                              title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                            >
                              <Activity size={14} />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: PAYMENTS & INVOICES ── */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Search by Trx ID, Customer, Method..."
                    className="glass-input pl-10 text-xs py-2.5 w-full"
                  />
                </div>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <GlassButton
                onClick={() => setShowRecordPaymentModal(true)}
                className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                Record Offline / Mobile Payment
              </GlassButton>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card-static">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Invoice / Trx ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments
                    .filter(p => {
                      const matchSearch = p.id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        (p.trxId && p.trxId.toLowerCase().includes(paymentSearch.toLowerCase())) ||
                        p.name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
                        p.customerId.toLowerCase().includes(paymentSearch.toLowerCase());
                      const matchStatus = paymentStatusFilter === 'all' || p.status === paymentStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((pay) => (
                      <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white block">{pay.id}</span>
                          <span className="text-[10px] font-mono text-[#B8B8C0]">{pay.trxId || 'N/A'}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-white block">{pay.name}</span>
                          <span className="text-[10px] text-red-400 font-mono">{pay.customerId}</span>
                        </td>
                        <td className="p-4 font-bold text-emerald-400 font-mono text-sm">
                          ৳{pay.amount}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium text-[11px]">
                            {pay.method}
                          </span>
                        </td>
                        <td className="p-4 text-[#B8B8C0] text-[11px]">
                          {pay.date}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            pay.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            pay.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {pay.status === 'Pending' && (
                            <button
                              onClick={() => updatePaymentStatus(pay.id, 'Paid')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {pay.status === 'Paid' && (
                            <span className="text-[11px] text-emerald-400/80 flex items-center justify-end gap-1">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: PACKAGES & PRICING CMS (LIVE WEBSITE) ── */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-lg">Live Website Package CMS</h3>
                <p className="text-xs text-[#B8B8C0]">Any change made here instantly reflects on the public packages page.</p>
              </div>

              <GlassButton
                onClick={() => setShowAddPackageModal(true)}
                className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                Create New Broadband Plan
              </GlassButton>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <GlassCard key={pkg.id} className="p-6 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-white">{pkg.name}</span>
                      {pkg.popular && (
                        <span className="popular-badge text-[10px]">Popular</span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-black text-white font-poppins">৳{pkg.price}</span>
                      <span className="text-xs text-[#B8B8C0]">/month</span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-[#B8B8C0] line-through ml-2">৳{pkg.originalPrice}</span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 mb-4">
                      <span className="text-xs text-[#B8B8C0] block">Speed & Bandwidth</span>
                      <span className="text-xl font-bold text-red-400 font-mono">{pkg.speed} Mbps Fiber</span>
                    </div>

                    <ul className="space-y-2 text-xs text-[#B8B8C0] mb-6">
                      {(pkg.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new price for ${pkg.name}:`, pkg.price);
                        if (newPrice && !isNaN(newPrice)) {
                          updatePackage(pkg.id, { price: Number(newPrice) });
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      Quick Edit Price
                    </button>

                    <button
                      onClick={() => {
                        updatePackage(pkg.id, { popular: !pkg.popular });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 font-medium cursor-pointer"
                    >
                      {pkg.popular ? 'Unset Popular' : 'Set Popular'}
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: NEW CONNECTION LEADS ── */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Website Connection Inquiries & Leads</h3>
                <p className="text-xs text-[#B8B8C0]">Visitors who submitted their area or application for a new fiber connection.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card-static">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Lead ID</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Location / Area</th>
                    <th className="p-4">Package Desired</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-bold text-red-400">{lead.id}</td>
                      <td className="p-4 font-bold text-white">{lead.name}</td>
                      <td className="p-4 text-[#B8B8C0]">{lead.mobile}</td>
                      <td className="p-4 text-white font-medium">{lead.area}</td>
                      <td className="p-4 text-emerald-400 font-semibold">{lead.package}</td>
                      <td className="p-4 text-[#B8B8C0]">{lead.date}</td>
                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Scheduled">Technician Scheduled</option>
                          <option value="Installed">Installed & Active</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            addUser({
                              name: lead.name,
                              mobile: lead.mobile,
                              address: lead.area,
                              package: lead.package,
                              speed: 50,
                              dueAmount: 0
                            });
                            updateLeadStatus(lead.id, 'Installed');
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold cursor-pointer"
                        >
                          Convert to User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 6: SUPPORT TICKETS HELPDESK ── */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-lg">Customer Support & NOC Tickets</h3>
                <p className="text-xs text-[#B8B8C0]">Fiber cuts, LOS alerts, router issues, and billing queries.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {tickets.map((t) => (
                <GlassCard key={t.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-red-400 font-bold text-xs">{t.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        t.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {t.priority} Priority
                      </span>
                      <span className="text-xs text-[#B8B8C0]">• {t.category}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm sm:text-base">{t.subject}</h4>
                    <p className="text-xs text-[#B8B8C0]">Customer: {t.customerName} ({t.customerId}) • Logged: {t.date}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={t.status}
                      onChange={(e) => updateTicketStatus(t.id, e.target.value)}
                      className="bg-black/70 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      onClick={() => updateTicketStatus(t.id, 'Resolved')}
                      className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      Mark Done
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 7: COVERAGE & POP NETWORK ── */}
        {activeTab === 'coverage' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-lg">Fiber POP Nodes & Coverage Coverage</h3>
              <p className="text-xs text-[#B8B8C0]">Real-time status of regional network distribution hubs across Bangladesh.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {networkNodes.map((node) => (
                <GlassCard key={node.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] text-red-400 font-bold">{node.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {node.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-3">{node.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-white/[0.03] border border-white/8 mb-4">
                    <div>
                      <span className="text-[#B8B8C0] block">Throughput:</span>
                      <span className="text-white font-bold">{node.load}</span>
                    </div>
                    <div>
                      <span className="text-[#B8B8C0] block">Node Latency:</span>
                      <span className="text-emerald-400 font-bold">{node.ping}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = node.status === 'Operational' ? 'Maintenance' : 'Operational';
                      updateNodeStatus(node.id, next);
                    }}
                    className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#B8B8C0] hover:text-white transition-all cursor-pointer"
                  >
                    Toggle Maintenance Mode
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 8: LIVE NOTICE & ANNOUNCEMENT BAR ── */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-white text-lg">Website Live Announcement Marquee</h3>
              <p className="text-xs text-[#B8B8C0]">Control the live announcement ribbon that shows at the top of the entire website.</p>
            </div>

            <GlassCard className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="font-bold text-white text-base block">Notice Banner Display</span>
                  <span className="text-xs text-[#B8B8C0]">Toggle on to broadcast across all pages instantly.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notice.enabled}
                    onChange={(e) => updateNotice({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Badge Text (English)"
                  value={notice.badge}
                  onChange={(e) => updateNotice({ badge: e.target.value })}
                  placeholder="Special Announcement"
                />
                <FormInput
                  label="Badge Text (Bangla)"
                  value={notice.badgeBn}
                  onChange={(e) => updateNotice({ badgeBn: e.target.value })}
                  placeholder="বিশেষ ঘোষণা"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Notice Message (English)</label>
                  <textarea
                    rows={3}
                    value={notice.text}
                    onChange={(e) => updateNotice({ text: e.target.value })}
                    className="glass-input text-xs w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Notice Message (Bangla)</label>
                  <textarea
                    rows={3}
                    value={notice.textBn}
                    onChange={(e) => updateNotice({ textBn: e.target.value })}
                    className="glass-input text-xs w-full"
                  />
                </div>

                <FormInput
                  label="Link Destination URL"
                  value={notice.link}
                  onChange={(e) => updateNotice({ link: e.target.value })}
                  placeholder="/packages"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] text-[#B8B8C0] font-semibold uppercase tracking-wider block mb-2">Live Preview:</span>
                <div className="p-2.5 rounded-lg bg-gradient-to-r from-red-600 via-[#B30F1F] to-red-800 text-white text-xs flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-bold uppercase">{notice.badge}</span>
                  <span className="truncate">{notice.text}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── TAB 9: NETWORK TRAFFIC & NOC MONITOR ── */}
        {activeTab === 'noc' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-lg">Network Traffic & BDIX Core Peering</h3>
              <p className="text-xs text-[#B8B8C0]">Live bandwidth utilization across international gateways and local BDIX exchanges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <GlassCard className="p-6">
                <span className="text-xs text-[#B8B8C0] block mb-1">BDIX 100G Exchange</span>
                <div className="text-3xl font-black text-white font-poppins mb-2">78.4 Gbps</div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[78%]"></div>
                </div>
                <span className="text-[11px] text-[#B8B8C0] mt-2 block">Direct Peering: 124 ISPs & CDNs</span>
              </GlassCard>

              <GlassCard className="p-6">
                <span className="text-xs text-[#B8B8C0] block mb-1">International IIG Uplink</span>
                <div className="text-3xl font-black text-white font-poppins mb-2">42.1 Gbps</div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[62%]"></div>
                </div>
                <span className="text-[11px] text-[#B8B8C0] mt-2 block">SEA-ME-WE 4 & 5 Redundant Cable</span>
              </GlassCard>

              <GlassCard className="p-6">
                <span className="text-xs text-[#B8B8C0] block mb-1">Local Cache Hits (YouTube/FB)</span>
                <div className="text-3xl font-black text-white font-poppins mb-2">91.2%</div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[91%]"></div>
                </div>
                <span className="text-[11px] text-emerald-400 mt-2 block">Buffer-free 4K instant playback</span>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── TAB 10: WEBSITE SETTINGS & BRANDING CMS ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-white text-lg">Website Brand & Contact Settings</h3>
              <p className="text-xs text-[#B8B8C0]">Live updates to telephone hotlines, WhatsApp, office address and social channels.</p>
            </div>

            <GlassCard className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Company Name"
                  value={siteSettings.companyName}
                  onChange={(e) => updateSiteSettings({ companyName: e.target.value })}
                />
                <FormInput
                  label="Official Tagline"
                  value={siteSettings.tagline}
                  onChange={(e) => updateSiteSettings({ tagline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="24/7 Hotline Number"
                  value={siteSettings.hotline}
                  onChange={(e) => updateSiteSettings({ hotline: e.target.value })}
                />
                <FormInput
                  label="WhatsApp Support Number"
                  value={siteSettings.whatsapp}
                  onChange={(e) => updateSiteSettings({ whatsapp: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Support Email"
                  value={siteSettings.supportEmail}
                  onChange={(e) => updateSiteSettings({ supportEmail: e.target.value })}
                />
                <FormInput
                  label="Sales Email"
                  value={siteSettings.salesEmail}
                  onChange={(e) => updateSiteSettings({ salesEmail: e.target.value })}
                />
              </div>

              <FormInput
                label="Head Office Address"
                value={siteSettings.headOffice}
                onChange={(e) => updateSiteSettings({ headOffice: e.target.value })}
              />

              <div className="pt-3">
                <GlassButton
                  onClick={() => toast.success('Settings verified and synchronized live!')}
                  className="py-2.5 px-6 text-xs font-semibold cursor-pointer shadow-red-glow"
                >
                  Save & Push Live
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── TAB 11: STAFF & AUDIT LOGS ── */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white text-lg">Administrative Audit Trail & Operations Log</h3>
              <p className="text-xs text-[#B8B8C0]">Complete tamper-evident log of changes made to subscribers, billing, and CMS.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 glass-card-static">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Action Event</th>
                    <th className="p-4">Operator</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-medium text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {log.action}
                      </td>
                      <td className="p-4 text-[#B8B8C0]">{log.user}</td>
                      <td className="p-4 text-right font-mono text-[11px] text-[#B8B8C0]">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: ADD NEW CUSTOMER ── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-lg p-6 rounded-3xl border border-white/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">Add New Fiber Customer</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#B8B8C0] hover:text-white">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addUser(newUserForm);
              setShowAddUserModal(false);
              setNewUserForm({ name: '', nameBn: '', mobile: '', email: '', address: '', package: 'Standard 50 Mbps', speed: 50, dueAmount: 900 });
            }} className="space-y-3 text-xs">
              <FormInput label="Full Name" required value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} />
              <FormInput label="Mobile Number" required value={newUserForm.mobile} onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })} />
              <FormInput label="Email Address" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} />
              <FormInput label="Installation Address" required value={newUserForm.address} onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#B8B8C0] block mb-1">Package Plan</label>
                  <select
                    value={newUserForm.package}
                    onChange={(e) => setNewUserForm({ ...newUserForm, package: e.target.value })}
                    className="glass-input text-xs"
                  >
                    {packages.map(p => <option key={p.id} value={p.name} className="bg-[#111113]">{p.name} ({p.speed}M)</option>)}
                  </select>
                </div>
                <FormInput label="Initial Due (৳)" type="number" value={newUserForm.dueAmount} onChange={(e) => setNewUserForm({ ...newUserForm, dueAmount: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white">Cancel</button>
                <GlassButton type="submit" className="py-2 px-5 text-xs font-semibold">Create Customer</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RECORD PAYMENT ── */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-md p-6 rounded-3xl border border-white/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">Record Customer Payment</h3>
              <button onClick={() => setShowRecordPaymentModal(false)} className="text-[#B8B8C0] hover:text-white">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              recordPayment(paymentForm);
              setShowRecordPaymentModal(false);
              setPaymentForm({ customerId: '', name: '', amount: '', method: 'bKash', trxId: '' });
            }} className="space-y-3 text-xs">
              <FormInput label="Customer ID (e.g. RL-001234)" required value={paymentForm.customerId} onChange={(e) => {
                const id = e.target.value;
                const match = users.find(u => u.id === id);
                setPaymentForm({
                  ...paymentForm,
                  customerId: id,
                  name: match ? match.name : paymentForm.name,
                  amount: match && match.dueAmount > 0 ? match.dueAmount : paymentForm.amount
                });
              }} />
              <FormInput label="Customer Name" required value={paymentForm.name} onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Amount (৳)" type="number" required value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
                <div>
                  <label className="text-xs text-[#B8B8C0] block mb-1">Method</label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                    className="glass-input text-xs"
                  >
                    <option value="bKash" className="bg-[#111113]">bKash</option>
                    <option value="Nagad" className="bg-[#111113]">Nagad</option>
                    <option value="Rocket" className="bg-[#111113]">Rocket</option>
                    <option value="Card" className="bg-[#111113]">Card / Bank</option>
                    <option value="Cash" className="bg-[#111113]">Cash Collection</option>
                  </select>
                </div>
              </div>
              <FormInput label="Transaction ID (TrxID)" required value={paymentForm.trxId} onChange={(e) => setPaymentForm({ ...paymentForm, trxId: e.target.value })} placeholder="BK9900XX12" />
              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowRecordPaymentModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white">Cancel</button>
                <GlassButton type="submit" className="py-2 px-5 text-xs font-semibold">Confirm Payment</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD PACKAGE ── */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-md p-6 rounded-3xl border border-white/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg">Create New Broadband Plan</h3>
              <button onClick={() => setShowAddPackageModal(false)} className="text-[#B8B8C0] hover:text-white">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addPackage({
                name: pkgForm.name,
                nameBn: pkgForm.nameBn || pkgForm.name,
                speed: Number(pkgForm.speed),
                price: Number(pkgForm.price),
                originalPrice: pkgForm.originalPrice ? Number(pkgForm.originalPrice) : null,
                popular: pkgForm.popular,
                features: pkgForm.features.split(',').map(s => s.trim()).filter(Boolean),
                featuresBn: ['আনলিমিটেড ডেটা', 'বিনামূল্যে ডুয়াল-ব্যান্ড রাউটার', '২৪/৭ সাপোর্ট']
              });
              setShowAddPackageModal(false);
              setPkgForm({ name: '', nameBn: '', speed: 60, price: 1000, originalPrice: 1300, popular: false, features: 'Unlimited Data, Free Dual-band Router, 24/7 Priority Support, BDIX 100 Mbps' });
            }} className="space-y-3 text-xs">
              <FormInput label="Package Name (e.g. Turbo 60)" required value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Speed (Mbps)" type="number" required value={pkgForm.speed} onChange={(e) => setPkgForm({ ...pkgForm, speed: e.target.value })} />
                <FormInput label="Monthly Price (৳)" type="number" required value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })} />
              </div>
              <FormInput label="Original Price (৳) (optional strike-through)" type="number" value={pkgForm.originalPrice} onChange={(e) => setPkgForm({ ...pkgForm, originalPrice: e.target.value })} />
              <div>
                <label className="text-xs text-[#B8B8C0] block mb-1">Features (comma separated)</label>
                <textarea
                  rows={2}
                  value={pkgForm.features}
                  onChange={(e) => setPkgForm({ ...pkgForm, features: e.target.value })}
                  className="glass-input text-xs w-full"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={pkgForm.popular}
                  onChange={(e) => setPkgForm({ ...pkgForm, popular: e.target.checked })}
                />
                <label htmlFor="popularCheck" className="text-xs text-white">Feature as 'Most Popular' badge</label>
              </div>
              <div className="pt-3 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddPackageModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white">Cancel</button>
                <GlassButton type="submit" className="py-2 px-5 text-xs font-semibold">Publish Plan Live</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
