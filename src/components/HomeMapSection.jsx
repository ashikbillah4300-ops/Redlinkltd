// ── Home Coverage Map Section (Connected to Admin Home Map Setup) ───────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Wifi, Activity, ArrowRight, ShieldCheck, Radio, CheckCircle2, Globe2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GlassCard, GlassButton, FadeUp, SectionHeading } from './ui/index';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';

// Custom Glowing Red Marker for RedLink POP Nodes
const createPopIcon = (status = 'Active') => {
  const isAct = status === 'Active';
  const color = isAct ? '#FF2D3F' : status === 'Expanding' ? '#F59E0B' : '#3B82F6';
  return L.divIcon({
    html: `
      <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:100%;height:100%;border-radius:50%;background:${color};opacity:0.4;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
        <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 10px ${color};"></div>
      </div>
    `,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function HomeMapSection() {
  const { isBn } = useLang();
  const { homeMapConfig } = useAdmin();
  const [activePoint, setActivePoint] = useState(null);

  if (!homeMapConfig || homeMapConfig.enabled === false) {
    return null;
  }

  const points = homeMapConfig.points || [];
  const centerLat = Number(homeMapConfig.centerLat) || 23.8103;
  const centerLng = Number(homeMapConfig.centerLng) || 90.4125;
  const zoom = Number(homeMapConfig.zoom) || 7;
  const mapType = homeMapConfig.mapType || 'interactive';

  const activeCount = points.filter(p => p.status === 'Active').length;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="coverage-map">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-tag mb-4 inline-flex items-center gap-2">
                <Globe2 size={14} className="text-red-400" />
                {isBn ? 'দেশব্যাপী ফাইবার নেটওয়ার্ক' : 'Nationwide Optical Coverage'}
              </span>
              <h2 className={`text-3xl md:text-5xl font-black font-poppins text-white mb-3 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? homeMapConfig.titleBn : homeMapConfig.title}
              </h2>
              <p className={`text-[#B8B8C0] max-w-2xl text-base ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? homeMapConfig.subtitleBn : homeMapConfig.subtitle}
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white text-xs font-semibold">
                  {activeCount} {isBn ? 'সক্রিয় হাব' : 'Active Optical POPs'}
                </span>
              </div>
              <Link
                to="/coverage"
                className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5"
              >
                {isBn ? 'এলাকা অনুযায়ী খুঁজুন' : 'Check Your Area'}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Map Container Card */}
        <FadeUp delay={0.15}>
          <div className="glass-card p-3 sm:p-5 rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Map display area */}
              <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 h-[440px] sm:h-[500px] relative bg-[#09090D]">
                {mapType === 'embed' && homeMapConfig.embedUrl ? (
                  <iframe
                    src={homeMapConfig.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="RedLink Fiber Coverage Map"
                  />
                ) : (
                  <MapContainer
                    center={[centerLat, centerLng]}
                    zoom={zoom}
                    scrollWheelZoom={false}
                    className="w-full h-full z-10"
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      subdomains="abcd"
                      maxZoom={19}
                    />

                    {points.map((pt) => (
                      <Marker
                        key={pt.id}
                        position={[pt.lat, pt.lng]}
                        icon={createPopIcon(pt.status)}
                        eventHandlers={{
                          click: () => setActivePoint(pt),
                        }}
                      >
                        <Popup className="redlink-map-popup">
                          <div className="p-2 text-xs">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm">
                                {isBn ? pt.nameBn || pt.name : pt.name}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                pt.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {pt.status}
                              </span>
                            </div>
                            <div className="text-slate-600 text-[11px] mb-2">{pt.division} Division</div>
                            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200 text-[10px]">
                              <div>
                                <span className="text-slate-500 block">Capacity</span>
                                <span className="font-bold text-slate-800">{pt.capacity || '10G Ring'}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Subscribers</span>
                                <span className="font-bold text-red-600">{pt.users || 'Active'}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}

                {/* Map Floating Indicator */}
                <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] flex items-center gap-2 pointer-events-none">
                  <Radio size={12} className="text-red-400 animate-pulse" />
                  <span>{isBn ? 'রেডলিংক ফাইবার ব্যাকবোন' : 'RedLink Live Optical Core'}</span>
                </div>
              </div>

              {/* Side POP Nodes Explorer */}
              <div className="lg:col-span-1 flex flex-col justify-between h-[440px] sm:h-[500px] p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-red-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {isBn ? 'প্রধান হাবসমূহ' : 'Key Fiber POPs'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#B8B8C0]">
                    {points.length} Nodes
                  </span>
                </div>

                {/* Scrollable list of POP nodes */}
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                  {points.map((pt) => {
                    const isSelected = activePoint?.id === pt.id;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setActivePoint(pt)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-500/15 border-red-500/50 shadow-red-glow'
                            : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs truncate">
                            {isBn ? pt.nameBn || pt.name : pt.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            pt.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : pt.status === 'Expanding'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {pt.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#B8B8C0]">
                          <span>{pt.division}</span>
                          <span className="font-mono text-red-300 font-semibold">{pt.capacity}</span>
                        </div>
                        {pt.users && (
                          <div className="mt-1 text-[10px] text-[#B8B8C0] flex items-center gap-1">
                            <Activity size={10} className="text-emerald-400" />
                            <span>{pt.users} connected</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Card Summary */}
                <div className="pt-3 mt-2 border-t border-white/10 text-center">
                  <div className="text-[11px] text-[#B8B8C0] mb-2 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>{isBn ? '৯৯.৯% নিরবচ্ছিন্ন গিগাবিট আপটাইম' : '99.9% Uptime Ring Protected'}</span>
                  </div>
                  <Link
                    to="/coverage"
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{isBn ? 'সম্পূর্ণ কভারেজ ম্যাপ' : 'Full Coverage Directory'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
