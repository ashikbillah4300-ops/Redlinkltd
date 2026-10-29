// ── Coverage Page ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, FormSelect, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { coverageData } from '../data/constants';
import { apiCheckCoverage, apiRegisterInterest } from '../services/api';

// Lazy load map
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Custom red marker icon
const redIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#FF2D3F,#B30F1F);border:2px solid rgba(255,255,255,0.5);box-shadow:0 0 8px rgba(225,29,46,0.70);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Coverage points (lat/lng for demo)
const coveragePoints = [
  { name: 'Mirpur, Dhaka', lat: 23.8103, lng: 90.3665 },
  { name: 'Gulshan, Dhaka', lat: 23.7803, lng: 90.4152 },
  { name: 'Uttara, Dhaka', lat: 23.8759, lng: 90.3795 },
  { name: 'Dhanmondi, Dhaka', lat: 23.7461, lng: 90.3742 },
  { name: 'Agrabad, Chittagong', lat: 22.3375, lng: 91.8123 },
  { name: 'GEC Circle, Chittagong', lat: 22.3569, lng: 91.8324 },
];

function InterestForm({ division, district, area, isBn, onClose }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRegisterInterest({ ...form, division, district, area });
      toast.success("Interest registered! We'll notify you when service is available.", { icon: '📍' });
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <FormInput label="Full Name *" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <FormInput label="Mobile *" placeholder="01XXXXXXXXX" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
      <FormInput label="Email" type="email" placeholder="Optional" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center">
        {isBn ? 'আগ্রহ নিবন্ধন করুন' : 'Register My Interest'}
      </GlassButton>
    </form>
  );
}

export default function CoveragePage() {
  const { isBn } = useLang();
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [result, setResult] = useState(null); // null | 'available' | 'unavailable'
  const [loading, setLoading] = useState(false);

  const divisions = Object.keys(coverageData);
  const districts = division ? Object.keys(coverageData[division] || {}) : [];
  const areas = division && district ? (coverageData[division]?.[district] || []) : [];

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!division || !district || !area) { toast.error('Please select Division, District and Area.'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await apiCheckCoverage(division, district, area);
      setResult(res.available ? 'available' : 'unavailable');
    } catch {
      setResult('unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Coverage Checker"
            tagBn="কভারেজ চেকার"
            title="Check Service Availability"
            titleBn="সেবার উপলব্ধতা যাচাই করুন"
            subtitle="Find out if RedLink fiber is available in your area."
            subtitleBn="আপনার এলাকায় রেডলিংক ফাইবার আছে কিনা দেখুন।"
            isBn={isBn}
          />
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Checker */}
          <div>
            <FadeUp>
              <GlassCard className="p-6 mb-6">
                <form onSubmit={handleCheck} className="space-y-4">
                  <FormSelect
                    label={isBn ? 'বিভাগ' : 'Division'}
                    value={division}
                    onChange={(e) => { setDivision(e.target.value); setDistrict(''); setArea(''); setResult(null); }}
                  >
                    <option value="">-- Select Division --</option>
                    {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </FormSelect>

                  <FormSelect
                    label={isBn ? 'জেলা' : 'District'}
                    value={district}
                    onChange={(e) => { setDistrict(e.target.value); setArea(''); setResult(null); }}
                    disabled={!division}
                  >
                    <option value="">-- Select District --</option>
                    {districts.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                  </FormSelect>

                  <FormSelect
                    label={isBn ? 'এলাকা / মহল্লা' : 'Area / Mohalla'}
                    value={area}
                    onChange={(e) => { setArea(e.target.value); setResult(null); }}
                    disabled={!district}
                  >
                    <option value="">-- Select Area --</option>
                    {areas.map((a) => <option key={a} value={a}>{a}</option>)}
                  </FormSelect>

                  <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
                    <Search size={16} /> {isBn ? 'কভারেজ যাচাই করুন' : 'Check Coverage'}
                  </GlassButton>
                </form>
              </GlassCard>
            </FadeUp>

            {/* Result */}
            <AnimatePresence>
              {result === 'available' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="coverage-available p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle size={32} className="text-green-400" />
                      <div>
                        <h3 className={`text-white font-bold text-lg ${isBn ? 'font-bangla' : ''}`}>
                          {isBn ? 'সেবা পাওয়া যাবে! ✅' : 'Service Available! ✅'}
                        </h3>
                        <p className={`text-green-300 text-sm ${isBn ? 'font-bangla' : ''}`}>
                          {isBn ? `${area}-এ রেডলিংক ফাইবার আছে।` : `RedLink fiber is available in ${area}.`}
                        </p>
                      </div>
                    </div>
                    <a href="/packages" className="btn-primary text-sm">
                      {isBn ? 'এখনই আবেদন করুন' : 'Apply Now'} →
                    </a>
                  </div>
                </motion.div>
              )}

              {result === 'unavailable' && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="coverage-unavailable p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle size={32} className="text-red-400" />
                      <div>
                        <h3 className={`text-white font-bold text-lg ${isBn ? 'font-bangla' : ''}`}>
                          {isBn ? 'এখনো পাওয়া যাচ্ছে না' : 'Not Yet Available'}
                        </h3>
                        <p className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>
                          {isBn ? 'আপনার এলাকায় শীঘ্রই আসছে। আগ্রহ নিবন্ধন করুন।' : 'We\'re expanding soon. Register your interest below.'}
                        </p>
                      </div>
                    </div>
                    <InterestForm division={division} district={district} area={area} isBn={isBn} onClose={() => setResult(null)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Map */}
          <FadeUp delay={0.2}>
            <div className="h-[420px] rounded-2xl overflow-hidden border border-white/10">
              <MapContainer
                center={[23.685, 90.356]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {coveragePoints.map((pt) => (
                  <Marker key={pt.name} position={[pt.lat, pt.lng]} icon={redIcon}>
                    <Popup>
                      <div style={{ background: '#1A1A1D', color: '#fff', padding: '8px 12px', borderRadius: '8px', minWidth: '140px' }}>
                        <div style={{ fontWeight: 'bold', color: '#FF2D3F' }}>✅ Covered</div>
                        <div style={{ fontSize: '13px' }}>{pt.name}</div>
                      </div>
                    </Popup>
                    <Circle center={[pt.lat, pt.lng]} radius={3000} color="#E11D2E" fillColor="#E11D2E" fillOpacity={0.12} weight={1} />
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Covered areas list */}
            <GlassCard className="mt-4 p-5">
              <h4 className={`text-white font-semibold mb-3 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'কভার করা প্রধান এলাকাসমূহ' : 'Key Covered Areas'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {coveragePoints.map((p) => (
                  <span key={p.name} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-red-500/10 border border-red-500/20 text-red-300">
                    <MapPin size={10} /> {p.name}
                  </span>
                ))}
              </div>
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
