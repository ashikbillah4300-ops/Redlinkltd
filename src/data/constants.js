// ── RedLink Ltd — Mock Data & Constants ──────────────────────────────────────

// ── Packages ────────────────────────────────────────────────────────────────
export const homePackages = [
  {
    id: 'h1',
    name: 'Starter',
    nameBn: 'স্টার্টার',
    speed: 20,
    price: 500,
    originalPrice: 650,
    features: [
      'Unlimited Data',
      'BDIX / FTP Access',
      'Free Installation',
      'Basic Router',
      'Email Support',
    ],
    featuresBn: [
      'আনলিমিটেড ডেটা',
      'BDIX / FTP সুবিধা',
      'বিনামূল্যে ইন্সটলেশন',
      'বেসিক রাউটার',
      'ইমেইল সাপোর্ট',
    ],
    popular: false,
    color: '#6B7280',
  },
  {
    id: 'h2',
    name: 'Standard',
    nameBn: 'স্ট্যান্ডার্ড',
    speed: 50,
    price: 900,
    originalPrice: 1200,
    features: [
      'Unlimited Data',
      'BDIX / FTP Access',
      'Free Installation',
      'Dual-Band Router',
      '24/7 Phone Support',
      'Priority Network',
    ],
    featuresBn: [
      'আনলিমিটেড ডেটা',
      'BDIX / FTP সুবিধা',
      'বিনামূল্যে ইন্সটলেশন',
      'ডুয়াল-ব্যান্ড রাউটার',
      '২৪/৭ ফোন সাপোর্ট',
      'প্রায়রিটি নেটওয়ার্ক',
    ],
    popular: true,
    color: '#E11D2E',
  },
  {
    id: 'h3',
    name: 'Ultra',
    nameBn: 'আল্ট্রা',
    speed: 100,
    price: 1500,
    originalPrice: 2000,
    features: [
      'Unlimited Data',
      'BDIX / FTP Access',
      'Free Installation',
      'Wi-Fi 6 Router',
      'Dedicated Account Manager',
      'Static IP Option',
      'SLA 99.9% Uptime',
    ],
    featuresBn: [
      'আনলিমিটেড ডেটা',
      'BDIX / FTP সুবিধা',
      'বিনামূল্যে ইন্সটলেশন',
      'Wi-Fi 6 রাউটার',
      'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার',
      'স্ট্যাটিক আইপি অপশন',
      'SLA ৯৯.৯% আপটাইম',
    ],
    popular: false,
    color: '#F59E0B',
  },
];

