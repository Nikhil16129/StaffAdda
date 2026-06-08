import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Companies', path: '/companies' },
    { label: 'About', path: '#' },
    { label: 'Contact', path: '#' },
  ];


  const active = (p) => location.pathname === p;
  const isDarkBg = !scrolled && !mobileOpen && location.pathname === '/';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${scrolled || mobileOpen ? 'navbar-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* mini icon */}
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            <img src="/logo-icon.png" className="w-7 h-7 object-contain" alt="StaffAdda Icon" />
          </div>
          <span className={`font-bold text-base transition-colors tracking-tight ${isDarkBg ? 'text-white' : 'brand-gradient-text'}`}>StaffAdda</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.label}
              to={l.path}
              className={`text-sm font-medium transition-colors ${
                active(l.path)
                  ? (isDarkBg ? 'text-white border-b-2 border-white pb-0.5' : 'text-blue-600 border-b-2 border-blue-600 pb-0.5')
                  : (isDarkBg ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-blue-600')
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.slice(0, 2).toUpperCase()}
                </div>
                <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
                  <button onClick={() => { 
                    if (user.role === 'admin') navigate('/admin/dashboard');
                    else navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard'); 
                    setDropdown(false); 
                  }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Dashboard</button>
                  <hr className="border-gray-100 my-1" />
                  <button onClick={() => { logout(); setDropdown(false); navigate('/'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium px-3 py-1.5 transition-colors ${isDarkBg ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm font-semibold px-5 py-2 rounded-full">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className={`md:hidden p-1.5 transition-colors ${isDarkBg ? 'text-white' : 'text-gray-600'}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 sm:px-6 py-4 space-y-1">
          {links.map(l => (
            <Link key={l.label} to={l.path} onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-medium ${active(l.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                className="text-sm text-red-500 text-left px-3 py-2">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center py-2.5 rounded-xl text-sm font-semibold">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
