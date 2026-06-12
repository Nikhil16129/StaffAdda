import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ChevronRight, ArrowRight, Terminal, Megaphone, Landmark, Palette, ShoppingCart, BriefcaseMedical, ArrowUpRight, Zap, ShieldCheck, ChevronLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { mockStats, mockSectors, mockTestimonials } from '../data/mockData';

const highImpactRoles = [
  {
    title: 'Senior Frontend Developer',
    company: 'PixelPerfect Solutions',
    location: 'Delhi',
    salary: '₹1.2 Lakh - ₹1.5 Lakh',
    badge: 'NEW POSTING',
    badgeClass: 'text-blue-600 bg-blue-50/80',
    tags: ['Remote', 'Full-time'],
    borderClass: 'border border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100/50',
    compColorClass: 'text-blue-600',
    compLabelColorClass: 'text-blue-400',
    buttonClass: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/20',
    logoType: 'pixel'
  },
  {
    title: 'UX/UI Architect',
    company: 'Creative Flow Studios',
    location: 'Kolkata',
    salary: '₹90,000 - ₹1.3 Lakh',
    badge: 'HYBRID',
    badgeClass: 'text-slate-500 bg-slate-100/80',
    tags: ['Project Based', '5+ Yrs Exp'],
    borderClass: 'border-2 border-purple-400/80 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/5',
    compColorClass: 'text-purple-600',
    compLabelColorClass: 'text-purple-400',
    buttonClass: 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100',
    logoType: 'creative'
  },
  {
    title: 'Product Lead (AI)',
    company: 'GrowthSpark AI',
    location: 'Ahmedabad',
    salary: '₹1.5 Lakh - ₹2 Lakh',
    badge: 'URGENT',
    badgeClass: 'text-teal-600 bg-teal-50/80',
    tags: ['On-site', 'Relocation'],
    borderClass: 'border-2 border-teal-400/80 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/5',
    compColorClass: 'text-teal-600',
    compLabelColorClass: 'text-teal-400',
    buttonClass: 'bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100',
    logoType: 'growth'
  }
];


const popularSectors = [
  {
    name: 'Software',
    count: '1.2k+ Opportunities',
    icon: Terminal,
    bgClass: 'bg-[#f0f5ff] text-[#2563eb]',
    textClass: 'text-[#2563eb]'
  },
  {
    name: 'Marketing',
    count: '800+ Opportunities',
    icon: Megaphone,
    bgClass: 'bg-[#fbf5ff] text-[#7c3aed]',
    textClass: 'text-[#7c3aed]'
  },
  {
    name: 'Finance',
    count: '650+ Opportunities',
    icon: Landmark,
    bgClass: 'bg-[#e6fcf5] text-[#059669]',
    textClass: 'text-[#059669]'
  },
  {
    name: 'Design',
    count: '420+ Opportunities',
    icon: Palette,
    bgClass: 'bg-[#f0f5ff] text-[#2563eb]',
    textClass: 'text-[#2563eb]'
  },
  {
    name: 'Sales',
    count: '940+ Opportunities',
    icon: ShoppingCart,
    bgClass: 'bg-[#fbf5ff] text-[#7c3aed]',
    textClass: 'text-[#7c3aed]'
  },
  {
    name: 'Healthcare',
    count: '310+ Opportunities',
    icon: BriefcaseMedical,
    bgClass: 'bg-[#eefdfa] text-[#0d9488]',
    textClass: 'text-[#0d9488]'
  }
];

