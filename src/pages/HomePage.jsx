// ── Home Page ─────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, DollarSign, Clock, Star, ChevronLeft, ChevronRight,
  ArrowRight, Wifi, BarChart3, Headphones, MapPin, CreditCard, User,
  Pause, Play, Sparkles
} from 'lucide-react';

import { GlassCard, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { useAdmin, DEFAULT_HERO_BANNERS } from '../context/AdminContext';
import { homePackages, stats, testimonials, whyChooseUs } from '../data/constants';
import PackageCard from '../components/PackageCard';
import SpeedTestModal from '../components/SpeedTestModal';
import OttEntertainment from '../components/OttEntertainment';
import HomeMapSection from '../components/HomeMapSection';

// ── Animated Speedometer Visual ────────────────────────────────────────────────
function SpeedometerVisual({ onTestSpeed, isBn, banner }) {
  const displaySpeed = banner?.visualSpeed || '100';
  const displayUnit = banner?.visualUnit || 'Mbps Fiber';
  const displayCta = isBn ? (banner?.visualCtaBn || 'স্পিড টেস্ট চালান') : (banner?.visualCta || 'Click to Test');
  const displayUptime = banner?.visualUptime || '99.9%';
  const displayPing = banner?.visualPing || '<5ms';
  const glow = banner?.themeGlow || 'red';

  const glowShadow = glow === 'blue'
    ? '0 0 45px rgba(14,165,233,0.38), 0 8px 32px rgba(14,165,233,0.22)'
    : glow === 'purple'
    ? '0 0 45px rgba(168,85,247,0.38), 0 8px 32px rgba(168,85,247,0.22)'
    : glow === 'emerald'
    ? '0 0 45px rgba(16,185,129,0.38), 0 8px 32px rgba(16,185,129,0.22)'
    : '0 0 45px rgba(225,29,46,0.38), 0 8px 32px rgba(225,29,46,0.22)';

  const tickColor = glow === 'blue'
    ? 'from-cyan-500/70'
    : glow === 'purple'
    ? 'from-purple-500/70'
    : glow === 'emerald'
    ? 'from-emerald-500/70'
    : 'from-red-500/70';

  const dotBg = glow === 'blue'
    ? 'bg-cyan-500 shadow-[0_0_14px_rgba(14,165,233,0.9)]'
    : glow === 'purple'
    ? 'bg-purple-500 shadow-[0_0_14px_rgba(168,85,247,0.9)]'
    : glow === 'emerald'
    ? 'bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)]'
    : 'bg-red-500 shadow-red-glow';

  const pingColor = glow === 'blue'
    ? 'text-cyan-400'
    : glow === 'purple'
    ? 'text-purple-400'
    : glow === 'emerald'
    ? 'text-emerald-400'
    : 'text-red-400';

  const speedTextClass = glow === 'blue'
    ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent font-poppins font-black'
    : glow === 'purple'
    ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent font-poppins font-black'
    : glow === 'emerald'
    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-poppins font-black'
    : 'gradient-text font-poppins font-black';

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="relative w-64 h-64 md:w-72 md:h-72"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute' }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-8 bg-gradient-to-b ${tickColor} to-transparent rounded-full`}
            style={{
              top: '0',
              left: '50%',
              transformOrigin: '50% 140px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </motion.div>

      <button
        onClick={onTestSpeed}
        className="glass-card-static rounded-full w-48 h-48 md:w-56 md:h-56 flex flex-col items-center justify-center relative z-10 cursor-pointer group hover:scale-105 transition-all text-center focus:outline-none"
        style={{ boxShadow: glowShadow }}
        title="Click to run live speed test"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className={`text-5xl md:text-6xl ${speedTextClass}`}>{displaySpeed}</div>
          <div className="text-[#B8B8C0] text-sm font-medium text-center">{displayUnit}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">{displayCta}</span>
          </div>
        </motion.div>
      </button>

      {/* Orbit dots */}
      <motion.div
        className="absolute w-64 h-64 md:w-72 md:h-72"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${dotBg}`} />
        <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-white/40" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-red-500/70" />
      </motion.div>

      {/* Mini stat cards */}
      <motion.div
        className="absolute -top-6 -right-6 glass-card-static px-4 py-2 rounded-xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-xs text-[#B8B8C0]">Uptime</div>
        <div className="text-lg font-bold text-green-400">{displayUptime}</div>
      </motion.div>
      <motion.div
        className="absolute -bottom-6 -left-6 glass-card-static px-4 py-2 rounded-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-xs text-[#B8B8C0]">Ping</div>
        <div className={`text-lg font-bold ${pingColor}`}>{displayPing}</div>
      </motion.div>
    </div>
  );
}

// ── Custom Image Right Visual ──────────────────────────────────────────────────
function BannerGraphicVisual({ banner, onTestSpeed }) {
  return (
    <div className="relative group cursor-pointer max-w-md w-full" onClick={onTestSpeed}>
      <div className="glass-card p-3 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        <img
          src={banner.imageUrl || '/logo.png'}
          alt={banner.name || 'Banner'}
          className="w-full h-64 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent rounded-2xl flex items-end p-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                {banner.visualUnit || 'High Speed Fiber'}
              </span>
              <p className="text-white text-xl font-black font-poppins">{banner.visualSpeed || '100'} Mbps</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5">
              <Zap size={13} /> {banner.visualCta || 'Test Speed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Counter Row ──────────────────────────────────────────────────────────
function StatCounter({ stat, isBn }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black font-poppins gradient-text">
        {stat.value.toLocaleString()}{stat.suffix}
      </div>
      <div className={`text-[#B8B8C0] mt-1 font-medium ${isBn ? 'font-bangla' : ''}`}>
        {isBn ? stat.labelBn : stat.label}
      </div>
    </div>
  );
}

// ── Testimonial Slider ─────────────────────────────────────────────────────────
function TestimonialSlider({ isBn }) {
  const [index, setIndex] = useState(0);
  const n = testimonials.length;
  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);
  const t = testimonials[index];

  return (
    <div className="relative">
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-8 max-w-2xl mx-auto"
      >
        <div className="flex gap-1 mb-4">
          {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
        </div>
        <p className={`text-white text-lg leading-relaxed mb-6 ${isBn ? 'font-bangla' : ''}`}>
          "{isBn ? t.textBn : t.text}"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center text-white font-bold text-sm">
            {t.avatar}
          </div>
          <div>
            <div className={`text-white font-semibold ${isBn ? 'font-bangla' : ''}`}>{isBn ? t.nameBn : t.name}</div>
            <div className="text-[#B8B8C0] text-sm">{t.location}</div>
          </div>
        </div>
      </motion.div>
      <div className="flex items-center justify-center gap-3 mt-6">
        <button onClick={prev} className="w-10 h-10 rounded-full glass-card-static flex items-center justify-center text-white hover:text-red-400 transition-colors" aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-red-500 w-6' : 'bg-white/30'}`} aria-label={`Go to testimonial ${i + 1}`} />
          ))}
        </div>
        <button onClick={next} className="w-10 h-10 rounded-full glass-card-static flex items-center justify-center text-white hover:text-red-400 transition-colors" aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ── Quick Actions ──────────────────────────────────────────────────────────────
const quickActions = [
  { icon: CreditCard, label: 'Pay Bill', labelBn: 'বিল পরিশোধ', to: '/pay-bill', desc: 'Quick online payment', descBn: 'দ্রুত অনলাইন পেমেন্ট' },
  { icon: MapPin, label: 'Check Coverage', labelBn: 'কভারেজ দেখুন', to: '/coverage', desc: 'Is your area covered?', descBn: 'আপনার এলাকায় সেবা আছে?' },
  { icon: User, label: 'Customer Login', labelBn: 'কাস্টমার লগইন', to: '/portal/login', desc: 'Access your portal', descBn: 'পোর্টালে প্রবেশ করুন' },
  { icon: Headphones, label: 'Get Support', labelBn: 'সাপোর্ট নিন', to: '/support', desc: '24/7 technical help', descBn: '২৪/৭ সাহায্য পান' },
];

// ── Main Export ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isBn } = useLang();
  const { packages: livePackages, heroConfig } = useAdmin();
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const displayPackages = livePackages && livePackages.length > 0 ? livePackages.slice(0, 3) : homePackages;

  // ── Multi-Banner Carousel Setup ──
  const rawBanners = Array.isArray(heroConfig?.banners) && heroConfig.banners.length > 0
    ? heroConfig.banners
    : DEFAULT_HERO_BANNERS;

  // Filter active banners
  const activeBanners = rawBanners.filter((b) => b.active !== false);
  const banners = activeBanners.length > 0 ? activeBanners : DEFAULT_HERO_BANNERS;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const autoScroll = heroConfig?.autoScroll !== false;
  const autoScrollInterval = Math.max(1, Number(heroConfig?.autoScrollInterval) || 4);
  const bannersCount = banners.length;

  // Keep slide index within range
  const safeIndex = currentSlide % bannersCount;
  const currentBanner = banners[safeIndex] || banners[0];

  // Auto-scroll Timer Effect — Guaranteed stable execution
  useEffect(() => {
    if (!autoScroll || bannersCount <= 1 || isPaused) return;

    const intervalMs = autoScrollInterval * 1000;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % bannersCount);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoScroll, bannersCount, isPaused, autoScrollInterval]);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % bannersCount);
  }, [bannersCount]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + bannersCount) % bannersCount);
  }, [bannersCount]);

  const goToSlide = (idx) => {
    setDirection(idx >= safeIndex ? 1 : -1);
    setCurrentSlide(idx);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    setTouchStartX(null);
  };

  // Banner Content Fields
  const badgeText = isBn
    ? (currentBanner?.badgeBn || currentBanner?.badge || '🚀 বাংলাদেশের সেরা ইন্টারনেট')
    : (currentBanner?.badge || "🚀 Bangladesh's #1 Fiber ISP");

  const title1 = isBn
    ? (currentBanner?.titleLine1Bn || currentBanner?.titleLine1 || 'অতি-দ্রুত ইন্টারনেট।')
    : (currentBanner?.titleLine1 || 'Ultra-Fast Internet.');

  const titleHighlight = isBn
    ? (currentBanner?.titleHighlightBn || currentBanner?.titleHighlight || 'জিরো বিঘ্ন।')
    : (currentBanner?.titleHighlight || 'Zero Interruption.');

  const subtitle = isBn
    ? (currentBanner?.subtitleBn || currentBanner?.subtitle || 'বাংলাদেশ জুড়ে বিশ্বস্ত ফাইবার নেটওয়ার্ক।')
    : (currentBanner?.subtitle || 'Reliable fiber broadband across Bangladesh.');

  const btn1Text = isBn
    ? (currentBanner?.btnPrimaryTextBn || currentBanner?.btnPrimaryText || 'প্যাকেজ দেখুন')
    : (currentBanner?.btnPrimaryText || 'View Packages');
  const btn1Link = currentBanner?.btnPrimaryLink || '/packages';

  const btn2Text = isBn
    ? (currentBanner?.btnSecondaryTextBn || currentBanner?.btnSecondaryText || 'বিল পরিশোধ')
    : (currentBanner?.btnSecondaryText || 'Pay Bill');
  const btn2Link = currentBanner?.btnSecondaryLink || '/pay-bill';

  const showSpeedBtn = currentBanner?.showSpeedTestBtn !== false;
  const speedBtnText = isBn
    ? (currentBanner?.speedTestBtnTextBn || currentBanner?.speedTestBtnText || 'স্পিড টেস্ট')
    : (currentBanner?.speedTestBtnText || 'Live Speed Test');

  const trustBadges = [
    {
      icon: currentBanner?.badge1Icon || '⚡',
      text: isBn ? (currentBanner?.badge1TextBn || currentBanner?.badge1Text || '৯৯.৯% আপটাইম') : (currentBanner?.badge1Text || '99.9% Uptime')
    },
    {
      icon: currentBanner?.badge2Icon || '🛡️',
      text: isBn ? (currentBanner?.badge2TextBn || currentBanner?.badge2Text || '২৪/৭ সাপোর্ট') : (currentBanner?.badge2Text || '24/7 Support')
    },
    {
      icon: currentBanner?.badge3Icon || '💸',
      text: isBn ? (currentBanner?.badge3TextBn || currentBanner?.badge3Text || 'কোনো লুকানো চার্জ নেই') : (currentBanner?.badge3Text || 'No Hidden Fees')
    },
  ];

  const glow = currentBanner?.themeGlow || 'red';
  const highlightGradient = glow === 'blue'
    ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent'
    : glow === 'purple'
    ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'
    : glow === 'emerald'
    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent'
    : 'gradient-text';

  const ambientGlowClass = glow === 'blue'
    ? 'from-cyan-900/15 via-blue-900/5 to-transparent'
    : glow === 'purple'
    ? 'from-purple-900/15 via-red-900/5 to-transparent'
    : glow === 'emerald'
    ? 'from-emerald-900/15 via-teal-900/5 to-transparent'
    : 'from-red-950/20 via-red-900/5 to-transparent';

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      filter: 'blur(4px)',
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div>
      {/* ── Multi-Banner Hero Carousel Section ── */}
      <section
        className="min-h-[78vh] md:min-h-[85vh] flex items-center py-10 md:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden group/hero"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Dynamic Ambient Background Glow */}
        <div className={`absolute inset-0 bg-gradient-radial ${ambientGlowClass} pointer-events-none transition-all duration-1000 -z-10`} />

        {/* Dynamic Ambient Slide Background Image Backdrop */}
        {currentBanner?.imageUrl && (
          <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden transition-opacity duration-1000">
            <img
              src={currentBanner.imageUrl}
              alt=""
              className="w-full h-full object-cover opacity-10 filter blur-[3px] scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/70 to-[#0a0a0d]" />
          </div>
        )}

        {/* Side Floating Navigation Arrows (Desktop) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600/80 border border-white/15 text-white items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 z-20 cursor-pointer"
              aria-label="Previous Banner"
              title="Previous Banner"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextSlide}
              className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600/80 border border-white/15 text-white items-center justify-center backdrop-blur-md transition-all shadow-xl hover:scale-110 z-20 cursor-pointer"
              aria-label="Next Banner"
              title="Next Banner"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div className="max-w-7xl mx-auto w-full relative">
          {/* Top Carousel Banner Switcher Tabs & Admin Setup Link */}
          {banners.length > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                {banners.map((b, idx) => {
                  const isActive = idx === safeIndex;
                  const bGlow = b.themeGlow || 'red';
                  const activeColor = bGlow === 'blue'
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                    : bGlow === 'purple'
                    ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'border-red-500 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(225,29,46,0.3)]';

                  return (
                    <button
                      key={b.id || idx}
                      onClick={() => goToSlide(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? activeColor
                          : 'border-white/10 bg-white/5 text-[#B8B8C0] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-current animate-pulse' : 'bg-white/30'}`} />
                      <span>{b.name || `Slide ${idx + 1}`}</span>
                      {isActive && autoScroll && (
                        <span className="text-[10px] font-mono opacity-80">({autoScrollInterval}s)</span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentBanner?.id ? `${currentBanner.id}-${safeIndex}` : safeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {currentBanner?.layout === 'image' && currentBanner?.imageUrl ? (
                currentBanner?.hideText ? (
                  /* Pure Full Graphic Banner Slide (Canvas/Photoshop Flyer with No Text Overlay) */
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-card min-h-[380px] sm:min-h-[460px] md:min-h-[520px] flex flex-col justify-end p-6 sm:p-8 md:p-10 shadow-2xl group">
                    <img
                      src={currentBanner.imageUrl}
                      alt={currentBanner.name || 'Banner'}
                      className="absolute inset-0 w-full h-full object-cover group-hover/hero:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4">
                      <div>
                        {badgeText && (
                          <span className="section-tag inline-block mb-1.5 text-xs">
                            {badgeText}
                          </span>
                        )}
                        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-black font-poppins drop-shadow-lg">
                          {currentBanner.name || 'Promotional Offer'}
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link to={btn1Link} className="btn-primary text-sm sm:text-base px-6 py-3 shadow-lg">
                          {btn1Text} <ArrowRight size={16} />
                        </Link>
                        {btn2Text && (
                          <Link to={btn2Link} className="btn-outline text-sm sm:text-base px-5 py-3">
                            {btn2Text} <CreditCard size={16} />
                          </Link>
                        )}
                        {showSpeedBtn && (
                          <button
                            onClick={() => setShowSpeedTest(true)}
                            className="px-5 py-3 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white font-medium text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
                          >
                            <Zap size={16} className="text-red-400" />
                            <span>{speedBtnText}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Full Promotional Graphic Banner Slide with Rich Text & CTA */
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 glass-card min-h-[440px] md:min-h-[520px] flex items-center p-6 sm:p-12 md:p-16 shadow-2xl">
                    <img
                      src={currentBanner.imageUrl}
                      alt={currentBanner.name || 'Banner'}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/hero:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35 pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl space-y-5">
                      {badgeText && (
                        <span className="section-tag inline-block">
                          {badgeText}
                        </span>
                      )}
                      <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black font-poppins text-white leading-tight drop-shadow-md ${isBn ? 'font-bangla' : ''}`}>
                        {title1}<br /><span className={highlightGradient}>{titleHighlight}</span>
                      </h1>
                      <p className={`text-[#D8D8E2] text-base md:text-xl leading-relaxed max-w-xl drop-shadow ${isBn ? 'font-bangla' : ''}`}>
                        {subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link to={btn1Link} className="btn-primary text-base px-7 py-3.5 shadow-lg shadow-red-600/30">
                          {btn1Text} <ArrowRight size={18} />
                        </Link>
                        <Link to={btn2Link} className="btn-outline text-base px-7 py-3.5 bg-black/40 backdrop-blur-sm">
                          {btn2Text} <CreditCard size={18} />
                        </Link>
                        {showSpeedBtn && (
                          <button
                            onClick={() => setShowSpeedTest(true)}
                            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-red-500/30 hover:border-red-500/60 text-white font-medium text-base flex items-center gap-2 transition-all cursor-pointer group backdrop-blur-md"
                          >
                            <Zap size={18} className="text-red-400 group-hover:scale-125 transition-transform" />
                            <span>{speedBtnText}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Rich Hero 2-Column Slide (As shown in screenshot) */
                <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
                  {/* Left Column: Headlines, Buttons, Badges */}
                  <div>
                    <span className="section-tag mb-5 md:mb-6 inline-block">
                      {badgeText}
                    </span>
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-poppins leading-tight text-white mb-5 md:mb-6 ${isBn ? 'font-bangla' : ''}`}>
                      {title1}<br /><span className={highlightGradient}>{titleHighlight}</span>
                    </h1>
                    <p className={`text-[#B8B8C0] text-lg md:text-xl leading-relaxed mb-7 md:mb-8 max-w-lg ${isBn ? 'font-bangla' : ''}`}>
                      {subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                      <Link to={btn1Link} className="btn-primary text-base px-6 sm:px-7 py-3.5">
                        {btn1Text} <ArrowRight size={18} />
                      </Link>
                      <Link to={btn2Link} className="btn-outline text-base px-6 sm:px-7 py-3.5">
                        {btn2Text} <CreditCard size={18} />
                      </Link>
                      {showSpeedBtn && (
                        <button
                          onClick={() => setShowSpeedTest(true)}
                          className="px-5 sm:px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-red-500/30 hover:border-red-500/60 text-white font-medium text-base flex items-center gap-2 transition-all cursor-pointer group"
                        >
                          <Zap size={18} className="text-red-400 group-hover:scale-125 transition-transform" />
                          <span>{speedBtnText}</span>
                        </button>
                      )}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-4 mt-7 md:mt-8">
                      {trustBadges.map((b) => (
                        <div key={b.text} className="flex items-center gap-2 text-sm text-[#B8B8C0]">
                          <span>{b.icon}</span>
                          <span className={isBn ? 'font-bangla' : ''}>{b.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Speedometer Visual or Custom Visual Card */}
                  <div className="flex justify-center lg:justify-end">
                    {currentBanner?.rightVisualType === 'image' && currentBanner?.imageUrl ? (
                      <BannerGraphicVisual banner={currentBanner} onTestSpeed={() => setShowSpeedTest(true)} />
                    ) : (
                      <div className="glass-card p-6 sm:p-10 rounded-3xl w-full max-w-sm mx-auto flex items-center justify-center relative">
                        <SpeedometerVisual onTestSpeed={() => setShowSpeedTest(true)} isBn={isBn} banner={currentBanner} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Carousel Navigation Controls ── */}
          {banners.length > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 md:mt-12 pt-6 border-t border-white/5">
              {/* Pagination Dots with Active Countdown Progress Bar */}
              <div className="flex items-center gap-2.5">
                {banners.map((b, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={b.id || idx}
                      onClick={() => goToSlide(idx)}
                      className={`relative h-2.5 rounded-full transition-all duration-300 overflow-hidden cursor-pointer ${
                        isActive ? 'w-10 sm:w-12 bg-white/20' : 'w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to banner slide ${idx + 1}`}
                      title={b.name || `Slide ${idx + 1}`}
                    >
                      {isActive && (
                        <motion.div
                          key={`progress-${safeIndex}-${isPaused}`}
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: isPaused ? '0%' : '100%' }}
                          transition={{
                            duration: autoScroll ? autoScrollInterval : 0,
                            ease: 'linear'
                          }}
                        />
                      )}
                    </button>
                  );
                })}

                <span className="text-xs text-[#B8B8C0] ml-2 font-mono">
                  {safeIndex + 1} / {banners.length}
                </span>

                {isPaused && (
                  <span className="text-[11px] text-amber-400/90 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Pause size={10} /> Paused
                  </span>
                )}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-xl glass-card-static flex items-center justify-center text-white/80 hover:text-white hover:border-red-500/50 hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="Previous Slide"
                  title="Previous Banner"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-xl glass-card-static flex items-center justify-center text-white/80 hover:text-white hover:border-red-500/50 hover:bg-white/10 transition-all cursor-pointer"
                  aria-label="Next Slide"
                  title="Next Banner"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Actions Strip ── */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <FadeUp key={action.label} delay={i * 0.1}>
                  <Link to={action.to}>
                    <GlassCard className="p-5 flex flex-col items-center text-center gap-3 cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/20 flex items-center justify-center">
                        <ActionIcon size={22} className="text-red-400" />
                      </div>
                      <div>
                        <div className={`text-white font-semibold text-sm ${isBn ? 'font-bangla' : ''}`}>{isBn ? action.labelBn : action.label}</div>
                        <div className={`text-[#B8B8C0] text-xs mt-0.5 ${isBn ? 'font-bangla' : ''}`}>{isBn ? action.descBn : action.desc}</div>
                      </div>
                    </GlassCard>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-static rounded-3xl p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <FadeUp key={stat.label} delay={i * 0.1}>
                  <StatCounter stat={stat} isBn={isBn} />
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Packages ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionHeading
              tag="Internet Packages"
              tagBn="ইন্টারনেট প্যাকেজ"
              title="Plans for Every Need"
              titleBn="প্রতিটি প্রয়োজনের জন্য পরিকল্পনা"
              subtitle="Choose from our flexible broadband packages. No contracts, no hidden fees."
              subtitleBn="আমাদের নমনীয় ব্রডব্যান্ড প্যাকেজ থেকে বেছে নিন। কোনো চুক্তি নেই, কোনো লুকানো ফি নেই।"
              isBn={isBn}
            />
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {displayPackages.map((pkg, i) => (
              <FadeUp key={pkg.id} delay={i * 0.12}>
                <PackageCard pkg={pkg} isBn={isBn} />
              </FadeUp>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/packages" className="btn-outline px-8 py-3">
              {isBn ? 'সব প্যাকেজ দেখুন' : 'View All Packages'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Entertainment, OTT & BDIX ── */}
      <OttEntertainment />

      {/* ── Why Choose Us ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionHeading
              tag="Why RedLink"
              tagBn="কেন রেডলিংক"
              title="Why Choose RedLink?"
              titleBn="কেন রেডলিংক বেছে নেবেন?"
              subtitle="We're not just another ISP. We deliver a premium network experience you can count on."
              subtitleBn="আমরা শুধু একটি ISP নই। আমরা একটি প্রিমিয়াম নেটওয়ার্ক অভিজ্ঞতা প্রদান করি।"
              isBn={isBn}
            />
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className={`text-white font-bold text-lg mb-2 ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? item.titleBn : item.title}
                  </h3>
                  <p className={`text-[#B8B8C0] text-sm leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? item.descBn : item.desc}
                  </p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Services Teaser ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-10 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center gap-8 justify-between">
            <div>
              <span className="section-tag mb-4 inline-block">🏢 {isBn ? 'বিজনেস সমাধান' : 'Business Solutions'}</span>
              <h2 className={`text-3xl md:text-4xl font-bold font-poppins text-white mb-3 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'আপনার ব্যবসার জন্য এন্টারপ্রাইজ-গ্রেড ইন্টারনেট' : 'Enterprise-Grade Internet for Your Business'}
              </h2>
              <p className={`text-[#B8B8C0] max-w-xl ${isBn ? 'font-bangla' : ''}`}>
                {isBn
                  ? 'ডেডিকেটেড ফাইবার, CCTV ইন্সটলেশন, নেটওয়ার্ক সমাধান এবং আরও অনেক কিছু।'
                  : 'Dedicated fiber, CCTV installation, network solutions, IIG connectivity and more for businesses of any size.'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/business" className="btn-primary px-8 py-3.5 text-base whitespace-nowrap">
                {isBn ? 'ব্যবসায়িক সেবা দেখুন' : 'Explore Business Services'} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Home Fiber Map Section ── */}
      <HomeMapSection />

      {/* ── Testimonials ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <SectionHeading
              tag="Testimonials"
              tagBn="গ্রাহকদের মতামত"
              title="What Our Customers Say"
              titleBn="আমাদের গ্রাহকরা কী বলেন"
              isBn={isBn}
            />
          </FadeUp>
          <TestimonialSlider isBn={isBn} />
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <div className="glass-card p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent pointer-events-none" />
              <div className="relative">
                <h2 className={`text-3xl md:text-5xl font-black font-poppins text-white mb-4 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? 'আজই সংযুক্ত হন' : 'Get Connected Today'}
                </h2>
                <p className={`text-[#B8B8C0] text-lg mb-8 max-w-xl mx-auto ${isBn ? 'font-bangla' : ''}`}>
                  {isBn
                    ? 'মাত্র ২৪ ঘণ্টার মধ্যে দ্রুত ইন্টারনেট পান। আজই আবেদন করুন।'
                    : 'Get blazing-fast internet in as little as 24 hours. Apply now and experience the RedLink difference.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/packages" className="btn-primary px-8 py-3.5 text-base">
                    {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'} <ArrowRight size={18} />
                  </Link>
                  <Link to="/support" className="btn-outline px-8 py-3.5 text-base">
                    {isBn ? 'আমাদের সাথে কথা বলুন' : 'Talk to Us'} <Headphones size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Speed Test Modal */}
      <SpeedTestModal isOpen={showSpeedTest} onClose={() => setShowSpeedTest(false)} />
    </div>
  );
}
