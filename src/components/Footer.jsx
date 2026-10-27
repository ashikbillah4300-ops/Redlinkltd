import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Phone, Mail, MapPin, MessageCircle, Activity } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';
import NetworkDiagnosticModal from './NetworkDiagnosticModal';

const footerLinks = {
  quick: [
    { to: '/', label: 'Home', labelBn: 'হোম' },
    { to: '/packages', label: 'Packages', labelBn: 'প্যাকেজ' },
    { to: '/pay-bill', label: 'Pay Bill', labelBn: 'বিল পরিশোধ' },
    { to: '/coverage', label: 'Coverage', labelBn: 'কভারেজ' },
    { to: '/about', label: 'About Us', labelBn: 'আমাদের সম্পর্কে' },
  ],
  services: [
    { to: '/business', label: 'Home Broadband', labelBn: 'হোম ব্রডব্যান্ড' },
    { to: '/business', label: 'Corporate Internet', labelBn: 'কর্পোরেট ইন্টারনেট' },
    { to: '/business', label: 'CCTV Installation', labelBn: 'সিসিটিভি ইন্সটলেশন' },
    { to: '/business', label: 'Network Solutions', labelBn: 'নেটওয়ার্ক সমাধান' },
    { to: '/support', label: 'Support', labelBn: 'সাপোর্ট' },
  ],
};

export default function Footer() {
  const { isBn } = useLang();
  const { siteSettings } = useAdmin();
  const [diagOpen, setDiagOpen] = useState(false);

  return (
    <footer className="relative border-t border-white/8 mt-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img 
                src="/logo.png" 
                alt="RedLink Logo" 
                className="w-12 h-12 rounded-xl object-cover border border-white/15 shadow-red-glow flex-shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-poppins text-white leading-tight">
                  Red<span className="gradient-text">Link</span> Technologies
                </span>
                <span className="text-[10px] text-[#B8B8C0] uppercase tracking-wider font-medium">
                  The service company
                </span>
              </div>
            </div>
            <p className={`text-[#B8B8C0] text-sm leading-relaxed mb-5 ${isBn ? 'font-bangla' : ''}`}>
              {isBn
                ? 'বাংলাদেশের বিশ্বস্ত ইন্টারনেট সেবা প্রদানকারী। ২০১৮ সাল থেকে আপনার সেবায়।'
                : "Bangladesh's trusted Internet Service Provider. Connecting communities since 2018 with fiber-fast reliability."}
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600/30 hover:border-blue-400/40 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-white hover:bg-red-600/30 hover:border-red-400/40 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a 
                href={`https://wa.me/${(() => {
                  const d = (siteSettings?.whatsapp || '8801700000000').replace(/[^0-9]/g, '');
                  return d.startsWith('880') ? d : d.startsWith('0') ? `88${d}` : d ? `880${d}` : '8801700000000';
                })()}?text=Hi%20RedLink%2C%20I%20need%20support`} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp" 
                className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-white hover:bg-green-600/30 hover:border-green-400/40 transition-all"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-white font-semibold mb-5 text-sm tracking-wider uppercase ${isBn ? 'font-bangla normal-case tracking-normal' : ''}`}>
              {isBn ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.quick.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className={`text-[#B8B8C0] text-sm hover:text-red-400 transition-colors ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? l.labelBn : l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-white font-semibold mb-5 text-sm tracking-wider uppercase ${isBn ? 'font-bangla normal-case tracking-normal' : ''}`}>
              {isBn ? 'সেবাসমূহ' : 'Services'}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className={`text-[#B8B8C0] text-sm hover:text-red-400 transition-colors ${isBn ? 'font-bangla' : ''}`}>
                    {isBn ? l.labelBn : l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-white font-semibold mb-5 text-sm tracking-wider uppercase ${isBn ? 'font-bangla normal-case tracking-normal' : ''}`}>
              {isBn ? 'যোগাযোগ' : 'Contact'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={`tel:${siteSettings?.hotline || '16500'}`} className="text-[#B8B8C0] text-sm hover:text-white block font-semibold">{siteSettings?.hotline || '16500'}</a>
                  <a href={`tel:${siteSettings?.whatsapp || '+8801700000000'}`} className="text-[#B8B8C0] text-xs hover:text-white block">{siteSettings?.whatsapp || '+880 1700-000000'}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${siteSettings?.supportEmail || 'support@redlinkltd.com'}`} className="text-[#B8B8C0] text-sm hover:text-white break-all">{siteSettings?.supportEmail || 'support@redlinkltd.com'}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>
                  {siteSettings?.headOffice || (isBn ? 'হাউজ ৪৫, রোড ১২, ধানমন্ডি, ঢাকা-১২০৯' : 'House 45, Road 12, Dhanmondi, Dhaka-1209')}
                </span>
              </li>
            </ul>

            {/* Payment Logos */}
            <div className="mt-5">
              <p className="text-xs text-[#6B6B78] mb-2 uppercase tracking-wider">{isBn ? 'পেমেন্ট পদ্ধতি' : 'We Accept'}</p>
              <div className="flex flex-wrap gap-2">
                {['bKash', 'Nagad', 'Rocket', 'Visa', 'MasterCard'].map((m) => (
                  <span key={m} className="px-2 py-1 rounded-md bg-white/8 border border-white/10 text-xs text-[#B8B8C0] font-medium">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p className={`text-[#6B6B78] text-sm ${isBn ? 'font-bangla' : ''}`}>
              © 2025 RedLink Technologies. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
            </p>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="text-xs text-[#8A8A96] flex items-center gap-1">
              🏛️ {isBn ? 'বিটিআরসি অনুমোদিত আইএসপি লাইসেন্স নং: ISP-NAT-2018-092' : 'BTRC Licensed Nationwide ISP No: ISP-NAT-2018-092'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDiagOpen(true)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-all"
              title="Run Network Traceroute"
            >
              <Activity size={12} />
              <span>{isBn ? 'রুট ডায়াগনস্টিক' : 'Ping & Route'}</span>
            </button>
            <Link to="/terms" className="text-[#6B6B78] text-sm hover:text-red-400 transition-colors">
              {isBn ? 'শর্তাবলী' : 'Terms'}
            </Link>
            <Link to="/privacy" className="text-[#6B6B78] text-sm hover:text-red-400 transition-colors">
              {isBn ? 'গোপনীয়তা' : 'Privacy'}
            </Link>
          </div>
        </div>
      </div>

      {/* Network Diagnostic Modal */}
      <NetworkDiagnosticModal isOpen={diagOpen} onClose={() => setDiagOpen(false)} />
    </footer>
  );
}