const eliteTestimonials = [
  {
    id: 1,
    name: 'SNEHA SHARMA',
    role: 'PRODUCT DESIGNER • RELIANCE JIO',
    quote: 'The cinematic interface and precise matching algorithm streamlined my entire transition. I secured a Lead Architect role in less than 20 days.',
    avatar: '/avatar_sarah.png',
    starColorClass: 'text-[#2563eb]',
    roleColorClass: 'text-[#2563eb]'
  },
  {
    id: 2,
    name: 'ROHAN MEHTA',
    role: 'SOLUTION ARCHITECT',
    quote: 'Premium experience from start to finish. The verified enterprise badges eliminated the noise, allowing me to focus on high-value interactions.',
    avatar: '/avatar_michael.png',
    starColorClass: 'text-[#7c3aed]',
    roleColorClass: 'text-[#7c3aed]'
  },
  {
    id: 3,
    name: 'DIVYA NAIR',
    role: 'MARKETING VP',
    quote: 'The interface is stunningly clean, and the level of analytics provided during the matchmaking process is unmatched in the industry.',
    avatar: '/avatar_elena.png',
    starColorClass: 'text-[#0d9488]',
    roleColorClass: 'text-[#0d9488]'
  }
];


export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [testiIndex, setTestiIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0b0f19] text-white relative overflow-hidden min-h-[680px] flex items-center pt-24 pb-16">
        
        {/* The photo in the background, aligned to the right side */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 select-none pointer-events-none z-0">
          <img 
            src="/hero_vr.png" 
            alt="VR Candidate Background" 
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Edge fading gradients to blend the image seamlessly into the dark background */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-1/3 bg-gradient-to-r from-[#0b0f19] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b0f19] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-[#0b0f19] to-transparent" />
        </div>

        {/* Decorative glows */}
        <div className="absolute left-1/4 top-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Heading, Subtitle, Search, Avatars */}
            <div>
              {/* Eyebrow link with line */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-blue-500" />
                <span className="text-[11px] text-blue-400 font-extrabold uppercase tracking-widest">
                  The Future of Talent Acquisition
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                Find Your<br />
                Dream Job<br />
                <span className="text-blue-500 italic font-black">Faster</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Experience a cinematic journey to your next career milestone. We connect top-tier talent with innovative global leaders using high-performance search technology.
              </p>

              {/* Styled search bar matching mockup */}
              <form
                onSubmit={e => { e.preventDefault(); navigate(`/jobs?q=${query}`); }}
                className="bg-white rounded-[24px] p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-xl border border-slate-800 max-w-xl mb-12 relative z-20"
              >
                <div className="flex items-center gap-3 flex-1 px-4 py-2 sm:py-0">
                  <Search size={20} className="text-slate-400 shrink-0" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Job Title, Skills"
                    className="w-full py-2 sm:py-3.5 text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3.5 rounded-[18px] font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer">
                  Explore
                </button>
              </form>

              {/* Overlapping avatar professionals row */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-slate-900 shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-slate-900 shrink-0 flex items-center justify-center text-white text-[10px] font-extrabold">
                    1k+
                  </div>
                </div>
                <p className="text-slate-300 text-sm font-medium">
                  <strong className="text-white font-extrabold">1200+ professionals</strong> joined this week
                </p>
              </div>
            </div>

            {/* Right Column: Hero Visual Glass Card overlaying the background photo */}
            <div className="hidden lg:flex items-center justify-end relative min-h-[400px]">
              
              {/* Cyberpunk Floating card frame detailing statistics overlay */}
              <div className="relative w-full max-w-[340px] rounded-[24px] p-6 bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-2xl animate-float transition-all duration-500 hover:border-orange-500/30 group pointer-events-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Zap size={22} className="text-orange-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-orange-400 uppercase bg-orange-500/10 px-2 py-0.5 rounded">Live Matchmaking</span>
                    <h4 className="text-sm font-black text-white mt-0.5">Matched with AI</h4>
                  </div>
                </div>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-4">
                  AI-driven parameters analyze profiles dynamically to secure 98% match rate relevance instantly.
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] font-bold text-slate-400">STATUS</span>
                  <span className="text-[10px] font-black tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded">ACTIVE SEARCH</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── POPULAR SECTORS ──────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mockup styled Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                Popular Sectors
              </h2>
              <p className="text-[#475569] text-base mt-2 max-w-2xl font-medium">
                Curated career paths optimized for the future of industry and technology.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-blue-100/80 text-blue-600 hover:bg-blue-50/40 hover:border-blue-200 transition-all group shrink-0"
            >
              <div className="text-left leading-tight">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a8a] opacity-80">Explore All</p>
                <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Tracks</p>
              </div>
              <ArrowRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Redesigned 6-column grid matching mockup */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {popularSectors.map(s => {
              const IconComponent = s.icon;
              return (
                <button
                  key={s.name}
                  onClick={() => navigate(`/jobs?sector=${encodeURIComponent(s.name)}`)}
                  className="card card-hover flex flex-col items-center justify-center p-4 sm:p-5 lg:p-6 text-center bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  {/* Icon container */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${s.bgClass} transition-transform group-hover:scale-105 duration-300`}>
                    <IconComponent size={24} className="stroke-[2]" />
                  </div>
                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-1">
                    {s.name}
                  </h3>
                  {/* Opportunities */}
                  <p className={`text-[10px] font-bold tracking-wider uppercase ${s.textClass}`}>
                    {s.count}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── HIGH IMPACT ROLES ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              High Impact Roles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highImpactRoles.map((role, i) => (
              <div
                key={i}
                onClick={() => navigate('/jobs')}
                className={`bg-white p-5 sm:p-7 cursor-pointer flex flex-col justify-between transition-all duration-300 rounded-[24px] ${role.borderClass}`}
              >
                {/* Top Row: Logo & Badge */}
                <div className="flex items-center justify-between mb-6">
                  {/* Abstract Logo */}
                  {role.logoType === 'pixel' && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center shadow-inner shrink-0">
                      <div className="w-5 h-5 rounded-full bg-white opacity-85" />
                    </div>
                  )}
                  {role.logoType === 'creative' && (
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-inner shrink-0">
                      <div className="w-6 h-6 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      </div>
                    </div>
                  )}
                  {role.logoType === 'growth' && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center shadow-inner shrink-0">
                      <div className="w-4 h-6 bg-white/20 rounded-tl-full rounded-br-full transform -rotate-12 border border-white/30" />
                    </div>
                  )}

                  {/* Badge */}
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${role.badgeClass}`}>
                    {role.badge}
                  </span>
                </div>

                {/* Middle Info: Title, Company, Location */}
                <div className="mb-6">
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight leading-snug mb-1">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {role.company} <span className="mx-1 text-slate-300">•</span> {role.location}
                  </p>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {role.tags.map(t => (
                    <span
                      key={t}
                      className="text-xs font-semibold text-slate-500 bg-[#f8fafc] border border-slate-100/80 px-3 py-1.5 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Row: Compensation & Action Arrow */}
                <div className="flex items-end justify-between border-t border-slate-50 pt-5 mt-auto">
                  <div>
                    <span className={`text-[9px] font-black uppercase tracking-widest block mb-0.5 ${role.compLabelColorClass}`}>
                      Compensation
                    </span>
                    <span className={`text-lg xs:text-xl font-black tracking-tight ${role.compColorClass}`}>
                      {role.salary}
                    </span>
                  </div>

                  {/* Arrow Action Button */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${role.buttonClass}`}>
                    <ArrowUpRight size={20} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── TECHNOLOGY BUILT / PERFORMANCE METRICS ────────────────────── */}
      <section className="py-20 bg-[#f8fafc]/60 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Headers & Feature Items */}
            <div>
              <p className="text-xs text-[#2563eb] font-extrabold uppercase tracking-widest mb-3">
                Performance Metrics
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-8 leading-tight tracking-tight">
                Technology Built for<br />
                <span className="text-[#2563eb]">Human Potential</span>
              </h2>
              
              <div className="space-y-7">
                {/* Feature 1: Instant Response */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0 shadow-sm bg-white">
                    <Zap size={18} className="text-[#2563eb] fill-[#2563eb]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                      Instant Response
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-md">
                      AI-driven matching ensures you're visible to the right employers in milliseconds.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Vetted Ecosystem */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0 shadow-sm bg-white">
                    <ShieldCheck size={18} className="text-[#0d9488]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                      Vetted Ecosystem
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed max-w-md">
                      Every enterprise partner is rigorously verified for culture and stability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Staggered white stats cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 items-start">
              {/* Left Column of cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Card 1: 25 Active Roles */}
                <div className="bg-white p-4 xs:p-6 lg:p-8 rounded-[24px] border border-slate-100/80 shadow-md shadow-slate-100/50 text-center flex flex-col items-center justify-center min-h-[160px] hover:shadow-lg transition-shadow duration-300">
                  <span className="text-3xl xs:text-4xl lg:text-5xl font-black text-[#2563eb] tracking-tight block mb-2">25</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Active Roles
                  </span>
                </div>

                {/* Card 3: 10,000+ Candidates Registered */}
                <div className="bg-white p-4 xs:p-6 lg:p-8 rounded-[24px] border border-slate-100/80 shadow-md shadow-slate-100/50 text-center flex flex-col items-center justify-center min-h-[160px] hover:shadow-lg transition-shadow duration-300">
                  <span className="text-3xl xs:text-4xl lg:text-5xl font-black text-[#1e3a8a] tracking-tight block mb-2">10,000+</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Candidates Registered
                  </span>
                </div>
              </div>

              {/* Right Column of cards (staggered down) */}
              <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10">
                {/* Card 2: 100+ Employers Served */}
                <div className="bg-white p-4 xs:p-6 lg:p-8 rounded-[24px] border border-slate-100/80 shadow-md shadow-slate-100/50 text-center flex flex-col items-center justify-center min-h-[160px] hover:shadow-lg transition-shadow duration-300">
                  <span className="text-3xl xs:text-4xl lg:text-5xl font-black text-[#7c3aed] tracking-tight block mb-2">100+</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Employers Served
                  </span>
                </div>

                {/* Card 4: 500+ Positions Closed */}
                <div className="bg-white p-4 xs:p-6 lg:p-8 rounded-[24px] border border-slate-100/80 shadow-md shadow-slate-100/50 text-center flex flex-col items-center justify-center min-h-[160px] hover:shadow-lg transition-shadow duration-300">
                  <span className="text-3xl xs:text-4xl lg:text-5xl font-black text-[#0d9488] tracking-tight block mb-2">500+</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Positions Closed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── COMMUNITY FEEDBACK ───────────────────────────────────────── */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Double quotation mark background watermark */}
        <div className="absolute left-10 top-16 text-9xl font-serif text-slate-100 opacity-20 pointer-events-none select-none">
          “
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs text-[#7c3aed] font-extrabold uppercase tracking-widest mb-3">
              Elite Testimonials
            </p>
            <h2 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">
              Community Feedback
            </h2>
          </div>

          {/* Testimonial slider row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[0, 1, 2].map(offset => {
              const itemIndex = (testiIndex + offset) % 3;
              const t = eliteTestimonials[itemIndex];
              
              // Responsive visibility classes:
              const visibilityClass =
                offset === 1 ? "hidden md:flex" :
                offset === 2 ? "hidden lg:flex" :
                "flex";

              return (
                <div
                  key={t.id}
                  className={`${visibilityClass} bg-white p-5 sm:p-8 rounded-[24px] border border-slate-100/90 shadow-md shadow-slate-100/30 flex-col justify-between min-h-[280px] hover:shadow-lg transition-all duration-300`}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} size={13} className={`${t.starColorClass} fill-current`} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-600 italic text-sm leading-relaxed mb-8">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-5 mt-auto">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100 shadow-sm"
                    />
                    <div className="text-left leading-tight">
                      <p className="font-black text-slate-800 text-xs tracking-wider uppercase">
                        {t.name}
                      </p>
                      <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${t.roleColorClass}`}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Arrows */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setTestiIndex(prev => (prev - 1 + 3) % 3)}
              className="w-12 h-12 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft size={20} className="stroke-[2.5]" />
            </button>
            <button
              onClick={() => setTestiIndex(prev => (prev + 1) % 3)}
              className="w-12 h-12 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>


      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-14 brand-gradient">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Find Your Dream Job?</h2>
          <p className="text-blue-100 mb-8">Join 10,000+ professionals already hired through StaffAdda</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-full hover:shadow-lg transition-shadow text-sm">
              Get Started Free
            </Link>
            <Link to="/companies" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-colors text-sm">
              Browse Companies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
