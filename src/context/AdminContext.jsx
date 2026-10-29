// ── Admin & Live CMS Context Store ─────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { homePackages as initialHomePackages, corporatePackages as initialCorpPackages, stats as initialStats, coverageData as initialCoverage } from '../data/constants';

const AdminContext = createContext();

// ── WhatsApp URL & Number Utilities ──────────────────────────────────────────
export function getWhatsAppNumber(siteSettings) {
  const raw = siteSettings?.whatsapp || siteSettings?.hotline || '8801700000000';
  const digits = String(raw).replace(/[^0-9]/g, '');
  if (!digits) return '8801700000000';
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('0')) return `88${digits}`;
  if (digits.length === 10 && digits.startsWith('1')) return `880${digits}`;
  return digits;
}

export function createWhatsAppUrl(siteSettings, message) {
  const num = getWhatsAppNumber(siteSettings);
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

// Initial Seed Data with full billing ledger & credentials
const INITIAL_USERS = [
  {
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
      { id: 'INV-2026-07', month: 'July 2026', monthBn: 'জুলাই ২০২৬', dueDate: '2026-07-05', amount: 900, status: 'Paid', paidDate: '2026-07-05 10:45', method: 'Card', trxId: 'CRD8812301', period: '01 Jul 2026 - 31 Jul 2026' },
      { id: 'INV-2026-06', month: 'June 2026', monthBn: 'জুন ২০২৬', dueDate: '2026-06-05', amount: 900, status: 'Paid', paidDate: '2026-06-04 11:30', method: 'bKash', trxId: 'BK7K89M432', period: '01 Jun 2026 - 30 Jun 2026' },
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
    speed: 20,
    monthlyFee: 500,
    dueAmount: 500,
    status: 'Active',
    joinDate: '2024-05-10',
    billingDate: '01',
    ip: '103.237.79.44',
    mac: 'BC:92:4B:21:77:18',
    opticalPower: '-19.1 dBm',
    invoices: [
      { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: '2026-10-01', amount: 500, status: 'Due', period: '01 Oct 2026 - 31 Oct 2026' },
      { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: '2026-09-01', amount: 500, status: 'Paid', paidDate: '2026-09-01 16:15', method: 'bKash', trxId: 'BK5P990142', period: '01 Sep 2026 - 30 Sep 2026' },
      { id: 'INV-2026-08', month: 'August 2026', monthBn: 'আগস্ট ২০২৬', dueDate: '2026-08-01', amount: 500, status: 'Paid', paidDate: '2026-08-02 12:10', method: 'Nagad', trxId: 'NG2A991011', period: '01 Aug 2026 - 31 Aug 2026' },
    ],
    upcomingBill: {
      id: 'INV-2026-11-NEXT',
      month: 'November 2026',
      monthBn: 'নভেম্বর ২০২৬',
      cycleStart: '2026-11-01',
      dueDate: '2026-11-01',
      estimatedAmount: 500,
      status: 'Upcoming Cycle',
      description: 'Monthly broadband recurring charges'
    },
    upgradeRequest: {
      targetPackage: 'Standard 50 Mbps',
      targetSpeed: 50,
      targetPrice: 900,
      requestedAt: '2026-10-26 15:10',
      status: 'Pending Approval'
    }
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
    speed: 100,
    monthlyFee: 1500,
    dueAmount: 0,
    status: 'Active',
    joinDate: '2024-01-20',
    billingDate: '10',
    ip: '103.237.79.88',
    mac: 'A0:B1:C2:D3:E4:F5',
    opticalPower: '-17.2 dBm',
    invoices: [
      { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: '2026-10-10', amount: 1500, status: 'Paid', paidDate: '2026-10-08 19:40', method: 'Nagad', trxId: 'NG4B11C908', period: '01 Oct 2026 - 31 Oct 2026' },
      { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: '2026-09-10', amount: 1500, status: 'Paid', paidDate: '2026-09-09 11:20', method: 'bKash', trxId: 'BK3M882190', period: '01 Sep 2026 - 30 Sep 2026' },
      { id: 'INV-2026-08', month: 'August 2026', monthBn: 'আগস্ট ২০২৬', dueDate: '2026-08-10', amount: 1500, status: 'Paid', paidDate: '2026-08-10 14:05', method: 'Card', trxId: 'CRD7712390', period: '01 Aug 2026 - 31 Aug 2026' },
    ],
    upcomingBill: {
      id: 'INV-2026-11-NEXT',
      month: 'November 2026',
      monthBn: 'নভেম্বর ২০২৬',
      cycleStart: '2026-11-01',
      dueDate: '2026-11-10',
      estimatedAmount: 1500,
      status: 'Upcoming Cycle',
      description: 'Monthly broadband recurring charges'
    },
    upgradeRequest: null
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
    speed: 500,
    monthlyFee: 8000,
    dueAmount: 8000,
    status: 'Suspended',
    joinDate: '2023-11-05',
    billingDate: '15',
    ip: '103.237.80.12',
    mac: 'CC:46:D6:55:01:99',
    opticalPower: '-22.4 dBm',
    invoices: [
      { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: '2026-10-15', amount: 8000, status: 'Due', period: '01 Oct 2026 - 31 Oct 2026' },
      { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: '2026-09-15', amount: 8000, status: 'Paid', paidDate: '2026-09-14 17:30', method: 'Bank Transfer', trxId: 'DBBL-99120', period: '01 Sep 2026 - 30 Sep 2026' },
    ],
    upcomingBill: {
      id: 'INV-2026-11-NEXT',
      month: 'November 2026',
      monthBn: 'নভেম্বর ২০২৬',
      cycleStart: '2026-11-01',
      dueDate: '2026-11-15',
      estimatedAmount: 8000,
      status: 'Upcoming Cycle',
      description: 'Dedicated business fiber recurring charges'
    },
    upgradeRequest: null
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
    speed: 50,
    monthlyFee: 900,
    dueAmount: 0,
    status: 'Active',
    joinDate: '2024-07-12',
    billingDate: '05',
    ip: '103.237.81.05',
    mac: 'FA:81:44:EE:32:01',
    opticalPower: '-18.1 dBm',
    invoices: [
      { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: '2026-10-05', amount: 900, status: 'Paid', paidDate: '2026-10-03 14:20', method: 'Card', trxId: 'CRD8812301', period: '01 Oct 2026 - 31 Oct 2026' },
      { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: '2026-09-05', amount: 900, status: 'Paid', paidDate: '2026-09-04 11:15', method: 'bKash', trxId: 'BK4P771200', period: '01 Sep 2026 - 30 Sep 2026' },
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
  },
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
  companyName: 'RedLink Technologies',
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

export const INITIAL_HOME_MAP_CONFIG = {
  enabled: true,
  title: 'Our Nationwide Fiber Coverage Map',
  titleBn: 'আমাদের দেশব্যাপী ফাইবার কভারেজ ম্যাপ',
  subtitle: 'High-speed gigabit optical POPs active across all major divisions and districts in Bangladesh.',
  subtitleBn: 'বাংলাদেশ জুড়ে সকল প্রধান বিভাগ ও জেলায় দ্রুতগতির গিগাবিট অপটিক্যাল হাব ও ফাইবার নেটওয়ার্ক।',
  centerLat: 23.8103,
  centerLng: 90.4125,
  zoom: 7,
  mapType: 'interactive', // 'interactive' | 'embed'
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848037380962!2d90.4132043759083!3d23.788390787919934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c79ebac40a05%3A0x835a5857e4e08f51!2sGulshan-1%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd',
  points: [
    { id: 'POP-01', name: 'Dhaka Central Core', nameBn: 'ঢাকা সেন্ট্রাল কোর', division: 'Dhaka', lat: 23.8103, lng: 90.4125, status: 'Active', capacity: '100G Ring', users: '18,500+' },
    { id: 'POP-02', name: 'Mirpur & Uttara Metro', nameBn: 'মিরপুর ও উত্তরা মেট্রো', division: 'Dhaka', lat: 23.8350, lng: 90.3700, status: 'Active', capacity: '40G Hub', users: '12,300+' },
    { id: 'POP-03', name: 'Chittagong Coastal Link', nameBn: 'চট্টগ্রাম কোস্টাল লিংক', division: 'Chittagong', lat: 22.3569, lng: 91.8324, status: 'Active', capacity: '50G Subsea', users: '9,400+' },
    { id: 'POP-04', name: 'Sylhet Metro Node', nameBn: 'সিলেট মেট্রো নোড', division: 'Sylhet', lat: 24.8949, lng: 91.8687, status: 'Active', capacity: '20G Optical', users: '4,800+' },
    { id: 'POP-05', name: 'Rajshahi Regional Point', nameBn: 'রাজশাহী রিজিওনাল হাব', division: 'Rajshahi', lat: 24.3745, lng: 88.6042, status: 'Active', capacity: '20G Optical', users: '3,900+' },
    { id: 'POP-06', name: 'Khulna Port Distribution', nameBn: 'খুলনা পোর্ট ডিস্ট্রিবিউশন', division: 'Khulna', lat: 22.8456, lng: 89.5403, status: 'Expanding', capacity: '10G Fiber', users: '2,100+' },
    { id: 'POP-07', name: 'Barishal Division Hub', nameBn: 'বরিশাল বিভাগীয় হাব', division: 'Barishal', lat: 22.7010, lng: 90.3535, status: 'Planned', capacity: '10G Fiber', users: 'Upcoming' },
  ]
};

export const DEFAULT_HERO_BANNERS = [
  {
    id: 'banner-1',
    name: 'Home Fiber: Ultra-Fast Internet',
    active: true,
    layout: 'hero', // 'hero' | 'image'
    themeGlow: 'red',
    badge: "🚀 Bangladesh's #1 Fiber ISP",
    badgeBn: "🚀 বাংলাদেশের সেরা ইন্টারনেট",
    titleLine1: "Ultra-Fast Internet.",
    titleLine1Bn: "অতি-দ্রুত ইন্টারনেট।",
    titleHighlight: "Zero Interruption.",
    titleHighlightBn: "জিরো বিঘ্ন।",
    subtitle: "Reliable fiber broadband across Bangladesh. Experience speeds up to 100 Mbps with 99.9% uptime guarantee and round-the-clock support.",
    subtitleBn: "বাংলাদেশ জুড়ে বিশ্বস্ত ফাইবার নেটওয়ার্ক। ২৪/৭ সাপোর্ট, কোনো লুকানো চার্জ নেই।",
    btnPrimaryText: "View Packages",
    btnPrimaryTextBn: "প্যাকেজ দেখুন",
    btnPrimaryLink: "/packages",
    btnSecondaryText: "Pay Bill",
    btnSecondaryTextBn: "বিল পরিশোধ",
    btnSecondaryLink: "/pay-bill",
    showSpeedTestBtn: true,
    speedTestBtnText: "Live Speed Test",
    speedTestBtnTextBn: "স্পিড টেস্ট",
    badge1Icon: "⚡",
    badge1Text: "99.9% Uptime",
    badge1TextBn: "৯৯.৯% আপটাইম",
    badge2Icon: "🛡️",
    badge2Text: "24/7 Support",
    badge2TextBn: "২৪/৭ সাপোর্ট",
    badge3Icon: "💸",
    badge3Text: "No Hidden Fees",
    badge3TextBn: "কোনো লুকানো চার্জ নেই",
    rightVisualType: 'image',
    visualSpeed: "100",
    visualUnit: "Mbps Fiber",
    visualPing: "<5ms",
    visualUptime: "99.9%",
    visualCta: "Click to Test",
    visualCtaBn: "স্পিড টেস্ট চালান",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: 'banner-2',
    name: 'Gaming & 4K Streaming Turbo',
    active: true,
    layout: 'image',
    themeGlow: 'blue',
    badge: "🎮 Ultra-Low Ping For Gamers",
    badgeBn: "🎮 গেমারদের জন্য বিশেষ আল্ট্রা-লো পিং",
    titleLine1: "Next-Gen Gaming & 4K.",
    titleLine1Bn: "নেক্সট-জেন গেমিং ও ৪কে।",
    titleHighlight: "Zero Buffer & Lag.",
    titleHighlightBn: "বাফারলেস গিগাবিট স্পিড।",
    subtitle: "Direct BDIX peering, zero jitter multiplayer routing, and seamless 4K/8K HDR streaming for your entire home.",
    subtitleBn: "সরাসরি BDIX পিয়ারিং, জিরো জিটার ও ল্যাগ-ফ্রি মাল্টিপ্লেয়ার গেমিং এবং স্মার্ট টিভিতে বাফারহীন ৪কে স্ট্রিমিং।",
    btnPrimaryText: "Explore Gaming Plans",
    btnPrimaryTextBn: "গেমিং প্যাকেজ দেখুন",
    btnPrimaryLink: "/packages",
    btnSecondaryText: "Check Coverage",
    btnSecondaryTextBn: "কভারেজ চেক করুন",
    btnSecondaryLink: "/coverage",
    showSpeedTestBtn: true,
    speedTestBtnText: "Speed Test",
    speedTestBtnTextBn: "স্পিড টেস্ট",
    badge1Icon: "⚡",
    badge1Text: "<2ms BDIX Latency",
    badge1TextBn: "<২মি.সে BDIX ল্যাটেন্সি",
    badge2Icon: "🕹️",
    badge2Text: "Dedicated Routing",
    badge2TextBn: "ডেডিকেটেড রাউটিং",
    badge3Icon: "🔥",
    badge3Text: "Free Dual-Band Router",
    badge3TextBn: "ফ্রি ডুয়াল-ব্যান্ড রাউটার",
    rightVisualType: 'image',
    visualSpeed: "200",
    visualUnit: "Mbps Turbo",
    visualPing: "<2ms",
    visualUptime: "99.99%",
    visualCta: "Test Turbo Speed",
    visualCtaBn: "টার্বো স্পিড টেস্ট",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop"
  },
  {
    id: 'banner-3',
    name: 'Corporate & SME Dedicated Fiber',
    active: true,
    layout: 'image',
    themeGlow: 'purple',
    badge: "🏢 Enterprise High Availability",
    badgeBn: "🏢 এন্টারপ্রাইজ ডেডিকেটেড ফাইবার",
    titleLine1: "Mission-Critical Business.",
    titleLine1Bn: "বিজনেস ডেডিকেটেড নেটওয়ার্ক।",
    titleHighlight: "1:1 Symmetrical Bandwidth.",
    titleHighlightBn: "১:১ সিমেট্রিক্যাল স্পিড।",
    subtitle: "Enterprise grade optical fiber with 99.99% SLA uptime, redundant gateway, static public IP, and 24/7 dedicated account manager.",
    subtitleBn: "কর্পোরেট অফিসের জন্য ৯৯.৯৯% SLA গ্যারান্টি, রিডানডেন্ট ব্যাকবোন, রিয়েল আইপি এবং সার্বক্ষণিক ডেডিকেটেড সাপোর্ট।",
    btnPrimaryText: "Business Solutions",
    btnPrimaryTextBn: "বিজনেস সমাধান",
    btnPrimaryLink: "/business",
    btnSecondaryText: "Contact Sales",
    btnSecondaryTextBn: "সেলস যোগাযোগ",
    btnSecondaryLink: "/contact",
    showSpeedTestBtn: true,
    speedTestBtnText: "Live Speed Test",
    speedTestBtnTextBn: "স্পিড টেস্ট",
    badge1Icon: "🏢",
    badge1Text: "99.99% SLA Uptime",
    badge1TextBn: "৯৯.৯৯% SLA আপটাইম",
    badge2Icon: "🌐",
    badge2Text: "Real Static IP Included",
    badge2TextBn: "রিয়েল আইপি অন্তর্ভুক্ত",
    badge3Icon: "🛡️",
    badge3Text: "Dedicated Account Mgr",
    badge3TextBn: "ডেডিকেটেড একাউন্ট ম্যানেজার",
    rightVisualType: 'image',
    visualSpeed: "500",
    visualUnit: "Mbps Corporate",
    visualPing: "<1ms",
    visualUptime: "99.999%",
    visualCta: "Test Corporate Speed",
    visualCtaBn: "কর্পোরেট স্পিড টেস্ট",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
  }
];

export const INITIAL_HERO_CONFIG = {
  version: 4,
  autoScroll: true,
  autoScrollInterval: 4, // in seconds!
  pauseOnHover: false,
  transitionEffect: 'slide', // 'slide' | 'fade'
  showArrows: true,
  showDots: true,
  banners: DEFAULT_HERO_BANNERS,
  ...DEFAULT_HERO_BANNERS[0]
};

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
    if (!saved) return INITIAL_USERS;
    try {
      const parsed = JSON.parse(saved);
      // Migrate and enrich existing records
      return parsed.map((u) => {
        const speed = Number(u.speed) || (u.package?.includes('100') ? 100 : u.package?.includes('20') ? 20 : 50);
        const fee = Number(u.monthlyFee) || (speed >= 100 ? 1500 : speed <= 20 ? 500 : 900);
        const due = u.dueAmount !== undefined ? Number(u.dueAmount) : 0;
        return {
          password: u.password || '1234',
          email: u.email || `${u.name?.toLowerCase().replace(/\s+/g, '') || 'user'}@gmail.com`,
          monthlyFee: fee,
          billingDate: u.billingDate || '05',
          ip: u.ip || `103.237.79.${Math.floor(10 + Math.random() * 200)}`,
          mac: u.mac || 'E4:8D:8C:44:91:02',
          opticalPower: u.opticalPower || '-18.4 dBm',
          invoices: (Array.isArray(u.invoices) && u.invoices.length > 0) ? u.invoices : [
            { id: 'INV-2026-10', month: 'October 2026', monthBn: 'অক্টোবর ২০২৬', dueDate: `2026-10-${u.billingDate || '05'}`, amount: due > 0 ? due : fee, status: due > 0 ? 'Due' : 'Paid', paidDate: due > 0 ? null : '2026-10-04 14:20', method: due > 0 ? null : 'bKash', trxId: due > 0 ? null : 'BK9X77A102', period: '01 Oct 2026 - 31 Oct 2026' },
            { id: 'INV-2026-09', month: 'September 2026', monthBn: 'সেপ্টেম্বর ২০২৬', dueDate: `2026-09-${u.billingDate || '05'}`, amount: fee, status: 'Paid', paidDate: '2026-09-04 14:20', method: 'bKash', trxId: 'BK9X77A102', period: '01 Sep 2026 - 30 Sep 2026' },
            { id: 'INV-2026-08', month: 'August 2026', monthBn: 'আগস্ট ২০২৬', dueDate: `2026-08-${u.billingDate || '05'}`, amount: fee, status: 'Paid', paidDate: '2026-08-03 18:11', method: 'Nagad', trxId: 'NG4B11C908', period: '01 Aug 2026 - 31 Aug 2026' },
          ],
          upcomingBill: u.upcomingBill || {
            id: 'INV-2026-11-NEXT',
            month: 'November 2026',
            monthBn: 'নভেম্বর ২০২৬',
            cycleStart: '2026-11-01',
            dueDate: `2026-11-${u.billingDate || '05'}`,
            estimatedAmount: fee,
            status: 'Upcoming Cycle',
            description: 'Monthly broadband recurring charges'
          },
          upgradeRequest: u.upgradeRequest || null,
          ...u,
        };
      });
    } catch {
      return INITIAL_USERS;
    }
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

  const [homeMapConfig, setHomeMapConfig] = useState(() => {
    const saved = localStorage.getItem('redlink_admin_home_map');
    return saved ? JSON.parse(saved) : INITIAL_HOME_MAP_CONFIG;
  });

  const [heroConfig, setHeroConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('redlink_admin_hero_config');
      if (!saved) return { ...INITIAL_HERO_CONFIG, version: 4 };
      const parsed = JSON.parse(saved);

      // Detect old or stale banners where all items are identical or version < 4
      const isStale = !parsed.version || parsed.version < 4 ||
        (Array.isArray(parsed.banners) && parsed.banners.length >= 2 &&
         parsed.banners.every((b) => b.titleLine1 === parsed.banners[0].titleLine1 && b.visualSpeed === parsed.banners[0].visualSpeed));

      let banners = (!isStale && Array.isArray(parsed.banners) && parsed.banners.length >= 2)
        ? parsed.banners
        : DEFAULT_HERO_BANNERS;

      // Ensure no banner retains speedometer visual
      banners = banners.map((b) => ({
        ...b,
        layout: b.layout === 'hero' && b.rightVisualType === 'speedometer' ? 'image' : b.layout,
        rightVisualType: 'image'
      }));

      return {
        ...INITIAL_HERO_CONFIG,
        ...parsed,
        version: 4,
        banners,
        autoScroll: parsed.autoScroll !== undefined ? parsed.autoScroll : true,
        autoScrollInterval: Number(parsed.autoScrollInterval) > 0 ? Number(parsed.autoScrollInterval) : 4,
        pauseOnHover: false,
        showArrows: true,
        showDots: true,
        transitionEffect: parsed.transitionEffect || 'slide'
      };
    } catch {
      return { ...INITIAL_HERO_CONFIG, version: 4 };
    }
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
    localStorage.setItem('redlink_admin_home_map', JSON.stringify(homeMapConfig));
  }, [homeMapConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('redlink_admin_hero_config', JSON.stringify(heroConfig));
    } catch (err) {
      console.warn('Failed to save redlink_admin_hero_config to localStorage:', err);
      toast.error('Browser storage quota reached! Images are kept in memory. Please use compressed images or URL links.', { id: 'storage-full' });
    }
  }, [heroConfig]);

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
    const custId = userData.id && userData.id.trim()
      ? userData.id.trim().toUpperCase()
      : `RL-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = Number(userData.monthlyFee) || (userData.package?.includes('100') ? 1500 : userData.package?.includes('20') ? 500 : 900);
    const speed = Number(userData.speed) || (userData.package?.includes('100') ? 100 : userData.package?.includes('20') ? 20 : 50);
    const due = userData.dueAmount !== undefined && userData.dueAmount !== '' ? Number(userData.dueAmount) : fee;
    const bDate = userData.billingDate || '05';

    const newUser = {
      id: custId,
      name: userData.name || 'New Customer',
      nameBn: userData.nameBn || userData.name || 'নতুন গ্রাহক',
      mobile: userData.mobile || '',
      email: userData.email || `${userData.name?.toLowerCase().replace(/\s+/g, '') || 'user'}@gmail.com`,
      password: userData.password || '1234',
      address: userData.address || '',
      package: userData.package || 'Standard 50 Mbps',
      speed: speed,
      monthlyFee: fee,
      dueAmount: due,
      billingDate: bDate,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      ip: userData.ip || `103.237.79.${Math.floor(10 + Math.random() * 240)}`,
      mac: userData.mac || `E4:8D:8C:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      opticalPower: '-18.4 dBm',
      invoices: [
        {
          id: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
          month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          monthBn: `${new Date().getFullYear()} চলতি মাস`,
          dueDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${bDate}`,
          amount: due,
          status: due > 0 ? 'Due' : 'Paid',
          paidDate: due > 0 ? null : new Date().toLocaleString(),
          method: due > 0 ? null : 'bKash',
          trxId: due > 0 ? null : `BK${Date.now().toString().slice(-8)}`,
          period: `01 ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()} - 30 ${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`
        },
        {
          id: `INV-${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}`,
          month: 'Previous Month',
          monthBn: 'পূর্ববর্তী মাস',
          dueDate: `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}-${bDate}`,
          amount: fee,
          status: 'Paid',
          paidDate: `${new Date().getFullYear()}-${String(new Date().getMonth()).padStart(2, '0')}-04 12:30`,
          method: 'bKash',
          trxId: `BK${(Date.now() - 2500000000).toString().slice(-8)}`,
          period: `Last Month Cycle`
        }
      ],
      upcomingBill: {
        id: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 2).padStart(2, '0')}-NEXT`,
        month: 'Next Billing Cycle',
        monthBn: 'পরবর্তী মাসের বিল',
        cycleStart: `${new Date().getFullYear()}-${String(new Date().getMonth() + 2).padStart(2, '0')}-01`,
        dueDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 2).padStart(2, '0')}-${bDate}`,
        estimatedAmount: fee,
        status: 'Upcoming Cycle',
        description: 'Monthly broadband recurring charges'
      },
      upgradeRequest: null,
      ...userData,
    };

    setUsers((prev) => [newUser, ...prev]);
    logAction(`Created customer account for ${newUser.name} (${newUser.id}) [Login: ${newUser.email} / Pass: ${newUser.password}]`);
    toast.success(`Customer ID ${newUser.id} generated successfully!`);
    return newUser;
  };

  const approveUpgrade = (userId) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id === userId && u.upgradeRequest) {
        const req = u.upgradeRequest;
        const newPkg = req.targetPackage || u.package;
        const newSpeed = Number(req.targetSpeed) || u.speed;
        const newFee = Number(req.targetPrice) || u.monthlyFee;
        logAction(`Approved package upgrade for ${u.id} (${u.name}) to ${newPkg} (${newSpeed} Mbps)`);
        toast.success(`Package upgrade approved for ${u.name}! Upgraded to ${newPkg}`);
        return {
          ...u,
          package: newPkg,
          speed: newSpeed,
          monthlyFee: newFee,
          upgradeRequest: null,
          upcomingBill: {
            ...u.upcomingBill,
            estimatedAmount: newFee,
            description: `Upgraded to ${newPkg} (${newSpeed} Mbps)`
          }
        };
      }
      return u;
    }));
  };

  const recordCustomerBillPayment = (customerId, amount, method = 'bKash', trxId = '') => {
    const payTrx = trxId || `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const payDate = new Date().toLocaleString();

    setUsers((prev) => prev.map((u) => {
      if (u.id === customerId) {
        const newDue = Math.max(0, (u.dueAmount || 0) - Number(amount));
        const updatedInvoices = (u.invoices || []).map((inv, idx) => {
          if (idx === 0 || inv.status === 'Due') {
            return {
              ...inv,
              status: 'Paid',
              paidDate: payDate,
              method: method,
              trxId: payTrx
            };
          }
          return inv;
        });

        return {
          ...u,
          dueAmount: newDue,
          invoices: updatedInvoices
        };
      }
      return u;
    }));

    // Record in global payments ledger
    const foundUser = users.find(u => u.id === customerId);
    const newPayment = {
      id: payTrx,
      customerId,
      name: foundUser?.name || 'Subscriber',
      amount: Number(amount),
      method,
      date: payDate,
      status: 'Paid',
      trxId: payTrx
    };
    setPayments((prev) => [newPayment, ...prev]);
    logAction(`Customer ${customerId} paid ৳${amount} via ${method} (${payTrx})`);
    return newPayment;
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

  // ── Home Map Setup CMS ──
  const updateHomeMapConfig = (fields) => {
    setHomeMapConfig((prev) => ({ ...prev, ...fields }));
    logAction('Updated Home Map Configuration');
    toast.success('Home map settings updated!');
  };

  const addHomeMapPoint = (point) => {
    const newPoint = {
      ...point,
      id: `POP-${Math.floor(10 + Math.random() * 90)}`,
      lat: Number(point.lat) || 23.8103,
      lng: Number(point.lng) || 90.4125,
      status: point.status || 'Active'
    };
    setHomeMapConfig((prev) => ({
      ...prev,
      points: [newPoint, ...prev.points]
    }));
    logAction(`Added map node ${newPoint.name} (${newPoint.id})`);
    toast.success(`Added ${newPoint.name} to Home Map!`);
  };

  const updateHomeMapPoint = (id, fields) => {
    setHomeMapConfig((prev) => ({
      ...prev,
      points: prev.points.map((p) => p.id === id ? {
        ...p,
        ...fields,
        lat: fields.lat !== undefined ? Number(fields.lat) : p.lat,
        lng: fields.lng !== undefined ? Number(fields.lng) : p.lng,
      } : p)
    }));
    logAction(`Updated map node ${id}`);
    toast.success(`Map node updated!`);
  };

  const deleteHomeMapPoint = (id) => {
    setHomeMapConfig((prev) => ({
      ...prev,
      points: prev.points.filter((p) => p.id !== id)
    }));
    logAction(`Deleted map node ${id}`);
    toast.success('Map node deleted!');
  };

  const resetHomeMapConfig = () => {
    setHomeMapConfig(INITIAL_HOME_MAP_CONFIG);
    logAction('Reset Home Map to default template');
    toast.success('Home Map reset to default template');
  };

  // ── Home Hero Setup CMS ──
  const updateHeroConfig = (fields) => {
    setHeroConfig((prev) => ({ ...prev, ...fields }));
    logAction('Updated Home Hero Banner Carousel Settings');
    toast.success('Hero settings updated live!', { id: 'hero-settings' });
  };

  const updateHeroBanner = (bannerId, bannerFields) => {
    setHeroConfig((prev) => {
      const currentBanners = prev.banners || [];
      const updatedBanners = currentBanners.map((b) =>
        b.id === bannerId ? { ...b, ...bannerFields } : b
      );
      const isFirst = updatedBanners[0]?.id === bannerId;
      return {
        ...prev,
        banners: updatedBanners,
        ...(isFirst ? bannerFields : {})
      };
    });
    logAction(`Updated Banner "${bannerId}"`);
    toast.success('Banner updated live!');
  };

  const addHeroBanner = (customFields = {}) => {
    const id = `banner-${Date.now()}`;
    const newBanner = {
      id,
      name: `Banner ${(heroConfig.banners?.length || 0) + 1}`,
      active: true,
      layout: 'hero',
      themeGlow: 'red',
      badge: "🚀 New High-Speed Plan",
      badgeBn: "🚀 নতুন হাই-স্পিড প্ল্যান",
      titleLine1: "Ultra-Fast Fiber.",
      titleLine1Bn: "অতি-দ্রুত ফাইবার।",
      titleHighlight: "Supercharged Speed.",
      titleHighlightBn: "সুপারচার্জড স্পিড।",
      subtitle: "Experience next-level internet connectivity across Bangladesh with 99.9% uptime guarantee.",
      subtitleBn: "৯৯.৯% আপটাইম সহ বাংলাদেশ জুড়ে আধুনিক হাই-স্পিড ফাইবার ইন্টারনেট সংযোগ উপভোগ করুন।",
      btnPrimaryText: "View Packages",
      btnPrimaryTextBn: "প্যাকেজ দেখুন",
      btnPrimaryLink: "/packages",
      btnSecondaryText: "Pay Bill",
      btnSecondaryTextBn: "বিল পরিশোধ",
      btnSecondaryLink: "/pay-bill",
      showSpeedTestBtn: true,
      speedTestBtnText: "Live Speed Test",
      speedTestBtnTextBn: "স্পিড টেস্ট",
      badge1Icon: "⚡",
      badge1Text: "99.9% Uptime",
      badge1TextBn: "৯৯.৯% আপটাইম",
      badge2Icon: "🛡️",
      badge2Text: "24/7 Support",
      badge2TextBn: "২৪/৭ সাপোর্ট",
      badge3Icon: "💸",
      badge3Text: "No Hidden Fees",
      badge3TextBn: "কোনো লুকানো চার্জ নেই",
      rightVisualType: 'image',
      visualSpeed: "150",
      visualUnit: "Mbps Fiber",
      visualPing: "<3ms",
      visualUptime: "99.9%",
      visualCta: "Click to Test",
      visualCtaBn: "স্পিড টেস্ট চালান",
      imageUrl: "",
      ...customFields
    };

    setHeroConfig((prev) => ({
      ...prev,
      banners: [...(prev.banners || []), newBanner]
    }));
    logAction('Added new Hero Banner');
    toast.success('New banner added!');
    return id;
  };

  const deleteHeroBanner = (bannerId) => {
    setHeroConfig((prev) => {
      const currentBanners = prev.banners || [];
      if (currentBanners.length <= 1) {
        toast.error('At least one banner must remain!');
        return prev;
      }
      const filtered = currentBanners.filter((b) => b.id !== bannerId);
      logAction(`Deleted Banner ${bannerId}`);
      toast.success('Banner removed!');
      return {
        ...prev,
        banners: filtered
      };
    });
  };

  const duplicateHeroBanner = (bannerId) => {
    setHeroConfig((prev) => {
      const source = (prev.banners || []).find((b) => b.id === bannerId);
      if (!source) return prev;
      const clone = {
        ...source,
        id: `banner-${Date.now()}`,
        name: `${source.name || 'Banner'} (Copy)`
      };
      logAction(`Duplicated Banner "${source.name}"`);
      toast.success('Banner duplicated!');
      return {
        ...prev,
        banners: [...prev.banners, clone]
      };
    });
  };

  const reorderHeroBanners = (fromIndex, toIndex) => {
    setHeroConfig((prev) => {
      const list = [...(prev.banners || [])];
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
        return prev;
      }
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      logAction('Reordered Hero Banners');
      return {
        ...prev,
        banners: list
      };
    });
  };

  const resetHeroConfig = () => {
    setHeroConfig(INITIAL_HERO_CONFIG);
    logAction('Reset Home Hero section to default');
    toast.success('Hero section restored to default');
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
        approveUpgrade,
        recordCustomerBillPayment,
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
        homeMapConfig,
        updateHomeMapConfig,
        addHomeMapPoint,
        updateHomeMapPoint,
        deleteHomeMapPoint,
        resetHomeMapConfig,
        heroConfig,
        updateHeroConfig,
        updateHeroBanner,
        addHeroBanner,
        deleteHeroBanner,
        duplicateHeroBanner,
        reorderHeroBanners,
        resetHeroConfig,
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
