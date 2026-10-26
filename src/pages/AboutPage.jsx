// ── About Page ────────────────────────────────────────────────────────────────
import { Wifi, Users, Award, Globe } from 'lucide-react';
import { GlassCard, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';

const timeline = [
  { year: '2018', event: 'RedLink Ltd founded in Dhaka with 500 initial customers.', eventBn: 'রেডলিংক লিমিটেড ঢাকায় ৫০০ গ্রাহক নিয়ে প্রতিষ্ঠিত।' },
  { year: '2020', event: 'Expanded to Chittagong — 5,000 customers milestone.', eventBn: 'চট্টগ্রামে সম্প্রসারিত — ৫,০০০ গ্রাহকের মাইলফলক।' },
  { year: '2022', event: 'IIG direct connection established. Corporate division launched.', eventBn: 'IIG সরাসরি সংযোগ স্থাপিত। কর্পোরেট বিভাগ চালু।' },
  { year: '2024', event: 'Reached 15,000+ customers. Wi-Fi 6 infrastructure rollout.', eventBn: '১৫,০০০+ গ্রাহক। Wi-Fi 6 অবকাঠামো চালু।' },
  { year: '2025', event: 'Serving 120+ areas across 5 divisions. 99.9% uptime SLA.', eventBn: '৫ বিভাগে ১২০+ এলাকায় সেবা। ৯৯.৯% আপটাইম।' },
];

const team = [
  { name: 'Mahfuzur Rahman', nameBn: 'মাহফুজুর রহমান', role: 'CEO & Founder', roleBn: 'সিইও ও প্রতিষ্ঠাতা', initials: 'MR' },
  { name: 'Tahmina Begum', nameBn: 'তাহমিনা বেগম', role: 'CTO', roleBn: 'প্রধান প্রযুক্তি কর্মকর্তা', initials: 'TB' },
  { name: 'Kamal Hossain', nameBn: 'কামাল হোসেন', role: 'Head of Operations', roleBn: 'পরিচালন প্রধান', initials: 'KH' },
  { name: 'Roksana Akter', nameBn: 'রোকসানা আক্তার', role: 'Customer Success Lead', roleBn: 'গ্রাহক সাফল্য প্রধান', initials: 'RA' },
];

export default function AboutPage() {
  const { isBn } = useLang();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="About RedLink"
            tagBn="রেডলিংক সম্পর্কে"
            title="Connecting Bangladesh, One Home at a Time"
            titleBn="একটি একটি করে ঘর সংযুক্ত করছি"
            subtitle="Founded in 2018, RedLink Ltd has grown to become one of Bangladesh's most trusted Internet Service Providers, delivering fiber-fast connectivity with a commitment to reliability and customer service."
            subtitleBn="২০১৮ সালে প্রতিষ্ঠিত রেডলিংক লিমিটেড বাংলাদেশের অন্যতম বিশ্বস্ত ইন্টারনেট সেবা প্রদানকারী।"
            isBn={isBn}
          />
        </FadeUp>

        {/* Mission Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            { icon: Wifi, title: 'Our Mission', titleBn: 'আমাদের লক্ষ্য', desc: 'Deliver fast, affordable, reliable internet to every home and business in Bangladesh.', descBn: 'বাংলাদেশের প্রতিটি ঘরে দ্রুত, সাশ্রয়ী, নির্ভরযোগ্য ইন্টারনেট পৌঁছে দেওয়া।' },
            { icon: Users, title: 'Customer First', titleBn: 'গ্রাহক প্রথম', desc: 'Every decision we make is driven by what\'s best for our customers.', descBn: 'প্রতিটি সিদ্ধান্ত গ্রাহকের সর্বোত্তম স্বার্থে।' },
            { icon: Award, title: 'Quality Network', titleBn: 'মানসম্পন্ন নেটওয়ার্ক', desc: 'Enterprise-grade infrastructure ensuring 99.9% uptime for all subscribers.', descBn: 'সব গ্রাহকের জন্য ৯৯.৯% আপটাইম নিশ্চিত।' },
            { icon: Globe, title: 'Community', titleBn: 'সম্প্রদায়', desc: 'We invest in local communities and digital inclusion across Bangladesh.', descBn: 'স্থানীয় সম্প্রদায়ে বিনিয়োগ এবং ডিজিটাল অন্তর্ভুক্তি।' },
          ].map((v, i) => (
            <FadeUp key={v.title} delay={i * 0.1}>
              <GlassCard className="p-6 text-center h-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-red-400" />
                </div>
                <h3 className={`text-white font-bold mb-2 ${isBn ? 'font-bangla' : ''}`}>{isBn ? v.titleBn : v.title}</h3>
                <p className={`text-[#B8B8C0] text-sm leading-relaxed ${isBn ? 'font-bangla' : ''}`}>{isBn ? v.descBn : v.desc}</p>
              </GlassCard>
            </FadeUp>
          ))}
        </div>

        {/* Timeline */}
        <FadeUp>
          <div className="mb-16">
            <h2 className={`text-3xl font-bold text-white text-center mb-10 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'আমাদের যাত্রা' : 'Our Journey'}
            </h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/50 to-transparent" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-10 md:pl-0`}>
                      <div className="glass-card-static p-4 inline-block rounded-2xl">
                        <div className="gradient-text font-black text-lg font-poppins">{item.year}</div>
                        <div className={`text-[#B8B8C0] text-sm mt-1 ${isBn ? 'font-bangla' : ''}`}>{isBn ? item.eventBn : item.event}</div>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-red-500 border-2 border-red-300 shadow-red-glow mt-4" />
                    <div className="md:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Team */}
        <FadeUp>
          <div>
            <h2 className={`text-3xl font-bold text-white text-center mb-8 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'আমাদের দল' : 'Leadership Team'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <FadeUp key={member.name} delay={i * 0.1}>
                  <GlassCard className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-red-glow">
                      {member.initials}
                    </div>
                    <div className={`text-white font-bold mb-1 ${isBn ? 'font-bangla' : ''}`}>{isBn ? member.nameBn : member.name}</div>
                    <div className={`text-red-400 text-sm ${isBn ? 'font-bangla' : ''}`}>{isBn ? member.roleBn : member.role}</div>
                  </GlassCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
