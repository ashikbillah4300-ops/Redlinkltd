// ── Business & Network Services Page ─────────────────────────────────────────
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { GlassCard, GlassButton, Modal, FormInput, FormTextarea, FormSelect, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { businessServices } from '../data/constants';
import { apiRequestQuote } from '../services/api';

function QuoteModal({ isOpen, onClose, service, isBn }) {
  const [form, setForm] = useState({ name: '', company: '', mobile: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile) { toast.error('Name and mobile are required.'); return; }
    setLoading(true);
    try {
      const res = await apiRequestQuote({ ...form, serviceId: service?.id, serviceName: service?.title });
      toast.success(`Quote request sent! Ref: ${res.quoteId}`, { icon: '📋', duration: 5000 });
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Quote — ${service?.title || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Full Name *" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <FormInput label="Company / Organization" placeholder="Your company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <FormInput label="Mobile *" placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
        <FormInput label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormTextarea label="Requirements / Message" placeholder="Tell us about your specific requirements..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
          Send Quote Request
        </GlassButton>
      </form>
    </Modal>
  );
}

export default function BusinessPage() {
  const { isBn } = useLang();
  const [quoteService, setQuoteService] = useState(null);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Business & Network Services"
            tagBn="ব্যবসায়িক ও নেটওয়ার্ক সেবা"
            title="Enterprise Solutions Built for Growth"
            titleBn="প্রবৃদ্ধির জন্য এন্টারপ্রাইজ সমাধান"
            subtitle="From small offices to large corporations, we have the right connectivity solution for every business."
            subtitleBn="ছোট অফিস থেকে বড় কর্পোরেশন — প্রতিটি ব্যবসার জন্য সঠিক সমাধান।"
            isBn={isBn}
          />
        </FadeUp>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {businessServices.map((service, i) => (
            <FadeUp key={service.id} delay={i * 0.1}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className={`text-white font-bold text-xl mb-2 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? service.titleBn : service.title}
                </h3>
                <p className={`text-[#B8B8C0] text-sm leading-relaxed mb-4 flex-1 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? service.descriptionBn : service.description}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#B8B8C0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <GlassButton
                  variant="outline"
                  className="w-full justify-center py-2.5 text-sm mt-auto"
                  onClick={() => setQuoteService(service)}
                >
                  {isBn ? 'কোটেশন চাই' : 'Request Quote'}
                </GlassButton>
              </GlassCard>
            </FadeUp>
          ))}
        </div>

        {/* Stats Banner */}
        <FadeUp>
          <div className="glass-card p-10 mb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/15 to-transparent pointer-events-none" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Business Clients', labelBn: 'বিজনেস ক্লায়েন্ট' },
                { value: '99.99%', label: 'Corporate Uptime', labelBn: 'কর্পোরেট আপটাইম' },
                { value: '10 Gbps', label: 'IIG Capacity', labelBn: 'IIG ক্যাপাসিটি' },
                { value: '24/7', label: 'NOC Support', labelBn: 'NOC সাপোর্ট' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-black gradient-text font-poppins">{s.value}</div>
                  <div className={`text-[#B8B8C0] mt-1 text-sm ${isBn ? 'font-bangla' : ''}`}>{isBn ? s.labelBn : s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="text-center">
            <h3 className={`text-3xl font-bold text-white mb-4 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'আজই কথা বলুন আমাদের বিশেষজ্ঞের সাথে' : 'Talk to Our Enterprise Team Today'}
            </h3>
            <p className={`text-[#B8B8C0] mb-6 max-w-xl mx-auto ${isBn ? 'font-bangla' : ''}`}>
              {isBn
                ? 'বিশেষজ্ঞ পরামর্শের জন্য এখনই কল করুন অথবা ইমেইল করুন।'
                : 'Get a free consultation and custom quote tailored to your business requirements.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+8801700000000" className="btn-primary px-8 py-3.5">
                📞 {isBn ? 'এখনই কল করুন' : 'Call Enterprise Sales'}
              </a>
              <a href="mailto:enterprise@redlinkltd.com" className="btn-outline px-8 py-3.5">
                ✉️ enterprise@redlinkltd.com
              </a>
            </div>
          </div>
        </FadeUp>
      </div>

      <QuoteModal
        isOpen={!!quoteService}
        onClose={() => setQuoteService(null)}
        service={quoteService}
        isBn={isBn}
      />
    </div>
  );
}
