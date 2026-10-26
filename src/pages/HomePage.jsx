// ── Home Page ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Shield, DollarSign, Clock, Star, ChevronLeft, ChevronRight,
  ArrowRight, Wifi, BarChart3, Headphones, MapPin, CreditCard, User
} from 'lucide-react';

import { GlassCard, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';
import { homePackages, stats, testimonials, whyChooseUs } from '../data/constants';
import PackageCard from '../components/PackageCard';
import SpeedTestModal from '../components/SpeedTestModal';
import OttEntertainment from '../components/OttEntertainment';

// ── Animated Speedometer Visual ────────────────────────────────────────────────
function SpeedometerVisual({ onTestSpeed, isBn }) {
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
            className="absolute w-1 h-8 bg-gradient-to-b from-red-500/60 to-transparent rounded-full"
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
        style={{ boxShadow: '0 0 40px rgba(225,29,46,0.35), 0 8px 32px rgba(225,29,46,0.20)' }}
        title="Click to run live speed test"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
        >
          <div className="text-5xl md:text-6xl font-black gradient-text font-poppins">100</div>
          <div className="text-[#B8B8C0] text-sm font-medium text-center">Mbps Fiber</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-mono">{isBn ? 'স্পিড টেস্ট চালান' : 'Click to Test'}</span>
          </div>
        </motion.div>
      </button>

      {/* Orbit dots */}
      <motion.div
        className="absolute w-64 h-64 md:w-72 md:h-72"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 shadow-red-glow" />
        <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-red-400/60" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-red-600/70" />
      </motion.div>

      {/* Mini stat cards */}
      <motion.div
        className="absolute -top-6 -right-6 glass-card-static px-4 py-2 rounded-xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-xs text-[#B8B8C0]">Uptime</div>
        <div className="text-lg font-bold text-green-400">99.9%</div>
      </motion.div>
      <motion.div
        className="absolute -bottom-6 -left-6 glass-card-static px-4 py-2 rounded-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-xs text-[#B8B8C0]">Ping</div>
        <div className="text-lg font-bold text-red-400">&lt;5ms</div>
      </motion.div>
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
  const { packages: livePackages } = useAdmin();
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const displayPackages = livePackages && livePackages.length > 0 ? livePackages.slice(0, 3) : homePackages;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="min-h-[75vh] md:min-h-[82vh] flex items-center py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="section-tag mb-6 inline-block">
                🚀 {isBn ? 'বাংলাদেশের সেরা ইন্টারনেট' : "Bangladesh's #1 Fiber ISP"}
              </span>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-poppins leading-tight text-white mb-6 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? (
                  <>অতি-দ্রুত ইন্টারনেট।<br /><span className="gradient-text">জিরো বিঘ্ন।</span></>
                ) : (
                  <>Ultra-Fast Internet.<br /><span className="gradient-text">Zero Interruption.</span></>
                )}
              </h1>
              <p className={`text-[#B8B8C0] text-lg md:text-xl leading-relaxed mb-8 max-w-lg ${isBn ? 'font-bangla' : ''}`}>
                {isBn
                  ? 'বাংলাদেশ জুড়ে বিশ্বস্ত ফাইবার নেটওয়ার্ক। ২৪/৭ সাপোর্ট, কোনো লুকানো চার্জ নেই।'
                  : 'Reliable fiber broadband across Bangladesh. Experience speeds up to 100 Mbps with 99.9% uptime guarantee and round-the-clock support.'}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/packages" className="btn-primary text-base px-7 py-3.5">
                  {isBn ? 'প্যাকেজ দেখুন' : 'View Packages'} <ArrowRight size={18} />
                </Link>
                <Link to="/pay-bill" className="btn-outline text-base px-7 py-3.5">
                  {isBn ? 'বিল পরিশোধ' : 'Pay Bill'} <CreditCard size={18} />
                </Link>
                <button
                  onClick={() => setShowSpeedTest(true)}
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-red-500/30 hover:border-red-500/60 text-white font-medium text-base flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <Zap size={18} className="text-red-400 group-hover:scale-125 transition-transform" />
                  <span>{isBn ? 'স্পিড টেস্ট' : 'Live Speed Test'}</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  { icon: '⚡', text: isBn ? '৯৯.৯% আপটাইম' : '99.9% Uptime' },
                  { icon: '🛡️', text: isBn ? '২৪/৭ সাপোর্ট' : '24/7 Support' },
                  { icon: '💸', text: isBn ? 'কোনো লুকানো চার্জ নেই' : 'No Hidden Fees' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-sm text-[#B8B8C0]">
                    <span>{b.icon}</span>
                    <span className={isBn ? 'font-bangla' : ''}>{b.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Speedometer */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <div className="glass-card p-6 sm:p-10 rounded-3xl w-full max-w-sm mx-auto flex items-center justify-center">
                <SpeedometerVisual onTestSpeed={() => setShowSpeedTest(true)} isBn={isBn} />
              </div>
            </motion.div>
          </div>
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