export const corporatePackages = [
  {
    id: 'c1',
    name: 'Business Basic',
    nameBn: 'বিজনেস বেসিক',
    speed: 100,
    price: 3500,
    originalPrice: 4500,
    features: ['Dedicated Line', 'Unlimited Data', 'Static IP Included', 'SLA 99.5%', '24/7 Support', 'Free Installation'],
    featuresBn: ['ডেডিকেটেড লাইন', 'আনলিমিটেড ডেটা', 'স্ট্যাটিক আইপি', 'SLA ৯৯.৫%', '২৪/৭ সাপোর্ট', 'বিনামূল্যে ইন্সটলেশন'],
    popular: false,
    color: '#6B7280',
  },
  {
    id: 'c2',
    name: 'Business Pro',
    nameBn: 'বিজনেস প্রো',
    speed: 500,
    price: 8000,
    originalPrice: 11000,
    features: ['Dedicated Fiber', 'Unlimited Data', 'Multiple Static IPs', 'SLA 99.9%', 'Account Manager', '24/7 Priority Support', 'Failover Redundancy'],
    featuresBn: ['ডেডিকেটেড ফাইবার', 'আনলিমিটেড ডেটা', 'মাল্টিপল স্ট্যাটিক আইপি', 'SLA ৯৯.৯%', 'অ্যাকাউন্ট ম্যানেজার', '২৪/৭ প্রায়রিটি সাপোর্ট', 'ফেইলওভার রিডান্ডেন্সি'],
    popular: true,
    color: '#E11D2E',
  },
  {
    id: 'c3',
    name: 'Enterprise',
    nameBn: 'এন্টারপ্রাইজ',
    speed: 1000,
    price: 15000,
    originalPrice: null,
    features: ['IIG Direct Connection', 'Unlimited Bandwidth', 'BGP Routing', 'SLA 99.99%', 'Dedicated NOC', '24/7/365 Support', 'Custom Solutions', 'MPLS / VPN'],
    featuresBn: ['IIG সরাসরি সংযোগ', 'আনলিমিটেড ব্যান্ডউইথ', 'BGP রাউটিং', 'SLA ৯৯.৯৯%', 'ডেডিকেটেড NOC', '২৪/৭/৩৬৫ সাপোর্ট', 'কাস্টম সমাধান', 'MPLS / VPN'],
    popular: false,
    color: '#8B5CF6',
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
export const stats = [
  { label: 'Happy Customers', labelBn: 'সুখী গ্রাহক', value: 15000, suffix: '+', icon: '👥' },
  { label: 'Uptime', labelBn: 'আপটাইম', value: 99.9, suffix: '%', icon: '⚡', decimals: 1 },
  { label: 'Coverage Areas', labelBn: 'কভারেজ এলাকা', value: 120, suffix: '+', icon: '📍' },
  { label: 'Support', labelBn: 'সাপোর্ট', value: 24, suffix: '/7', icon: '🛟' },
];

// ── Coverage Data ──────────────────────────────────────────────────────────────
export const coverageData = {
  Dhaka: {
    Dhaka: ['Mirpur', 'Uttara', 'Gulshan', 'Banani', 'Mohammadpur', 'Dhanmondi', 'Motijheel', 'Rampura', 'Badda', 'Khilgaon'],
    Gazipur: ['Tongi', 'Gazipur Sadar', 'Kaliakair'],
    Narayanganj: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj'],
  },
  Chittagong: {
    Chittagong: ['Agrabad', 'GEC Circle', 'Nasirabad', 'Bayezid', 'Halishahar', 'Double Mooring', 'Pahartali'],
    Cox_Bazar: ['Cox\'s Bazar Sadar', 'Teknaf'],
  },
  Sylhet: {
    Sylhet: ['Sylhet Sadar', 'Bianibazar', 'Osmani Nagar'],
  },
  Rajshahi: {
    Rajshahi: ['Rajshahi Sadar', 'Boalia', 'Motihar'],
  },
  Khulna: {
    Khulna: ['Khulna Sadar', 'Sonadanga', 'Khalishpur'],
  },
};

// Areas NOT covered (to trigger "Register Interest" flow)
export const uncoveredAreas = ['Barishal', 'Rangpur', 'Mymensingh'];

// ── Testimonials ───────────────────────────────────────────────────────────────
export const testimonials = [
  {
    id: 1,
    name: 'Rakib Hossain',
    nameBn: 'রাকিব হোসেন',
    location: 'Mirpur, Dhaka',
    rating: 5,
    text: 'RedLink has transformed my work-from-home experience. Blazing fast speeds and zero downtime in 8 months!',
    textBn: 'রেডলিংক আমার ওয়ার্ক-ফ্রম-হোম অভিজ্ঞতা বদলে দিয়েছে। ৮ মাসে কোনো ডাউনটাইম নেই!',
    avatar: 'RH',
  },
  {
    id: 2,
    name: 'Sumaiya Akter',
    nameBn: 'সুমাইয়া আক্তার',
    location: 'Gulshan, Dhaka',
    rating: 5,
    text: 'Customer support is incredible — they resolved my issue within 2 hours. Highly recommended for families.',
    textBn: 'কাস্টমার সাপোর্ট অবিশ্বাস্য — ২ ঘণ্টার মধ্যে আমার সমস্যা সমাধান করেছে।',
    avatar: 'SA',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    location: 'Agrabad, Chittagong',
    rating: 4,
    text: 'Great speeds for gaming and streaming. BDIX speeds are exceptional. Value for money at this price.',
    textBn: 'গেমিং ও স্ট্রিমিংয়ের জন্য দুর্দান্ত। BDIX গতি অসাধারণ। দামে সেরা।',
    avatar: 'TA',
  },
  {
    id: 4,
    name: 'Nadia Islam',
    nameBn: 'নাদিয়া ইসলাম',
    location: 'Dhanmondi, Dhaka',
    rating: 5,
    text: 'Installation was done within 24 hours of applying. The technicians were professional and friendly.',
    textBn: 'আবেদনের ২৪ ঘণ্টার মধ্যে ইন্সটলেশন হয়েছে। টেকনিশিয়ানরা পেশাদার ছিলেন।',
    avatar: 'NI',
  },
];

// ── FAQ Data ────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: 'How long does installation take?',
    qBn: 'ইন্সটলেশন কতটুকু সময় নেয়?',
    a: 'Standard installation is completed within 24-48 hours of your application approval. Our technicians will call you to schedule a convenient time.',
    aBn: 'আবেদন অনুমোদনের ২৪-৪৮ ঘণ্টার মধ্যে ইন্সটলেশন সম্পন্ন হয়।',
  },
  {
    q: 'Is there a contract period?',
    qBn: 'কোনো চুক্তির মেয়াদ আছে?',
    a: 'Our home packages are month-to-month with no long-term contract required. Corporate packages may have 1-year agreements for better pricing.',
    aBn: 'আমাদের হোম প্যাকেজগুলো মাসে মাসে — কোনো দীর্ঘমেয়াদী চুক্তি নেই।',
  },
  {
    q: 'What payment methods are accepted?',
    qBn: 'কোন পেমেন্ট পদ্ধতি গ্রহণযোগ্য?',
    a: 'We accept bKash, Nagad, Rocket, credit/debit cards, and bank transfers. You can pay online through our portal or via our payment app.',
    aBn: 'আমরা bKash, Nagad, Rocket, ক্রেডিট/ডেবিট কার্ড এবং ব্যাংক ট্রান্সফার গ্রহণ করি।',
  },
  {
    q: 'Do you offer a free router?',
    qBn: 'কি বিনামূল্যে রাউটার দেওয়া হয়?',
    a: 'Yes! All packages include a free router on a rental basis. Higher-tier packages include premium Wi-Fi 6 routers.',
    aBn: 'হ্যাঁ! সমস্ত প্যাকেজে ভাড়ার ভিত্তিতে বিনামূল্যে রাউটার দেওয়া হয়।',
  },
  {
    q: 'What is BDIX/FTP access?',
    qBn: 'BDIX/FTP কী?',
    a: 'BDIX (Bangladesh Internet Exchange) provides ultra-fast local content — including local streaming, gaming servers, and FTP content at speeds up to 10x your package speed.',
    aBn: 'BDIX স্থানীয় কন্টেন্ট দ্রুতগতিতে অ্যাক্সেস করতে দেয় — স্ট্রিমিং, গেমিং সার্ভার সহ।',
  },
  {
    q: 'How do I report a technical issue?',
    qBn: 'টেকনিক্যাল সমস্যা কীভাবে রিপোর্ট করবো?',
    a: 'Call our 24/7 hotline at 16500, WhatsApp us, or raise a support ticket via the Customer Portal. Average resolution time is under 4 hours.',
    aBn: '১৬৫০০ নম্বরে ফোন করুন, WhatsApp করুন, বা কাস্টমার পোর্টালে টিকেট তৈরি করুন।',
  },
];

