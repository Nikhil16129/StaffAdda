import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      console.error('Update password error:', err);
      setError(err?.message || 'Failed to update password. Your recovery link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #e0e8f8 0%, #ece8f8 40%, #f3e8f4 100%)' }}>
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500 border border-green-150">
            <CheckCircle size={36} className="text-green-500 fill-green-50" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your password has been reset successfully. You can now use your new password to sign in.
          </p>
          <Link to="/login" className="btn-primary w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #e0e8f8 0%, #ece8f8 40%, #f3e8f4 100%)' }}>

      {/* Logo */}
      <div className="mb-5 flex flex-col items-center">
        <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl shadow-md border border-white/50 flex items-center justify-center h-16 w-56 mb-3">
          <img src="/logo-with-text.png" className="h-full w-full object-contain" alt="StaffAdda Logo" />
        </div>
        <div className="w-40 h-1 bg-gray-300/60 rounded-full overflow-hidden">
          <div className="h-full w-1/3 brand-gradient rounded-full" />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md" style={{ marginTop: 12 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Please enter your new password below.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-70 flex items-center justify-center gap-2 mt-6">
            {loading ? (
              <>
                <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                Resetting Password...
              </>
            ) : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
