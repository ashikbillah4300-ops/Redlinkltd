// ── GlassCard ─────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion';

/**
 * GlassCard — reusable glass morphism card
 * @param {boolean} hover — enable lift-on-hover (default true)
 * @param {boolean} static_ — disable all hover effects
 */
export const GlassCard = ({ children, className = '', hover = true, onClick, ...props }) => {
  if (!hover) {
    return (
      <div className={`glass-card-static ${className}`} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={`glass-card ${className}`}
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(225,29,46,0.30)' }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ── GlassButton ───────────────────────────────────────────────────────────────
export const GlassButton = ({
  children,
  variant = 'primary', // 'primary' | 'outline'
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const cls = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  return (
    <motion.button
      className={`${cls} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      style={{ opacity: disabled || loading ? 0.65 : 1, cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Processing…
        </span>
      ) : children}
    </motion.button>
  );
};

// ── SectionHeading ────────────────────────────────────────────────────────────
export const SectionHeading = ({ tag, tagBn, title, titleBn, subtitle, subtitleBn, isBn, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {(tag || tagBn) && (
      <span className="section-tag mb-4 inline-block">
        {isBn && tagBn ? tagBn : tag}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins text-white leading-tight mb-4">
      {isBn && titleBn ? titleBn : title}
    </h2>
    {(subtitle || subtitleBn) && (
      <p className={`text-[#B8B8C0] text-lg max-w-2xl ${center ? 'mx-auto' : ''} leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
        {isBn && subtitleBn ? subtitleBn : subtitle}
      </p>
    )}
  </div>
);

// ── FormInput ─────────────────────────────────────────────────────────────────
export const FormInput = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-[#B8B8C0]">{label}</label>}
    <input className={`glass-input ${error ? 'border-red-500 focus:border-red-500' : ''}`} {...props} />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

export const FormTextarea = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-[#B8B8C0]">{label}</label>}
    <textarea
      className={`glass-input resize-none ${error ? 'border-red-500' : ''}`}
      rows={4}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

export const FormSelect = ({ label, error, children, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-[#B8B8C0]">{label}</label>}
    <select
      className={`glass-input appearance-none ${error ? 'border-red-500' : ''}`}
      style={{ background: 'rgba(17,17,19,0.95)' }}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <motion.div
        className="glass-card-static w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// ── Accordion ─────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ items, isBn }) => {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="glass-card-static overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className={`font-semibold text-white pr-4 ${isBn ? 'font-bangla' : ''}`}>
              {isBn && item.qBn ? item.qBn : item.q}
            </span>
            <ChevronDown
              size={18}
              className={`text-red-400 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div className={`accordion-content ${open === i ? 'open' : ''}`}>
            <p className={`px-5 pb-5 text-[#B8B8C0] leading-relaxed text-sm ${isBn ? 'font-bangla' : ''}`}>
              {isBn && item.aBn ? item.aBn : item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-2 p-1.5 glass-card-static rounded-2xl inline-flex">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
          active === tab.id ? 'tab-active' : 'tab-inactive'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// ── LoadingSkeleton ───────────────────────────────────────────────────────────
export const LoadingSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`glass-card-static p-6 space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`shimmer h-4 rounded-full ${i === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
    ))}
  </div>
);

// ── FadeUp wrapper ────────────────────────────────────────────────────────────
export const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.02 }}
    transition={{ duration: 0.35, delay: Math.min(delay, 0.2), ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);
