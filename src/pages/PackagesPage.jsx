// ── Packages Page ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Tabs, SectionHeading, GlassCard, FadeUp } from '../components/ui/index';
import PackageCard from '../components/PackageCard';
import OttEntertainment from '../components/OttEntertainment';
import { useLang } from '../context/LangContext';
import { useAdmin } from '../context/AdminContext';
import { homePackages, corporatePackages } from '../data/constants';

// Comparison table columns
const homeFeatures = [
  { key: 'speed', label: 'Speed', values: ['20 Mbps', '50 Mbps', '100 Mbps'] },
  { key: 'price', label: 'Monthly Price', values: ['৳500', '৳900', '৳1,500'] },
  { key: 'data', label: 'Data Limit', values: ['Unlimited', 'Unlimited', 'Unlimited'] },
  { key: 'bdix', label: 'BDIX / FTP', values: [true, true, true] },
  { key: 'router', label: 'Free Router', values: [true, true, true] },
  { key: 'routerType', label: 'Router Type', values: ['Basic', 'Dual-Band', 'Wi-Fi 6'] },
  { key: 'support', label: 'Support', values: ['Email', '24/7 Phone', '24/7 Priority'] },
  { key: 'staticIp', label: 'Static IP', values: [false, false, true] },
  { key: 'sla', label: 'SLA Uptime', values: ['—', '99.5%', '99.9%'] },
];

function ComparisonTable({ packages, features, isBn }) {
  return (
    <div className="overflow-x-auto rounded-2xl glass-card-static">
      <table className="comparison-table min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left w-40">
              <span className={isBn ? 'font-bangla' : ''}>{isBn ? 'বৈশিষ্ট্য' : 'Feature'}</span>
            </th>
            {packages.map((pkg) => (
              <th key={pkg.id} className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-white font-bold ${isBn ? 'font-bangla' : ''}`}>{isBn ? pkg.nameBn : pkg.name}</span>
                  {pkg.popular && <span className="popular-badge text-xs">Popular</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feat) => (
            <tr key={feat.key}>
              <td className={`text-[#B8B8C0] font-medium ${isBn ? 'font-bangla' : ''}`}>{feat.label}</td>
              {feat.values.map((val, i) => (
                <td key={i} className="text-center">
                  {typeof val === 'boolean' ? (
                    val
                      ? <Check size={16} className="text-green-400 mx-auto" />
                      : <X size={16} className="text-red-500/60 mx-auto" />
                  ) : (
                    <span className="text-white text-sm">{val}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState('home');
  const { isBn } = useLang();
  const { packages: liveHomePackages } = useAdmin();

  const packages = activeTab === 'home' ? (liveHomePackages && liveHomePackages.length > 0 ? liveHomePackages : homePackages) : corporatePackages;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeUp>
          <SectionHeading
            tag="Internet Packages"
            tagBn="ইন্টারনেট প্যাকেজ"
            title="Simple, Transparent Pricing"
            titleBn="সহজ, স্বচ্ছ মূল্য নির্ধারণ"
            subtitle="No contracts. No hidden fees. Just blazing-fast internet."
            subtitleBn="কোনো চুক্তি নেই। কোনো লুকানো ফি নেই। শুধু দ্রুত ইন্টারনেট।"
            isBn={isBn}
          />
        </FadeUp>

        {/* Tabs */}
        <FadeUp delay={0.1}>
          <div className="flex justify-center mb-10">
            <Tabs
              tabs={[
                { id: 'home', label: isBn ? 'হোম প্যাকেজ' : 'Home Package' },
                { id: 'corporate', label: isBn ? 'রিসেলার' : 'Reseller' },
              ]}
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </FadeUp>

        {/* Package Cards */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {packages.map((pkg, i) => (
            <FadeUp key={pkg.id} delay={i * 0.1}>
              <PackageCard pkg={pkg} isBn={isBn} />
            </FadeUp>
          ))}
        </motion.div>

        {/* Comparison Table */}
        {activeTab === 'home' && (
          <FadeUp>
            <div className="mb-8">
              <h3 className={`text-2xl font-bold text-white text-center mb-6 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'প্যাকেজ তুলনা' : 'Package Comparison'}
              </h3>
              <ComparisonTable packages={homePackages} features={homeFeatures} isBn={isBn} />
            </div>
          </FadeUp>
        )}

        {/* Reseller Info Box */}
        {activeTab === 'corporate' && (
          <FadeUp>
            <GlassCard className="p-8 text-center mt-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className={`text-2xl font-bold text-white mb-3 ${isBn ? 'font-bangla' : ''}`}>
                {isBn ? 'রিসেলার পার্টনারশিপ বা কাস্টম সমাধান দরকার?' : 'Need Reseller Bandwidth or Custom Solution?'}
              </h3>
              <p className={`text-[#B8B8C0] max-w-md mx-auto mb-6 ${isBn ? 'font-bangla' : ''}`}>
                {isBn
                  ? 'আমাদের সাথে রিসেলার পার্টনার হিসেবে যুক্ত হতে বা পাইকারি ব্যান্ডউইথ নিতে সরাসরি যোগাযোগ করুন।'
                  : 'Partner with us as an ISP reseller or get wholesale dedicated bandwidth tailored to your business.'}
              </p>
              <a href="tel:+8801700000000" className="btn-primary">
                📞 {isBn ? 'আমাদের কল করুন' : 'Call Us Now'}
              </a>
            </GlassCard>
          </FadeUp>
        )}

        {/* OTT & Value Added Section */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <OttEntertainment />
        </div>
      </div>
    </div>
  );
}