// ── Business Services ──────────────────────────────────────────────────────────
export const businessServices = [
  {
    id: 'bs1',
    title: 'Home Broadband',
    titleBn: 'হোম ব্রডব্যান্ড',
    icon: '🏠',
    description: 'High-speed fiber broadband for residential customers. Unlimited data with BDIX access.',
    descriptionBn: 'আবাসিক গ্রাহকদের জন্য উচ্চগতির ফাইবার ব্রডব্যান্ড।',
    features: ['Up to 100 Mbps', 'BDIX / FTP', 'Free Router', '24/7 Support'],
  },
  {
    id: 'bs2',
    title: 'Network Solutions',
    titleBn: 'নেটওয়ার্ক সমাধান',
    icon: '🌐',
    description: 'End-to-end network design, deployment, and management for businesses of all sizes.',
    descriptionBn: 'ব্যবসার জন্য সম্পূর্ণ নেটওয়ার্ক ডিজাইন ও ব্যবস্থাপনা।',
    features: ['Network Design', 'VLAN / VPN', 'Firewall Setup', 'Remote Monitoring'],
  },
  {
    id: 'bs3',
    title: 'CCTV Installation',
    titleBn: 'সিসিটিভি ইন্সটলেশন',
    icon: '📷',
    description: 'IP-based HD CCTV systems with remote viewing, motion detection, and cloud storage.',
    descriptionBn: 'IP-ভিত্তিক HD CCTV সিস্টেম রিমোট ভিউয়িং সহ।',
    features: ['HD Cameras', 'Remote Access', 'Motion Detection', 'Cloud Storage'],
  },
  {
    id: 'bs4',
    title: 'Data Connectivity',
    titleBn: 'ডেটা কানেক্টিভিটি',
    icon: '🔗',
    description: 'Leased line and point-to-point connectivity for multi-branch businesses.',
    descriptionBn: 'মাল্টি-ব্রাঞ্চ ব্যবসার জন্য লিজড লাইন কানেক্টিভিটি।',
    features: ['Leased Lines', 'P2P Links', 'MPLS Network', 'QoS Guarantee'],
  },
  {
    id: 'bs5',
    title: 'Dedicated Internet (IIG)',
    titleBn: 'ডেডিকেটেড ইন্টারনেট',
    icon: '⚡',
    description: 'Direct IIG connection for ISPs and large enterprises requiring guaranteed bandwidth.',
    descriptionBn: 'ISP ও বড় প্রতিষ্ঠানের জন্য সরাসরি IIG সংযোগ।',
    features: ['IIG Direct', 'Guaranteed BW', 'BGP / AS Number', 'SLA 99.99%'],
  },
  {
    id: 'bs6',
    title: 'Cloud & Hosting',
    titleBn: 'ক্লাউড ও হোস্টিং',
    icon: '☁️',
    description: 'Local data center hosting, VPS, and cloud storage solutions for businesses.',
    descriptionBn: 'স্থানীয় ডেটা সেন্টার হোস্টিং, VPS এবং ক্লাউড স্টোরেজ।',
    features: ['VPS / Dedicated', 'Domain & Hosting', 'SSL Certificates', '99.9% Uptime'],
  },
];

