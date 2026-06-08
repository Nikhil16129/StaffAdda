import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">

          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm max-w-[180px] flex items-center justify-center">
                <img src="/logo-with-text.png" className="w-full h-auto object-contain" alt="StaffAdda Logo" />
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connecting the world's best talent with the most innovative companies on the planet.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">SOLUTIONS</h4>
            <ul className="space-y-2.5">
              {['Browse Jobs', 'Top Companies', 'Salary Insights', 'Career Advice'].map(item => (
                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">COMPANY</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Press', 'Resources'].map(item => (
                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">LEGAL</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(item => (
                <li key={item}><Link to="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">NEWSLETTER</h4>
            <p className="text-sm text-gray-500 mb-3">The best jobs, delivered weekly to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 bg-gray-50"
              />
              <button className="btn-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">© 2024 StaffAdda. All rights reserved.</p>
          <div className="flex gap-3">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
              <Globe size={14} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
              <Mail size={14} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors">
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
