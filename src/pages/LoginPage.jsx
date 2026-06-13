import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, Cloud } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const successMessage = location.state?.successMessage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
      }
    } catch (err) {
      if (err?.message?.toLowerCase().includes('email not confirmed')) {
        setError('Email not confirmed. Please check your inbox and verify your email.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    /* Background: very soft blue-lavender gradient matching reference exactly */
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #e0e8f8 0%, #ece8f8 40%, #f3e8f4 100%)' }}>

      {/* Logo */}
      <div className="mb-5 flex flex-col items-center">
        <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl shadow-md border border-white/50 flex items-center justify-center h-16 w-56 mb-3">
          <img src="/logo-with-text.png" className="h-full w-full object-contain" alt="StaffAdda Logo" />
        </div>
        {/* Progress bar decoration */}
        <div className="w-40 h-1 bg-gray-300/60 rounded-full overflow-hidden">
          <div className="h-full w-1/3 brand-gradient rounded-full" />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md" style={{ marginTop: 12 }}>

        {successMessage && !error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 font-medium">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.remember}
              onChange={e => setForm({ ...form, remember: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span className="text-sm text-gray-600">Keep me logged in</span>
          </label>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <hr className="my-5 border-gray-100" />
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create Account</Link>
        </p>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-10 mt-8">
        {[{ Icon: Shield, label: 'SECURE SSL' }, { Icon: Cloud, label: 'ENCRYPTED' }, { Icon: Shield, label: 'PRIVACY PRO' }].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <Icon size={20} className="text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium tracking-widest">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
