// ── Pay Bill Page ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CreditCard, CheckCircle, XCircle, Download, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, SectionHeading, FadeUp } from '../components/ui/index';
import { useLang } from '../context/LangContext';
import { apiFetchBill, apiPayBill } from '../services/api';

// ── Payment methods ────────────────────────────────────────────────────────────
const paymentMethods = [
  {
    id: 'bkash', label: 'bKash', color: '#E2136E', emoji: '💳',
    steps: [
      'Go to bKash app → "Pay Bill" or "Send Money"',
      'Enter merchant number: 01700-000000',
      'Enter your Customer ID as reference',
      'Enter the amount and your bKash PIN',
      'You will receive a confirmation SMS',
    ],
    stepsBn: [
      'bKash অ্যাপ খুলুন → "বিল পরিশোধ" বা "পে"',
      'মার্চেন্ট নম্বর দিন: ০১৭০০-০০০০০০',
      'রেফারেন্সে আপনার কাস্টমার আইডি দিন',
      'পরিমাণ ও bKash পিন দিন',
      'নিশ্চিতকরণ এসএমএস পাবেন',
    ],
  },
  {
    id: 'nagad', label: 'Nagad', color: '#F97316', emoji: '💰',
    steps: [
      'Open Nagad app → "Payment"',
      'Enter merchant number: 01700-000000',
      'Add Customer ID as reference',
      'Confirm amount and PIN',
      'Save the transaction ID',
    ],
    stepsBn: [
      'Nagad অ্যাপ খুলুন → "পেমেন্ট"',
      'মার্চেন্ট নম্বর: ০১৭০০-০০০০০০',
      'রেফারেন্সে কাস্টমার আইডি দিন',
      'পরিমাণ ও পিন নিশ্চিত করুন',
      'লেনদেন আইডি সংরক্ষণ করুন',
    ],
  },
  {
    id: 'card', label: 'Card (Visa/MC)', color: '#1D4ED8', emoji: '🏦',
    steps: [
      'Click "Pay Now" button below',
      'You\'ll be redirected to our secure payment gateway (SSLCommerz)',
      'Enter your card details',
      'Complete 3D Secure verification',
      'Download your receipt',
    ],
    stepsBn: [
      '"এখন পরিশোধ করুন" বাটনে ক্লিক করুন',
      'নিরাপদ পেমেন্ট গেটওয়েতে যাবেন',
      'কার্ডের তথ্য দিন',
      '3D সিকিউর যাচাই করুন',
      'রিসিট ডাউনলোড করুন',
    ],
  },
  {
    id: 'bank', label: 'Bank Transfer', color: '#059669', emoji: '🏛️',
    steps: [
      'Bank: Dutch-Bangla Bank Limited (DBBL)',
      'Account Name: RedLink Ltd',
      'Account No: 1234567890',
      'Routing: 090270497',
      'Use your Customer ID as the reference/narration',
      'Email proof of payment to billing@redlinkltd.com',
    ],
    stepsBn: [
      'ব্যাংক: ডাচ-বাংলা ব্যাংক লিমিটেড',
      'অ্যাকাউন্ট: রেডলিংক লিমিটেড',
      'অ্যাকাউন্ট নং: ১২৩৪৫৬৭৮৯০',
      'রেফারেন্সে কাস্টমার আইডি দিন',
      'পেমেন্ট প্রমাণ ইমেইল করুন',
    ],
  },
];

