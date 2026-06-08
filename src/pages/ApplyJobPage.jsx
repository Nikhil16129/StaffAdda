import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Check, User, Mail, Phone, 
  Briefcase, Link2, FileText, X, AlertCircle, Building2, MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { supabase } from '../utils/supabaseClient';

export default function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('2-5 years');
  const [portfolio, setPortfolio] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
        if (error) throw error;
        setJob({
          id: data.id,
          title: data.title,
          salaryLabel: data.salary_label || (data.salary_min && data.salary_max 
            ? `${data.salary_currency}${data.salary_min.toLocaleString()} - ${data.salary_currency}${data.salary_max.toLocaleString()} /Month`
            : 'Salary Negotiable'),
          company: data.company_name,
          companyLogo: data.company_logo,
          companyColor: data.company_color || '#3b82f6',
          location: data.location,
          experience: data.experience,
          tags: data.tags || [],
          type: data.type,
          description: data.description,
          employerId: data.employer_id
        });
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setJobLoading(false);
      }
    };
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);
  
  // File upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');


  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Prefill user details if they change/load later
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Please select a valid document (PDF, DOC, or DOCX)');
      return;
    }

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadError('');
    setFile(selectedFile);
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number (10+ digits)';
    }
    if (!file) errors.file = 'Please upload your resume';
    return errors;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`${firstErrorKey}-input`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    setUploadError('');

    try {
      let resumeUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id || 'anonymous'}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('resumes')
          .upload(fileName, file);

        if (uploadErr) {
          throw new Error('Resume upload failed: ' + uploadErr.message);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);
        resumeUrl = publicUrl;
      }

      const { error: insertErr } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          job_seeker_id: user?.id || null,
          name: name,
          email: email,
          phone: phone,
          experience: experience,
          portfolio: portfolio,
          linkedin: linkedIn,
          resume_name: file.name,
          resume_url: resumeUrl,
          status: 'new'
        });

      if (insertErr) {
        throw new Error('Failed to submit application: ' + insertErr.message);
      }

      setSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setUploadError(err.message);
      setSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <svg className="spin w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <p className="text-gray-500 text-sm font-semibold">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Job Not Found</h1>
            <p className="text-gray-400 text-sm mt-2">The job listing you are looking for does not exist or has expired.</p>
            <Link to="/jobs" className="btn-primary inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-bold">Browse Other Jobs</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Styled background wrapper */}
      <div className="flex-1 pt-24 pb-10 px-4 md:px-8 relative overflow-hidden" 
           style={{ background: 'radial-gradient(circle at 85% 15%, rgba(37, 99, 235, 0.03) 0%, transparent 60%), radial-gradient(circle at 15% 85%, rgba(124, 58, 237, 0.03) 0%, transparent 60%)' }}>
        
        <div className="max-w-3xl mx-auto">
          
          {/* Back Button */}
          <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>

          {!isSuccess ? (
            <div className="grid gap-6">
              
              {/* ── JOB DETAILS CARD ── */}
              <div className="card p-5 sm:p-6 border-slate-100 shadow-sm relative overflow-hidden bg-white">
                <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-bl-full pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden bg-white border border-gray-100 shadow-sm"
                      style={{ backgroundColor: job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? '#ffffff' : job.companyColor }}
                    >
                      {job.companyLogo && (job.companyLogo.startsWith('/') || job.companyLogo.includes('.')) ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1.5" />
                      ) : (
                        job.companyLogo
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                        Applying For
                      </span>
                      <h1 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                        <span className="font-semibold text-gray-700">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={13} className="text-gray-400" /> {job.location}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-bold">{job.salaryLabel || job.salary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {job.tags?.map(t => (
                      <span key={t} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── APPLICATION FORM ── */}
              <div className="card p-5 sm:p-8 border-slate-100 shadow-md bg-white">
                <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Application Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Step 1: Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div id="name-input">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="e.g. Arjun Malhotra"
                          value={name}
                          onChange={e => {
                            setName(e.target.value);
                            if(formErrors.name) setFormErrors({...formErrors, name: ''});
                          }}
                          className={`input-field ${formErrors.name ? 'border-red-400 focus:border-red-500 focus:shadow-red-500/10' : ''}`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div id="email-input">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="name@gmail.com"
                          value={email}
                          onChange={e => {
                            setEmail(e.target.value);
                            if(formErrors.email) setFormErrors({...formErrors, email: ''});
                          }}
                          className={`input-field ${formErrors.email ? 'border-red-400 focus:border-red-500 focus:shadow-red-500/10' : ''}`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div id="phone-input">
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={phone}
                          onChange={e => {
                            setPhone(e.target.value);
                            if(formErrors.phone) setFormErrors({...formErrors, phone: ''});
                          }}
                          className={`input-field ${formErrors.phone ? 'border-red-400 focus:border-red-500 focus:shadow-red-500/10' : ''}`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Total Experience <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={experience}
                          onChange={e => setExperience(e.target.value)}
                          className="input-field appearance-none bg-gray-50 cursor-pointer"
                        >
                          <option>Entry Level (0-2 years)</option>
                          <option>2-5 years</option>
                          <option>5-10 years</option>
                          <option>10+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Portfolio */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                        Portfolio Website <span className="text-xs font-normal text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://myportfolio.com"
                          value={portfolio}
                          onChange={e => setPortfolio(e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                        LinkedIn URL <span className="text-xs font-normal text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={linkedIn}
                          onChange={e => setLinkedIn(e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload Box */}
                  <div id="file-input">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 flex justify-between">
                      Upload Resume <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-gray-400">PDF, DOC, DOCX up to 5MB</span>
                    </label>
                    
                    {!file ? (
                      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-all text-center ${formErrors.file ? 'border-red-300 bg-red-50/10' : 'border-gray-200'}`}>
                        <Upload size={28} className={`mb-2.5 ${formErrors.file ? 'text-red-400' : 'text-slate-400'}`} />
                        <p className="text-sm font-bold text-slate-700">Click to upload your resume</p>
                        <p className="text-xs text-slate-400 mt-1">or drag and drop here</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                            {uploading ? (
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div className="h-1.5 bg-blue-600 rounded-full transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{uploadProgress}%</span>
                              </div>
                            ) : (
                              <p className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-1">
                                <Check size={12} /> Uploaded & Verified
                              </p>
                            )}
                          </div>
                        </div>

                        <button 
                          type="button" 
                          onClick={removeFile}
                          className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {uploadError}
                      </p>
                    )}
                    {formErrors.file && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.file}
                      </p>
                    )}
                  </div>


                  {/* Submit buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="btn-primary flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {submitting ? (
                        <>
                          <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                          </svg>
                          Submitting Application...
                        </>
                      ) : 'Submit Application'}
                    </button>
                    <Link
                      to="/jobs"
                      className="px-6 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 text-sm text-center transition-colors"
                    >
                      Cancel
                    </Link>
                  </div>

                </form>
              </div>

            </div>
          ) : (
            
            /* ── SUCCESS SCREEN WITH SPARKS / INTERACTIVE PATHS ── */
            <div className="card p-8 text-center bg-white border-slate-100 shadow-xl relative overflow-hidden flex flex-col items-center">
              
              {/* Confetti particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <style>{`
                  @keyframes fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
                  }
                  .confetti {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: fall 3s linear infinite;
                  }
                `}</style>
                {[
                  { left: '10%', delay: '0s', color: '#3b82f6' },
                  { left: '25%', delay: '1.2s', color: '#10b981' },
                  { left: '45%', delay: '0.5s', color: '#f59e0b' },
                  { left: '65%', delay: '2.1s', color: '#8b5cf6' },
                  { left: '80%', delay: '0.8s', color: '#ec4899' },
                  { left: '90%', delay: '1.7s', color: '#10b981' },
                ].map((c, i) => (
                  <div 
                    key={i} 
                    className="confetti" 
                    style={{ 
                      left: c.left, 
                      animationDelay: c.delay, 
                      backgroundColor: c.color, 
                      top: '-10px',
                      animationDuration: `${2 + Math.random() * 2}s`
                    }} 
                  />
                ))}
              </div>

              {/* Animated checkmark circle */}
              <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6 relative shadow-inner animate-bounce">
                <Check size={40} className="stroke-[3.5]" />
              </div>

              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Application Submitted!</h2>
              <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                Your application for <strong className="text-slate-800">{job.title}</strong> at <strong className="text-slate-800">{job.company}</strong> has been successfully received. We have sent a confirmation email to <strong className="text-slate-700">{email}</strong>.
              </p>

              {/* Submitted Details Box */}
              <div className="w-full max-w-md bg-slate-50/80 rounded-2xl p-5 border border-slate-100 text-left mb-8 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Submitted Details</p>
                <div className="grid grid-cols-3 text-xs gap-y-2">
                  <span className="text-slate-400 font-medium">Candidate:</span>
                  <span className="col-span-2 text-slate-800 font-bold">{name}</span>
                  
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span className="col-span-2 text-slate-800 font-bold">{phone}</span>

                  <span className="text-slate-400 font-medium">Experience:</span>
                  <span className="col-span-2 text-slate-800 font-bold">{experience}</span>

                  <span className="text-slate-400 font-medium">Resume File:</span>
                  <span className="col-span-2 text-blue-600 font-semibold truncate flex items-center gap-1">
                    <FileText size={12} /> {file?.name}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary py-3 rounded-xl font-bold text-sm flex-1"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/jobs')}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 rounded-xl font-semibold text-sm flex-1 transition-all"
                >
                  Explore More Jobs
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