// ── Mock Customer ──────────────────────────────────────────────────────────────
export const mockCustomer = {
  id: 'RL-001234',
  name: 'Mohammad Karim',
  nameBn: 'মোহাম্মদ করিম',
  mobile: '01712345678',
  email: 'karim@example.com',
  address: 'House 12, Road 5, Mirpur-1, Dhaka',
  package: 'Standard 50 Mbps',
  packageId: 'h2',
  status: 'Active',
  statusBn: 'সক্রিয়',
  joinDate: '2024-03-15',
  dueAmount: 900,
  dueDate: '2025-11-05',
};

// ── Mock Payment History ────────────────────────────────────────────────────────
export const mockPaymentHistory = [
  { id: 'TXN-8821', date: '2025-10-01', amount: 900, method: 'bKash', status: 'Success' },
  { id: 'TXN-8720', date: '2025-09-01', amount: 900, method: 'bKash', status: 'Success' },
  { id: 'TXN-8610', date: '2025-08-01', amount: 900, method: 'Nagad', status: 'Success' },
  { id: 'TXN-8505', date: '2025-07-01', amount: 900, method: 'Card', status: 'Success' },
  { id: 'TXN-8401', date: '2025-06-01', amount: 900, method: 'bKash', status: 'Failed' },
];

// ── Mock Usage Data ─────────────────────────────────────────────────────────────
export const mockUsageData = [
  { day: 'Mon', download: 4.2, upload: 1.1 },
  { day: 'Tue', download: 6.8, upload: 1.8 },
  { day: 'Wed', download: 3.5, upload: 0.9 },
  { day: 'Thu', download: 8.1, upload: 2.3 },
  { day: 'Fri', download: 11.4, upload: 3.1 },
  { day: 'Sat', download: 15.2, upload: 4.5 },
  { day: 'Sun', download: 12.7, upload: 3.8 },
];

// ── Mock Tickets ────────────────────────────────────────────────────────────────
export const mockTickets = [
  { id: 'TKT-441', subject: 'Slow speed during evenings', status: 'Resolved', created: '2025-10-10', category: 'Technical' },
  { id: 'TKT-389', subject: 'Router replacement request', status: 'In Progress', created: '2025-10-20', category: 'Hardware' },
  { id: 'TKT-312', subject: 'Billing clarification', status: 'Resolved', created: '2025-09-15', category: 'Billing' },
];

// ── Why Choose Us ───────────────────────────────────────────────────────────────
export const whyChooseUs = [
  {
    icon: '🔥',
    title: 'True Fiber Network',
    titleBn: 'সত্যিকারের ফাইবার নেটওয়ার্ক',
    desc: 'End-to-end optical fiber to your home. No copper, no throttling — pure speed.',
    descBn: 'আপনার বাড়ি পর্যন্ত সম্পূর্ণ অপটিক্যাল ফাইবার।',
  },
  {
    icon: '🛡️',
    title: '24/7 Support',
    titleBn: '২৪/৭ সাপোর্ট',
    desc: 'Round-the-clock technical support via call, WhatsApp, or our portal.',
    descBn: 'কল, WhatsApp বা পোর্টালের মাধ্যমে সার্বক্ষণিক সাপোর্ট।',
  },
  {
    icon: '💎',
    title: 'No Hidden Charges',
    titleBn: 'কোনো লুকানো চার্জ নেই',
    desc: 'Transparent pricing. What you see is what you pay — always.',
    descBn: 'স্বচ্ছ মূল্য নির্ধারণ। যা দেখবেন তাই দিতে হবে।',
  },
  {
    icon: '⚡',
    title: 'Fast Installation',
    titleBn: 'দ্রুত ইন্সটলেশন',
    desc: 'Get connected in 24-48 hours. Our expert team handles everything.',
    descBn: '২৪-৪৮ ঘণ্টার মধ্যে সংযোগ। আমাদের দল সব সামলায়।',
  },
];