// ── Accordion Steps ────────────────────────────────────────────────────────────
function MethodAccordion({ method, isBn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card-static overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{method.emoji}</span>
          <span className="text-white font-semibold">{method.label}</span>
        </div>
        <ChevronDown size={16} className={`text-red-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <ol className="px-4 pb-4 space-y-2 ml-4">
          {(isBn ? method.stepsBn : method.steps).map((step, i) => (
            <li key={i} className={`text-[#B8B8C0] text-sm flex gap-2 ${isBn ? 'font-bangla' : ''}`}>
              <span className="text-red-400 font-bold flex-shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Receipt Component ──────────────────────────────────────────────────────────
function Receipt({ txn, bill }) {
  const handleDownload = () => {
    const content = `
REDLINK LTD - PAYMENT RECEIPT
==============================
Transaction ID: ${txn.transactionId}
Date: ${new Date(txn.timestamp).toLocaleString('en-BD')}
Customer ID: ${bill.customerId}
Customer Name: ${bill.name}
Package: ${bill.package}
Amount Paid: ৳${txn.amount}
Payment Method: ${txn.method}
Status: SUCCESS
==============================
Thank you for your payment!
For support: 16500 | support@redlinkltd.com
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RedLink_Receipt_${txn.transactionId}.txt`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center"
      style={{ borderColor: 'rgba(34,197,94,0.35)', boxShadow: '0 8px 32px rgba(34,197,94,0.15)' }}
    >
      <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
      <p className="text-[#B8B8C0] mb-6">Your bill has been paid successfully.</p>
      <div className="glass-card-static rounded-2xl p-5 text-left space-y-3 mb-6">
        {[
          ['Transaction ID', txn.transactionId],
          ['Amount', `৳${txn.amount}`],
          ['Method', txn.method],
          ['Customer', bill.name],
          ['Date', new Date(txn.timestamp).toLocaleString('en-BD')],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center">
            <span className="text-[#B8B8C0] text-sm">{k}</span>
            <span className="text-white font-semibold text-sm">{v}</span>
          </div>
        ))}
      </div>
      <GlassButton variant="outline" onClick={handleDownload} className="w-full justify-center">
        <Download size={16} /> Download Receipt
      </GlassButton>
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function PayBillPage() {
  const { isBn } = useLang();
  const [customerId, setCustomerId] = useState('');
  const [bill, setBill] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bkash');
  const [payLoading, setPayLoading] = useState(false);
  const [txn, setTxn] = useState(null);
  const [error, setError] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!customerId.trim()) { setError('Please enter a Customer ID. Try RL-001234'); return; }
    setError('');
    setFetchLoading(true);
    try {
      const data = await apiFetchBill(customerId.trim().toUpperCase());
      setBill(data);
      setTxn(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handlePay = async () => {
    setPayLoading(true);
    try {
      const result = await apiPayBill(bill.customerId, selectedMethod, bill.amount);
      setTxn(result);
      toast.success('Payment successful!', { icon: '✅' });
    } catch (err) {
      toast.error(err.message, { icon: '❌' });
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <SectionHeading
            tag="Quick Pay"
            tagBn="দ্রুত পেমেন্ট"
            title="Pay Your Bill Online"
            titleBn="অনলাইনে বিল পরিশোধ করুন"
            subtitle="Enter your Customer ID to view and pay your due bill instantly."
            subtitleBn="আপনার কাস্টমার আইডি দিন এবং বিল পরিশোধ করুন।"
            isBn={isBn}
          />
        </FadeUp>

        {/* Step 1: Fetch Bill */}
        <FadeUp delay={0.1}>
          <GlassCard className="p-6 mb-6">
            <h3 className={`text-white font-bold text-lg mb-4 flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
              <span className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-sm font-bold">1</span>
              {isBn ? 'কাস্টমার আইডি দিন' : 'Enter Customer ID'}
            </h3>
            <form onSubmit={handleFetch} className="flex gap-3">
              <input
                className="glass-input flex-1"
                placeholder={isBn ? 'কাস্টমার আইডি (যেমন RL-001234)' : 'Customer ID (e.g. RL-001234)'}
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                aria-label="Customer ID"
              />
              <GlassButton type="submit" variant="primary" loading={fetchLoading}>
                <Search size={16} /> {isBn ? 'খুঁজুন' : 'Find'}
              </GlassButton>
            </form>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <p className="text-[#6B6B78] text-xs mt-2">{isBn ? 'ডেমো: RL-001234' : 'Demo: try RL-001234'}</p>
          </GlassCard>
        </FadeUp>

        <AnimatePresence>
          {bill && !txn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Step 2: Bill Summary */}
              <GlassCard className="p-6">
                <h3 className={`text-white font-bold text-lg mb-5 flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
                  <span className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-sm font-bold">2</span>
                  {isBn ? 'বিলের বিবরণ' : 'Bill Summary'}
                </h3>
                <div className="space-y-3">
                  {[
                    [isBn ? 'কাস্টমার আইডি' : 'Customer ID', bill.customerId],
                    [isBn ? 'নাম' : 'Name', bill.name],
                    [isBn ? 'প্যাকেজ' : 'Package', bill.package],
                    [isBn ? 'বকেয়া তারিখ' : 'Due Date', bill.dueDate],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-white/5">
                      <span className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>{k}</span>
                      <span className="text-white font-medium text-sm">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3">
                    <span className={`text-white font-bold text-lg ${isBn ? 'font-bangla' : ''}`}>{isBn ? 'মোট দেয়' : 'Total Due'}</span>
                    <span className="text-3xl font-black gradient-text font-poppins">৳{bill.amount}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Step 3: Payment Method */}
              <GlassCard className="p-6">
                <h3 className={`text-white font-bold text-lg mb-5 flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
                  <span className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-sm font-bold">3</span>
                  {isBn ? 'পেমেন্ট পদ্ধতি নির্বাচন করুন' : 'Choose Payment Method'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`payment-tile flex flex-col items-center gap-2 ${selectedMethod === m.id ? 'selected' : ''}`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-white text-xs font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* How-to Instructions */}
                <div className="space-y-2 mb-5">
                  {paymentMethods.map((m) => selectedMethod === m.id && (
                    <MethodAccordion key={m.id} method={m} isBn={isBn} />
                  ))}
                </div>

                <GlassButton
                  variant="primary"
                  onClick={handlePay}
                  loading={payLoading}
                  className="w-full justify-center py-3.5 text-base"
                >
                  <CreditCard size={18} />
                  {isBn ? `৳${bill.amount} পরিশোধ করুন` : `Pay ৳${bill.amount} Now`}
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {txn && (
            <motion.div key="receipt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Receipt txn={txn} bill={bill} />
              <button
                onClick={() => { setBill(null); setTxn(null); setCustomerId(''); }}
                className="btn-outline w-full justify-center mt-4"
              >
                {isBn ? 'নতুন পেমেন্ট করুন' : 'Make Another Payment'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
