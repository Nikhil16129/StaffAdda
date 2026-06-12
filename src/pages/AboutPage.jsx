import { Link } from 'react-router-dom';
import { Globe, ArrowUpRight, TrendingUp, Shield, Award, Lightbulb, Users } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function AboutPage() {
  const stats = [
    { value: '10k+', label: 'Professionals Hired' },
    { value: '500+', label: 'Top Companies' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust',
      desc: 'We build transparent relationships with candidates and companies alike.',
      bgColor: 'bg-blue-50/70 border-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      desc: 'Leveraging AI and smart matching to revolutionize the search.',
      bgColor: 'bg-purple-50/70 border-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Award,
      title: 'Excellence',
      desc: 'Setting the gold standard for premium recruitment services.',
      bgColor: 'bg-teal-50/70 border-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      icon: Users,
      title: 'Community',
      desc: 'Creating a supportive ecosystem for career long-term success.',
      bgColor: 'bg-orange-50/70 border-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const leadership = [
    {
      name: 'S.K. Rai',
      role: 'DIRECTOR & FOUNDER',
      image: '/leader_sk_rai.jpg',
    },
    {
      name: 'Ravi Raj',
      role: 'CHIEF OPERATIONS OFFICER',
      image: '/leader_ravi_raj_new.jpg',
    },
    {
      name: 'Nikhil Prasad',
      role: 'CHIEF TECHNOLOGY OFFICER',
      image: '/leader_nikhil_prasad.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-slate-50 to-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 border border-blue-200/60 bg-blue-50/50 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-600 mb-6">
            <Globe size={14} className="animate-spin-slow" />
            <span>Empowering the Global Workforce</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Connecting Talent,<br />
            <span className="brand-gradient-text">Building Careers</span>
          </h1>

          {/* Intro Text */}
          <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            StaffAdda is a premium recruitment ecosystem designed to bridge the gap between world-class
            visionaries and industry-leading professionals. We don't just fill roles; we catalyze growth.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-sm font-semibold px-6 py-3 rounded-xl shadow-md">
              Get Started
            </Link>
            <a href="#journey" className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-800 text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm">
              Learn More
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-gray-100 pt-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black brand-gradient-text mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Our Journey & Commitment Section */}
      <section id="journey" className="max-w-7xl mx-auto px-6 py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Our Journey & Commitment</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-4">
                A VENTURE OF SAIVRAS CONSULTANCY SERVICES PVT. LTD.
              </h2>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Founded in 2020, StaffAdda emerged from a simple observation: the traditional recruitment
              process was fragmented and impersonal. We set out to build a platform that prioritizes
              human connection alongside data-driven matching.
            </p>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Our journey has been defined by a relentless commitment to professional growth. We believe
              that every individual deserves a role that challenges them, and every company deserves
              talent that inspires them.
            </p>

            {/* Bullet list item */}
            <div className="flex items-start gap-3 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm max-w-md">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <TrendingUp className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">Scalable Growth</h4>
                <p className="text-xs text-gray-400 font-semibold leading-normal">
                  Helping startups to enterprises scale seamlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-gray-250/60 shadow-lg relative bg-slate-100">
              <img
                src="/about_conference.png"
                alt="Conference room meeting"
                className="w-full h-auto object-cover min-h-[350px]"
              />
            </div>
            
            {/* Overlay card */}
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md border border-gray-150 rounded-2xl p-4 shadow-xl max-w-[190px] flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200">
              <p className="text-xl font-black brand-gradient-text mb-0.5">4 Years</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">
                Of excellence in recruitment
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-gray-100 text-center">
        <div className="mb-14">
          <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">The Core of StaffAdda</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-4">Our Core Values</h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Our values aren't just words on a wall; they are the architectural principles behind every
            product feature and partnership.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${v.bgColor} mb-5`}>
                    <Icon className={`${v.iconColor} w-6 h-6`} />
                  </div>
                  <h3 className="font-bold text-gray-950 text-base mb-2">{v.title}</h3>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meet Our Leadership Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-gray-100 text-center">
        <div className="mb-14">
          <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Meet Our Leadership</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-2">
            A VENTURE OF SAIVRAS CONSULTANCY SERVICES PVT. LTD.
          </h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            The visionaries steering StaffAdda toward the future of work.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leadership.map((leader, i) => (
            <div key={i} className="group">
              <div className="rounded-2xl overflow-hidden border border-gray-150 bg-slate-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-[280px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-gray-950 text-sm mb-0.5">{leader.name}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">{leader.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="brand-gradient rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          {/* Subtle Background Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <span className="text-[10px] font-black uppercase text-white/70 tracking-widest">Ready to Scale Your Future?</span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 mb-1">Ready to Scale Your Future?</h2>
          <h3 className="text-sm font-bold text-white/80 mb-6 uppercase tracking-wider">
            A VENTURE OF SAIVRAS CONSULTANCY SERVICES PVT. LTD.
          </h3>
          <p className="text-xs md:text-sm text-white/70 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
            Whether you're looking for your next career-defining role or seeking to build a world-class
            team, StaffAdda is your partner in excellence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="bg-white hover:bg-slate-50 text-blue-600 font-semibold text-sm px-6 py-3 rounded-xl shadow transition-colors shrink-0">
              I'm a Job Seeker
            </Link>
            <Link to="/register" className="border border-white/45 hover:bg-white/10 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shrink-0">
              I'm an Employer
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
