// ── Admin Login Page (Exact 2nd Screenshot Match) ─────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLoginPage() {
  const { adminLogin, isAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect directly to admin
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = adminLogin(username, password);
      setLoading(false);
      if (success) {
        navigate('/admin');
      }
    }, 400);
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #174ea6 0%, #0d3880 40%, #082154 100%)'
      }}
    >
      <div className="w-full max-w-[430px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 animate-fadeIn">
        {/* ── Top Header Section (Dark Navy) ── */}
        <div className="bg-[#092244] pt-8 pb-7 px-6 text-center text-white border-b border-white/10">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield size={24} className="text-blue-300" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white font-poppins">
            Admin Panel
          </h2>
          <p className="text-sm font-semibold text-blue-200 mt-1">
            RedLink Ltd
          </p>
          <p className="text-xs text-blue-300/80 mt-1 font-normal tracking-wide">
            Secure Administration Access
          </p>
        </div>

        {/* ── Lower Form Section (Crisp White Container) ── */}
        <div className="bg-white p-6 sm:p-8 text-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username or Email
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 flex items-center bg-white transition-all">
                <div className="pl-3.5 text-slate-400 flex items-center pointer-events-none">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-2.5 pr-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 flex items-center bg-white transition-all">
                <div className="pl-3.5 text-slate-400 flex items-center pointer-events-none">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-2.5 pr-10 py-3 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#092244] hover:bg-[#071933] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Login to Admin Panel</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security & Auto-logout Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              ⏰ Your session will auto-logout after 10 minutes of login<br />
              For security reasons, you must login fresh each time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
