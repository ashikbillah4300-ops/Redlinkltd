// ── Live Notice & Announcement Banner ──────────────────────────────────────────
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LangContext';
import { useState } from 'react';

export default function LiveNoticeBanner() {
  const { notice } = useAdmin();
  const { isBn } = useLang();
  const [dismissed, setDismissed] = useState(false);

  if (!notice || !notice.enabled || dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-red-600 via-[#B30F1F] to-red-800 text-white text-xs py-2 px-3 sm:px-6 shadow-md border-b border-red-400/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white animate-pulse">
            <Zap size={12} />
          </span>
          <span className="bg-black/30 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0 border border-white/20">
            {isBn && notice.badgeBn ? notice.badgeBn : notice.badge || 'Notice'}
          </span>
          <span className={`truncate font-medium text-white/95 ${isBn ? 'font-bangla' : ''}`}>
            {isBn && notice.textBn ? notice.textBn : notice.text}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {notice.link && (
            <Link
              to={notice.link}
              className="hidden sm:inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              <span>{isBn ? 'বিস্তারিত দেখুন' : 'Explore Offer'}</span>
              <ArrowRight size={12} />
            </Link>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="w-5 h-5 rounded-md hover:bg-white/20 flex items-center justify-center transition-colors text-white/80 hover:text-white cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
