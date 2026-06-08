import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, BarChart2, Settings,
  HelpCircle, LogOut, Download, Plus, MoreVertical, TrendingUp, TrendingDown, Menu, X, Check, FileText, Phone, Mail, Award, Lock, Building2, Save
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { mockHiringData } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/employer/dashboard' },
  { icon: Briefcase,       label: 'Manage Jobs', path: '/employer/jobs' },
  { icon: Users,           label: 'Applications',path: '/employer/applications' },
  { icon: BarChart2,       label: 'Analytics',   path: '/employer/analytics' },
  { icon: Settings,        label: 'Settings',    path: '/employer/settings' },
];

const STATUS = {
  shortlisted: { label: 'SHORTLISTED', cls: 'status-shortlisted' },
  under_review: { label: 'UNDER REVIEW', cls: 'status-review' },
  new: { label: 'NEW', cls: 'status-new' },
  rejected: { label: 'REJECTED', cls: 'status-rejected' }
};

const BAR_GRADIENTS = [
  { id: 'g0', from: '#6ea8fe', to: '#2563eb' },
  { id: 'g1', from: '#6ea8fe', to: '#2563eb' },
  { id: 'g2', from: '#6ea8fe', to: '#2563eb' },
  { id: 'g3', from: '#6ea8fe', to: '#2563eb' },
  { id: 'g4', from: '#a78bfa', to: '#7c3aed' },
  { id: 'g5', from: '#4fdbc8', to: '#0d9488' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-xs">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-blue-600 font-bold">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
};

export default function EmployerDashboard() {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('/employer/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DB States
  const [dbJobs, setDbJobs] = useState([]);
  const [dbApplications, setDbApplications] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [appsLoading, setAppsLoading] = useState(false);

  // Post Job Modal State
  const [postJobModal, setPostJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    type: 'Full-time',
    description: '',
    tags: ''
  });
  const [jobPosting, setJobPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');

  // Settings State
  const [companyForm, setCompanyForm] = useState({
    organisationName: '',
    address: '',
    idType: 'PAN',
    idNumber: '',
    mobile: '',
    name: ''
  });
  const [companySaving, setCompanySaving] = useState(false);
  const [companySuccess, setCompanySuccess] = useState('');

  // Load Company Form details
  useEffect(() => {
    if (user) {
      setCompanyForm({
        organisationName: user.organisationName || user.company || '',
        address: user.address || '',
        idType: user.idType || 'PAN',
        idNumber: user.idNumber || '',
        mobile: user.mobile || '',
        name: user.name || ''
      });
    }
  }, [user, activeNav]);

  // Fetch Jobs & Applications from Supabase
  const fetchData = async () => {
    if (!user) return;
    setJobsLoading(true);
    setAppsLoading(true);
    try {
      // Fetch employer's jobs
      const { data: jobsData, error: jobsErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      if (jobsErr) throw jobsErr;
      setDbJobs(jobsData || []);

      // Fetch applications for these jobs (automatically filtered by RLS policies)
      const { data: appsData, error: appsErr } = await supabase
        .from('applications')
        .select('*, job:jobs(*)')
        .order('applied_at', { ascending: false });
      if (appsErr) throw appsErr;
      setDbApplications(appsData || []);
    } catch (e) {
      console.error('Failed to fetch employer dashboard data:', e);
    } finally {
      setJobsLoading(false);
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, activeNav]);

  // Handle Post Job Submission
  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobPosting(true);
    setPostSuccess('');

    try {
      const salaryMinNum = Number(newJob.salaryMin) || 0;
      const salaryMaxNum = Number(newJob.salaryMax) || 0;
      const salaryLabelStr = salaryMinNum && salaryMaxNum 
        ? `₹${(salaryMinNum / 100000).toFixed(1)}L - ₹${(salaryMaxNum / 100000).toFixed(1)}L /Year`
        : 'Salary Negotiable';

      const tagArray = newJob.tags.split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Default tags if empty
      if (tagArray.length === 0) {
        tagArray.push(newJob.type);
      }

      const companyInitials = (user.organisationName || user.company || user.name || 'C').slice(0, 1).toUpperCase();

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          employer_id: user.id,
          title: newJob.title,
          company_name: user.organisationName || user.company || 'My Enterprise',
          company_logo: companyInitials,
          company_color: '#3b82f6',
          location: newJob.location,
          experience: newJob.experience,
          salary_min: salaryMinNum,
          salary_max: salaryMaxNum,
          salary_label: salaryLabelStr,
          tags: tagArray,
          type: newJob.type,
          description: newJob.description
        });

      if (error) throw error;
      setPostSuccess('Job vacancy posted successfully!');
      setNewJob({
        title: '',
        location: '',
        experience: '',
        salaryMin: '',
        salaryMax: '',
        type: 'Full-time',
        description: '',
        tags: ''
      });
      fetchData();
      setTimeout(() => {
        setPostJobModal(false);
        setPostSuccess('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setPostSuccess('Error posting job: ' + err.message);
    } finally {
      setJobPosting(false);
    }
  };

  // Update Application Status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);
      if (error) throw error;
      
      // Update locally
      setDbApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Update Company profile Settings
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanySuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: companyForm.name,
          organisation_name: companyForm.organisationName,
          address: companyForm.address,
          id_type: companyForm.idType,
          id_number: companyForm.idNumber,
          mobile: companyForm.mobile
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      setCompanySuccess('Company details updated successfully!');
      setTimeout(() => setCompanySuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setCompanySuccess('Failed to save settings: ' + err.message);
    } finally {
      setCompanySaving(false);
    }
  };

  // Stats computation
  const activeListings = dbJobs.length;
  const totalApplicants = dbApplications.length;
  const shortlistedCount = dbApplications.filter(a => a.status === 'shortlisted').length;
  const underReviewCount = dbApplications.filter(a => a.status === 'under_review').length;

  const topStats = [
    { label: 'ACTIVE LISTINGS',  value: activeListings,   change: '+2',  up: true,  icon: Briefcase,  color: '#eff6ff', iconColor: '#2563eb' },
    { label: 'TOTAL APPLICANTS', value: totalApplicants,  change: `+${dbApplications.length}`,  up: true,  icon: Users,      color: '#f5f3ff', iconColor: '#7c3aed' },
    { label: 'SHORTLISTED',      value: shortlistedCount,  change: 'Live',  up: true,  icon: BarChart2,  color: '#fffbeb', iconColor: '#d97706' },
    { label: 'UNDER REVIEW',     value: underReviewCount, change: 'Pending',  up: true,  icon: Users,      color: '#f0fdf4', iconColor: '#16a34a' },
  ];

  // Adjust chart data based on live applicants
  const getChartData = () => {
    const defaultData = mockHiringData.map(item => ({ ...item }));
    if (defaultData.length > 0) {
      // Set current month to the real applicant count
      defaultData[defaultData.length - 1].applications = totalApplicants;
    }
    return defaultData;
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
      <aside className={`w-52 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo-icon.png" className="w-7 h-7 object-contain" alt="StaffAdda Icon" />
            </div>
            <span className="text-sm font-bold brand-gradient-text tracking-tight">StaffAdda</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500 hover:text-gray-700 md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label, path }) => (
            <button key={path} onClick={() => { setActiveNav(path); setSidebarOpen(false); }}
              className={`sidebar-link ${activeNav === path ? 'active' : ''}`}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Post a Job CTA */}
        <div className="px-3 pb-3">
          <button onClick={() => setPostJobModal(true)} className="btn-primary w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
            <Plus size={15} />
            Post a Job
          </button>
        </div>

        {/* User card + bottom */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer mb-2">
            <div className="w-9 h-9 rounded-full brand-gradient flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'AR'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-xs truncate">{user?.name || 'Arjun Roy'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.company || 'Acme Corp'}</p>
            </div>
          </div>
          <button className="sidebar-link"><HelpCircle size={15} />Help Center</button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="sidebar-link hover:!text-red-500 hover:!bg-red-50">
            <LogOut size={15} />Logout
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
            <span className="text-sm font-bold brand-gradient-text tracking-tight">StaffAdda Recruiter</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden brand-gradient flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.slice(0, 2).toUpperCase() || 'AR'}
          </div>
        </div>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeNav === '/employer/dashboard' && 'Employer Hub'}
              {activeNav === '/employer/jobs' && 'Manage Job Vacancies'}
              {activeNav === '/employer/applications' && 'Candidates Pool'}
              {activeNav === '/employer/analytics' && 'Recruitment Analytics'}
              {activeNav === '/employer/settings' && 'Enterprise Profile'}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {activeNav === '/employer/dashboard' && `Welcome back, ${user?.name?.split(' ')[0] || 'Employer'}. Here's what's happening today.`}
              {activeNav === '/employer/jobs' && 'Publish, delete, or inspect active job openings.'}
              {activeNav === '/employer/applications' && 'Review details and update selection status for applicants.'}
              {activeNav === '/employer/analytics' && 'Visual insights into applicant volumes and pipelines.'}
              {activeNav === '/employer/settings' && 'Modify corporate profile details and tax IDs.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPostJobModal(true)} className="btn-primary text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm">
              <Plus size={15} />
              Post a New Job
            </button>
          </div>
        </div>

        {/* ── DASHBOARD VIEW ── */}
        {activeNav === '/employer/dashboard' && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {topStats.map((s, i) => (
                <div key={i} className="card p-4 sm:p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color }}>
                      <s.icon size={18} style={{ color: s.iconColor }} />
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                      <TrendingUp size={12} />
                      {s.change}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">{s.label}</p>
                  <p className="text-2xl xs:text-3xl font-black text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Chart + Plan info */}
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              {/* Hiring analytics chart */}
              <div className="lg:col-span-2 card p-4 sm:p-6 bg-white shadow-sm rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-base">Hiring Analytics</h3>
                  <span className="text-xs text-blue-600 font-semibold">Active Campaign</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={getChartData()} barSize={36}>
                    <defs>
                      {BAR_GRADIENTS.map(g => (
                        <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={g.from} />
                          <stop offset="100%" stopColor={g.to} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.02)', radius: 8 }} />
                    <Bar dataKey="applications" radius={[6, 6, 0, 0]}>
                      {getChartData().map((_, i) => (
                        <Cell key={i} fill={`url(#g${i % BAR_GRADIENTS.length})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Premium Plan Card */}
              <div className="pro-card rounded-3xl p-6 text-white flex flex-col justify-between"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">Ecosystem Status</p>
                  <h3 className="text-2xl font-bold mb-1">Corporate Standard</h3>
                  <p className="text-blue-100 text-xs mb-6 leading-relaxed">Increase limits by upgrading your recruiter account tier.</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 opacity-90">
                        <span>Active Job Vacancies</span>
                        <span className="font-bold">{activeListings} / 15</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(activeListings / 15) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 opacity-90">
                        <span>Total Monthly Candidates</span>
                        <span className="font-bold">{totalApplicants} / 100</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(totalApplicants / 100) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold py-3 rounded-2xl text-xs transition-colors mt-6">
                  View Upgrades
                </button>
              </div>
            </div>

            {/* Recent Applications table */}
            <div className="card overflow-hidden bg-white shadow-sm rounded-3xl border border-gray-105">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900 text-base">Recent Submissions</h3>
                <button onClick={() => setActiveNav('/employer/applications')} className="text-blue-600 text-xs font-semibold hover:underline">
                  View Pool
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {['CANDIDATE', 'APPLIED ROLE', 'STATUS', 'DATE'].map(col => (
                        <th key={col} className="text-left px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-55">
                    {appsLoading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-8">
                          <svg className="spin w-5 h-5 text-blue-600 animate-spin mx-auto" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                          </svg>
                        </td>
                      </tr>
                    ) : dbApplications.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-sm text-gray-450">
                          No candidate applications received yet.
                        </td>
                      </tr>
                    ) : (
                      dbApplications.slice(0, 5).map(app => {
                        const status = STATUS[app.status] || STATUS.new;
                        return (
                          <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0">
                                  {app.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-xs">{app.name}</p>
                                  <p className="text-[10px] text-gray-400">{app.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-gray-750">{app.job?.title}</p>
                              <p className="text-[10px] text-gray-400">{app.job?.type}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${
                                app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                app.status === 'under_review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-205' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-450">
                              {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── MANAGE JOBS VIEW ── */}
        {activeNav === '/employer/jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobsLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            ) : dbJobs.length === 0 ? (
              <div className="col-span-full card text-center py-16 bg-white rounded-3xl">
                <p className="text-4xl mb-3">💼</p>
                <p className="font-bold text-gray-800 text-lg">No vacancies published yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-6">Create job openings to receive candidate applications.</p>
                <button onClick={() => setPostJobModal(true)} className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-md">
                  <Plus size={16} /> Post First Job
                </button>
              </div>
            ) : (
              dbJobs.map(job => (
                <div key={job.id} className="card p-5 bg-white shadow-sm rounded-3xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[9px] font-black tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                          {job.type}
                        </span>
                        <h3 className="font-bold text-gray-900 text-base mt-2 leading-tight">{job.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{job.location}</p>
                      </div>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this job listing?')) {
                            const { error } = await supabase.from('jobs').delete().eq('id', job.id);
                            if (error) alert(error.message);
                            else fetchData();
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.tags?.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs mt-auto">
                    <span className="text-gray-400 font-bold">Salary label:</span>
                    <span className="text-blue-600 font-black">{job.salary_label}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── APPLICATIONS VIEW ── */}
        {activeNav === '/employer/applications' && (
          appsLoading ? (
            <div className="flex justify-center py-20">
              <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
          ) : dbApplications.length === 0 ? (
            <div className="card text-center py-16 bg-white rounded-3xl">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-bold text-gray-805 text-lg">No applicant profiles found</p>
              <p className="text-gray-400 text-sm mt-1">Applications will show here once seekers start applying.</p>
            </div>
          ) : (
            <div className="card overflow-hidden bg-white shadow-sm rounded-3xl border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {['CANDIDATE', 'JOB POSITION', 'EXPERIENCE', 'RESUME DOCUMENT', 'STATUS ACTION'].map(col => (
                        <th key={col} className="text-left px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dbApplications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{app.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{app.email} • {app.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800">{app.job?.title}</p>
                          <p className="text-xs text-gray-400">{app.job?.location}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {app.experience}
                        </td>
                        <td className="px-6 py-4">
                          {app.resume_url ? (
                            <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs font-semibold bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                              <FileText size={13} /> View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={app.status} 
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                            className="text-xs font-bold rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="new">APPLIED</option>
                            <option value="under_review">UNDER REVIEW</option>
                            <option value="shortlisted">SHORTLISTED</option>
                            <option value="rejected">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ── ANALYTICS VIEW ── */}
        {activeNav === '/employer/analytics' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6 bg-white rounded-3xl">
              <h3 className="font-bold text-gray-900 text-base mb-6">Monthly Recipient Traffic</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={getChartData()} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6 bg-white rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-6">Funnel Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                      <span>Total Submissions</span>
                      <span className="text-gray-800">{totalApplicants}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                      <span>Under Review</span>
                      <span className="text-gray-800">{underReviewCount}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${totalApplicants > 0 ? (underReviewCount / totalApplicants) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                      <span>Shortlisted</span>
                      <span className="text-gray-800">{shortlistedCount}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${totalApplicants > 0 ? (shortlistedCount / totalApplicants) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mt-6 text-xs leading-relaxed text-blue-700 font-medium">
                Tip: Update candidate review statuses regularly. Unreviewed profiles are marked as stale after 14 days and may lower candidate match metrics.
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS VIEW ── */}
        {activeNav === '/employer/settings' && (
          <div className="card p-6 sm:p-8 bg-white max-w-2xl shadow-md border-gray-100 rounded-[28px]">
            {companySuccess && (
              <div className={`p-4 rounded-xl text-sm mb-6 border ${
                companySuccess.startsWith('Error') 
                  ? 'bg-red-50 text-red-650 border-red-200' 
                  : 'bg-green-50 text-green-600 border-green-200'
              }`}>
                {companySuccess}
              </div>
            )}

            <form onSubmit={handleSaveCompany} className="space-y-6">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Building2 size={16} /> Enterprise Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Org Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Organisation Name</label>
                  <input type="text" value={companyForm.organisationName} required
                    onChange={e => setCompanyForm({ ...companyForm, organisationName: e.target.value })}
                    className="input-field bg-gray-50/50" />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Recruiter Full Name</label>
                  <input type="text" value={companyForm.name} required
                    onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="input-field bg-gray-50/50" />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mobile Phone</label>
                  <input type="tel" value={companyForm.mobile} required
                    onChange={e => setCompanyForm({ ...companyForm, mobile: e.target.value })}
                    className="input-field bg-gray-50/50" />
                </div>

                {/* ID Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">ID Type</label>
                  <select value={companyForm.idType} required
                    onChange={e => setCompanyForm({ ...companyForm, idType: e.target.value })}
                    className="input-field bg-gray-50/50">
                    <option value="PAN">PAN</option>
                    <option value="GST">GST</option>
                  </select>
                </div>

                {/* ID Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">ID Number</label>
                  <input type="text" value={companyForm.idNumber} required
                    onChange={e => setCompanyForm({ ...companyForm, idNumber: e.target.value.toUpperCase() })}
                    className="input-field bg-gray-50/50" />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Organisation Corporate Address</label>
                  <textarea value={companyForm.address} required rows={3}
                    onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                    className="input-field bg-gray-50/50 py-3 resize-y" />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={companySaving}
                  className="btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm disabled:opacity-70 flex items-center gap-2">
                  {companySaving ? (
                    <>
                      <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                      </svg>
                      Saving Details...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ── POST JOB MODAL ── */}
      {postJobModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPostJobModal(false)}>
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 relative overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Post a Job Opening</h3>
              <button onClick={() => setPostJobModal(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-650">
                <X size={20} />
              </button>
            </div>

            {postSuccess && (
              <div className={`p-3 rounded-xl text-sm mb-4 border ${
                postSuccess.startsWith('Error') 
                  ? 'bg-red-50 text-red-650 border-red-200' 
                  : 'bg-green-50 text-green-650 border-green-200'
              }`}>
                {postSuccess}
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                  <input type="text" placeholder="e.g. Senior Frontend Developer" required
                    value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input type="text" placeholder="e.g. Mumbai (Hybrid)" required
                    value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience Required</label>
                  <input type="text" placeholder="e.g. 5 - 8 years" required
                    value={newJob.experience} onChange={e => setNewJob({ ...newJob, experience: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Type</label>
                  <select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })} required
                    className="input-field py-2.5 appearance-none pr-8">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Salary Min */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Salary (Monthly)</label>
                  <input type="number" placeholder="e.g. 80000" required
                    value={newJob.salaryMin} onChange={e => setNewJob({ ...newJob, salaryMin: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Salary Max */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Salary (Monthly)</label>
                  <input type="number" placeholder="e.g. 120000" required
                    value={newJob.salaryMax} onChange={e => setNewJob({ ...newJob, salaryMax: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Skills Tags (comma separated)</label>
                  <input type="text" placeholder="e.g. React, Node.js, Next.js"
                    value={newJob.tags} onChange={e => setNewJob({ ...newJob, tags: e.target.value })}
                    className="input-field py-2.5" />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Description</label>
                  <textarea placeholder="Outline job responsibilities and project details..." required rows={4}
                    value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                    className="input-field py-2.5 resize-y" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setPostJobModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={jobPosting}
                  className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md">
                  {jobPosting ? (
                    <>
                      <svg className="spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                      </svg>
                      Publishing...
                    </>
                  ) : 'Publish Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
