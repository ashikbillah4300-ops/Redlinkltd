// ── Customer Portal — Dual-Method Login Page (Customer ID & Gmail/Email) ────────
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Lock, Mail, Hash, ShieldCheck, ArrowRight,
  Smartphone, UserCheck, Sparkles, CheckCircle2, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { GlassCard, GlassButton, FormInput, FadeUp } from '../../components/ui/index';
import { useLang } from '../../context/LangContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { isBn } = useLang();
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  // Mode: 'id' (Customer ID Login) | 'email' (Gmail / Email Login) | 'otp' (SMS OTP)
  const [loginMethod, setLoginMethod] = useState('id');

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(1);

  // Quick Demo credentials auto-fill
  const demoAccounts = [
    {
      name: 'Mohammad Karim',
      nameBn: 'মোহাম্মদ করিম',
      id: 'RL-001234',
      email: 'karim@gmail.com',
      pkg: '50 Mbps',
      due: 900
    },
    {
      name: 'Fatema Begum',
      nameBn: 'ফাতেমা বেগম',
      id: 'RL-005678',
      email: 'fatema@gmail.com',
      pkg: '20 Mbps',
      due: 500
    },
    {
      name: 'Tanvir Ahmed',
      nameBn: 'তানভীর আহমেদ',
      id: 'RL-007890',
      email: 'tanvir@gmail.com',
      pkg: '100 Mbps',
      due: 0
    }
  ];

  const handleFillDemo = (demo) => {
    if (loginMethod === 'email') {
      setEmail(demo.email);
    } else {
      setCustomerId(demo.id);
    }
    setPassword('1234');
    setErrors({});
    toast.success(`Filled credentials for ${demo.name}! (PIN: 1234)`, { icon: '🔑' });
  };

  // Submit Handler for Customer ID & Gmail Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (loginMethod === 'id') {
      if (!customerId.trim()) newErrors.customerId = isBn ? 'কাস্টমার আইডি আবশ্যক' : 'Customer ID is required';
    } else if (loginMethod === 'email') {
      if (!email.trim()) newErrors.email = isBn ? 'জিমেইল বা ইমেইল আবশ্যক' : 'Gmail / Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = isBn ? 'সঠিক ইমেইল ফরম্যাট দিন' : 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = isBn ? 'পাসওয়ার্ড বা পিন আবশ্যক' : 'Password or PIN is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const identifier = loginMethod === 'id' ? customerId.trim().toUpperCase() : email.trim().toLowerCase();
      const authenticatedUser = await loginWithCredentials({
        identifier,
        password,
        method: loginMethod
      });

      toast.success(
        isBn
          ? `স্বাগতম, ${authenticatedUser.nameBn || authenticatedUser.name}! লগইন সফল হয়েছে।`
          : `Welcome back, ${authenticatedUser.name}! Access granted.`,
        { icon: '🚀' }
      );
      navigate('/portal');
    } catch (err) {
      toast.error(err.message || 'Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // OTP handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobile.match(/^01[3-9]\d{8}$/)) {
      setErrors({ mobile: 'Valid 11-digit BD mobile required' });
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(2);
      toast.success('Demo OTP sent: 1234');
    }, 600);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== '1234') {
      setErrors({ otp: 'Invalid OTP. Enter 1234' });
      return;
    }
    setLoading(true);
    try {
      const authenticatedUser = await loginWithCredentials({
        identifier: 'RL-001234',
        password: '1234',
        method: 'id'
      });
      toast.success(`Logged in via OTP! Welcome ${authenticatedUser.name}`);
      navigate('/portal');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <FadeUp>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block relative">
              <img
                src="/logo.png"
                alt="RedLink Technologies"
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-red-glow border border-white/20 p-0.5"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'গ্রাহক সেলফ-কেয়ার পোর্টাল' : 'RedLink Customer Portal'}
            </h1>
            <p className={`text-[#B8B8C0] text-sm mt-1.5 max-w-sm mx-auto ${isBn ? 'font-bangla' : ''}`}>
              {isBn
                ? 'আপনার কাস্টমার আইডি অথবা জিমেইল দিয়ে অ্যাকাউন্টে লগইন করুন'
                : 'Sign in using your Customer ID or registered Gmail address'}
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative backdrop-blur-xl">
            {/* Dual Login Method Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 mb-6 gap-1">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('id');
                  setErrors({});
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMethod === 'id'
                    ? 'bg-gradient-to-r from-red-600 to-[#B30F1F] text-white shadow-red-glow'
                    : 'text-[#B8B8C0] hover:text-white hover:bg-white/5'
                }`}
              >
                <Hash size={16} />
                <span>{isBn ? 'কাস্টমার আইডি' : 'Customer ID'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setErrors({});
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginMethod === 'email'
                    ? 'bg-gradient-to-r from-red-600 to-[#B30F1F] text-white shadow-red-glow'
                    : 'text-[#B8B8C0] hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail size={16} />
                <span>{isBn ? 'জিমেইল / ইমেইল' : 'Gmail / Email'}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <AnimatePresence mode="wait">
                {loginMethod === 'id' ? (
                  <motion.div
                    key="customer-id-input"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1"
                  >
                    <label className="text-xs font-semibold text-[#B8B8C0] block flex items-center justify-between">
                      <span>{isBn ? 'কাস্টমার আইডি' : 'Customer ID'}</span>
                      <span className="text-[10px] text-red-400 font-mono">Format: RL-XXXXXX</span>
                    </label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                      <input
                        type="text"
                        placeholder="e.g. RL-001234"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                        className="glass-input pl-10 text-sm font-mono tracking-wider font-semibold uppercase"
                      />
                    </div>
                    {errors.customerId && (
                      <p className="text-red-400 text-xs mt-1">{errors.customerId}</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="gmail-input"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1"
                  >
                    <label className="text-xs font-semibold text-[#B8B8C0] block flex items-center justify-between">
                      <span>{isBn ? 'জিমেইল বা ইমেইল ঠিকানা' : 'Gmail / Email Address'}</span>
                      <span className="text-[10px] text-red-400 font-mono">Any registered email</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                      <input
                        type="email"
                        placeholder="e.g. karim@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input pl-10 text-sm"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password / PIN Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#B8B8C0]">
                    {isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'}
                  </label>
                  <span className="text-[10px] text-[#B8B8C0]">Demo PIN: <strong className="text-white">1234</strong></span>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B8C0]" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password or PIN"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B78] hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Login CTA */}
              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center py-3.5 text-sm font-bold shadow-red-glow cursor-pointer mt-2"
              >
                <span>
                  {loginMethod === 'id'
                    ? (isBn ? 'কাস্টমার আইডি দিয়ে লগইন করুন' : 'Sign In with Customer ID')
                    : (isBn ? 'জিমেইল দিয়ে লগইন করুন' : 'Sign In with Gmail / Email')}
                </span>
                <ArrowRight size={16} />
              </GlassButton>
            </form>

            {/* Quick Demo Credentials Helper */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={13} className="text-red-400" />
                  {isBn ? 'টেস্ট করার জন্য ক্লিক করুন' : 'Quick Demo Accounts'}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Default PIN: 1234</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleFillDemo(acc)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-red-400 truncate">
                      {isBn ? acc.nameBn : acc.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#B8B8C0] truncate">
                      {loginMethod === 'email' ? acc.email : acc.id}
                    </div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">
                      {acc.pkg} • ৳{acc.due > 0 ? `${acc.due} due` : 'Paid'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Admin Note Badge */}
              <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/20 flex items-start gap-2.5 text-left">
                <HelpCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#B8B8C0] leading-relaxed">
                  <strong className="text-white">Admin-Managed Users:</strong> All customer accounts and Customer IDs are created from the{' '}
                  <Link to="/admin/login" className="text-red-400 hover:underline font-semibold">
                    Admin Panel
                  </Link>
                  . Any newly generated user can log in here instantly with either their ID or Gmail!
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Footer Assistance */}
          <div className="text-center mt-6 text-xs text-[#B8B8C0] space-y-2">
            <p>
              {isBn ? 'নতুন ফাইবার সংযোগ নিতে চান?' : 'Need a new fiber broadband connection?'}{' '}
              <Link to="/packages" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-4">
                {isBn ? 'হোম প্যাকেজসমূহ দেখুন' : 'Explore Home Packages'}
              </Link>
            </p>
            <p className="text-[11px] text-[#6B6B78]">
              Need billing assistance? Call our 24/7 Hotline: <strong className="text-white">16500</strong>
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
