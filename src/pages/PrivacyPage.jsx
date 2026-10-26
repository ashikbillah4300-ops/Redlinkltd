// ── Privacy Policy Page ───────────────────────────────────────────────────────
import { SectionHeading, GlassCard, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide when subscribing to our services, including: full name, contact number, email address, physical address, payment information, and Customer ID. We also collect technical data such as IP addresses, connection logs, and usage statistics.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your information is used to: provide and improve our services, process payments and issue receipts, send service notifications and billing reminders, respond to customer support queries, comply with legal obligations, and analyze network performance.',
  },
  {
    title: '3. Data Security',
    content: 'We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. Payment transactions are processed through secure payment gateways (SSLCommerz, bKash, Nagad) and are PCI-DSS compliant.',
  },
  {
    title: '4. Data Sharing',
    content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with: payment processors to complete transactions, regulatory authorities when required by law, and service providers who assist in our operations under confidentiality agreements.',
  },
  {
    title: '5. Cookies',
    content: 'Our website uses cookies to improve your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser. Disabling cookies may affect some website functionality.',
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to: access your personal data, request correction of inaccurate information, request deletion of your data (subject to legal obligations), opt out of marketing communications, and lodge a complaint with relevant authorities.',
  },
  {
    title: '7. Data Retention',
    content: 'We retain your personal data for the duration of your service subscription and for up to 7 years thereafter as required by Bangladesh financial regulations.',
  },
  {
    title: '8. Contact',
    content: 'For privacy-related inquiries, contact our Data Protection Officer at privacy@redlinkltd.com or by post at House 45, Road 12, Dhanmondi, Dhaka-1209.',
  },
];

export default function PrivacyPage() {
  const { isBn } = useLang();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Legal"
            title="Privacy Policy"
            titleBn="গোপনীয়তা নীতি"
            subtitle="Last updated: October 2025. We are committed to protecting your privacy and personal information."
            isBn={isBn}
          />
        </FadeUp>

        <FadeUp delay={0.1}>
          <GlassCard className="p-8 space-y-8" hover={false}>
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-bold text-lg mb-2">{section.title}</h3>
                <p className="text-[#B8B8C0] text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </GlassCard>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-6 text-center">
            <p className="text-[#6B6B78] text-sm">
              Privacy inquiries: {' '}
              <a href="mailto:privacy@redlinkltd.com" className="text-red-400 hover:text-red-300">privacy@redlinkltd.com</a>
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
