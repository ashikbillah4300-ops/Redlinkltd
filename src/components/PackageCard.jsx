// ── PackageCard ───────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { GlassButton, Modal, FormInput, FormTextarea, FormSelect } from './ui/index';
import { homePackages } from '../data/constants';
import toast from 'react-hot-toast';
import { apiApplyPackage } from '../services/api';

function ApplyModal({ isOpen, onClose, pkg, isBn }) {
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
        <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
          Submit Application
        </GlassButton>
      </form>
    </Modal>
  );
}

export default function PackageCard({ pkg, isBn }) {
  const [showModal, setShowModal] = useState(false);

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

        {/* Price */}
        <div className="mb-5">
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

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {(isBn ? pkg.featuresBn : pkg.features).map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <Check size={15} className="text-green-400 flex-shrink-0" />
              <span className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>{f}</span>
            </li>
          ))}
        </ul>

        <GlassButton
          variant="primary"
          className="w-full justify-center py-3"
          onClick={() => setShowModal(true)}
        >
          {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'}
        </GlassButton>
      </motion.div>

      <ApplyModal isOpen={showModal} onClose={() => setShowModal(false)} pkg={pkg} isBn={isBn} />
    </>
  );
}
