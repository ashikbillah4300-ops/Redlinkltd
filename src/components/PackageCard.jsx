// ── PackageCard ───────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { GlassButton, Modal, FormInput, FormTextarea, FormSelect } from './ui/index';
import { useAdmin, createWhatsAppUrl, getWhatsAppNumber } from '../context/AdminContext';
import { homePackages } from '../data/constants';
import toast from 'react-hot-toast';
import { apiApplyPackage } from '../services/api';

function ApplyModal({ isOpen, onClose, pkg, isBn }) {
  const { siteSettings } = useAdmin();
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', address: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.mobile.match(/^01[3-9]\d{8}$/)) e.mobile = 'Valid Bangladeshi mobile required (e.g. 01XXXXXXXXX)';
    if (form.email && !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await apiApplyPackage({ ...form, packageId: pkg?.id, packageName: pkg?.name });
      toast.success('Application submitted! We\'ll contact you within 24 hours.', { duration: 5000, icon: '🎉' });
      
      // Also send directly to the Admin's configured WhatsApp number
      const waMsg = `হ্যালো RedLink, আমি ওয়েবসাইটে নতুন সংযোগের জন্য আবেদন করেছি:\n- নাম: ${form.name}\n- মোবাইল: ${form.mobile}\n- ঠিকানা: ${form.address}\n- প্যাকেজ: ${pkg?.name} (${pkg?.speed} Mbps @ ৳${pkg?.price}/মাস)${form.message ? `\n- বার্তা: ${form.message}` : ''}`;
      window.open(createWhatsAppUrl(siteSettings, waMsg), '_blank');

      onClose();
      setForm({ name: '', mobile: '', email: '', address: '', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply — ${pkg?.name || ''} Package`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Full Name *" placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <FormInput label="Mobile Number *" placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} error={errors.mobile} />
        <FormInput label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <FormInput label="Full Address / Area *" placeholder="House, Road, Area, City" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} />
        <div className="glass-card-static p-4 rounded-xl">
          <p className="text-xs text-[#B8B8C0] mb-1">Selected Package</p>
          <p className="text-white font-bold">{pkg?.name} — {pkg?.speed} Mbps @ ৳{pkg?.price}/mo</p>
        </div>
        <FormTextarea label="Message (Optional)" placeholder="Any questions or special requirements?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5 flex items-center gap-2">
          <span>{isBn ? 'আবেদন জমা দিন ও হোয়াটসঅ্যাপে পাঠান' : 'Submit & Connect on WhatsApp'}</span>
        </GlassButton>
      </form>
    </Modal>
  );
}

export default function PackageCard({ pkg, isBn, isReseller = false }) {
  const [showModal, setShowModal] = useState(false);
  const { siteSettings } = useAdmin();

  // Detect if reseller package
  const isResellerPkg = isReseller || pkg?.type === 'corporate' || pkg?.isReseller || pkg?.id?.startsWith('c');

  const pkgName = isBn ? (pkg.nameBn || pkg.name) : pkg.name;
  
  const waMessage = isResellerPkg
    ? (isBn
        ? `হ্যালো RedLink, আমি আপনাদের রিসেলার "${pkgName} (${pkg.speed} Mbps)" প্যাকেজটি নিতে চাই। বিস্তারিত ও প্রাইসিং জানাবেন কি?`
        : `Hello RedLink, I want to take the "${pkgName} (${pkg.speed} Mbps)" Reseller package. Please share details and pricing.`)
    : (isBn
        ? `হ্যালো RedLink, আমি আপনাদের "${pkgName} (${pkg.speed} Mbps @ ৳${pkg.price}/মাস)" প্যাকেজটি নিতে চাই। সংযোগ প্রক্রিয়া সম্পর্কে জানাবেন কি?`
        : `Hello RedLink, I want to take the "${pkgName} (${pkg.speed} Mbps @ ৳${pkg.price}/month)" package. Please share connection details.`);

  // Connects directly to admin-configured WhatsApp number
  const waLink = createWhatsAppUrl(siteSettings, waMessage);

  return (
    <>
      <motion.div
        className={`glass-card p-6 h-full flex flex-col relative overflow-hidden ${pkg.popular ? 'border-red-500/40' : ''}`}
        style={pkg.popular ? { boxShadow: '0 8px 32px rgba(225,29,46,0.30)', borderColor: 'rgba(225,29,46,0.35)' } : {}}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
      >
        {/* Popular badge */}
        {pkg.popular && (
          <div className="absolute top-5 right-5">
            <span className="popular-badge">⭐ Most Popular</span>
          </div>
        )}

        {/* Speed badge */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center">
            <Zap size={22} style={{ color: pkg.color }} />
          </div>
          <div>
            <div className={`text-white font-bold text-lg ${isBn ? 'font-bangla' : ''}`}>{isBn ? pkg.nameBn : pkg.name}</div>
            <div className="text-[#B8B8C0] text-sm">{pkg.speed} Mbps</div>
          </div>
        </div>

        {/* Price or Reseller WhatsApp Notice */}
        {isResellerPkg ? (
          <div className="mb-5 p-3 rounded-xl bg-white/[0.04] border border-emerald-500/30 flex flex-col justify-center min-h-[72px]">
            <span className="text-emerald-400 font-bold text-sm block">
              {isBn ? 'আলোচনা সাপেক্ষে' : 'Negotiable / Custom Rate'}
            </span>
            <span className={`text-[#B8B8C0] text-xs mt-0.5 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'প্যাকেজটি নিতে হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Contact on WhatsApp to get this package'}
            </span>
          </div>
        ) : (
          <div className="mb-5 min-h-[72px] flex flex-col justify-center">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black font-poppins gradient-text">৳{pkg.price}</span>
              <span className="text-[#B8B8C0] text-sm pb-1">/month</span>
            </div>
            {pkg.originalPrice && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#6B6B78] text-sm line-through">৳{pkg.originalPrice}</span>
                <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-0.5 rounded-full">
                  Save {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {(isBn ? pkg.featuresBn : pkg.features).map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <Check size={15} className="text-green-400 flex-shrink-0" />
              <span className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>{f}</span>
            </li>
          ))}
        </ul>

        {isResellerPkg ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-95 text-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className={isBn ? 'font-bangla' : ''}>
              {isBn ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন' : 'Contact on WhatsApp'}
            </span>
          </a>
        ) : (
          <div className="flex flex-col gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center py-3 flex items-center gap-2 text-center font-bold text-sm shadow-red-glow cursor-pointer transition-all active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className={isBn ? 'font-bangla' : ''}>
                {isBn ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order via WhatsApp'}
              </span>
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="text-[11px] text-[#B8B8C0] hover:text-white transition-colors text-center cursor-pointer py-1 underline underline-offset-4"
            >
              {isBn ? 'অথবা ওয়েবসাইটে ফর্ম পূরণ করুন' : 'Or fill out online form'}
            </button>
          </div>
        )}
      </motion.div>

      <ApplyModal isOpen={showModal} onClose={() => setShowModal(false)} pkg={pkg} isBn={isBn} />
    </>
  );
}
