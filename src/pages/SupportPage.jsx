// ── Support Page ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones, Zap, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, FormTextarea, FormSelect, SectionHeading, Accordion, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { useAdmin, createWhatsAppUrl, getWhatsAppNumber } from '../context/AdminContext';
import { faqs } from '../data/constants';
import { apiCreateTicket } from '../services/api';
import SpeedTestModal from '../components/SpeedTestModal';

const categories = [
  { id: 'billing', label: 'Billing', labelBn: 'বিলিং' },
  { id: 'new-connection', label: 'New Connection', labelBn: 'নতুন সংযোগ' },
  { id: 'technical', label: 'Technical Problem', labelBn: 'টেকনিক্যাল সমস্যা' },
  { id: 'other', label: 'Other', labelBn: 'অন্যান্য' },
];

export default function SupportPage() {
  const { isBn } = useLang();
  const { siteSettings } = useAdmin();
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', category: 'technical', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const contactCards = [
    { icon: Phone, label: 'Hotline', labelBn: 'হটলাইন', value: siteSettings?.hotline || '16500', value2: siteSettings?.whatsapp || '+880 1700-000000', href: `tel:${siteSettings?.hotline || '16500'}`, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-900/20' },
    { icon: MessageCircle, label: 'WhatsApp', labelBn: 'হোয়াটসঅ্যাপ', value: siteSettings?.whatsapp || '+880 1700-000000', href: createWhatsAppUrl(siteSettings, 'Hi RedLink, I need support'), color: 'text-green-400', bg: 'from-green-500/20 to-green-900/20' },
    { icon: Mail, label: 'Email', labelBn: 'ইমেইল', value: siteSettings?.supportEmail || 'support@redlinkltd.com', href: `mailto:${siteSettings?.supportEmail || 'support@redlinkltd.com'}`, color: 'text-red-400', bg: 'from-red-500/20 to-red-900/20' },
    { icon: MapPin, label: 'Office', labelBn: 'অফিস', value: siteSettings?.headOffice || 'House 45, Road 12, Dhanmondi, Dhaka-1209', href: 'https://maps.google.com', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-900/20' },
    { icon: Clock, label: 'Working Hours', labelBn: 'কার্যঘণ্টা', value: 'Sat–Thu: 9AM–9PM', value2: 'Fri: 10AM–6PM | Emergency: 24/7', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-900/20' },
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.mobile.match(/^01[3-9]\d{8}$/)) e.mobile = 'Valid BD mobile required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await apiCreateTicket(form);
      toast.success(`Ticket created: ${res.ticketId}`, { icon: '🎫', duration: 5000 });
      setForm({ name: '', mobile: '', email: '', category: 'technical', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Support"
            tagBn="সাপোর্ট"
            title="We're Here to Help"
            titleBn="আমরা সাহায্য করতে এখানে আছি"
            subtitle="24/7 technical support via call, WhatsApp, email or our support portal."
            subtitleBn="কল, WhatsApp, ইমেইল বা সাপোর্ট পোর্টালের মাধ্যমে ২৪/৭ সাহায্য পান।"
            isBn={isBn}
          />
        </FadeUp>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {contactCards.map((card, i) => (
            <FadeUp key={card.label} delay={i * 0.08}>
              <a href={card.href || '#'} target={card.href?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="block h-full">
                <GlassCard className="p-5 h-full">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.bg} flex items-center justify-center mb-3`}>
                    <card.icon size={20} className={card.color} />
                  </div>
                  <div className={`text-[#B8B8C0] text-xs uppercase tracking-wider mb-1 ${isBn ? 'font-bangla normal-case tracking-normal' : ''}`}>
                    {isBn ? card.labelBn : card.label}
                  </div>
                  <div className="text-white font-semibold text-sm">{card.value}</div>
                  {card.value2 && <div className="text-[#B8B8C0] text-xs mt-0.5">{card.value2}</div>}
                </GlassCard>
              </a>
            </FadeUp>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Support Ticket Form */}
          <FadeUp>
            <div>
              <h3 className={`text-2xl font-bold text-white mb-6 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'সাপোর্ট টিকেট তৈরি করুন' : 'Create a Support Ticket'}
              </h3>
              <GlassCard className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput label={isBn ? 'পূর্ণ নাম *' : 'Full Name *'} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                    <FormInput label={isBn ? 'মোবাইল *' : 'Mobile *'} placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} error={errors.mobile} />
                  </div>
                  <FormInput label="Email" type="email" placeholder="Optional" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <FormSelect
                    label={isBn ? 'বিষয়শ্রেণী' : 'Category'}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{isBn ? c.labelBn : c.label}</option>
                    ))}
                  </FormSelect>
                  <FormInput label={isBn ? 'বিষয় *' : 'Subject *'} placeholder="Brief description of your issue" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={errors.subject} />
                  <FormTextarea label={isBn ? 'বার্তা *' : 'Message *'} placeholder="Describe your issue in detail..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} />
                  <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
                    {isBn ? 'টিকেট জমা দিন' : 'Submit Ticket'}
                  </GlassButton>
                </form>
              </GlassCard>

              {/* Interactive Speed Test Widget Promo */}
              <GlassCard className="mt-5 p-5 flex items-center justify-between gap-4 border-red-500/20 hover:border-red-500/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-red-400" />
                  </div>
                  <div>
                    <div className={`text-white font-semibold flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? 'লাইভ স্পিড টেস্ট' : 'Live Speed Test'}
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Ookla</span>
                    </div>
                    <div className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>
                      {isBn ? 'ডাউনলোড, আপলোড ও পিং রিয়েল-টাইমে পরীক্ষা করুন' : 'Test download, upload, ping & jitter in real-time'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSpeedTest(true)} 
                  className="btn-primary text-sm flex items-center gap-1.5 flex-shrink-0"
                >
                  <Zap size={14} />
                  {isBn ? 'টেস্ট শুরু করুন' : 'Run Test'}
                </button>
              </GlassCard>
            </div>
          </FadeUp>

          {/* FAQ */}
          <FadeUp delay={0.15}>
            <div>
              <h3 className={`text-2xl font-bold text-white mb-6 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'সাধারণ জিজ্ঞাসা' : 'Frequently Asked Questions'}
              </h3>
              <Accordion items={faqs} isBn={isBn} />
            </div>
          </FadeUp>
        </div>
      </div>
      <SpeedTestModal isOpen={showSpeedTest} onClose={() => setShowSpeedTest(false)} />
    </div>
  );
}
