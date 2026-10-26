// ── Master Admin Portal — Login Page ──────────────────────────────────────────
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard, GlassButton, FormInput, FadeUp } from '../../components/ui/index';

export default function AdminLoginPage() {
  const { adminLogin, isAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@redlink.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect directly
  if (isAdminLoggedIn) {
    navigate('/admin');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = adminLogin(email, password);
      setLoading(false);
      if (success) {
        navigate('/admin');
      }
    }, 500);
  };

  const handleQuickDemo = () => {
    setEmail('admin@redlink.com');
    setPassword('admin123');
    setLoading(true);
    setTimeout(() => {
      adminLogin('admin@redlink.com', 'admin123');
      setLoading(false);
      navigate('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 relative">
      <div className="w-full max-w-md relative z-10">
        <FadeUp>
          <div className="text-center mb-8">
            <div className="relative inline-block mb-3">
              <img 
                src="/logo.png" 
                alt="RedLink Logo" 
                className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-red-glow border border-white/20" 
              />
              <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-md">
                ADMIN
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
              Master Admin Panel
            </h1>
            <p className="text-sm text-[#B8B8C0] mt-1">
              Live Website CMS & ISP Network Operations Control
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Admin Username / Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@redlink.com"
                required
              />

              <FormInput
                label="Master Security Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="pt-2">
                <GlassButton
                  type="submit"
                  loading={loading}
                  className="w-full justify-center py-3 text-base shadow-red-glow font-semibold cursor-pointer"
                >
                  <KeyRound size={18} className="mr-2" />
                  Sign In to Admin Console
                </GlassButton>
              </div>
            </form>

            <div className="mt-5 pt-5 border-t border-white/10">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles size={14} />
                1-Click Quick Demo Admin Access
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-xs text-[#B8B8C0] hover:text-white transition-colors flex items-center justify-center gap-1">
                ← Back to Public Website
              </Link>
            </div>
          </GlassCard>
        </FadeUp>
      </div>
    </div>
  );
}
