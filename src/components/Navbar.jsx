// ── Navbar ─────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wifi, ChevronDown, Zap } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import SpeedTestModal from './SpeedTestModal';

const navLinks = [
  { to: '/', label: 'Home', labelBn: 'হোম' },
  { to: '/packages', label: 'Packages', labelBn: 'প্যাকেজ' },
  { to: '/pay-bill', label: 'Pay Bill', labelBn: 'বিল পরিশোধ' },
  { to: '/coverage', label: 'Coverage', labelBn: 'কভারেজ' },
  { to: '/support', label: 'Support', labelBn: 'সাপোর্ট' },
  { to: '/business', label: 'Business', labelBn: 'বিজনেস' },
  { to: '/about', label: 'About', labelBn: 'আমাদের সম্পর্কে' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedTestOpen, setSpeedTestOpen] = useState(false);
  const { lang, toggle, isBn } = useLang();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="RedLink Ltd Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF2D3F] to-[#B30F1F] flex items-center justify-center shadow-red-glow">
                <Wifi size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold font-poppins text-white">
                Red<span className="gradient-text">Link</span>
                <span className="text-xs text-[#B8B8C0] ml-1 font-normal hidden sm:inline">Ltd</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-red-400 bg-red-500/10'
                      : 'text-[#B8B8C0] hover:text-white hover:bg-white/5'
                  } ${isBn ? 'font-bangla' : ''}`}
                >
                  {isBn ? link.labelBn : link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Speed Test Quick Action */}
              <button
                onClick={() => setSpeedTestOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group"
                title="Run Live Speed Test"
              >
                <Zap size={14} className="text-red-400 group-hover:scale-125 transition-transform" />
                <span className={isBn ? 'font-bangla' : ''}>{isBn ? 'স্পিড টেস্ট' : 'Speed Test'}</span>
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggle}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 border border-white/12 text-sm font-medium text-white hover:bg-white/12 transition-all"
                aria-label="Toggle language"
              >
                🌐 {lang === 'en' ? 'বাংলা' : 'English'}
              </button>

              {/* Portal / Login */}
              <Link
                to={isLoggedIn ? '/portal' : '/portal/login'}
                className="hidden sm:flex btn-primary text-sm px-4 py-2"
              >
                {isLoggedIn ? (isBn ? 'পোর্টাল' : 'Portal') : (isBn ? 'লগইন' : 'Login')}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden w-10 h-10 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center text-white"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer lg:hidden ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF2D3F] to-[#B30F1F] flex items-center justify-center">
              <Wifi size={16} className="text-white" />
            </div>
            <span className="font-bold text-white font-poppins">RedLink Ltd</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.to
                  ? 'text-red-400 bg-red-500/15 border border-red-500/25'
                  : 'text-[#B8B8C0] hover:text-white hover:bg-white/8'
              } ${isBn ? 'font-bangla' : ''}`}
            >
              {isBn ? link.labelBn : link.label}
            </Link>
          ))}
        </nav>

        <div className="px-5 pt-2 space-y-3 border-t border-white/10 mt-4">
          <button
            onClick={() => { setSpeedTestOpen(true); setDrawerOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all"
          >
            <Zap size={16} />
            {isBn ? 'স্পিড টেস্ট চালান' : 'Run Live Speed Test'}
          </button>
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-sm font-medium text-white"
          >
            🌐 {lang === 'en' ? 'বাংলায় দেখুন' : 'View in English'}
          </button>
          <Link
            to={isLoggedIn ? '/portal' : '/portal/login'}
            className="btn-primary w-full justify-center text-sm"
          >
            {isLoggedIn ? (isBn ? 'আমার পোর্টাল' : 'My Portal') : (isBn ? 'কাস্টমার লগইন' : 'Customer Login')}
          </Link>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16 md:h-18" />

      {/* Live Speed Test Modal */}
      <SpeedTestModal isOpen={speedTestOpen} onClose={() => setSpeedTestOpen(false)} />
    </>
  );
}
