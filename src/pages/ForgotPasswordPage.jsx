import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await resetPassword(email);
      setMessage('A password reset link has been sent to your email address. Please check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl text-sm font-semibold disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                Sending Link...
              </>
            ) : 'Send Reset Link'}
          </button>
        </form>

        <hr className="my-6 border-gray-100" />
        
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
