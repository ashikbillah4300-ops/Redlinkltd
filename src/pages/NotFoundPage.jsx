// ── 404 Not Found Page ────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useLang } from '../context/LangContext';

export default function NotFoundPage() {
  const { isBn } = useLang();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-[10rem] md:text-[14rem] font-black font-poppins leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(225,29,46,0.15) 0%, rgba(225,29,46,0.05) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-7xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                📡
              </motion.div>
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-white mb-3 ${isBn ? 'font-bangla' : ''}`}>
            {isBn ? 'পেজটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
          </h1>
          <p className={`text-[#B8B8C0] mb-8 leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
            {isBn
              ? 'আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই অথবা সরানো হয়েছে। হোমপেজে ফিরে যান।'
              : "The page you're looking for doesn't exist or has been moved. Let's get you back on track."}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-primary px-7 py-3">
              <Home size={16} /> {isBn ? 'হোমে যান' : 'Go Home'}
            </Link>
            <button onClick={() => window.history.back()} className="btn-outline px-7 py-3">
              <ArrowLeft size={16} /> {isBn ? 'পেছনে যান' : 'Go Back'}
            </button>
          </div>

          {/* Helpful links */}
          <div className="mt-10 glass-card-static rounded-2xl p-5 inline-block">
            <p className={`text-[#B8B8C0] text-sm mb-3 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'আপনার কি সাহায্য দরকার?' : 'Looking for something?'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { to: '/packages', label: 'Packages' },
                { to: '/pay-bill', label: 'Pay Bill' },
                { to: '/support', label: 'Support' },
                { to: '/coverage', label: 'Coverage' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-red-400 hover:text-red-300 text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
