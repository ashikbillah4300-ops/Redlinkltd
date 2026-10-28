// ── Master Admin Dashboard with 11 Comprehensive Management Sections ──────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, Package, UserPlus, LifeBuoy,
  MapPin, Megaphone, Activity, Settings, Shield, LogOut, Search,
  Plus, Filter, CheckCircle2, AlertTriangle, Clock, RefreshCw,
  Edit2, Trash2, Eye, ArrowUpRight, TrendingUp, Download, Globe,
  Phone, Mail, Server, Menu, X, Sparkles, Check, Globe2, Radio, Navigation, Zap,
  ChevronLeft, ChevronRight, Copy, ArrowUp, ArrowDown, Sliders, Timer,
  Image as ImageIcon, Layers, Upload, Play, Pause, ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAdmin, getWhatsAppNumber, createWhatsAppUrl } from '../../context/AdminContext';
import { GlassCard, GlassButton, FormInput } from '../../components/ui/index';
import toast from 'react-hot-toast';

const createAdminMapIcon = (status = 'Active') => {
  const color = status === 'Active' ? '#FF2D3F' : status === 'Expanding' ? '#F59E0B' : '#3B82F6';
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 8px ${color};"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

export default function AdminDashboard() {
  const {
    adminUser, adminLogout,
    users, addUser, updateUser, toggleUserStatus, deleteUser, approveUpgrade, recordCustomerBillPayment,
    payments, recordPayment, updatePaymentStatus,
    packages, updatePackage, addPackage, deletePackage,
    leads, updateLeadStatus,
    tickets, updateTicketStatus,
    siteSettings, updateSiteSettings,
    notice, updateNotice,
    networkNodes, updateNodeStatus,
    homeMapConfig, updateHomeMapConfig,
    addHomeMapPoint, updateHomeMapPoint, deleteHomeMapPoint, resetHomeMapConfig,
    heroConfig, updateHeroConfig, updateHeroBanner, addHeroBanner, deleteHeroBanner, duplicateHeroBanner, reorderHeroBanners, resetHeroConfig,
    auditLogs
  } = useAdmin();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Helper to generate formatted customer IDs (RL-XXXXXX)
  const generateNewCustomerId = () => `RL-${Math.floor(100000 + Math.random() * 900000)}`;

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showAddMapPointModal, setShowAddMapPointModal] = useState(false);
  const [editingMapPoint, setEditingMapPoint] = useState(null);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [mapPointSearch, setMapPointSearch] = useState('');
  const [mapDivisionFilter, setMapDivisionFilter] = useState('all');

  // Map Point Form State
  const [mapPointForm, setMapPointForm] = useState({
    name: '', nameBn: '', division: 'Dhaka', lat: 23.8103, lng: 90.4125, status: 'Active', capacity: '20G Optical', users: '2,500+'
  });

  // New User Form State with auto ID generator, Gmail, and credentials
  const [newUserForm, setNewUserForm] = useState({
    id: `RL-${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    nameBn: '',
    mobile: '',
    email: '',
    password: '1234',
    address: '',
    package: 'Standard 50 Mbps',
    speed: 50,
    monthlyFee: 900,
    dueAmount: 900,
    billingDate: '05',
    ip: '103.237.79.55'
  });

  // Hero Banners Setup State
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [adminPreviewIndex, setAdminPreviewIndex] = useState(0);
  const [isUploadingBannerImg, setIsUploadingBannerImg] = useState(false);

  // Ready-to-use high-quality preset ISP banners
  const PRESET_BANNER_IMAGES = [
    {
      name: 'Ultra Fiber Optical',
      titleBn: 'অপটিক্যাল ফাইবার',
      url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop',
      theme: 'red'
    },
    {
      name: 'Gaming & Low Ping',
      titleBn: 'টার্বো গেমিং',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
      theme: 'blue'
    },
    {
      name: 'Corporate Server Link',
      titleBn: 'কর্পোরেট সার্ভার',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
      theme: 'purple'
    },
    {
      name: 'Home 4K Entertainment',
      titleBn: 'স্মার্ট হোম স্ট্রিমিং',
      url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1600&auto=format&fit=crop',
      theme: 'emerald'
    }
  ];

  // High-performance client-side image compressor (fits images cleanly into ~70-130KB data URL)
  const compressBannerImage = (file, maxWidth = 1600, maxHeight = 900, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBannerImageUpload = async (e, bannerId, preferredDisplayMode) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsUploadingBannerImg(true);
      const toastId = toast.loading('ব্যানার ছবি অপ্টিমাইজ ও আপলোড হচ্ছে...');
      const compressedDataUrl = await compressBannerImage(file);

      const updateData = { imageUrl: compressedDataUrl };
      if (preferredDisplayMode === 'image') {
        updateData.layout = 'image';
      } else if (preferredDisplayMode === 'visual') {
        updateData.layout = 'hero';
        updateData.rightVisualType = 'image';
      }

      updateHeroBanner(bannerId, updateData);
      toast.dismiss(toastId);
      toast.success('ব্যানারের ছবি সফলভাবে আপলোড হয়েছে! হোমপেজে দেখতে পাবেন।', { icon: '🖼️' });
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error('ছবি প্রসেসিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsUploadingBannerImg(false);
      if (e.target) e.target.value = '';
    }
  };

  // Record Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    customerId: '', name: '', amount: '', method: 'bKash', trxId: ''
  });

  // Package Form State
  const [pkgForm, setPkgForm] = useState({
    name: '', nameBn: '', speed: 60, price: 1000, originalPrice: 1300, popular: false,
    features: 'Unlimited Data\nFree Dual-band Router\n24/7 Priority Support\nBDIX 100 Mbps',
    featuresBn: 'আনলিমিটেড ডেটা\nবিনামূল্যে ডুয়াল-ব্যান্ড রাউটার\n২৪/৭ সাপোর্ট'
  });

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPkgForm({
      name: pkg.name || '',
      nameBn: pkg.nameBn || '',
      speed: pkg.speed || 50,
      price: pkg.price || 900,
      originalPrice: pkg.originalPrice || '',
      popular: Boolean(pkg.popular),
      features: Array.isArray(pkg.features) ? pkg.features.join('\n') : (pkg.features || ''),
      featuresBn: Array.isArray(pkg.featuresBn) ? pkg.featuresBn.join('\n') : (pkg.featuresBn || '')
    });
    setShowAddPackageModal(true);
  };

  const handleOpenCreatePackage = () => {
    setEditingPackage(null);
    setPkgForm({
      name: '',
      nameBn: '',
      speed: 60,
      price: 1000,
      originalPrice: 1300,
      popular: false,
      features: 'Unlimited Data\nFree Dual-band Router\n24/7 Priority Support\nBDIX 100 Mbps',
      featuresBn: 'আনলিমিটেড ডেটা\nবিনামূল্যে ডুয়াল-ব্যান্ড রাউটার\n২৪/৭ সাপোর্ট'
    });
    setShowAddPackageModal(true);
  };

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
    { id: 'hero', label: 'Home Hero & Banner', icon: Sparkles },
    { id: 'users', label: 'Subscribers / Users', icon: Users, badge: users.length },
    { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
    { id: 'packages', label: 'Live Packages CMS', icon: Package, badge: packages.length },
    { id: 'leads', label: 'Connection Leads', icon: UserPlus, badge: newLeadsCount ? `${newLeadsCount} new` : null, badgeColor: 'bg-emerald-500' },
    { id: 'tickets', label: 'Support Helpdesk', icon: LifeBuoy, badge: openTicketsCount ? `${openTicketsCount} open` : null, badgeColor: 'bg-red-500' },
    { id: 'coverage', label: 'Coverage & POP Nodes', icon: MapPin },
    { id: 'homemap', label: 'Home Map Setup', icon: Globe2, badge: homeMapConfig?.enabled ? `${homeMapConfig.points?.length || 0} POPs` : 'Off', badgeColor: homeMapConfig?.enabled ? 'bg-red-500' : 'bg-gray-500' },
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
              Live Content & Network Operations Management for RedLink Technologies
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

        {/* ── TAB: HOME HERO & BANNER SETUP ── */}
        {activeTab === 'hero' && (() => {
          const bannersList = Array.isArray(heroConfig?.banners) && heroConfig.banners.length > 0
            ? heroConfig.banners
            : [];

          const currentEditingBanner = bannersList.find((b) => b.id === selectedBannerId) || bannersList[0] || {};
          const safePreviewIdx = bannersList.length > 0 ? adminPreviewIndex % bannersList.length : 0;
          const previewBanner = bannersList[safePreviewIdx] || currentEditingBanner;
          const currentInterval = Number(heroConfig?.autoScrollInterval) || 5;

          const previewGlow = previewBanner?.themeGlow || 'red';
          const previewHighlightClass = previewGlow === 'blue'
            ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent'
            : previewGlow === 'purple'
            ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'
            : previewGlow === 'emerald'
            ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent'
            : 'gradient-text';

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-red-400" />
                    <h3 className="font-bold text-white text-lg">Home Hero & Banner Setup (হোম ব্যানার ও স্লাইডার সেটআপ)</h3>
                  </div>
                  <p className="text-xs text-[#B8B8C0]">
                    হোমপেজের ব্যানারগুলো কনফিগার করুন, অটো-স্ক্রল সময় (সেকেন্ড), স্লাইডার নেভিগেশন ও স্পিডোমিটার মেট্রিক্স সেট করুন।
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    title="Open Homepage in a new tab to view changes live"
                  >
                    <ExternalLink size={13} className="text-red-400" />
                    <span>View Homepage Live (হোমপেজে দেখুন)</span>
                  </a>
                  <button
                    onClick={() => {
                      const newId = addHeroBanner({ name: `Promo Slide ${bannersList.length + 1}` });
                      setSelectedBannerId(newId);
                    }}
                    className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add New Banner (+ নতুন ব্যানার)</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('redlink_admin_hero_config', JSON.stringify(heroConfig));
                      toast.success('Banners & auto-scroll interval saved live!', { icon: '✅' });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Force immediate save to localStorage"
                  >
                    <CheckCircle2 size={13} />
                    <span>Save All (সংরক্ষণ)</span>
                  </button>
                  <button
                    onClick={() => {
                      resetHeroConfig();
                      toast.success('Restored 3 default multi-slide banners!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Restore default 3 multi-slide banners"
                  >
                    <RefreshCw size={13} />
                    <span>Restore Defaults</span>
                  </button>
                </div>
              </div>

              {/* ── CARD 1: CAROUSEL & AUTO-SCROLL CONFIGURATION ── */}
              <GlassCard className="p-6 relative overflow-hidden border border-red-500/30 bg-gradient-to-br from-red-950/20 via-black/80 to-[#0e0e12]">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
                  <Sliders size={18} className="text-red-400" />
                  <span className="font-bold text-white text-sm">
                    Carousel & Auto-Scroll Setup (স্লাইডার ও অটো-স্ক্রল সময় নির্ধারণ)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                  {/* Auto-Scroll Toggle */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white font-bold">Auto-Scroll (স্বয়ংক্রিয় স্ক্রল)</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroConfig?.autoScroll !== false}
                          onChange={(e) => updateHeroConfig({ autoScroll: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-[#B8B8C0]">
                      চালু থাকলে ব্যানারগুলো একা একাই নির্দিষ্ট সময় পর পর পরিবর্তন হবে।
                    </p>
                  </div>

                  {/* Auto-Scroll Interval Input & Range Slider */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-red-500/20 md:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Timer size={15} className="text-red-400" />
                        <span className="text-xs text-white font-bold">
                          অটো স্ক্রল সময় (সেকেন্ড) / Auto Scroll Interval
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={currentInterval}
                          onChange={(e) => updateHeroConfig({ autoScrollInterval: Math.max(1, Number(e.target.value)) })}
                          className="w-16 text-center glass-input py-1 px-2 font-mono font-bold text-red-400 text-sm"
                        />
                        <span className="text-xs text-white font-medium">সেকেন্ড (Sec)</span>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="1"
                      value={currentInterval}
                      onChange={(e) => updateHeroConfig({ autoScrollInterval: Number(e.target.value) })}
                      className="w-full accent-red-500 cursor-pointer h-2 bg-white/10 rounded-lg"
                    />

                    {/* Quick Presets */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-[#B8B8C0]">দ্রুত নির্বাচন:</span>
                      {[
                        { sec: 3, label: '3s (দ্রুত)' },
                        { sec: 5, label: '5s (স্ট্যান্ডার্ড)' },
                        { sec: 7, label: '7s (রিল্যাক্সড)' },
                        { sec: 10, label: '10s (ধীর)' }
                      ].map((item) => (
                        <button
                          key={item.sec}
                          type="button"
                          onClick={() => updateHeroConfig({ autoScrollInterval: item.sec })}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            currentInterval === item.sec
                              ? 'bg-red-600/30 text-white border-red-500 font-bold'
                              : 'bg-white/5 text-[#B8B8C0] border-white/10 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pause on Hover & Nav Controls */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white font-bold">Pause on Hover</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroConfig?.pauseOnHover !== false}
                          onChange={(e) => updateHeroConfig({ pauseOnHover: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-[#B8B8C0]">
                      মাউস আনলে অটো-স্ক্রল সাময়িক থেমে থাকবে যেন ভিজিটর শান্তিমতো পড়তে পারে।
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* ── CARD 2: LIVE HOMEPAGE PREVIEW SLIDER ── */}
              <GlassCard className="p-6 relative overflow-hidden border border-red-500/20 bg-gradient-to-br from-black/90 via-[#0e0e12] to-red-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      Live Homepage Carousel Preview (লাইভ হোমপেজ প্রিভিউ)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-[11px] font-mono">
                      Slide {safePreviewIdx + 1} of {bannersList.length}
                    </span>
                    {heroConfig?.autoScroll !== false && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#B8B8C0] text-[11px] font-mono">
                        ⚡ Auto-scroll: {currentInterval}s
                      </span>
                    )}
                  </div>

                  {/* Preview Navigation */}
                  <div className="flex items-center gap-2">
                    {bannersList.map((b, i) => (
                      <button
                        key={b.id || i}
                        type="button"
                        onClick={() => setAdminPreviewIndex(i)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          i === safePreviewIdx
                            ? 'bg-red-600 text-white border-red-500 font-bold'
                            : 'bg-white/5 text-[#B8B8C0] border-white/10 hover:text-white'
                        }`}
                      >
                        Slide {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAdminPreviewIndex((prev) => (prev - 1 + bannersList.length) % bannersList.length)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminPreviewIndex((prev) => (prev + 1) % bannersList.length)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Banner Content Preview */}
                {previewBanner?.layout === 'image' && previewBanner?.imageUrl ? (
                  previewBanner?.hideText ? (
                    /* Pure Full Graphic Poster Preview */
                    <div className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-5 border border-white/10 group shadow-xl">
                      <img
                        src={previewBanner.imageUrl}
                        alt="Banner Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="section-tag inline-block text-[10px] py-0.5 px-2 mb-1">
                            {previewBanner.badge || 'PROMO POSTER'}
                          </span>
                          <h3 className="text-white font-bold text-base line-clamp-1">
                            {previewBanner.name || 'Graphic Banner'}
                          </h3>
                        </div>
                        <span className="btn-primary text-xs px-4 py-2 pointer-events-none">
                          {previewBanner.btnPrimaryText || 'View Packages'} →
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Full Promotional Graphic Banner Preview */
                    <div className="relative rounded-2xl overflow-hidden min-h-[240px] sm:min-h-[280px] flex items-center p-6 border border-white/10 shadow-xl">
                      <img
                        src={previewBanner.imageUrl}
                        alt="Banner Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35 pointer-events-none" />
                      <div className="relative z-10 max-w-xl space-y-2.5">
                        <span className="section-tag inline-block text-[10px] py-0.5 px-2">
                          {previewBanner.badge || "🚀 Special Offer"}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black font-poppins text-white leading-tight">
                          {previewBanner.titleLine1 || "Headline"}<br />
                          <span className={previewHighlightClass}>{previewBanner.titleHighlight}</span>
                        </h2>
                        <p className="text-xs text-[#D8D8E2] line-clamp-2 max-w-md">
                          {previewBanner.subtitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="btn-primary text-xs px-4 py-2 pointer-events-none">
                            {previewBanner.btnPrimaryText || "View Packages"} →
                          </span>
                          <span className="btn-outline text-xs px-4 py-2 pointer-events-none">
                            {previewBanner.btnSecondaryText || "Pay Bill"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* Rich 2-Column Hero Preview */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative overflow-hidden rounded-2xl p-2">
                    {previewBanner?.imageUrl && (
                      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                        <img src={previewBanner.imageUrl} alt="" className="w-full h-full object-cover opacity-10 filter blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                      </div>
                    )}
                    <div className="lg:col-span-2 space-y-3">
                      <span className="section-tag inline-block text-xs py-1 px-3">
                        {previewBanner?.badge || "🚀 Bangladesh's #1 Fiber ISP"}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black font-poppins text-white leading-tight">
                        {previewBanner?.titleLine1 || "Ultra-Fast Internet."}<br />
                        <span className={previewHighlightClass}>
                          {previewBanner?.titleHighlight || "Zero Interruption."}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-[#B8B8C0] leading-relaxed max-w-xl">
                        {previewBanner?.subtitle || "Reliable fiber broadband across Bangladesh. Experience speeds up to 100 Mbps with 99.9% uptime guarantee."}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <span className="btn-primary text-xs px-4 py-2 pointer-events-none">
                          {previewBanner?.btnPrimaryText || "View Packages"} →
                        </span>
                        <span className="btn-outline text-xs px-4 py-2 pointer-events-none">
                          {previewBanner?.btnSecondaryText || "Pay Bill"}
                        </span>
                        {previewBanner?.showSpeedTestBtn !== false && (
                          <span className="px-3 py-2 rounded-xl bg-white/5 border border-red-500/30 text-white text-xs flex items-center gap-1.5 pointer-events-none">
                            <Zap size={13} className="text-red-400" />
                            {previewBanner?.speedTestBtnText || "Live Speed Test"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-[#B8B8C0]">
                        <span>{previewBanner?.badge1Icon || "⚡"} {previewBanner?.badge1Text || "99.9% Uptime"}</span>
                        <span>{previewBanner?.badge2Icon || "🛡️"} {previewBanner?.badge2Text || "24/7 Support"}</span>
                        <span>{previewBanner?.badge3Icon || "💸"} {previewBanner?.badge3Text || "No Hidden Fees"}</span>
                      </div>
                    </div>

                    {/* Right side visual preview */}
                    <div className="lg:col-span-1 flex justify-center">
                      {previewBanner?.rightVisualType === 'image' && previewBanner?.imageUrl ? (
                        <div className="w-48 h-48 rounded-2xl overflow-hidden border border-white/10 relative group shadow-lg">
                          <img src={previewBanner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-black/60">
                                {previewBanner.visualSpeed || '100'} Mbps
                              </span>
                              <span className="text-[10px] text-red-400 font-bold uppercase">Image Visual</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl glass-card-static border border-red-500/30 text-center relative w-48 h-48 flex flex-col items-center justify-center">
                          <div className="text-3xl font-black gradient-text font-poppins">
                            {previewBanner?.visualSpeed || "100"}
                          </div>
                          <div className="text-[#B8B8C0] text-xs font-medium">
                            {previewBanner?.visualUnit || "Mbps Fiber"}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-green-400 font-mono">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span>{previewBanner?.visualCta || "Click to Test"}</span>
                          </div>
                          <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                            {previewBanner?.visualUptime || "99.9%"}
                          </span>
                          <span className="absolute -bottom-2 -left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                            {previewBanner?.visualPing || "<5ms"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* ── CARD 3: BANNERS MANAGEMENT LIST (সকল ব্যানারের তালিকা ও ক্রম) ── */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-red-400" />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Manage Banners List (ব্যানার তালিকা ও ক্রম নিয়ন্ত্রণ)
                      </span>
                      <span className="text-[11px] text-[#B8B8C0]">
                        একাধিক ব্যানার যোগ করুন, ক্রম সাজান বা সক্রিয়/নিষ্ক্রিয় করুন।
                      </span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white font-mono">
                    Total: {bannersList.length} Banners
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bannersList.map((banner, index) => {
                    const isSelected = (currentEditingBanner?.id === banner.id);
                    return (
                      <div
                        key={banner.id || index}
                        onClick={() => {
                          setSelectedBannerId(banner.id);
                          setAdminPreviewIndex(index);
                        }}
                        className={`p-4 rounded-2xl transition-all cursor-pointer border relative flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-red-950/30 border-red-500 shadow-[0_0_20px_rgba(225,29,46,0.25)]'
                            : 'bg-white/[0.02] border-white/8 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono flex items-center justify-center font-bold">
                              #{index + 1}
                            </span>
                            <div>
                              <span className="font-bold text-white text-xs block line-clamp-1">
                                {banner.name || `Banner ${index + 1}`}
                              </span>
                              <span className="text-[10px] text-[#B8B8C0]">
                                {banner.layout === 'image' ? '🖼️ Image Banner' : '⚡ Rich Hero Slide'}
                              </span>
                            </div>
                          </div>

                          {/* Active / Inactive Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateHeroBanner(banner.id, { active: banner.active === false ? true : false });
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                              banner.active !== false
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-white/5 text-gray-400 border-white/10'
                            }`}
                          >
                            {banner.active !== false ? 'Active' : 'Disabled'}
                          </button>
                        </div>

                        {/* Banner Image Thumbnail & Quick Upload */}
                        <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 group/thumb bg-black/60 flex items-center justify-center">
                          {banner.imageUrl ? (
                            <>
                              <img
                                src={banner.imageUrl}
                                alt={banner.name || 'Banner'}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Image Set
                                </span>
                                <label
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] px-2 py-0.5 rounded bg-red-600/90 hover:bg-red-600 text-white font-medium cursor-pointer transition-colors flex items-center gap-1 shadow"
                                  title="Change Banner Image"
                                >
                                  <Upload size={10} /> Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleBannerImageUpload(e, banner.id)}
                                  />
                                </label>
                              </div>
                            </>
                          ) : (
                            <label
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-full flex flex-col items-center justify-center gap-1 text-[11px] text-[#B8B8C0] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border border-dashed border-white/20 rounded-xl"
                            >
                              <ImageIcon size={18} className="text-red-400" />
                              <span className="font-medium">+ Upload Image (ছবি দিন)</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleBannerImageUpload(e, banner.id, 'image')}
                              />
                            </label>
                          )}
                        </div>

                        {/* Middle info */}
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#B8B8C0] space-y-1">
                          <p className="line-clamp-1 text-white font-medium">
                            {banner.titleLine1 || 'Headline'} {banner.titleHighlight || ''}
                          </p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Speed: {banner.visualSpeed || '100'} {banner.visualUnit || 'Mbps'}</span>
                            <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 text-white/80">
                              {banner.themeGlow || 'red'} glow
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => reorderHeroBanners(index, index - 1)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={index === bannersList.length - 1}
                              onClick={() => reorderHeroBanners(index, index + 1)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateHeroBanner(banner.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white cursor-pointer"
                              title="Duplicate Banner"
                            >
                              <Copy size={13} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBannerId(banner.id);
                                setAdminPreviewIndex(index);
                              }}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-red-600 text-white border-red-500'
                                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                              }`}
                            >
                              {isSelected ? 'Editing' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              disabled={bannersList.length <= 1}
                              onClick={() => deleteHeroBanner(banner.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Delete Banner"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* ── CARD 4: DETAILED BANNER EDITOR FOR SELECTED BANNER ── */}
              {currentEditingBanner?.id && (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2">
                      <Edit2 size={18} className="text-red-400" />
                      <div>
                        <h4 className="font-bold text-white text-base">
                          Editing: <span className="text-red-400 font-poppins">{currentEditingBanner.name || 'Banner Slide'}</span>
                        </h4>
                        <p className="text-xs text-[#B8B8C0]">
                          নিচে এই ব্যানারের টেক্সট, বাটন, স্পিডোমিটার বা ছবি কাস্টমাইজ করুন।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#B8B8C0]">Banner Theme Glow:</span>
                      {['red', 'blue', 'purple', 'emerald'].map((glowColor) => (
                        <button
                          key={glowColor}
                          type="button"
                          onClick={() => updateHeroBanner(currentEditingBanner.id, { themeGlow: glowColor })}
                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                            glowColor === 'red' ? 'bg-red-600' : glowColor === 'blue' ? 'bg-cyan-500' : glowColor === 'purple' ? 'bg-purple-600' : 'bg-emerald-500'
                          } ${
                            (currentEditingBanner.themeGlow || 'red') === glowColor
                              ? 'border-white scale-110 shadow-lg'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={`Select ${glowColor} glow`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Banner Identity */}
                  <GlassCard className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-2/3">
                      <FormInput
                        label="Banner Display Label (ব্যানারের নাম - অ্যাডমিন রেফারেন্স)"
                        value={currentEditingBanner.name || ''}
                        onChange={(e) => updateHeroBanner(currentEditingBanner.id, { name: e.target.value })}
                        placeholder="e.g. Slide 1: Ultra-Fast Internet"
                      />
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-4">
                      <span className="text-xs text-[#B8B8C0]">Banner Status:</span>
                      <button
                        type="button"
                        onClick={() => updateHeroBanner(currentEditingBanner.id, { active: currentEditingBanner.active === false ? true : false })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          currentEditingBanner.active !== false
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        {currentEditingBanner.active !== false ? '✅ Active on Homepage' : '⏸️ Disabled'}
                      </button>
                    </div>
                  </GlassCard>

                  {/* ── ALWAYS-VISIBLE BANNER IMAGE & HOMEPAGE DISPLAY STUDIO ── */}
                  <GlassCard className="p-6 space-y-6 border border-red-500/30 bg-gradient-to-br from-red-950/20 via-black/80 to-[#0e0e12]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <span className="font-bold text-white text-base block">
                            Banner Image & Homepage Display (ব্যানার ইমেজ আপলোড ও হোমপেজ ডিসপ্লে সেটআপ)
                          </span>
                          <span className="text-xs text-[#B8B8C0]">
                            প্রতিটি ব্যানারে নিজস্ব ছবি আপলোড করুন এবং হোমপেজে কীভাবে দেখাবে তা পছন্দ করুন।
                          </span>
                        </div>
                      </div>

                      {currentEditingBanner.imageUrl && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                          <CheckCircle2 size={13} /> Image Active on Home
                        </span>
                      )}
                    </div>

                    {/* Image Upload & Input Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Upload Dropzone & Controls (7 Cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Drag and drop / Click upload button */}
                        <div>
                          <label className="text-xs text-white font-semibold block mb-2 flex items-center gap-1.5">
                            <Upload size={14} className="text-red-400" />
                            <span>Upload Image from Device (কম্পিউটার বা ফোন থেকে ছবি আপলোড করুন):</span>
                          </label>
                          <label
                            className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              isUploadingBannerImg
                                ? 'border-red-500 bg-red-500/10 opacity-75'
                                : 'border-white/20 hover:border-red-500 hover:bg-white/[0.04]'
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingBannerImg}
                              onChange={(e) => handleBannerImageUpload(e, currentEditingBanner.id, 'image')}
                              className="hidden"
                            />
                            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-2.5 shadow-lg">
                              {isUploadingBannerImg ? (
                                <RefreshCw size={22} className="animate-spin" />
                              ) : (
                                <Upload size={22} />
                              )}
                            </div>
                            <p className="text-sm font-bold text-white mb-1">
                              {isUploadingBannerImg ? 'ছবি আপলোড ও অপ্টিমাইজ হচ্ছে...' : 'ছবি বেছে নিতে এখানে ক্লিক করুন'}
                            </p>
                            <p className="text-xs text-[#B8B8C0]">
                              JPG, PNG, WebP ফরম্যাট সমর্থিত • স্বয়ংক্রিয়ভাবে ব্রাউজারে অপ্টিমাইজ হবে
                            </p>
                            <span className="mt-3 px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow">
                              + ব্রাউজ ফাইল (Browse Image)
                            </span>
                          </label>
                        </div>

                        {/* Direct Image URL input */}
                        <div>
                          <label className="text-xs text-[#B8B8C0] font-medium block mb-1.5">
                            অথবা সরাসরি ছবির লিংক দিন (Direct Image URL):
                          </label>
                          <FormInput
                            value={currentEditingBanner.imageUrl || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { imageUrl: e.target.value })}
                            placeholder="https://example.com/your-banner-image.jpg"
                          />
                        </div>

                        {/* Ready-made ISP Preset Images */}
                        <div>
                          <label className="text-xs text-[#B8B8C0] font-medium block mb-2">
                            ⚡ দ্রুত ব্যবহারের জন্য রেডিমেড ব্যানার ছবি (Click to apply preset):
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {PRESET_BANNER_IMAGES.map((preset, idx) => {
                              const isCurrent = currentEditingBanner.imageUrl === preset.url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    updateHeroBanner(currentEditingBanner.id, {
                                      imageUrl: preset.url,
                                      themeGlow: preset.theme
                                    });
                                    toast.success(`Preset "${preset.titleBn}" applied!`, { icon: '🖼️' });
                                  }}
                                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer group relative overflow-hidden ${
                                    isCurrent
                                      ? 'border-red-500 bg-red-950/40 ring-1 ring-red-500'
                                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30'
                                  }`}
                                >
                                  <div className="w-full h-12 rounded-lg overflow-hidden mb-1.5 bg-black/50">
                                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                  </div>
                                  <span className="text-[11px] font-bold text-white block line-clamp-1">{preset.titleBn}</span>
                                  <span className="text-[9px] text-[#B8B8C0] block line-clamp-1">{preset.name}</span>
                                  {isCurrent && (
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Image Preview Box (5 Cols) */}
                      <div className="lg:col-span-5 space-y-3">
                        <label className="text-xs text-white font-semibold block flex items-center justify-between">
                          <span>Image Preview (ছবির প্রিভিউ):</span>
                          {currentEditingBanner.imageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                updateHeroBanner(currentEditingBanner.id, { imageUrl: '' });
                                toast.success('ছবি বাদ দেওয়া হয়েছে');
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> ছবি মুছে ফেলুন
                            </button>
                          )}
                        </label>

                        {currentEditingBanner.imageUrl ? (
                          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-xl group/preview">
                            <img
                              src={currentEditingBanner.imageUrl}
                              alt="Banner Preview"
                              className="w-full h-56 sm:h-64 object-cover group-hover/preview:scale-102 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3.5 pointer-events-none">
                              <span className="self-end px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                                ✓ Ready for Home Page
                              </span>
                              <div>
                                <span className="text-xs font-bold text-white block line-clamp-1 drop-shadow">
                                  {currentEditingBanner.name || 'Banner Slide'}
                                </span>
                                <span className="text-[10px] text-red-300 block drop-shadow">
                                  {currentEditingBanner.layout === 'image'
                                    ? currentEditingBanner.hideText ? 'Mode: Full Graphic Poster' : 'Mode: Full Promo Banner'
                                    : currentEditingBanner.rightVisualType === 'image' ? 'Mode: Right-side Visual Card' : 'Mode: Hero Background'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-56 sm:h-64 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center">
                            <ImageIcon size={36} className="text-white/20 mb-2" />
                            <p className="text-xs font-bold text-white mb-1">কোনো ছবি সেট করা নেই</p>
                            <p className="text-[11px] text-[#B8B8C0] max-w-xs">
                              বামপাশের বক্স থেকে যেকোনো ছবি ফাইল নির্বাচন করুন বা রেডিমেড প্রিসেট সিলেক্ট করুন।
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── HOMEPAGE DISPLAY MODE SELECTOR (হোমপেজে ছবিটি কীভাবে দেখাবেন?) ── */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div>
                        <span className="font-bold text-white text-sm block">
                          How Should This Image Appear on Homepage? (হোমপেজে এই ছবিটি কীভাবে দেখাবেন?)
                        </span>
                        <span className="text-xs text-[#B8B8C0]">
                          নিচের যেকোনো একটি অপশনে ক্লিক করুন, হোমপেজে স্বয়ংক্রিয়ভাবে সেভাবে প্রদর্শিত হবে:
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Option 1: Full Promotional Banner */}
                        <div
                          onClick={() => {
                            updateHeroBanner(currentEditingBanner.id, { layout: 'image', hideText: false });
                            toast.success('হোমপেজ মোড: ফুল প্রোমোশনাল ব্যানার', { icon: '🌟' });
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentEditingBanner.layout === 'image' && !currentEditingBanner.hideText
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(225,29,46,0.3)] ring-1 ring-red-500'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-xs">🌟 Full Promo Banner</span>
                              {currentEditingBanner.layout === 'image' && !currentEditingBanner.hideText && (
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-red-400 block mb-1">ফুল ব্যানার স্লাইড</span>
                            <p className="text-[10px] text-[#B8B8C0] leading-relaxed">
                              পুরো স্লাইডে ছবি থাকবে ব্যাকগ্রাউন্ডে এবং উপরে টেক্সট, হেডলাইন ও বাটন থাকবে।
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold py-1 px-2 rounded-lg text-center ${
                            currentEditingBanner.layout === 'image' && !currentEditingBanner.hideText
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 text-[#B8B8C0]'
                          }`}>
                            {currentEditingBanner.layout === 'image' && !currentEditingBanner.hideText ? '✓ নির্বাচিত (Active)' : 'নির্বাচন করুন'}
                          </span>
                        </div>

                        {/* Option 2: Right-Side Visual Card */}
                        <div
                          onClick={() => {
                            updateHeroBanner(currentEditingBanner.id, { layout: 'hero', rightVisualType: 'image' });
                            toast.success('হোমপেজ মোড: ডানপাশের ভিজ্যুয়াল কার্ড', { icon: '⚡' });
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentEditingBanner.layout === 'hero' && currentEditingBanner.rightVisualType === 'image'
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(225,29,46,0.3)] ring-1 ring-red-500'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-xs">⚡ Right Visual Card</span>
                              {currentEditingBanner.layout === 'hero' && currentEditingBanner.rightVisualType === 'image' && (
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-red-400 block mb-1">ডানপাশের কার্ড</span>
                            <p className="text-[10px] text-[#B8B8C0] leading-relaxed">
                              বামে হেডলাইন ও বাটন এবং ডানপাশে আপনার আপলোড করা ছবির কার্ড দেখাবে।
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold py-1 px-2 rounded-lg text-center ${
                            currentEditingBanner.layout === 'hero' && currentEditingBanner.rightVisualType === 'image'
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 text-[#B8B8C0]'
                          }`}>
                            {currentEditingBanner.layout === 'hero' && currentEditingBanner.rightVisualType === 'image' ? '✓ নির্বাচিত (Active)' : 'নির্বাচন করুন'}
                          </span>
                        </div>

                        {/* Option 3: Full Graphic Poster (No Text Overlay) */}
                        <div
                          onClick={() => {
                            updateHeroBanner(currentEditingBanner.id, { layout: 'image', hideText: true });
                            toast.success('হোমপেজ মোড: শুধুমাত্র ছবি/পোস্টার ব্যানার', { icon: '🎯' });
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentEditingBanner.layout === 'image' && currentEditingBanner.hideText
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(225,29,46,0.3)] ring-1 ring-red-500'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-xs">🎯 Pure Graphic Poster</span>
                              {currentEditingBanner.layout === 'image' && currentEditingBanner.hideText && (
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-red-400 block mb-1">শুধুমাত্র পুরো ছবি</span>
                            <p className="text-[10px] text-[#B8B8C0] leading-relaxed">
                              Canva বা ফটোশপে বানানো সম্পূর্ণ অফার ব্যানার কোনো টেক্সট কভার ছাড়া দেখাবে।
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold py-1 px-2 rounded-lg text-center ${
                            currentEditingBanner.layout === 'image' && currentEditingBanner.hideText
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 text-[#B8B8C0]'
                          }`}>
                            {currentEditingBanner.layout === 'image' && currentEditingBanner.hideText ? '✓ নির্বাচিত (Active)' : 'নির্বাচন করুন'}
                          </span>
                        </div>

                        {/* Option 4: Hero Ambient Background Wallpaper */}
                        <div
                          onClick={() => {
                            updateHeroBanner(currentEditingBanner.id, { layout: 'hero', rightVisualType: 'image', bgImage: true });
                            toast.success('হোমপেজ মোড: হিরো ব্যাকগ্রাউন্ড ইমেজ', { icon: '🌌' });
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            currentEditingBanner.layout === 'hero' && currentEditingBanner.bgImage
                              ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(225,29,46,0.3)] ring-1 ring-red-500'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-xs">🌌 Hero Background</span>
                              {currentEditingBanner.layout === 'hero' && currentEditingBanner.bgImage && (
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-red-400 block mb-1">হিরো ব্যাকগ্রাউন্ড</span>
                            <p className="text-[10px] text-[#B8B8C0] leading-relaxed">
                              ব্যাকগ্রাউন্ডে ছবি থাকবে, সাথে বামে টেক্সট ও ডানে ছবির ভিজ্যুয়াল কার্ড।
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold py-1 px-2 rounded-lg text-center ${
                            currentEditingBanner.layout === 'hero' && currentEditingBanner.bgImage
                              ? 'bg-red-600 text-white'
                              : 'bg-white/5 text-[#B8B8C0]'
                          }`}>
                            {currentEditingBanner.layout === 'hero' && currentEditingBanner.bgImage ? '✓ নির্বাচিত (Active)' : 'নির্বাচন করুন'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Form Controls: Card 1 - Headlines & Badges */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlassCard className="p-6 space-y-4">
                      <span className="font-bold text-white text-sm block pb-2 border-b border-white/10">
                        1. Headlines & Top Badge (হেডলাইন ও ব্যাজ)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormInput
                          label="Top Badge Text (English)"
                          value={currentEditingBanner.badge || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge: e.target.value })}
                          placeholder="🚀 Bangladesh's #1 Fiber ISP"
                        />
                        <FormInput
                          label="Top Badge Text (Bangla)"
                          value={currentEditingBanner.badgeBn || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badgeBn: e.target.value })}
                          placeholder="🚀 বাংলাদেশের সেরা ইন্টারনেট"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormInput
                          label="Headline Line 1 (English)"
                          value={currentEditingBanner.titleLine1 || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { titleLine1: e.target.value })}
                          placeholder="Ultra-Fast Internet."
                        />
                        <FormInput
                          label="Headline Line 1 (Bangla)"
                          value={currentEditingBanner.titleLine1Bn || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { titleLine1Bn: e.target.value })}
                          placeholder="অতি-দ্রুত ইন্টারনেট।"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormInput
                          label="Highlight Line 2 (English - Gradient)"
                          value={currentEditingBanner.titleHighlight || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { titleHighlight: e.target.value })}
                          placeholder="Zero Interruption."
                        />
                        <FormInput
                          label="Highlight Line 2 (Bangla - Gradient)"
                          value={currentEditingBanner.titleHighlightBn || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { titleHighlightBn: e.target.value })}
                          placeholder="জিরো বিঘ্ন।"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Hero Description / Subtitle (English)</label>
                        <textarea
                          rows={2}
                          value={currentEditingBanner.subtitle || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { subtitle: e.target.value })}
                          className="glass-input text-xs w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Hero Description / Subtitle (Bangla)</label>
                        <textarea
                          rows={2}
                          value={currentEditingBanner.subtitleBn || ''}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { subtitleBn: e.target.value })}
                          className="glass-input text-xs w-full"
                        />
                      </div>
                    </GlassCard>

                    {/* Card 2: Action Buttons & Navigation */}
                    <GlassCard className="p-6 space-y-4">
                      <span className="font-bold text-white text-sm block pb-2 border-b border-white/10">
                        2. Action Buttons & Navigation (অ্যাকশন বাটন)
                      </span>
                      
                      {/* Primary Button */}
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
                        <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider block">Primary Button</span>
                        <div className="grid grid-cols-2 gap-3">
                          <FormInput
                            label="Label (English)"
                            value={currentEditingBanner.btnPrimaryText || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnPrimaryText: e.target.value })}
                          />
                          <FormInput
                            label="Label (Bangla)"
                            value={currentEditingBanner.btnPrimaryTextBn || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnPrimaryTextBn: e.target.value })}
                          />
                        </div>
                        <FormInput
                          label="Target Link Destination"
                          value={currentEditingBanner.btnPrimaryLink || '/packages'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnPrimaryLink: e.target.value })}
                        />
                      </div>

                      {/* Secondary Button */}
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
                        <span className="text-[11px] text-[#B8B8C0] font-bold uppercase tracking-wider block">Secondary Button</span>
                        <div className="grid grid-cols-2 gap-3">
                          <FormInput
                            label="Label (English)"
                            value={currentEditingBanner.btnSecondaryText || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnSecondaryText: e.target.value })}
                          />
                          <FormInput
                            label="Label (Bangla)"
                            value={currentEditingBanner.btnSecondaryTextBn || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnSecondaryTextBn: e.target.value })}
                          />
                        </div>
                        <FormInput
                          label="Target Link Destination"
                          value={currentEditingBanner.btnSecondaryLink || '/pay-bill'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { btnSecondaryLink: e.target.value })}
                        />
                      </div>

                      {/* Speed Test Button */}
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white font-bold uppercase tracking-wider">Speed Test Button</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentEditingBanner.showSpeedTestBtn !== false}
                              onChange={(e) => updateHeroBanner(currentEditingBanner.id, { showSpeedTestBtn: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormInput
                            label="Label (English)"
                            value={currentEditingBanner.speedTestBtnText || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { speedTestBtnText: e.target.value })}
                          />
                          <FormInput
                            label="Label (Bangla)"
                            value={currentEditingBanner.speedTestBtnTextBn || ''}
                            onChange={(e) => updateHeroBanner(currentEditingBanner.id, { speedTestBtnTextBn: e.target.value })}
                          />
                        </div>
                      </div>
                    </GlassCard>

                    {/* Card 3: Speedometer Visual Card Metrics */}
                    <GlassCard className="p-6 space-y-4">
                      <span className="font-bold text-white text-sm block pb-2 border-b border-white/10">
                        3. Right Visual Card & Speedometer Metrics (স্পিডোমিটার মেট্রিক্স)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Showcase Speed Number"
                          value={currentEditingBanner.visualSpeed || '100'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualSpeed: e.target.value })}
                          placeholder="100"
                        />
                        <FormInput
                          label="Speed Unit Label"
                          value={currentEditingBanner.visualUnit || 'Mbps Fiber'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualUnit: e.target.value })}
                          placeholder="Mbps Fiber"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Ping Latency Tag"
                          value={currentEditingBanner.visualPing || '<5ms'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualPing: e.target.value })}
                          placeholder="<5ms"
                        />
                        <FormInput
                          label="Uptime Metric Tag"
                          value={currentEditingBanner.visualUptime || '99.9%'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualUptime: e.target.value })}
                          placeholder="99.9%"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput
                          label="Action Label (English)"
                          value={currentEditingBanner.visualCta || 'Click to Test'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualCta: e.target.value })}
                          placeholder="Click to Test"
                        />
                        <FormInput
                          label="Action Label (Bangla)"
                          value={currentEditingBanner.visualCtaBn || 'স্পিড টেস্ট চালান'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { visualCtaBn: e.target.value })}
                          placeholder="স্পিড টেস্ট চালান"
                        />
                      </div>
                    </GlassCard>

                    {/* Card 4: Trust Badges */}
                    <GlassCard className="p-6 space-y-4">
                      <span className="font-bold text-white text-sm block pb-2 border-b border-white/10">
                        4. Trust Badges & Guarantees (৩টি ট্রাস্ট ব্যাজ)
                      </span>
                      
                      {/* Badge 1 */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/8 items-end">
                        <FormInput
                          label="Icon"
                          value={currentEditingBanner.badge1Icon || '⚡'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge1Icon: e.target.value })}
                        />
                        <FormInput
                          label="Text (English)"
                          value={currentEditingBanner.badge1Text || '99.9% Uptime'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge1Text: e.target.value })}
                        />
                        <FormInput
                          label="Text (Bangla)"
                          value={currentEditingBanner.badge1TextBn || '৯৯.৯% আপটাইম'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge1TextBn: e.target.value })}
                        />
                      </div>

                      {/* Badge 2 */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/8 items-end">
                        <FormInput
                          label="Icon"
                          value={currentEditingBanner.badge2Icon || '🛡️'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge2Icon: e.target.value })}
                        />
                        <FormInput
                          label="Text (English)"
                          value={currentEditingBanner.badge2Text || '24/7 Support'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge2Text: e.target.value })}
                        />
                        <FormInput
                          label="Text (Bangla)"
                          value={currentEditingBanner.badge2TextBn || '২৪/৭ সাপোর্ট'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge2TextBn: e.target.value })}
                        />
                      </div>

                      {/* Badge 3 */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/8 items-end">
                        <FormInput
                          label="Icon"
                          value={currentEditingBanner.badge3Icon || '💸'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge3Icon: e.target.value })}
                        />
                        <FormInput
                          label="Text (English)"
                          value={currentEditingBanner.badge3Text || 'No Hidden Fees'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge3Text: e.target.value })}
                        />
                        <FormInput
                          label="Text (Bangla)"
                          value={currentEditingBanner.badge3TextBn || 'কোনো লুকানো চার্জ নেই'}
                          onChange={(e) => updateHeroBanner(currentEditingBanner.id, { badge3TextBn: e.target.value })}
                        />
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

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
                    <th className="p-4">Customer ID & Name</th>
                    <th className="p-4">Contact & Login Credentials</th>
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
                      const matchSearch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.id || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                        (u.mobile || '').includes(userSearch) ||
                        (u.ip && u.ip.includes(userSearch));
                      const matchStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                              {user.id}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user.id);
                                toast.success(`Copied Customer ID: ${user.id}`);
                              }}
                              className="text-[#B8B8C0] hover:text-white cursor-pointer"
                              title="Copy Customer ID"
                            >
                              <Copy size={11} />
                            </button>
                          </div>
                          <span className="font-bold text-white block text-sm">{user.name}</span>
                          {user.nameBn && <span className="text-[10px] text-[#B8B8C0]">{user.nameBn}</span>}
                        </td>

                        <td className="p-4 text-[#B8B8C0]">
                          <div className="text-white font-medium">{user.mobile}</div>
                          <div className="text-[11px] text-blue-400 truncate max-w-[170px]">
                            {user.email || 'customer@gmail.com'}
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono text-[#B8B8C0]">
                              PIN: <strong className="text-white">{user.password || '1234'}</strong>
                            </span>
                            <button
                              onClick={() => {
                                const creds = `RedLink Customer Credentials:\nCustomer ID: ${user.id}\nGmail: ${user.email}\nPassword: ${user.password || '1234'}\nPortal: https://redlinkltd.vercel.app/portal/login`;
                                navigator.clipboard.writeText(creds);
                                toast.success(`Copied login credentials for ${user.name}! Ready to share via SMS/WhatsApp.`, { icon: '📋' });
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer underline flex items-center gap-0.5"
                              title="Copy Login Details for Customer"
                            >
                              <Copy size={10} /> Copy Login
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-white block">{user.package}</span>
                          <span className="text-[10px] text-emerald-400 font-mono">{user.speed} Mbps Fiber • ৳{user.monthlyFee || 900}/mo</span>

                          {/* Upgrade Request Badge & Action */}
                          {user.upgradeRequest && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-1.5">
                              <div>
                                <span className="text-[9px] text-red-400 font-bold block uppercase flex items-center gap-1">
                                  <Zap size={10} /> Upgrade Requested
                                </span>
                                <span className="text-[10px] text-white font-semibold">
                                  {user.upgradeRequest.targetPackage} ({user.upgradeRequest.targetSpeed}M)
                                </span>
                              </div>
                              <button
                                onClick={() => approveUpgrade(user.id)}
                                className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold shadow-red-glow transition-all cursor-pointer whitespace-nowrap"
                                title="Approve Package Upgrade Now"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="p-4 font-mono text-[11px] text-[#B8B8C0]">
                          <span className="text-white font-medium block">{user.ip || '103.237.79.xx'}</span>
                          <span className="text-[9px] text-[#6B6B78]">{user.mac || 'E4:8D:8C:xx:xx'}</span>
                        </td>

                        <td className="p-4">
                          {user.dueAmount > 0 ? (
                            <div>
                              <span className="text-red-400 font-bold font-mono text-sm block">৳{user.dueAmount}</span>
                              <button
                                onClick={() => recordCustomerBillPayment(user.id, user.dueAmount, 'bKash')}
                                className="text-[9px] text-emerald-400 hover:underline cursor-pointer font-medium"
                              >
                                Mark Paid
                              </button>
                            </div>
                          ) : (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} /> Paid
                            </span>
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
                onClick={handleOpenCreatePackage}
                className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                Create New Broadband Plan
              </GlassButton>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <GlassCard key={pkg.id} className="p-6 relative flex flex-col justify-between group hover:border-white/20 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-white block">{pkg.name}</span>
                        {pkg.nameBn && <span className="text-xs text-[#B8B8C0] font-normal font-bangla">{pkg.nameBn}</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {pkg.popular && (
                          <span className="popular-badge text-[10px]">Popular</span>
                        )}
                        <button
                          onClick={() => handleOpenEditPackage(pkg)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#B8B8C0] hover:text-white transition-all cursor-pointer"
                          title="Edit All Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${pkg.name}"?`)) {
                              deletePackage(pkg.id);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/25 flex items-center justify-center text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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
                      onClick={() => handleOpenEditPackage(pkg)}
                      className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/35 border border-red-500/30 hover:border-red-500/60 text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all flex-1"
                    >
                      <Edit2 size={13} />
                      Edit All Details
                    </button>

                    <button
                      onClick={() => {
                        updatePackage(pkg.id, { popular: !pkg.popular });
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        pkg.popular
                          ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white border border-white/10'
                      }`}
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

        {/* ── TAB: HOME MAP SETUP ── */}
        {activeTab === 'homemap' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Globe2 size={20} className="text-red-400" />
                  <h3 className="font-bold text-white text-lg">Home Map Setup (হোম ম্যাপ সেটআপ)</h3>
                </div>
                <p className="text-xs text-[#B8B8C0]">
                  Configure the interactive fiber network map displayed on RedLink's homepage. Manage POP coordinates, live provider, and points.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetHomeMapConfig}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#B8B8C0] hover:text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Reset Defaults
                </button>
                <GlassButton
                  onClick={() => {
                    setEditingMapPoint(null);
                    setMapPointForm({
                      name: '', nameBn: '', division: 'Dhaka', lat: 23.8103, lng: 90.4125, status: 'Active', capacity: '20G Optical', users: '2,500+'
                    });
                    setShowAddMapPointModal(true);
                  }}
                  className="py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  Add POP Point
                </GlassButton>
              </div>
            </div>

            {/* Top Config Cards: Display Settings & Copywriting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Map Display & Provider */}
              <GlassCard className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="font-bold text-white text-sm block">Display Map on Homepage</span>
                    <span className="text-[11px] text-[#B8B8C0]">Turn on or off the interactive map section on the home page.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homeMapConfig?.enabled ?? true}
                      onChange={(e) => updateHomeMapConfig({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-xs text-[#B8B8C0] font-medium block mb-2">Map Engine / Provider Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateHomeMapConfig({ mapType: 'interactive' })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        (homeMapConfig?.mapType || 'interactive') === 'interactive'
                          ? 'bg-red-500/20 border-red-500 text-white'
                          : 'bg-white/5 border-white/10 text-[#B8B8C0] hover:text-white'
                      }`}
                    >
                      <Radio size={14} className={(homeMapConfig?.mapType || 'interactive') === 'interactive' ? 'text-red-400' : ''} />
                      Interactive Dark Fiber Map
                    </button>
                    <button
                      type="button"
                      onClick={() => updateHomeMapConfig({ mapType: 'embed' })}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        homeMapConfig?.mapType === 'embed'
                          ? 'bg-red-500/20 border-red-500 text-white'
                          : 'bg-white/5 border-white/10 text-[#B8B8C0] hover:text-white'
                      }`}
                    >
                      <Globe size={14} className={homeMapConfig?.mapType === 'embed' ? 'text-red-400' : ''} />
                      Google Maps Embed Iframe
                    </button>
                  </div>
                </div>

                {homeMapConfig?.mapType === 'embed' ? (
                  <div>
                    <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Google Maps Embed URL (Iframe Src)</label>
                    <textarea
                      rows={3}
                      value={homeMapConfig?.embedUrl || ''}
                      onChange={(e) => updateHomeMapConfig({ embedUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="glass-input text-xs w-full font-mono"
                    />
                    <span className="text-[10px] text-[#B8B8C0] mt-1 block">
                      Tip: Open Google Maps, search location, click Share &gt; Embed a map, then copy the src link.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <FormInput
                        label="Center Latitude"
                        type="number"
                        step="0.0001"
                        value={homeMapConfig?.centerLat || 23.8103}
                        onChange={(e) => updateHomeMapConfig({ centerLat: Number(e.target.value) })}
                      />
                      <FormInput
                        label="Center Longitude"
                        type="number"
                        step="0.0001"
                        value={homeMapConfig?.centerLng || 90.4125}
                        onChange={(e) => updateHomeMapConfig({ centerLng: Number(e.target.value) })}
                      />
                      <FormInput
                        label="Default Zoom (5-15)"
                        type="number"
                        min="5"
                        max="16"
                        value={homeMapConfig?.zoom || 7}
                        onChange={(e) => updateHomeMapConfig({ zoom: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#B8B8C0] block mb-1">Quick Center Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'All Bangladesh', lat: 23.8103, lng: 90.4125, zoom: 7 },
                          { label: 'Dhaka Division', lat: 23.8103, lng: 90.4125, zoom: 11 },
                          { label: 'Chittagong Hub', lat: 22.3569, lng: 91.8324, zoom: 11 },
                          { label: 'Sylhet Node', lat: 24.8949, lng: 91.8687, zoom: 11 },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => updateHomeMapConfig({ centerLat: p.lat, centerLng: p.lng, zoom: p.zoom })}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white transition-all cursor-pointer"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Card 2: Section Titles & Copywriting */}
              <GlassCard className="p-6 space-y-3">
                <span className="font-bold text-white text-sm block pb-2 border-b border-white/10">
                  Homepage Section Copywriting
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput
                    label="Section Title (English)"
                    value={homeMapConfig?.title || ''}
                    onChange={(e) => updateHomeMapConfig({ title: e.target.value })}
                    placeholder="Our Nationwide Fiber Coverage Map"
                  />
                  <FormInput
                    label="Section Title (Bangla)"
                    value={homeMapConfig?.titleBn || ''}
                    onChange={(e) => updateHomeMapConfig({ titleBn: e.target.value })}
                    placeholder="আমাদের দেশব্যাপী ফাইবার কভারেজ ম্যাপ"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Subtitle (English)</label>
                  <textarea
                    rows={2}
                    value={homeMapConfig?.subtitle || ''}
                    onChange={(e) => updateHomeMapConfig({ subtitle: e.target.value })}
                    className="glass-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B8B8C0] font-medium block mb-1">Subtitle (Bangla)</label>
                  <textarea
                    rows={2}
                    value={homeMapConfig?.subtitleBn || ''}
                    onChange={(e) => updateHomeMapConfig({ subtitleBn: e.target.value })}
                    className="glass-input text-xs w-full"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Live Map Preview Card */}
            <GlassCard className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold text-white text-sm">Live Preview (Homepage Synchronized)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#B8B8C0]">
                    {homeMapConfig?.enabled ? 'Live on Site' : 'Hidden on Site'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#B8B8C0]">Total POPs: <strong className="text-white">{homeMapConfig?.points?.length || 0}</strong></span>
                  <span className="text-emerald-400 font-semibold">Active: {homeMapConfig?.points?.filter(p => p.status === 'Active').length || 0}</span>
                  <span className="text-amber-400 font-semibold">Expanding: {homeMapConfig?.points?.filter(p => p.status === 'Expanding').length || 0}</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 h-80 sm:h-96 relative bg-[#09090D]">
                {homeMapConfig?.mapType === 'embed' && homeMapConfig?.embedUrl ? (
                  <iframe
                    src={homeMapConfig.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Home Map Live Preview"
                  />
                ) : (
                  <MapContainer
                    center={[Number(homeMapConfig?.centerLat) || 23.8103, Number(homeMapConfig?.centerLng) || 90.4125]}
                    zoom={Number(homeMapConfig?.zoom) || 7}
                    scrollWheelZoom={false}
                    className="w-full h-full z-10"
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      subdomains="abcd"
                      maxZoom={19}
                    />
                    {(homeMapConfig?.points || []).map((pt) => (
                      <Marker
                        key={pt.id}
                        position={[pt.lat, pt.lng]}
                        icon={createAdminMapIcon(pt.status)}
                      >
                        <Popup>
                          <div className="p-1 text-xs">
                            <div className="font-bold text-slate-900">{pt.name}</div>
                            <div className="text-[11px] text-slate-600">{pt.division} Division • {pt.status}</div>
                            <div className="text-[10px] text-red-600 font-semibold mt-1">{pt.capacity} • {pt.users}</div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </GlassCard>

            {/* POP Nodes / Coverage Points Management Table */}
            <GlassCard className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-bold text-white text-base">Configured POP Hubs & Coverage Nodes</h4>
                  <p className="text-xs text-[#B8B8C0]">Add, modify, or remove fiber distribution points that show on the map.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                    <input
                      type="text"
                      placeholder="Search node or division..."
                      value={mapPointSearch}
                      onChange={(e) => setMapPointSearch(e.target.value)}
                      className="glass-input pl-8 pr-3 py-1.5 text-xs w-48 sm:w-60"
                    />
                  </div>
                  <select
                    value={mapDivisionFilter}
                    onChange={(e) => setMapDivisionFilter(e.target.value)}
                    className="glass-input py-1.5 px-3 text-xs"
                  >
                    <option value="all" className="bg-[#111113]">All Divisions</option>
                    <option value="Dhaka" className="bg-[#111113]">Dhaka</option>
                    <option value="Chittagong" className="bg-[#111113]">Chittagong</option>
                    <option value="Sylhet" className="bg-[#111113]">Sylhet</option>
                    <option value="Rajshahi" className="bg-[#111113]">Rajshahi</option>
                    <option value="Khulna" className="bg-[#111113]">Khulna</option>
                    <option value="Barishal" className="bg-[#111113]">Barishal</option>
                    <option value="Rangpur" className="bg-[#111113]">Rangpur</option>
                    <option value="Mymensingh" className="bg-[#111113]">Mymensingh</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-[#B8B8C0] uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Node ID</th>
                      <th className="p-3">POP Name</th>
                      <th className="p-3">Division</th>
                      <th className="p-3">Coordinates (Lat, Lng)</th>
                      <th className="p-3">Capacity</th>
                      <th className="p-3">Subscribers</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(homeMapConfig?.points || [])
                      .filter(p => {
                        const matchDiv = mapDivisionFilter === 'all' || p.division.toLowerCase() === mapDivisionFilter.toLowerCase();
                        const matchQ = !mapPointSearch || p.name.toLowerCase().includes(mapPointSearch.toLowerCase()) || p.division.toLowerCase().includes(mapPointSearch.toLowerCase());
                        return matchDiv && matchQ;
                      })
                      .map((pt) => (
                        <tr key={pt.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 font-mono text-red-400 font-bold text-[11px]">{pt.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-white text-xs">{pt.name}</div>
                            {pt.nameBn && <div className="text-[11px] text-[#B8B8C0]">{pt.nameBn}</div>}
                          </td>
                          <td className="p-3 text-[#B8B8C0] font-medium">{pt.division}</td>
                          <td className="p-3 font-mono text-[11px] text-[#B8B8C0]">
                            {Number(pt.lat).toFixed(4)}, {Number(pt.lng).toFixed(4)}
                          </td>
                          <td className="p-3 font-semibold text-white">{pt.capacity || '10G Ring'}</td>
                          <td className="p-3 text-emerald-400 font-medium">{pt.users || 'Active'}</td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              pt.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : pt.status === 'Expanding'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}>
                              {pt.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  const next = pt.status === 'Active' ? 'Expanding' : pt.status === 'Expanding' ? 'Planned' : 'Active';
                                  updateHomeMapPoint(pt.id, { status: next });
                                }}
                                title="Cycle Status"
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#B8B8C0] hover:text-white transition-all cursor-pointer"
                              >
                                Toggle
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMapPoint(pt);
                                  setMapPointForm({
                                    name: pt.name,
                                    nameBn: pt.nameBn || '',
                                    division: pt.division,
                                    lat: pt.lat,
                                    lng: pt.lng,
                                    status: pt.status,
                                    capacity: pt.capacity || '',
                                    users: pt.users || ''
                                  });
                                  setShowAddMapPointModal(true);
                                }}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#B8B8C0] hover:text-white transition-all cursor-pointer"
                                title="Edit Node"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => deleteHomeMapPoint(pt.id)}
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all cursor-pointer"
                                title="Delete Node"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
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
                <div>
                  <FormInput
                    label="WhatsApp Support Number (All website buttons route here)"
                    value={siteSettings.whatsapp}
                    onChange={(e) => updateSiteSettings({ whatsapp: e.target.value })}
                    placeholder="e.g. 01700000000 or +8801700000000"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#B8B8C0] mt-1.5 px-1 flex-wrap gap-1">
                    <span>
                      লাইভ গন্তব্য: <span className="text-emerald-400 font-mono font-medium">wa.me/{getWhatsAppNumber(siteSettings)}</span>
                    </span>
                    <a
                      href={createWhatsAppUrl(siteSettings, 'হ্যালো RedLink, এটি অ্যাডমিন প্যানেল থেকে টেস্ট মেসেজ।')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink size={11} /> টেস্ট করুন
                    </a>
                  </div>
                </div>
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

      {/* ── MODAL: GENERATE CUSTOMER ID & ACCOUNT ── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="glass-card-static w-full max-w-xl p-6 sm:p-7 rounded-3xl border border-white/20 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  <Sparkles size={18} className="text-red-400" />
                  <span>Generate Customer ID & Account</span>
                </h3>
                <p className="text-xs text-[#B8B8C0] mt-0.5">
                  Create subscriber profile with instant Customer ID, Gmail authentication & login credentials
                </p>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addUser(newUserForm);
                setShowAddUserModal(false);
                const nextId = generateNewCustomerId();
                setNewUserForm({
                  id: nextId,
                  name: '',
                  nameBn: '',
                  mobile: '',
                  email: '',
                  password: '1234',
                  address: '',
                  package: 'Standard 50 Mbps',
                  speed: 50,
                  monthlyFee: 900,
                  dueAmount: 900,
                  billingDate: '05',
                  ip: `103.237.79.${Math.floor(10 + Math.random() * 240)}`
                });
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Generated Customer ID Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 to-black border border-red-500/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                    Auto-Generated Customer ID
                  </span>
                  <span className="text-lg font-black text-white font-mono tracking-widest block">
                    {newUserForm.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newId = generateNewCustomerId();
                      setNewUserForm({ ...newUserForm, id: newId });
                      toast.success(`Generated new ID: ${newId}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Generate another unique Customer ID"
                  >
                    <RefreshCw size={13} /> Re-roll ID
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Customer Full Name (English)"
                  required
                  placeholder="e.g. Mohammad Rahim"
                  value={newUserForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoEmail = newUserForm.email ? newUserForm.email : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
                    setNewUserForm({ ...newUserForm, name, email: autoEmail });
                  }}
                />
                <FormInput
                  label="Name (Bengali / বাংলা নাম)"
                  placeholder="e.g. মোহাম্মদ রহিম"
                  value={newUserForm.nameBn}
                  onChange={(e) => setNewUserForm({ ...newUserForm, nameBn: e.target.value })}
                />
              </div>

              {/* Contact & Gmail Login Creds */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <FormInput
                    label="Mobile Number"
                    required
                    placeholder="017XXXXXXXX"
                    value={newUserForm.mobile}
                    onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                  />
                </div>
                <div>
                  <FormInput
                    label="Customer Gmail (for Login)"
                    required
                    type="email"
                    placeholder="user@gmail.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <FormInput
                    label="Login Password / PIN"
                    required
                    placeholder="Default: 1234"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Package, Speed, Monthly Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[#B8B8C0] block mb-1">Assigned Package</label>
                  <select
                    value={newUserForm.package}
                    onChange={(e) => {
                      const sel = packages.find(p => p.name === e.target.value);
                      const speed = sel ? Number(sel.speed) : 50;
                      const fee = sel ? Number(sel.price) : 900;
                      setNewUserForm({
                        ...newUserForm,
                        package: e.target.value,
                        speed,
                        monthlyFee: fee,
                        dueAmount: fee
                      });
                    }}
                    className="glass-input text-xs"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.name} className="bg-[#111113]">
                        {p.name} ({p.speed}M) - ৳{p.price}
                      </option>
                    ))}
                  </select>
                </div>

                <FormInput
                  label="Monthly Fee (৳)"
                  type="number"
                  value={newUserForm.monthlyFee}
                  onChange={(e) => setNewUserForm({ ...newUserForm, monthlyFee: e.target.value, dueAmount: e.target.value })}
                />

                <FormInput
                  label="Initial Due Amount (৳)"
                  type="number"
                  value={newUserForm.dueAmount}
                  onChange={(e) => setNewUserForm({ ...newUserForm, dueAmount: e.target.value })}
                />
              </div>

              {/* Billing Date, IP, Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Billing Cycle Date (Day of Month)"
                  placeholder="e.g. 05"
                  value={newUserForm.billingDate}
                  onChange={(e) => setNewUserForm({ ...newUserForm, billingDate: e.target.value })}
                />
                <FormInput
                  label="Assigned Static IP"
                  placeholder="103.237.79.xx"
                  value={newUserForm.ip}
                  onChange={(e) => setNewUserForm({ ...newUserForm, ip: e.target.value })}
                />
              </div>

              <FormInput
                label="Installation / House Address"
                required
                placeholder="House, Road, Area, City"
                value={newUserForm.address}
                onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
              />

              {/* Live Credentials Preview Box */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs">
                <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">
                  📋 Ready-to-Use Customer Login Credentials:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[#B8B8C0]">
                  <div>Customer ID: <strong className="text-white">{newUserForm.id}</strong></div>
                  <div className="truncate">Gmail: <strong className="text-white">{newUserForm.email || 'customer@gmail.com'}</strong></div>
                  <div>Password: <strong className="text-white">{newUserForm.password || '1234'}</strong></div>
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <GlassButton
                  type="submit"
                  className="py-2.5 px-6 text-xs font-bold shadow-red-glow cursor-pointer"
                >
                  Generate Customer ID & Save
                </GlassButton>
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

      {/* ── MODAL: ADD / EDIT PACKAGE ── */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-red-400" />
                <h3 className="font-bold text-white text-base">
                  {editingPackage ? `Edit Package: ${editingPackage.name}` : 'Create New Broadband Plan'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddPackageModal(false);
                  setEditingPackage(null);
                }}
                className="text-[#B8B8C0] hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const feats = (pkgForm.features || '')
                .split(/[\n,]/)
                .map(s => s.trim())
                .filter(Boolean);
              const featsBn = (pkgForm.featuresBn || '')
                .split(/[\n,]/)
                .map(s => s.trim())
                .filter(Boolean);

              if (editingPackage) {
                updatePackage(editingPackage.id, {
                  name: pkgForm.name,
                  nameBn: pkgForm.nameBn || pkgForm.name,
                  speed: Number(pkgForm.speed),
                  price: Number(pkgForm.price),
                  originalPrice: pkgForm.originalPrice ? Number(pkgForm.originalPrice) : null,
                  popular: Boolean(pkgForm.popular),
                  features: feats.length ? feats : (editingPackage.features || []),
                  featuresBn: featsBn.length ? featsBn : (editingPackage.featuresBn || [])
                });
              } else {
                addPackage({
                  name: pkgForm.name,
                  nameBn: pkgForm.nameBn || pkgForm.name,
                  speed: Number(pkgForm.speed),
                  price: Number(pkgForm.price),
                  originalPrice: pkgForm.originalPrice ? Number(pkgForm.originalPrice) : null,
                  popular: Boolean(pkgForm.popular),
                  features: feats.length ? feats : ['Unlimited Data', 'Free Dual-band Router', '24/7 Priority Support'],
                  featuresBn: featsBn.length ? featsBn : ['আনলিমিটেড ডেটা', 'বিনামূল্যে ডুয়াল-ব্যান্ড রাউটার', '২৪/৭ সাপোর্ট']
                });
              }
              setShowAddPackageModal(false);
              setEditingPackage(null);
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Package Name (English) *"
                  required
                  placeholder="e.g. Starter / Standard"
                  value={pkgForm.name}
                  onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                />
                <FormInput
                  label="Package Name (Bangla)"
                  placeholder="e.g. স্টার্টার / স্ট্যান্ডার্ড"
                  value={pkgForm.nameBn}
                  onChange={(e) => setPkgForm({ ...pkgForm, nameBn: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  label="Speed (Mbps) *"
                  type="number"
                  required
                  value={pkgForm.speed}
                  onChange={(e) => setPkgForm({ ...pkgForm, speed: e.target.value })}
                />
                <FormInput
                  label="Monthly Price (৳) *"
                  type="number"
                  required
                  value={pkgForm.price}
                  onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                />
                <FormInput
                  label="Original Price (৳ strike)"
                  type="number"
                  placeholder="e.g. 650"
                  value={pkgForm.originalPrice}
                  onChange={(e) => setPkgForm({ ...pkgForm, originalPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-[#B8B8C0] font-medium block mb-1">
                  Features List (English - One feature per line or comma-separated)
                </label>
                <textarea
                  rows={4}
                  value={pkgForm.features}
                  onChange={(e) => setPkgForm({ ...pkgForm, features: e.target.value })}
                  placeholder="Unlimited Data&#10;BDIX / FTP Access&#10;Free Installation&#10;Dual-Band Router"
                  className="glass-input text-xs w-full font-sans"
                />
              </div>

              <div>
                <label className="text-xs text-[#B8B8C0] font-medium block mb-1">
                  Features List (Bangla - One feature per line or comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={pkgForm.featuresBn || ''}
                  onChange={(e) => setPkgForm({ ...pkgForm, featuresBn: e.target.value })}
                  placeholder="আনলিমিটেড ডেটা&#10;বিডিআইএক্স / এফটিপি এক্সেস&#10;বিনামূল্যে ইন্সটলেশন"
                  className="glass-input text-xs w-full font-sans"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/8">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={pkgForm.popular}
                  onChange={(e) => setPkgForm({ ...pkgForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="popularCheck" className="text-xs text-white cursor-pointer select-none">
                  Highlight as <strong>'Popular'</strong> badge on card
                </label>
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPackageModal(false);
                    setEditingPackage(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <GlassButton type="submit" className="py-2 px-5 text-xs font-semibold cursor-pointer">
                  {editingPackage ? 'Save Package Changes' : 'Publish Plan Live'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT POP POINT ── */}
      {showAddMapPointModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card-static w-full max-w-lg p-6 rounded-3xl border border-white/20">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-red-400" />
                <h3 className="font-bold text-white text-base">
                  {editingMapPoint ? `Edit POP Node: ${editingMapPoint.id}` : 'Add New Home Map POP Point'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddMapPointModal(false);
                  setEditingMapPoint(null);
                }}
                className="text-[#B8B8C0] hover:text-white"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingMapPoint) {
                  updateHomeMapPoint(editingMapPoint.id, mapPointForm);
                } else {
                  addHomeMapPoint(mapPointForm);
                }
                setShowAddMapPointModal(false);
                setEditingMapPoint(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="POP Name (English) *"
                  required
                  placeholder="e.g. Dhanmondi Metro Hub"
                  value={mapPointForm.name}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, name: e.target.value })}
                />
                <FormInput
                  label="POP Name (Bangla)"
                  placeholder="e.g. ধানমন্ডি মেট্রো হাব"
                  value={mapPointForm.nameBn}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, nameBn: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#B8B8C0] block mb-1">Division *</label>
                  <select
                    value={mapPointForm.division}
                    onChange={(e) => setMapPointForm({ ...mapPointForm, division: e.target.value })}
                    className="glass-input text-xs"
                  >
                    <option value="Dhaka" className="bg-[#111113]">Dhaka</option>
                    <option value="Chittagong" className="bg-[#111113]">Chittagong</option>
                    <option value="Sylhet" className="bg-[#111113]">Sylhet</option>
                    <option value="Rajshahi" className="bg-[#111113]">Rajshahi</option>
                    <option value="Khulna" className="bg-[#111113]">Khulna</option>
                    <option value="Barishal" className="bg-[#111113]">Barishal</option>
                    <option value="Rangpur" className="bg-[#111113]">Rangpur</option>
                    <option value="Mymensingh" className="bg-[#111113]">Mymensingh</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#B8B8C0] block mb-1">Status</label>
                  <select
                    value={mapPointForm.status}
                    onChange={(e) => setMapPointForm({ ...mapPointForm, status: e.target.value })}
                    className="glass-input text-xs"
                  >
                    <option value="Active" className="bg-[#111113]">Active (Operational)</option>
                    <option value="Expanding" className="bg-[#111113]">Expanding (Under Upgrade)</option>
                    <option value="Planned" className="bg-[#111113]">Planned (Coming Soon)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Latitude (e.g. 23.8103) *"
                  type="number"
                  step="0.0001"
                  required
                  value={mapPointForm.lat}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, lat: e.target.value })}
                />
                <FormInput
                  label="Longitude (e.g. 90.4125) *"
                  type="number"
                  step="0.0001"
                  required
                  value={mapPointForm.lng}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, lng: e.target.value })}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[10px] text-[#B8B8C0] block mb-1">Quick Coordinates Preset:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Dhaka', lat: 23.8103, lng: 90.4125 },
                    { label: 'Chittagong', lat: 22.3569, lng: 91.8324 },
                    { label: 'Sylhet', lat: 24.8949, lng: 91.8687 },
                    { label: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
                    { label: 'Khulna', lat: 22.8456, lng: 89.5403 },
                    { label: 'Barishal', lat: 22.7010, lng: 90.3535 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setMapPointForm(prev => ({ ...prev, lat: p.lat, lng: p.lng }))}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Bandwidth Capacity"
                  placeholder="e.g. 20G Optical / 40G Hub"
                  value={mapPointForm.capacity}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, capacity: e.target.value })}
                />
                <FormInput
                  label="Connected Subscribers"
                  placeholder="e.g. 3,500+ users"
                  value={mapPointForm.users}
                  onChange={(e) => setMapPointForm({ ...mapPointForm, users: e.target.value })}
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMapPointModal(false);
                    setEditingMapPoint(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                >
                  Cancel
                </button>
                <GlassButton type="submit" className="py-2 px-5 text-xs font-semibold">
                  {editingMapPoint ? 'Save Changes' : 'Add POP Point'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
