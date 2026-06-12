import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Briefcase, LogOut,
  HelpCircle, Trash2, Bell, Menu, X, ChevronRight, Check, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin/dashboard' },
  { icon: Users,           label: 'Job Seekers', path: '/admin/seekers' },
  { icon: Building2,       label: 'Employers',   path: '/admin/employers' },
  { icon: Briefcase,       label: 'Posted Jobs', path: '/admin/jobs' },
  { icon: HelpCircle,      label: 'Enquiries',   path: '/admin/enquiries' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('/admin/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Live Database States
  const [seekers, setSeekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [appsCount, setAppsCount] = useState(0);
  const [enquiries, setEnquiries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch all administration details
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profiles (seekers + employers)
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('*');
      if (profErr) throw profErr;

      const seekerList = (profiles || []).filter(p => p.role === 'jobseeker');
      const employerList = (profiles || []).filter(p => p.role === 'employer');
      setSeekers(seekerList);
      setEmployers(employerList);

      // 2. Fetch jobs
      const { data: jobsData, error: jobsErr } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (jobsErr) throw jobsErr;
      setJobs(jobsData || []);

      // 3. Fetch applications count
      const { count, error: appsErr } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });
      if (appsErr) throw appsErr;
      setAppsCount(count || 0);

      // 4. Fetch contact messages (enquiries)
      let dbMsgs = [];
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          dbMsgs = data;
        }
      } catch (err) {
        console.warn('Failed to fetch from Supabase table contact_messages:', err);
      }

      // Load from local storage
      const localMsgs = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      const merged = [...dbMsgs, ...localMsgs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setEnquiries(merged);

    } catch (e) {
      console.error('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user, activeNav]);

  // Delete User Handler (Job Seeker / Employer) via RPC
  const handleDeleteUser = async (userId, userEmail, userRole) => {
    const confirmation = window.confirm(
      `CRITICAL ACTION:\nAre you sure you want to permanently delete this ${userRole} (${userEmail})?\n\nThis will remove their profile, authentication records, and all cascading database records.`
    );
    if (!confirmation) return;

    setActionSuccess('');
    try {
      const { error } = await supabase.rpc('delete_user_by_admin', { user_id: userId });
      if (error) throw error;

      setActionSuccess(`Successfully deleted ${userRole} (${userEmail})`);
      fetchAllData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // Delete Job Listing Handler
  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmation = window.confirm(
      `Are you sure you want to permanently delete the job vacancy: "${jobTitle}"?`
    );
    if (!confirmation) return;

    setActionSuccess('');
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
      if (error) throw error;

      setActionSuccess(`Successfully deleted job: "${jobTitle}"`);
      fetchAllData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // Delete Enquiry Handler
  const handleDeleteEnquiry = async (msgId) => {
    const confirmation = window.confirm('Are you sure you want to permanently delete this contact message?');
    if (!confirmation) return;

    setActionSuccess('');
    try {
      if (typeof msgId === 'string' && !msgId.startsWith('local_')) {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', msgId);
        if (error) throw error;
      }
      
      const localMsgs = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      const filtered = localMsgs.filter(m => m.id !== msgId && m.created_at !== msgId);
      localStorage.setItem('contact_messages', JSON.stringify(filtered));

      setActionSuccess('Enquiry deleted successfully.');
      fetchAllData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`w-52 bg-slate-900 text-slate-350 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-700/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo-icon.png" className="w-7 h-7 object-contain" alt="StaffAdda Icon" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">StaffAdda Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => { setActiveNav(path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeNav === path
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800 space-y-0.5">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all">
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-0 md:ml-52 flex-1 p-4 md:p-8 min-w-0">
        {/* Mobile Header strip */}
        <div className="md:hidden flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-600 hover:text-gray-800">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo-icon.png" className="w-6 h-6 object-contain" alt="StaffAdda Icon" />
            </div>
            <span className="text-sm font-bold brand-gradient-text tracking-tight">StaffAdda Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            AD
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeNav === '/admin/dashboard' && 'Systems Overview'}
              {activeNav === '/admin/seekers' && 'Job Seekers Register'}
              {activeNav === '/admin/employers' && 'Employers Directory'}
              {activeNav === '/admin/jobs' && 'Active Vacancies'}
              {activeNav === '/admin/enquiries' && 'Contact Enquiries'}
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              {activeNav === '/admin/dashboard' && 'Review live metrics and ecosystem stats.'}
              {activeNav === '/admin/seekers' && 'Monitor registered candidates and delete inactive profiles.'}
              {activeNav === '/admin/employers' && 'Inspect enterprise profiles and cancel system accounts.'}
              {activeNav === '/admin/jobs' && 'Manage job listings and clean up stale postings.'}
              {activeNav === '/admin/enquiries' && 'View messages sent by visitors via the Contact Us form.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllData} className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              Refresh Data
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-2xl mb-6 flex items-center gap-2">
            <Check size={16} />
            {actionSuccess}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-20">
            <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* ── DASHBOARD VIEW ── */}
        {!loading && activeNav === '/admin/dashboard' && (
          <div className="space-y-6">
            {/* Summary statistics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Job Seekers */}
              <div className="card p-5 bg-white shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Job Seekers</span>
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Users size={16} /></span>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 mt-2">{seekers.length}</p>
                  <button onClick={() => setActiveNav('/admin/seekers')} className="text-blue-600 text-xs font-semibold hover:underline mt-2 flex items-center gap-0.5">
                    View Register <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Employers */}
              <div className="card p-5 bg-white shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Employers</span>
                  <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Building2 size={16} /></span>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 mt-2">{employers.length}</p>
                  <button onClick={() => setActiveNav('/admin/employers')} className="text-blue-600 text-xs font-semibold hover:underline mt-2 flex items-center gap-0.5">
                    View Directory <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Posted Jobs */}
              <div className="card p-5 bg-white shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Posted Jobs</span>
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Briefcase size={16} /></span>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 mt-2">{jobs.length}</p>
                  <button onClick={() => setActiveNav('/admin/jobs')} className="text-blue-600 text-xs font-semibold hover:underline mt-2 flex items-center gap-0.5">
                    Manage Vacancies <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Total Applications */}
              <div className="card p-5 bg-white shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Total Submissions</span>
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText size={16} /></span>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 mt-2">{appsCount}</p>
                  <span className="text-xs text-gray-400 mt-3 inline-block font-semibold">Active Campaigns</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Panels */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Latest Jobs Posted */}
              <div className="card bg-white p-5 shadow-sm border border-gray-100 rounded-[24px]">
                <h3 className="font-bold text-gray-950 text-sm mb-4">Latest Job Openings</h3>
                {jobs.length === 0 ? (
                  <p className="text-xs text-gray-400">No active job listings.</p>
                ) : (
                  <div className="space-y-3">
                    {jobs.slice(0, 4).map(job => (
                      <div key={job.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-gray-800">{job.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{job.company_name} • {job.location}</p>
                        </div>
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{job.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Stats panel */}
              <div className="card bg-white p-5 shadow-sm border border-gray-100 rounded-[24px] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-950 text-sm mb-4">Ecosystem Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                        <span>Job Seekers Share</span>
                        <span>{seekers.length + employers.length > 0 ? Math.round((seekers.length / (seekers.length + employers.length)) * 100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${seekers.length + employers.length > 0 ? (seekers.length / (seekers.length + employers.length)) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                        <span>Employers Share</span>
                        <span>{seekers.length + employers.length > 0 ? Math.round((employers.length / (seekers.length + employers.length)) * 100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600" style={{ width: `${seekers.length + employers.length > 0 ? (employers.length / (seekers.length + employers.length)) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 text-[11px] leading-relaxed text-amber-700 font-semibold rounded-xl border border-amber-100/50 mt-6">
                  Admin Warning: Account deletions are cascading and irreversible. Removing an employer will delete their active jobs and applicant submissions immediately.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── JOB SEEKERS REGISTER TAB ── */}
        {!loading && activeNav === '/admin/seekers' && (
          <div className="card bg-white shadow-sm border border-gray-100 rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['NAME', 'EMAIL & CONTACT', 'QUALIFICATION', 'RESIDENCE DETAILS', 'ACTIONS'].map(c => (
                      <th key={c} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {seekers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-sm text-gray-400">No job seekers found in profiles table.</td>
                    </tr>
                  ) : (
                    seekers.map(sk => (
                      <tr key={sk.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{sk.name}</p>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Created at {new Date(sk.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-gray-700">{sk.email}</p>
                          <p className="text-gray-400 mt-0.5">{sk.mobile || 'No Mobile'}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                          {sk.qualification || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          <p className="font-semibold">{sk.district}, {sk.state}</p>
                          <p className="truncate max-w-[180px] text-[10px] text-gray-450 mt-0.5" title={sk.current_address}>{sk.current_address}</p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(sk.id, sk.email, 'job seeker')}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-150 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EMPLOYERS DIRECTORY TAB ── */}
        {!loading && activeNav === '/admin/employers' && (
          <div className="card bg-white shadow-sm border border-gray-100 rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['ORGANISATION', 'RECRUITER CONTACT', 'ADDRESS', 'ID CREDENTIALS', 'ACTIONS'].map(c => (
                      <th key={c} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-sm text-gray-400">No employers registered in profiles table.</td>
                    </tr>
                  ) : (
                    employers.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{emp.organisation_name || emp.name}</p>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Created at {new Date(emp.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-bold text-gray-800">{emp.name}</p>
                          <p className="text-gray-500 mt-0.5">{emp.email}</p>
                          <p className="text-gray-400">{emp.mobile}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[200px]" title={emp.address}>
                          {emp.address || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {emp.id_type ? (
                            <>
                              <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 mr-1.5">{emp.id_type}</span>
                              <span className="font-bold text-gray-700">{emp.id_number}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(emp.id, emp.email, 'employer')}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-150 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── POSTED JOBS TAB ── */}
        {!loading && activeNav === '/admin/jobs' && (
          <div className="card bg-white shadow-sm border border-gray-100 rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['JOB ROLE', 'COMPANY', 'LOCATION & TYPE', 'SALARY LEVEL', 'ACTIONS'].map(c => (
                      <th key={c} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-sm text-gray-400">No active job listings.</td>
                    </tr>
                  ) : (
                    jobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{job.title}</p>
                          <span className="text-[10px] font-bold text-gray-450 mt-0.5">Experience: {job.experience}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-850">{job.company_name}</p>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-gray-700">{job.location}</p>
                          <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">{job.type}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-blue-600">
                          {job.salary_label}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-150 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                          >
                            <Trash2 size={13} /> Delete Job
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ENQUIRIES TAB ── */}
        {!loading && activeNav === '/admin/enquiries' && (
          <div className="card bg-white shadow-sm border border-gray-100 rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['SUBMITTER', 'SUBJECT', 'MESSAGE', 'DATE', 'ACTIONS'].map(c => (
                      <th key={c} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-sm text-gray-400">No enquiries found.</td>
                    </tr>
                  ) : (
                    enquiries.map(enq => (
                      <tr key={enq.id || enq.created_at} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{enq.name}</p>
                          <span className="text-[10px] font-semibold text-gray-500">{enq.email}</span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                          {enq.subject}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600 max-w-[300px] whitespace-pre-wrap">
                          {enq.message}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-400">
                          {new Date(enq.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id || enq.created_at)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-150 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
