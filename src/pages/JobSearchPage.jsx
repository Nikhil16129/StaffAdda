import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ChevronLeft, ChevronRight, TrendingUp, Building2, Check, Phone } from 'lucide-react';
import { mockCompanies } from '../data/mockData';
import JobCard from '../components/jobs/JobCard';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract'];

export default function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedTypes, setSelectedTypes] = useState(['Full-time', 'Remote']);
  const [salaryRange, setSalaryRange] = useState(200000);
  const [experience, setExperience] = useState('Any Experience');
  const [page, setPage] = useState(1);
  
  // Apply States
  const [applyModal, setApplyModal] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [quickApplying, setQuickApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const PER_PAGE = 3;

  const [jobs, setJobs] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        
        const mappedJobs = (data || []).map(j => ({
          id: j.id,
          title: j.title,
          salaryLabel: j.salary_label || (j.salary_min && j.salary_max 
            ? `${j.salary_currency}${j.salary_min.toLocaleString()} - ${j.salary_currency}${j.salary_max.toLocaleString()} /Month`
            : 'Salary Negotiable'),
          company: j.company_name,
          companyLogo: j.company_logo,
          companyColor: j.company_color || '#3b82f6',
          location: j.location,
          experience: j.experience,
          tags: j.tags || [],
          type: j.type,
          description: j.description,
          employerId: j.employer_id
        }));
        setJobs(mappedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setDbLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Load applied status from database
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('job_id')
          .eq('job_seeker_id', user.id);
        if (error) throw error;
        setAppliedJobs((data || []).map(a => a.job_id));
      } catch (e) {
        console.error('Error fetching applied status:', e);
      }
    };
    fetchAppliedJobs();
  }, [user]);

  const handleOpenApplyModal = (job) => {
    setApplyModal(job);
    setApplySuccess(false);
    setQuickApplying(false);
  };

  const handleQuickApply = (job) => {
    setQuickApplying(true);
    setTimeout(() => {
      setQuickApplying(false);
      setApplySuccess(true);

      const existing = localStorage.getItem('staffadda_applications');
      const list = existing ? JSON.parse(existing) : [];
      
      const newApp = {
        jobId: job.id,
        title: job.title,
        company: job.company,
        companyColor: job.companyColor,
        companyLogo: job.companyLogo,
        appliedAt: new Date().toISOString(),
        name: user?.name || 'Arjun Malhotra',
        email: user?.email || 'arjun.malhotra@gmail.com',
        phone: '+91 99999 88888',
        experience: '2-5 years',
        resumeName: 'Resume_Default.pdf'
      };

      if (!list.some(item => item.jobId === job.id)) {
        list.push(newApp);
        localStorage.setItem('staffadda_applications', JSON.stringify(list));
      }

      setAppliedJobs(prev => [...prev, job.id]);
    }, 1200);
  };

  const filtered = jobs.filter(job => {
    const qMatch = !query || job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase());
    const typeMatch = selectedTypes.length === 0 || 
                      selectedTypes.includes(job.type) || 
                      job.tags.some(t => selectedTypes.includes(t));
    const locationMatch = !location || job.location.toLowerCase().includes(location.toLowerCase());
    return qMatch && typeMatch && locationMatch;
  });

  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleType = (t) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    setPage(1);
  };

  const topCompanies = mockCompanies.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── SEARCH BAR STRIP ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-14 z-40 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={e => { e.preventDefault(); setPage(1); }} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-4 py-2.5 bg-white">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Job title, keyw..." className="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white md:w-44">
              <MapPin size={15} className="text-gray-400 shrink-0" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                className="w-full text-sm text-gray-800 bg-transparent focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm font-semibold px-6 py-2.5 rounded-xl flex-1 whitespace-nowrap">
                Search Jobs
              </button>
              <button 
                type="button" 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden border border-gray-200 rounded-xl p-2.5 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-6">

        {/* ── LEFT SIDEBAR — FILTERS ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="card p-5 sticky top-32">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-blue-600" />
                Filters
              </h3>
              <button onClick={() => { setSelectedTypes(['Full-time', 'Remote']); setSalaryRange(200000); setLocation(''); setPage(1); }}
                className="text-xs text-blue-600 font-semibold hover:underline">Clear All</button>
            </div>

            {/* Job Type */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">JOB TYPE</p>
              <div className="space-y-2.5">
                {JOB_TYPES.map(t => (
                  <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">SALARY RANGE</p>
              <input type="range" min={50000} max={300000} step={10000} value={salaryRange}
                onChange={e => setSalaryRange(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹0</span>
                <span className="text-blue-600 font-semibold">
                  {salaryRange >= 100000 
                    ? `₹${(salaryRange / 100000).toFixed(1).replace('.0', '')} Lakh` 
                    : `₹${salaryRange}`}
                </span>
                <span>₹3 Lakh+</span>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">EXPERIENCE</p>
              <select value={experience} onChange={e => setExperience(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-gray-50">
                {['Any Experience','0-2 years','2-5 years','5-10 years','10+ years'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">LOCATION</p>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input placeholder="City or Zip" value={location} onChange={e => { setLocation(e.target.value); setPage(1); }}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-gray-50" />
              </div>
            </div>

            {/* Premium upgrade card */}
            <div className="rounded-2xl p-4 brand-gradient text-white">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Premium Career</p>
              <p className="text-xs leading-relaxed mb-3 opacity-90">Unlock exclusive job listings and priority applications today.</p>
              <button className="w-full bg-white text-blue-600 text-xs font-bold py-2.5 rounded-xl hover:shadow-md transition-shadow">
                Go Pro
              </button>
            </div>
          </div>
        </aside>

        {/* ── CENTER — JOB RESULTS ── */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              Recommended Jobs
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                {filtered.length} Found
              </span>
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              Sort by:{' '}
              <select className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:outline-none">
                <option>Newest</option>
                <option>Salary</option>
              </select>
            </div>
          </div>

          {paged.length > 0 ? paged.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onApply={handleOpenApplyModal} 
              applied={appliedJobs.includes(job.id)} 
            />
          )) : (
            <div className="card text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-700">No jobs found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-blue-500 disabled:opacity-40">
                <ChevronLeft size={15} />
              </button>
              {[1,2,3].map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page===p ? 'btn-primary' : 'border border-gray-200 text-gray-600 hover:border-blue-500'}`}>
                  {p}
                </button>
              ))}
              <span className="text-gray-400 text-sm">...</span>
              <button onClick={() => setPage(total)}
                className="w-9 h-9 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-blue-500">12</button>
              <button onClick={() => setPage(p => Math.min(total, p+1))} disabled={page===total}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-blue-500 disabled:opacity-40">
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR — INSIGHTS ── */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="space-y-4 sticky top-32">
            {/* Smart Insights */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Smart Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <TrendingUp size={15} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-blue-900">High Match</p>
                    <p className="text-xs text-blue-700 mt-0.5">Your skills match 92% of "Senior UX" roles.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-xl">
                  <MapPin size={15} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-teal-900">Resume Tip</p>
                    <p className="text-xs text-teal-700 mt-0.5">Adding "Next.js" could increase reach by 15%.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Companies Hiring */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Building2 size={14} className="text-purple-500" />
                Top Companies Hiring
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {topCompanies.map(co => (
                  <div key={co.id} className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-110 transition-transform overflow-hidden bg-white border border-gray-100 shadow-sm"
                    style={{ backgroundColor: co.logo && (co.logo.startsWith('/') || co.logo.includes('.')) ? '#ffffff' : co.color }} title={co.name}>
                    {co.logo && (co.logo.startsWith('/') || co.logo.includes('.')) ? (
                      <img src={co.logo} alt={co.name} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      co.logo
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/companies')}
                className="text-blue-600 text-xs font-semibold hover:underline">
                View All Companies
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Footer />

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setApplyModal(null)}>
          <div className="bg-white rounded-[32px] p-5 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100/90 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Top decorative accent color ring */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none" />

            {!applySuccess ? (
              <>
                {/* Header: Logo & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 sm:w-14 h-14 rounded-2xl text-white font-black flex items-center justify-center overflow-hidden bg-white border border-slate-100 shadow-md shrink-0"
                    style={{ backgroundColor: applyModal.companyLogo && (applyModal.companyLogo.startsWith('/') || applyModal.companyLogo.includes('.')) ? '#ffffff' : applyModal.companyColor }}>
                    {applyModal.companyLogo && (applyModal.companyLogo.startsWith('/') || applyModal.companyLogo.includes('.')) ? (
                      <img src={applyModal.companyLogo} alt={applyModal.company} className="w-full h-full object-contain p-2" />
                    ) : (
                      applyModal.companyLogo
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 text-left leading-tight tracking-tight">{applyModal.title}</h3>
                    <p className="text-slate-500 text-sm font-bold text-left mt-0.5">{applyModal.company}</p>
                  </div>
                </div>

                {/* Job Metadata Pill Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                    <MapPin size={13} className="text-slate-400" />
                    {applyModal.location}
                  </span>
                  {applyModal.salaryLabel && (
                    <span className="px-3 py-1.5 bg-blue-50/60 border border-blue-100/40 text-blue-600 rounded-xl text-xs font-bold">
                      {applyModal.salaryLabel}
                    </span>
                  )}
                  {applyModal.tags && applyModal.tags[0] && (
                    <span className="px-3 py-1.5 bg-purple-50/60 border border-purple-100/40 text-purple-600 rounded-xl text-xs font-bold">
                      {applyModal.tags[0]}
                    </span>
                  )}
                </div>

                {/* Styled Job Description Preview */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4.5 mb-6 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Job Overview</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{applyModal.description}</p>
                </div>
                
                {/* Actions Layout */}
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setApplyModal(null);
                      navigate(`/apply/${applyModal.id}`);
                    }}
                    className="btn-primary w-full py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Apply with Detailed Form
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="tel:7808009991"
                      className="py-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-blue-600 hover:text-blue-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <Phone size={14} className="stroke-[2.5]" />
                      Call Now
                    </a>
                    
                    <button 
                      onClick={() => setApplyModal(null)}
                      className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                  <Check size={32} className="stroke-[3.5]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Applied Successfully!</h3>
                <p className="text-sm text-slate-500 mb-6">Your application was submitted with your profile resume.</p>
                <button 
                  onClick={() => setApplyModal(null)}
                  className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm"
                >
                  Great!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden flex justify-end"
          onClick={() => setMobileFiltersOpen(false)}>
          <div className="bg-white w-full max-w-sm h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            onClick={e => e.stopPropagation()}>
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-blue-600" />
                  Filters
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-semibold">&times;</button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">JOB TYPE</p>
                <div className="space-y-3">
                  {JOB_TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                      <span className="text-sm text-gray-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">SALARY RANGE</p>
                <input type="range" min={50000} max={300000} step={10000} value={salaryRange}
                  onChange={e => setSalaryRange(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span>
                  <span className="text-blue-600 font-semibold">
                    {salaryRange >= 100000 
                      ? `₹${(salaryRange / 100000).toFixed(1).replace('.0', '')} Lakh` 
                      : `₹${salaryRange}`}
                  </span>
                  <span>₹3 Lakh+</span>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">EXPERIENCE</p>
                <select value={experience} onChange={e => setExperience(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-gray-50">
                  {['Any Experience','0-2 years','2-5 years','5-10 years','10+ years'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">LOCATION</p>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="City or Zip" value={location} onChange={e => { setLocation(e.target.value); setPage(1); }}
                    className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-gray-50" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => { setSelectedTypes(['Full-time', 'Remote']); setSalaryRange(200000); setLocation(''); setPage(1); }}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Clear All
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 btn-primary py-3 rounded-xl text-sm font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
