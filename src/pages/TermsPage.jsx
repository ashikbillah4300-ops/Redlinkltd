// ── Terms Page ────────────────────────────────────────────────────────────────
import { SectionHeading, GlassCard, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By subscribing to RedLink Technologies services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: '2. Service Description',
    content: 'RedLink Technologies provides broadband internet access, including but not limited to fiber optic broadband, wireless broadband, and associated network services to residential and commercial customers across Bangladesh.',
  },
  {
    title: '3. Billing & Payment',
    content: 'Monthly charges are due by the 5th of each month. Late payments may result in service suspension. We accept bKash, Nagad, Rocket, credit/debit cards, and bank transfers. All prices are in Bangladeshi Taka (৳) and inclusive of applicable taxes.',
  },
  {
    title: '4. Fair Use Policy',
    content: 'While our packages offer unlimited data, we operate a fair use policy to ensure network quality for all users. During peak hours, traffic management may apply to users consuming excessive bandwidth that impacts other customers.',
  },
  {
    title: '5. Service Availability',
    content: 'We strive for 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance, force majeure events, or circumstances beyond our control may temporarily affect service availability. We will provide advance notice for planned outages.',
  },
  {
    title: '6. Customer Responsibilities',
    content: 'You are responsible for maintaining the security of your account credentials. You must not use our services for illegal activities, spamming, or network attacks. You are responsible for all equipment provided on a rental basis.',
  },
  {
    title: '7. Termination',
    content: 'Either party may terminate the service agreement with 30 days written notice. RedLink Technologies reserves the right to terminate service immediately for breach of these terms, non-payment, or illegal use.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'RedLink Technologies\' liability is limited to the monthly subscription fee paid. We are not liable for indirect, consequential, or special damages arising from service interruptions or data loss.',
  },
];

export default function TermsPage() {
  const { isBn } = useLang();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Legal"
            title="Terms of Service"
            titleBn="সেবার শর্তাবলী"
            subtitle="Last updated: October 2025. Please read these terms carefully before using our services."
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
              Questions about our terms? Contact us at{' '}
              <a href="mailto:legal@redlinkltd.com" className="text-red-400 hover:text-red-300">legal@redlinkltd.com</a>
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
