import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ChevronDown } from 'lucide-react';
import { mockCompanies } from '../data/mockData';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const INDUSTRIES = ['All Companies', 'IT & Software', 'Finance', 'Healthcare', 'Marketing'];

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All Companies');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = mockCompanies.filter(co => {
    const qMatch = !query || co.name.toLowerCase().includes(query.toLowerCase()) || co.industry.toLowerCase().includes(query.toLowerCase());
    const iMatch = activeIndustry === 'All Companies' || co.industry === activeIndustry;
    return qMatch && iMatch;
  });

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Discover Top Companies to Work For</h1>
          <p className="text-gray-400 text-base">
            Find your next career move by exploring the most innovative and employee-friendly workplaces across India.
          </p>
        </div>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="px-4 sm:px-6 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 bg-white w-full sm:w-80">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by company name or industry..."
                className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none" />
            </div>

            {/* Industry pills */}
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setActiveIndustry(ind)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    activeIndustry === ind
                      ? 'btn-primary'
                      : 'border border-gray-200 text-gray-600 bg-white hover:border-blue-400 hover:text-blue-600'
                  }`}>
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPANY GRID ── */}
      <div className="px-4 sm:px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(co => (
              <div key={co.id} className="card card-hover p-5 sm:p-6 cursor-pointer group"
                onClick={() => navigate(`/jobs?company=${encodeURIComponent(co.name)}`)}>

                {/* Header: logo + rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                    style={{ backgroundColor: co.logo && (co.logo.startsWith('/') || co.logo.includes('.')) ? '#ffffff' : co.color }}>
                    {co.logo && (co.logo.startsWith('/') || co.logo.includes('.')) ? (
                      <img src={co.logo} alt={co.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      co.logo
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-orange-400 fill-orange-400" />
                    <span className="text-sm font-bold text-gray-900">{co.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">{co.reviews} Reviews</span>
                  </div>
                </div>

                {/* Name + desc */}
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{co.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{co.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {co.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{t}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500 font-medium">{co.openJobs}+ Open Jobs</span>
                  <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View Jobs →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button onClick={() => setVisibleCount(c => c + 6)}
                className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-sm">
                Load More Companies
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
