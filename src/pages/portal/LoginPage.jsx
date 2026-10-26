// ── Customer Portal — Login Page ───────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Smartphone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, FadeUp } from '../../components/ui/index';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';
import { apiLogin, apiRequestOTP, apiVerifyOTP } from '../../services/api';

export default function LoginPage() {
  const { isBn } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [step, setStep] = useState(1); // OTP: step 1 = enter mobile, step 2 = enter OTP
  const [form, setForm] = useState({ customerId: '', password: '', mobile: '', otp: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!form.customerId.trim()) { setErrors({ customerId: 'Required' }); return; }
    if (!form.password) { setErrors({ password: 'Required' }); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await apiLogin(form.customerId.trim().toUpperCase(), form.password);
      login({ customerId: data.customerId, token: data.token });
      toast.success('Login successful!', { icon: '👋' });
      navigate('/portal');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSend = async (e) => {
    e.preventDefault();
    if (!form.mobile.match(/^01[3-9]\d{8}$/)) { setErrors({ mobile: 'Valid BD mobile required' }); return; }
    setErrors({});
    setLoading(true);
    try {
      await apiRequestOTP(form.mobile);
      toast.success('OTP sent! Use 1234 for demo.');
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    if (form.otp.length < 4) { setErrors({ otp: 'Enter 4-digit OTP' }); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await apiVerifyOTP(form.mobile, form.otp);
      login({ customerId: 'RL-001234', token: data.token });
      toast.success('Login successful!', { icon: '👋' });
      navigate('/portal');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <FadeUp>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-900 flex items-center justify-center mx-auto mb-4 shadow-red-glow">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold text-white mb-2 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'কাস্টমার পোর্টাল' : 'Customer Portal'}
            </h1>
            <p className={`text-[#B8B8C0] text-sm ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Sign in to your RedLink account'}
            </p>
          </div>

          <GlassCard className="p-7">
            {/* Mode Switcher */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
              {[
                { id: 'password', label: 'Password', labelBn: 'পাসওয়ার্ড' },
                { id: 'otp', label: 'OTP Login', labelBn: 'OTP লগইন' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setStep(1); setErrors({}); }}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${mode === m.id ? 'tab-active' : 'tab-inactive'}`}
                >
                  {isBn ? m.labelBn : m.label}
                </button>
              ))}
            </div>

            {/* Password Form */}
            {mode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <FormInput
                  label={isBn ? 'কাস্টমার আইডি' : 'Customer ID'}
                  placeholder="RL-001234"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  error={errors.customerId}
                />
                <div className="relative">
                  <FormInput
                    label={isBn ? 'পাসওয়ার্ড' : 'Password'}
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-9 text-[#6B6B78] hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button type="button" className="text-red-400 text-sm hover:text-red-300">
                    {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                </div>
                <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
                  {isBn ? 'লগইন করুন' : 'Sign In'}
                </GlassButton>
                <p className="text-[#6B6B78] text-xs text-center">
                  Demo: Customer ID = <strong className="text-white">RL-001234</strong>, Password = <strong className="text-white">1234</strong>
                </p>
              </form>
            )}

            {/* OTP Form */}
            {mode === 'otp' && step === 1 && (
              <form onSubmit={handleOTPSend} className="space-y-4">
                <FormInput
                  label={isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  placeholder="01XXXXXXXXX"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  error={errors.mobile}
                />
                <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
                  <Smartphone size={16} /> {isBn ? 'OTP পাঠান' : 'Send OTP'}
                </GlassButton>
              </form>
            )}

            {mode === 'otp' && step === 2 && (
              <form onSubmit={handleOTPVerify} className="space-y-4">
                <p className="text-[#B8B8C0] text-sm text-center">{isBn ? 'OTP পাঠানো হয়েছে' : 'OTP sent to'} <strong className="text-white">{form.mobile}</strong></p>
                <FormInput
                  label="OTP"
                  placeholder="Enter 4-digit OTP (demo: 1234)"
                  maxLength={6}
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value })}
                  error={errors.otp}
                />
                <GlassButton type="submit" variant="primary" loading={loading} className="w-full justify-center py-3.5">
                  {isBn ? 'যাচাই করুন' : 'Verify OTP'}
                </GlassButton>
                <button type="button" onClick={() => setStep(1)} className="text-red-400 text-sm w-full text-center hover:text-red-300">
                  {isBn ? 'পুনরায় পাঠান' : 'Resend OTP'}
                </button>
              </form>
            )}
          </GlassCard>

          <p className={`text-center text-[#6B6B78] text-sm mt-6 ${isBn ? 'font-bangla' : ''}`}>
            {isBn ? 'নতুন সংযোগের জন্য' : 'New connection?'}{' '}
            <Link to="/packages" className="text-red-400 hover:text-red-300">
              {isBn ? 'প্যাকেজ দেখুন' : 'View Packages'}
            </Link>
          </p>
        </FadeUp>
      </div>
    </div>
  );
}
