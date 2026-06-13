import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, User, Star, Phone, 
  MapPin, Calendar, Briefcase, Building, FileText 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('jobseeker');
  
  // Job Seeker Form State
  const [jobSeekerForm, setJobSeekerForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    mobile: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
    pinCode: '',
    district: '',
    state: '',
    qualification: '',
    password: '',
  });

  // Employer Form State
  const [employerForm, setEmployerForm] = useState({
    organisationName: '',
    address: '',
    idType: 'PAN',
    idNumber: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  // DOB Dropdowns State
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  // Automatically sync permanent address with current address if sameAddress is checked
  useEffect(() => {
    if (sameAddress) {
      setJobSeekerForm(prev => ({
        ...prev,
        permanentAddress: prev.currentAddress
      }));
    }
  }, [sameAddress, jobSeekerForm.currentAddress]);

  // Sync Day, Month, Year dropdowns with jobSeekerForm.dob
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setJobSeekerForm(prev => ({
        ...prev,
        dob: `${dobYear}-${dobMonth}-${dobDay}`
      }));
    } else {
      setJobSeekerForm(prev => ({
        ...prev,
        dob: ''
      }));
    }
  }, [dobDay, dobMonth, dobYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { 
      setError('Please agree to the Terms.'); 
      return; 
    }

    const activePassword = role === 'jobseeker' ? jobSeekerForm.password : employerForm.password;
    if (activePassword.length < 8) { 
      setError('Password must be at least 8 characters.'); 
      return; 
    }

    setError('');
    try {
      if (role === 'jobseeker') {
        const extraFields = {
          fatherName: jobSeekerForm.fatherName,
          motherName: jobSeekerForm.motherName,
          dob: jobSeekerForm.dob,
          mobile: jobSeekerForm.mobile,
          currentAddress: jobSeekerForm.currentAddress,
          permanentAddress: sameAddress ? jobSeekerForm.currentAddress : jobSeekerForm.permanentAddress,
          pinCode: jobSeekerForm.pinCode,
          district: jobSeekerForm.district,
          state: jobSeekerForm.state,
          qualification: jobSeekerForm.qualification,
        };
        const result = await register(
          jobSeekerForm.name, 
          jobSeekerForm.email, 
          jobSeekerForm.password, 
          'jobseeker', 
          extraFields
        );
        if (result && !result.session) {
          navigate('/login', { state: { successMessage: 'Registration successful! Please check your email to confirm your account before logging in.' } });
        } else {
          navigate('/dashboard');
        }
      } else {
        const extraFields = {
          organisationName: employerForm.organisationName,
          address: employerForm.address,
          idType: employerForm.idType,
          idNumber: employerForm.idNumber,
          mobile: employerForm.mobile,
        };
        const result = await register(
          employerForm.organisationName, 
          employerForm.email, 
          employerForm.password, 
          'employer', 
          extraFields
        );
        if (result && !result.session) {
          navigate('/login', { state: { successMessage: 'Registration successful! Please check your email to confirm your account before logging in.' } });
        } else {
          navigate('/employer/dashboard');
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL (blue gradient with testimonial) ── */}
      <div className="hidden lg:flex flex-col w-[46%] shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #3b5bdb 0%, #5f27cd 100%)' }}>

        {/* Decorative circle */}
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative p-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-white border border-white/20 rounded-2xl px-4 py-2 shadow-sm max-w-[180px] flex items-center justify-center">
              <img src="/logo-with-text.png" className="w-full h-auto object-contain" alt="StaffAdda Logo" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white/85 text-lg font-medium leading-relaxed mb-auto">
            Join the most innovative network of professionals and premium employers. Your next career milestone starts here.
          </p>

          {/* Testimonial card */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 my-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-300 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center text-purple-900 font-bold text-sm">SS</div>
              </div>
              <div>
                <p className="text-blue-200 font-semibold text-sm">Sneha Sharma</p>
                <p className="text-blue-300 text-xs">Senior Product Designer @ TechFlow</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed italic">
              "StaffAdda completely transformed how I approach my job search. Within two weeks, I was connected with three top-tier companies that perfectly matched my skill set. The platform feels high-end and professional."
            </p>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="text-orange-400 fill-orange-400" />
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#e0c3fc','#a8d8ea','#c5e1a5'].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white/40" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-white/70 text-xs">Join 10,000+ professionals already hired.</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-8 overflow-y-auto">
        <div className={`w-full transition-all duration-300 ${role === 'jobseeker' ? 'max-w-2xl' : 'max-w-md'}`}>
          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/50 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="/logo-icon.png" className="w-7 h-7 object-contain" alt="StaffAdda Icon" />
            </div>
            <span className="font-bold brand-gradient-text text-base tracking-tight">StaffAdda</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm mb-6">Start your premium recruitment journey today.</p>

          {/* Role Switcher Segment Control */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole('jobseeker')}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${role === 'jobseeker' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${role === 'employer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Employer
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {role === 'jobseeker' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="John Doe" value={jobSeekerForm.name}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, name: e.target.value })} required className="input-field" />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" placeholder="john@example.com" value={jobSeekerForm.email}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, email: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Father's Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Robert Doe" value={jobSeekerForm.fatherName}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, fatherName: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Mother's Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Mary Doe" value={jobSeekerForm.motherName}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, motherName: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Date of Birth</label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Day Selector */}
                    <div className="relative">
                      <select 
                        value={dobDay} 
                        onChange={e => setDobDay(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all appearance-none pr-8"
                      >
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                          const val = d < 10 ? `0${d}` : `${d}`;
                          return <option key={val} value={val}>{d}</option>;
                        })}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                        ▼
                      </div>
                    </div>

                    {/* Month Selector */}
                    <div className="relative">
                      <select 
                        value={dobMonth} 
                        onChange={e => setDobMonth(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all appearance-none pr-8"
                      >
                        <option value="">Month</option>
                        {[
                          { v: '01', name: 'Jan' }, { v: '02', name: 'Feb' }, { v: '03', name: 'Mar' },
                          { v: '04', name: 'Apr' }, { v: '05', name: 'May' }, { v: '06', name: 'Jun' },
                          { v: '07', name: 'Jul' }, { v: '08', name: 'Aug' }, { v: '09', name: 'Sep' },
                          { v: '10', name: 'Oct' }, { v: '11', name: 'Nov' }, { v: '12', name: 'Dec' }
                        ].map(m => (
                          <option key={m.v} value={m.v}>{m.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                        ▼
                      </div>
                    </div>

                    {/* Year Selector */}
                    <div className="relative">
                      <select 
                        value={dobYear} 
                        onChange={e => setDobYear(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all appearance-none pr-8"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 70 }, (_, i) => 2015 - i).map(y => (
                          <option key={y} value={`${y}`}>{y}</option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-755 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="9876543210" value={jobSeekerForm.mobile}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, mobile: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Qualification</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={jobSeekerForm.qualification}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, qualification: e.target.value })} required className="input-field appearance-none pr-10">
                      <option value="">Select Qualification</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate (B.A., B.Sc., B.Com, B.Tech, etc.)</option>
                      <option value="Post Graduate">Post Graduate (M.A., M.Sc., M.Com, etc.)</option>
                      <option value="Doctorate">Doctorate (Ph.D.)</option>
                      <option value="Other">Other Certification</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={jobSeekerForm.password}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, password: e.target.value })} required className="input-field pr-12" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Current Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Current Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                    <textarea placeholder="Flat, House no., Building, Street, Area" value={jobSeekerForm.currentAddress}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, currentAddress: e.target.value })} required 
                      className="input-field pl-11 pt-3 pb-3 min-h-[80px] resize-y" />
                  </div>
                </div>

                {/* Pin Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Pin Code</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="110001" value={jobSeekerForm.pinCode}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, pinCode: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* District & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-750 mb-1.5">District</label>
                    <input type="text" placeholder="New Delhi" value={jobSeekerForm.district}
                      onChange={e => setJobSeekerForm({ ...jobSeekerForm, district: e.target.value })} required 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-750 mb-1.5">State</label>
                    <div className="relative">
                      <select value={jobSeekerForm.state}
                        onChange={e => setJobSeekerForm({ ...jobSeekerForm, state: e.target.value })} required 
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 appearance-none pr-8">
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Delhi">Delhi (UT)</option>
                        <option value="Jammu & Kashmir">Jammu & Kashmir (UT)</option>
                        <option value="Ladakh">Ladakh (UT)</option>
                        <option value="Puducherry">Puducherry (UT)</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkbox Same Address */}
                <div className="sm:col-span-2 py-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-semibold text-gray-600">Permanent address is same as current address</span>
                  </label>
                </div>

                {/* Permanent Address */}
                {!sameAddress && (
                  <div className="sm:col-span-2 transition-all duration-200">
                    <label className="block text-sm font-semibold text-gray-750 mb-1.5">Permanent Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                      <textarea placeholder="Flat, House no., Building, Street, Area" value={jobSeekerForm.permanentAddress}
                        onChange={e => setJobSeekerForm({ ...jobSeekerForm, permanentAddress: e.target.value })} required={!sameAddress}
                        className="input-field pl-11 pt-3 pb-3 min-h-[80px] resize-y" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Organisation Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Organisation Name</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Acme Corp Pvt Ltd" value={employerForm.organisationName}
                      onChange={e => setEmployerForm({ ...employerForm, organisationName: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" placeholder="hr@acme.com" value={employerForm.email}
                      onChange={e => setEmployerForm({ ...employerForm, email: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-755 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" placeholder="9876543210" value={employerForm.mobile}
                      onChange={e => setEmployerForm({ ...employerForm, mobile: e.target.value })} required className="input-field" />
                  </div>
                </div>

                {/* Id Type (PAN or GST) & Id Number */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-750 mb-1.5">ID Type</label>
                    <div className="relative">
                      <select value={employerForm.idType}
                        onChange={e => setEmployerForm({ ...employerForm, idType: e.target.value, idNumber: '' })} required 
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition-all duration-200 appearance-none pr-8">
                        <option value="PAN">PAN</option>
                        <option value="GST">GST</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-750 mb-1.5">ID Number</label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={employerForm.idType === 'PAN' ? 'ABCDE1234F' : '22AAAAA1111A1Z1'} 
                        value={employerForm.idNumber}
                        onChange={e => setEmployerForm({ ...employerForm, idNumber: e.target.value.toUpperCase() })} 
                        pattern={employerForm.idType === 'PAN' ? '[A-Z]{5}[0-9]{4}[A-Z]{1}' : '[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'}
                        title={employerForm.idType === 'PAN' ? 'Please enter a valid 10-digit PAN (e.g. ABCDE1234F)' : 'Please enter a valid 15-digit GSTIN'}
                        required 
                        className="input-field" 
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Organisation Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                    <textarea placeholder="Corporate office, Building, Area, City, State" value={employerForm.address}
                      onChange={e => setEmployerForm({ ...employerForm, address: e.target.value })} required 
                      className="input-field pl-11 pt-3 pb-3 min-h-[80px] resize-y" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-750 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={employerForm.password}
                      onChange={e => setEmployerForm({ ...employerForm, password: e.target.value })} required className="input-field pr-12" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 rounded-2xl text-sm font-bold disabled:opacity-70 flex items-center justify-center gap-2 mt-4 hover:shadow-lg transition-all duration-200">
              {loading ? (
                <>
                  <svg className="spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  Creating Account...
                </>
              ) : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
