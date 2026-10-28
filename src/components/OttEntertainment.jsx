// ── OTT, BDIX & Value Added Entertainment Section ────────────────────────────
import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { GlassCard, SectionHeading, FadeUp } from './ui/index';

const OTT_PLATFORMS = [
  { name: 'Toffee', desc: 'Live TV & Premier Sports', icon: '⚽', badge: 'Free with 30M+' },
  { name: 'Chorki', desc: 'Original Bangla Thrillers & Movies', icon: '🎬', badge: 'Complimentary' },
  { name: 'Hoichoi', desc: 'Popular Bengali Web Series', icon: '🍿', badge: 'Included' },
  { name: 'Sony LIV', desc: 'UEFA Champions League & Cricket', icon: '🏏', badge: 'Add-on ৳99' },
  { name: 'BDIX Cache', desc: '100 Mbps Dedicated Local Peering', icon: '⚡', badge: 'All Plans' },
  { name: 'YouTube Cache', desc: 'Instant 4K Bufferless Playback', icon: '▶️', badge: 'Direct CDN' },
];

export default function OttEntertainment() {
  const { isBn } = useLang();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Entertainment & BDIX"
            tagBn="বিনোদন ও বিডিআইএক্স"
            title="Unlimited Streaming & High-Speed BDIX"
            titleBn="আনলিমিটেড স্ট্রিমিং ও দ্রুত বিডিআইএক্স"
            subtitle="Every RedLink connection includes blazing-fast 100 Mbps BDIX, local CDN caching, and top OTT bundles."
            subtitleBn="প্রতিটি রেডলিংক সংযোগে রয়েছে ১০০ এমবিপিএস বিডিআইএক্স, লোকাল সিডিএন ক্যাশিং এবং সেরা ওটিটি বান্ডেল।"
            isBn={isBn}
          />
        </FadeUp>

        {/* OTT Platforms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {OTT_PLATFORMS.map((item, i) => (
            <FadeUp key={item.name} delay={i * 0.08}>
              <GlassCard className="p-4 text-center h-full flex flex-col items-center justify-between group hover:border-red-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-[11px] text-[#B8B8C0] line-clamp-2 leading-tight mb-3">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-medium">
                  {item.badge}
                </span>
              </GlassCard>
            </FadeUp>
          ))}
        </div>

        {/* Value Added Highlights */}
        <div className="grid md:grid-cols-3 gap-6">
          <FadeUp delay={0.1}>
            <GlassCard className="p-6 h-full flex flex-col justify-start">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400 mb-4">
                <Zap size={24} />
              </div>
              <h4 className={`text-base font-bold text-white mb-2 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? '১০০ এমবিপিএস বিডিআইএক্স ও এফটিপি' : '100 Mbps BDIX & Local FTP Servers'}
              </h4>
              <p className={`text-sm text-[#B8B8C0] leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                {isBn 
                  ? 'বাংলাদেশের শীর্ষস্থানীয় মুভি সার্ভার, এফটিপি হাব ও বিডিআইএক্স পিয়ারগুলিতে সর্বোচ্চ ১০০ এমবিপিএস গতি উপভোগ করুন।'
                  : 'Connect directly to Bangladesh’s premier local peering exchange for lightning fast local torrents, movie servers and live streaming.'}
              </p>
            </GlassCard>
          </FadeUp>

          <FadeUp delay={0.2}>
            <GlassCard className="p-6 h-full flex flex-col justify-start">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 mb-4">
                <Shield size={24} />
              </div>
              <h4 className={`text-base font-bold text-white mb-2 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'রিয়েল পাবলিক আইপি ও ডুয়াল স্ট্যাক' : 'Real Public IPv4 & IPv6 Dual-Stack'}
              </h4>
              <p className={`text-sm text-[#B8B8C0] leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                {isBn
                  ? 'হোম সার্ভার, সিসিটিভি রিমোট অ্যাক্সেস বা অনলাইন হোস্টিংয়ের জন্য রিয়েল স্ট্যাটিক আইপি যোগ করুন নামমাত্র মূল্যে।'
                  : 'Perfect for remote CCTV camera monitoring, home media servers, port forwarding, and secure network bridges.'}
              </p>
            </GlassCard>
          </FadeUp>

          <FadeUp delay={0.3}>
            <GlassCard className="p-6 h-full flex flex-col justify-start">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400 mb-4">
                <Sparkles size={24} />
              </div>
              <h4 className={`text-base font-bold text-white mb-2 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'স্মার্ট রাউটার ও ফ্রি অপটিক্যাল ফাইবার' : 'Free Fiber Optical Terminal Unit (ONU)'}
              </h4>
              <p className={`text-sm text-[#B8B8C0] leading-relaxed ${isBn ? 'font-bangla' : ''}`}>
                {isBn
                  ? 'বার্ষিক পেমেন্টে পাচ্ছেন ফ্রি গিগাবিট ডুয়াল-ব্যান্ড ওয়াইফাই ৬ রাউটার এবং ফ্রি ইনস্টলেশন।'
                  : 'Sign up for 6 or 12 months in advance and receive a complimentary Gigabit WiFi-6 router plus zero installation cost.'}
              </p>
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
