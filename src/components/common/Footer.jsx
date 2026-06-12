import { Link, useLocation } from 'react-router-dom';
import { Globe, Mail, MessageSquare } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => {
    return isActive(path)
      ? "text-sm text-blue-600 dark:text-blue-400 underline font-medium transition-colors"
      : "text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-14 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/80 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo-icon.png" className="w-7 h-7 object-contain" alt="StaffAdda Icon" />
              </div>
              <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">StaffAdda</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
              StaffAdda is a premium recruitment platform connecting world-class talent with leading companies worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">QUICK LINKS</h4>
            <ul className="space-y-2.5">
              <li><Link to="/jobs" className={getLinkClass('/jobs')}>Browse Jobs</Link></li>
              <li><Link to="/companies" className={getLinkClass('/companies')}>Companies</Link></li>
              <li><Link to="/about" className={getLinkClass('/about')}>About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">SUPPORT</h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className={getLinkClass('/contact')}>Contact Us</Link></li>
              <li><Link to="/privacy" className={getLinkClass('/privacy')}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={getLinkClass('/terms')}>Terms of Service</Link></li>
              <li><Link to="#" className={getLinkClass('#resources')}>Resources</Link></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">STAY CONNECTED</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <Globe size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <MessageSquare size={14} />
              </a>
              <a href="mailto:career@staffadda.in" className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <Mail size={14} />
              </a>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
              © 2024 StaffAdda. Premium<br />Recruitment Solutions.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
