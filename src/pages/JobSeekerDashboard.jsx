import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Bookmark, FileText, Zap, Settings,
  HelpCircle, LogOut, Bell, Video, TrendingUp, ChevronRight, Menu, X, Check,
  MapPin, Briefcase, Calendar, Shield, Phone, Mail, Award, Lock, Building2, Save
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { mockInterviews, mockNotifications } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User,            label: 'My Profile', path: '/profile' },
  { icon: Bookmark,        label: 'Saved Jobs',  path: '/saved-jobs' },
  { icon: FileText,        label: 'Applications', path: '/applications' },
  { icon: Zap,             label: 'Recommended', path: '/recommended' },
  { icon: Settings,        label: 'Settings',    path: '/settings' },
];

export default function JobSeekerDashboard() {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // DB States
  const [jobs, setJobs] = useState([]);
  const [dbApplications, setDbApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    mobile: '',
    currentAddress: '',
    permanentAddress: '',
    pinCode: '',
    district: '',
    state: '',
    qualification: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [sameAddress, setSameAddress] = useState(false);

  // Load Saved Jobs and sync address
  useEffect(() => {
    const saved = localStorage.getItem('staffadda_saved_jobs');
    if (saved) {
      try {
        setSavedJobIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync profileForm with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        dob: user.dob || '',
        mobile: user.mobile || '',
        currentAddress: user.currentAddress || '',
        permanentAddress: user.permanentAddress || '',
        pinCode: user.pinCode || '',
        district: user.district || '',
        state: user.state || '',
        qualification: user.qualification || ''
      });
      setSameAddress(user.currentAddress === user.permanentAddress && !!user.currentAddress);
    }
  }, [user, activeNav]);

  // Handle same address toggle
  useEffect(() => {
    if (sameAddress) {
      setProfileForm(prev => ({
        ...prev,
        permanentAddress: prev.currentAddress
      }));
    }
  }, [sameAddress, profileForm.currentAddress]);

  // Fetch Jobs & Applications from Supabase
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setAppsLoading(true);
      setJobsLoading(true);
      try {
        // Fetch applications
        const { data: appsData, error: appsErr } = await supabase
          .from('applications')
          .select('*, job:jobs(*)')
          .eq('job_seeker_id', user.id)
          .order('applied_at', { ascending: false });

        if (appsErr) throw appsErr;
        setDbApplications(appsData || []);

        // Fetch jobs
        const { data: jobsData, error: jobsErr } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (jobsErr) throw jobsErr;

        const mappedJobs = (jobsData || []).map(j => ({
          id: j.id,
          title: j.title,
          salaryLabel: j.salary_label || `${j.salary_currency}${j.salary_min?.toLocaleString()} - ${j.salary_currency}${j.salary_max?.toLocaleString()} /Month`,
          company: j.company_name,
          companyLogo: j.company_logo,
          companyColor: j.company_color || '#3b82f6',
          location: j.location,
          experience: j.experience,
          tags: j.tags || [],
          type: j.type,
          description: j.description
        }));
        setJobs(mappedJobs);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setAppsLoading(false);
        setJobsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, activeNav]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileForm.name,
          father_name: profileForm.fatherName,
          mother_name: profileForm.motherName,
          dob: profileForm.dob || null,
          mobile: profileForm.mobile,
          current_address: profileForm.currentAddress,
          permanent_address: sameAddress ? profileForm.currentAddress : profileForm.permanentAddress,
          pin_code: profileForm.pinCode,
          district: profileForm.district,
          state: profileForm.state,
          qualification: profileForm.qualification
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      setProfileSuccess('Profile details saved successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setProfileSuccess('Error updating profile: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    const list = savedJobIds.includes(jobId) 
      ? savedJobIds.filter(id => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(list);
    localStorage.setItem('staffadda_saved_jobs', JSON.stringify(list));
  };

  // Profile completion calculation
  const getCompletion = () => {
    if (!user) return 35;
    let count = 35;
    if (user.mobile) count += 10;
    if (user.qualification) count += 15;
    if (user.dob) count += 10;
    if (user.currentAddress) count += 15;
    if (user.fatherName) count += 15;
    return Math.min(100, count);
  };

  const profileCompletion = getCompletion();

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

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <button className="sidebar-link"><HelpCircle size={16} />Help Center</button>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link text-gray-500 hover:!text-red-500 hover:!bg-red-50">
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
            <span className="text-sm font-bold brand-gradient-text tracking-tight">StaffAdda Seeker</span>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden brand-gradient flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.slice(0, 2).toUpperCase() || 'AJ'}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeNav === '/dashboard' && `Welcome back, ${user?.name?.split(' ')[0] || 'Seeker'}!`}
              {activeNav === '/profile' && 'My Profile Details'}
              {activeNav === '/saved-jobs' && 'Saved Opportunities'}
              {activeNav === '/applications' && 'My Job Applications'}
              {activeNav === '/recommended' && 'Recommended Jobs'}
              {activeNav === '/settings' && 'Account Settings'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {activeNav === '/dashboard' && "Here's what's happening with your job applications today."}
              {activeNav === '/profile' && 'Manage your professional details to attract leading recruiters.'}
              {activeNav === '/saved-jobs' && 'Review and apply to positions you marked for later.'}
              {activeNav === '/applications' && 'Track the real-time review status of your applications.'}
              {activeNav === '/recommended' && 'Tailored job matches based on your profile qualification.'}
              {activeNav === '/settings' && 'Configure and secure your StaffAdda credentials.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl bg-white">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full pulse-dot" />
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden brand-gradient flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.slice(0, 2).toUpperCase() || 'AJ'}
            </div>
          </div>
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeNav === '/dashboard' && (
          <>
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Profile Completion */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-900 text-sm leading-snug">Profile<br />Completion</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${profileCompletion === 100 ? 'text-green-600 bg-green-50' : 'text-teal-600 bg-teal-50'}`}>
                    {profileCompletion}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="h-2 brand-gradient rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {profileCompletion < 100 
                    ? 'Fill out all details in the "My Profile" tab to reach 100% and unlock double recruiter search views.'
                    : 'Your profile is fully completed and ready! You are obtaining maximum visibility in searches.'}
                </p>
                <button onClick={() => setActiveNav('/profile')} className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold">
                  {profileCompletion < 100 ? 'Complete Profile' : 'Edit Profile'}
                </button>
              </div>

              {/* Applied Jobs */}
              <div className="card p-5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                    <FileText size={18} className="text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Applied Jobs</p>
                  <p className="text-4xl font-bold text-gray-900">{dbApplications.length}</p>
                </div>
                <button onClick={() => setActiveNav('/applications')} className="text-blue-600 text-xs font-semibold hover:underline text-left mt-3">
                  Track Applications →
                </button>
              </div>

              {/* Saved Jobs */}
              <div className="card p-5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
                    <Bookmark size={18} className="text-pink-500" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saved Jobs</p>
                  <p className="text-4xl font-bold text-gray-900">{savedJobIds.length}</p>
                </div>
                <button onClick={() => setActiveNav('/saved-jobs')} className="text-blue-600 text-xs font-semibold hover:underline text-left mt-3">
                  View Saved Jobs →
                </button>
              </div>

              {/* Interviews */}
              <div className="card p-5 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                    <Video size={18} className="text-teal-500" />
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Interviews Scheduled</p>
                  <p className="text-4xl font-bold text-gray-900">{mockInterviews.length}</p>
                </div>
                <span className="text-xs text-blue-600 font-semibold mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                  Round 2 Tomorrow
                </span>
              </div>
            </div>

            {/* Lower row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recommended Jobs */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-xl">Recommended Opportunities</h2>
                  <Link to="/jobs" className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Search All <ChevronRight size={14} />
                  </Link>
                </div>
                {jobsLoading ? (
                  <div className="card p-10 flex justify-center">
                    <svg className="spin w-6 h-6 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {jobs.slice(0, 4).map(job => {
                      const isApplied = dbApplications.some(a => a.job_id === job.id);
                      return (
                        <div key={job.id} className="card p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden bg-white border border-gray-100 shadow-sm"
                                  style={{ backgroundColor: job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? '#ffffff' : job.companyColor }}>
                                  {job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? (
                                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1.5" />
                                  ) : (
                                    job.companyLogo
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm leading-tight">{job.title}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">{job.company} • {job.location}</p>
                                </div>
                              </div>
                              <Bookmark 
                                size={15} 
                                onClick={() => toggleSaveJob(job.id)}
                                className={`cursor-pointer transition-colors mt-0.5 ${savedJobIds.includes(job.id) ? 'text-blue-600 fill-blue-600' : 'text-gray-300 hover:text-blue-600'}`} 
                              />
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">{job.type}</span>
                              <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{job.salaryLabel}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => navigate(`/apply/${job.id}`)}
                            disabled={isApplied}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                              isApplied 
                                ? 'bg-emerald-50 border border-emerald-500 text-emerald-600 cursor-not-allowed flex items-center justify-center gap-1' 
                                : 'btn-primary'
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <Check size={14} className="stroke-[3]" />
                                Applied
                              </>
                            ) : 'Apply Now'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Side Panels */}
              <div className="space-y-5">
                {/* Interviews */}
                <div className="card p-5 bg-white">
                  <h3 className="font-bold text-gray-900 mb-4">Upcoming Interviews</h3>
                  <div className="space-y-3">
                    {mockInterviews.map(iv => (
                      <div key={iv.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <div className="text-center shrink-0">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">{iv.monthLabel}</p>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: iv.color }}>
                            {iv.dateLabel}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{iv.company}</p>
                          <p className="text-xs text-gray-400">{iv.time} • {iv.round}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Video size={13} className="text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="card p-5 bg-white">
                  <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    {mockNotifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                          style={{ backgroundColor: n.bgColor }}>
                          {n.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-700 leading-snug break-words">
                            {n.isUrgent && <span className="text-orange-500 font-bold">Urgent: </span>}
                            <span dangerouslySetInnerHTML={{ __html: n.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PROFILE TAB ── */}
        {activeNav === '/profile' && (
          <div className="card p-6 sm:p-8 bg-white max-w-4xl shadow-md border-gray-100 rounded-[28px]">
            {profileSuccess && (
              <div className={`p-4 rounded-xl text-sm mb-6 border ${
                profileSuccess.startsWith('Error') 
                  ? 'bg-red-50 text-red-600 border-red-200' 
                  : 'bg-green-50 text-green-600 border-green-200'
              }`}>
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Section: Personal Info */}
              <div>
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <User size={16} /> Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                    <input type="text" value={profileForm.name} required
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field bg-gray-50/50" />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mobile Number</label>
                    <input type="tel" value={profileForm.mobile} required
                      onChange={e => setProfileForm({ ...profileForm, mobile: e.target.value })}
                      className="input-field bg-gray-50/50" />
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Father's Name</label>
                    <input type="text" value={profileForm.fatherName} required
                      onChange={e => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                      className="input-field bg-gray-50/50" />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mother's Name</label>
                    <input type="text" value={profileForm.motherName} required
                      onChange={e => setProfileForm({ ...profileForm, motherName: e.target.value })}
                      className="input-field bg-gray-50/50" />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date of Birth</label>
                    <input type="date" value={profileForm.dob} required
                      onChange={e => setProfileForm({ ...profileForm, dob: e.target.value })}
                      className="input-field bg-gray-50/50" />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Qualification</label>
                    <select value={profileForm.qualification} required
                      onChange={e => setProfileForm({ ...profileForm, qualification: e.target.value })}
                      className="input-field bg-gray-50/50 pr-8 appearance-none">
                      <option value="">Select Qualification</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Address */}
              <div className="pt-4">
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <MapPin size={16} /> Address Details
                </h3>
                <div className="space-y-4">
                  {/* Current Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Current Address</label>
                    <textarea value={profileForm.currentAddress} required rows={3}
                      onChange={e => setProfileForm({ ...profileForm, currentAddress: e.target.value })}
                      className="input-field bg-gray-50/50 py-3 resize-y" />
                  </div>

                  {/* Same Address Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-650">Permanent address is same as current address</span>
                  </label>

                  {/* Permanent Address */}
                  {!sameAddress && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Permanent Address</label>
                      <textarea value={profileForm.permanentAddress} required={!sameAddress} rows={3}
                        onChange={e => setProfileForm({ ...profileForm, permanentAddress: e.target.value })}
                        className="input-field bg-gray-50/50 py-3 resize-y" />
                    </div>
                  )}

                  {/* Pin Code, District, State */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Pin Code</label>
                      <input type="text" value={profileForm.pinCode} required
                        onChange={e => setProfileForm({ ...profileForm, pinCode: e.target.value })}
                        className="input-field bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">District</label>
                      <input type="text" value={profileForm.district} required
                        onChange={e => setProfileForm({ ...profileForm, district: e.target.value })}
                        className="input-field bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">State</label>
                      <input type="text" value={profileForm.state} required
                        onChange={e => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="input-field bg-gray-50/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <button type="submit" disabled={profileSaving}
                  className="btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm disabled:opacity-70 flex items-center gap-2">
                  {profileSaving ? (
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

        {/* ── APPLICATIONS TAB ── */}
        {activeNav === '/applications' && (
          appsLoading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
          ) : dbApplications.length === 0 ? (
            <div className="card text-center py-16 bg-white">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-semibold text-gray-700">No applications found</p>
              <p className="text-gray-400 text-sm mt-1">You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="btn-primary inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-bold">Browse Jobs</Link>
            </div>
          ) : (
            <div className="card overflow-hidden bg-white shadow-md border-gray-100 rounded-[24px]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Job Title', 'Company', 'Date Applied', 'Resume File', 'Status'].map(col => (
                        <th key={col} className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dbApplications.map(app => {
                      const statusCls = app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                                        app.status === 'under_review' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                                        app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-250' :
                                        'bg-blue-50 text-blue-700 border-blue-250';
                      const statusLabel = app.status === 'shortlisted' ? 'SHORTLISTED' :
                                          app.status === 'under_review' ? 'UNDER REVIEW' :
                                          app.status === 'rejected' ? 'REJECTED' : 'APPLIED';
                      return (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 text-sm">{app.job?.title || 'Unknown Role'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{app.job?.location}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-700">{app.job?.company_name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            {app.resume_url ? (
                              <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold flex items-center gap-1">
                                <FileText size={13} /> {app.resume_name}
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCls}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ── SAVED JOBS TAB ── */}
        {activeNav === '/saved-jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsLoading ? (
              <div className="col-span-2 flex justify-center py-20">
                <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            ) : jobs.filter(j => savedJobIds.includes(j.id)).length === 0 ? (
              <div className="col-span-2 card text-center py-16 bg-white">
                <p className="text-4xl mb-3">🔖</p>
                <p className="font-semibold text-gray-700">No saved jobs</p>
                <p className="text-gray-400 text-sm mt-1">Bookmark jobs you like from the search page.</p>
                <Link to="/jobs" className="btn-primary inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-bold">Search Jobs</Link>
              </div>
            ) : (
              jobs.filter(j => savedJobIds.includes(j.id)).map(job => {
                const isApplied = dbApplications.some(a => a.job_id === job.id);
                return (
                  <div key={job.id} className="card p-5 bg-white shadow-sm border-gray-150 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden bg-white border border-gray-100 shadow-sm"
                            style={{ backgroundColor: job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? '#ffffff' : job.companyColor }}>
                            {job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? (
                              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1.5" />
                            ) : (
                              job.companyLogo
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{job.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        <Bookmark 
                          size={15} 
                          onClick={() => toggleSaveJob(job.id)}
                          className="text-blue-600 fill-blue-600 cursor-pointer" 
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">{job.type}</span>
                        <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{job.salaryLabel}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/apply/${job.id}`)}
                      disabled={isApplied}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isApplied 
                          ? 'bg-emerald-50 border border-emerald-500 text-emerald-600 cursor-not-allowed flex items-center justify-center gap-1' 
                          : 'btn-primary'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          Applied
                        </>
                      ) : 'Apply Now'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── RECOMMENDED TAB ── */}
        {activeNav === '/recommended' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsLoading ? (
              <div className="col-span-2 flex justify-center py-20">
                <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            ) : jobs.length === 0 ? (
              <div className="col-span-2 card text-center py-16 bg-white">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-700">No recommended jobs</p>
                <p className="text-gray-400 text-sm mt-1">Check back later for matching openings.</p>
              </div>
            ) : (
              jobs.map(job => {
                const isApplied = dbApplications.some(a => a.job_id === job.id);
                return (
                  <div key={job.id} className="card p-5 bg-white shadow-sm border-gray-150 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden bg-white border border-gray-100 shadow-sm"
                            style={{ backgroundColor: job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? '#ffffff' : job.companyColor }}>
                            {job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? (
                              <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1.5" />
                            ) : (
                              job.companyLogo
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{job.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{job.company} • {job.location}</p>
                          </div>
                        </div>
                        <Bookmark 
                          size={15} 
                          onClick={() => toggleSaveJob(job.id)}
                          className={`cursor-pointer transition-colors mt-0.5 ${savedJobIds.includes(job.id) ? 'text-blue-600 fill-blue-600' : 'text-gray-300 hover:text-blue-600'}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">{job.type}</span>
                        <span className="tag-gray px-2.5 py-0.5 rounded-full text-[10px] font-semibold">{job.salaryLabel}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/apply/${job.id}`)}
                      disabled={isApplied}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isApplied 
                          ? 'bg-emerald-50 border border-emerald-500 text-emerald-600 cursor-not-allowed flex items-center justify-center gap-1' 
                          : 'btn-primary'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          Applied
                        </>
                      ) : 'Apply Now'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeNav === '/settings' && (
          <div className="card p-6 sm:p-8 bg-white max-w-md shadow-md border-gray-100 rounded-[28px] space-y-6">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
              <Shield size={16} /> Account Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase">Registered Email</span>
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mt-1">
                  <Mail size={14} className="text-gray-400" /> {user?.email}
                </span>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase">Account Type</span>
                <span className="text-xs font-black tracking-wide text-blue-600 bg-blue-50/80 border border-blue-100/50 px-2.5 py-1 rounded-full uppercase inline-block mt-1">
                  JOB SEEKER
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
                    if (error) throw error;
                    alert('Password reset link sent to ' + user.email);
                  } catch (e) {
                    alert('Failed to send reset link: ' + e.message);
                  }
                }}
                className="w-full py-3 border border-blue-200 text-blue-600 font-bold rounded-2xl text-xs hover:bg-blue-50/40 transition-all flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Send Password Reset Email
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
