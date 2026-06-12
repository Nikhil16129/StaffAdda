import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Search, 
  Mail, 
  FileText, 
  Info, 
  Lock, 
  ShieldAlert, 
  AlertTriangle,
  ChevronRight,
  Sun,
  Moon,
  Bookmark
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function TermsOfServicePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [readingMode, setReadingMode] = useState('light'); // 'light' or 'dark' reading pane
  const [activeSection, setActiveSection] = useState('summary');
  
  const sectionRefs = {
    summary: useRef(null),
    intro: useRef(null),
    sec1: useRef(null),
    sec2: useRef(null),
    sec3: useRef(null),
    sec4: useRef(null),
    sec5: useRef(null),
    sec6: useRef(null),
    sec7: useRef(null),
    sec8: useRef(null),
    sec9: useRef(null),
    sec10: useRef(null),
    sec11: useRef(null),
    sec12: useRef(null),
    sec13: useRef(null),
    sec14: useRef(null),
    sec15: useRef(null),
    sec16: useRef(null),
    sec17: useRef(null),
    sec18: useRef(null),
    sec19: useRef(null),
    sec20: useRef(null),
    sec21: useRef(null),
    sec22: useRef(null),
    sec23: useRef(null),
    sec24: useRef(null),
    sec25: useRef(null),
    sec26: useRef(null),
    sec27: useRef(null),
    sec28: useRef(null),
    sec29: useRef(null),
  };

  const menuItems = [
    { id: 'summary', label: 'Summary' },
    { id: 'intro', label: 'Introduction' },
    { id: 'sec1', label: '1. Agreement to Terms' },
    { id: 'sec2', label: '2. Intellectual Property' },
    { id: 'sec3', label: '3. User Representations' },
    { id: 'sec4', label: '4. User Registration' },
    { id: 'sec5', label: '5. Prohibited Activities' },
    { id: 'sec6', label: '6. User Contributions' },
    { id: 'sec7', label: '7. Contribution License' },
    { id: 'sec8', label: '8. Review Guidelines' },
    { id: 'sec9', label: '9. Mobile App License' },
    { id: 'sec10', label: '10. Social Media Integration' },
    { id: 'sec11', label: '11. Submissions' },
    { id: 'sec12', label: '12. Third-Party Websites' },
    { id: 'sec13', label: '13. Advertisers' },
    { id: 'sec14', label: '14. Site Management' },
    { id: 'sec15', label: '15. Privacy Policy' },
    { id: 'sec16', label: '16. DMCA Policy' },
    { id: 'sec17', label: '17. Copyright Infringements' },
    { id: 'sec18', label: '18. Term & Termination' },
    { id: 'sec19', label: '19. Modifications & Outages' },
    { id: 'sec20', label: '20. Governing Law' },
    { id: 'sec21', label: '21. Dispute Resolution' },
    { id: 'sec22', label: '22. Corrections' },
    { id: 'sec23', label: '23. Legal Disclaimer' },
    { id: 'sec24', label: '24. Liability Limitations' },
    { id: 'sec25', label: '25. Indemnification' },
    { id: 'sec26', label: '26. User Data Records' },
    { id: 'sec27', label: '27. Electronic Signatures' },
    { id: 'sec28', label: '28. California Residents' },
    { id: 'sec29', label: '29. Miscellaneous Terms' },
  ];

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const [key, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const top = ref.current.offsetTop;
          const height = ref.current.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync full page dark mode html class
  useEffect(() => {
    if (readingMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [readingMode]);

  const scrollToSection = (id) => {
    const element = sectionRefs[id]?.current;
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-slate-950 font-semibold px-0.5 rounded">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      readingMode === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      <Navbar />

      {/* Hero Banner Section */}
      <section className={`pt-24 pb-14 relative overflow-hidden transition-all duration-300 border-b ${
        readingMode === 'dark' 
          ? 'bg-slate-950 text-white border-slate-900' 
          : 'bg-slate-100 text-slate-800 border-slate-200'
      }`}>
        {/* Background Gradients */}
        <div className={`absolute inset-0 -z-10 transition-opacity duration-300 ${
          readingMode === 'dark'
            ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950'
            : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/40 via-slate-100 to-slate-50'
        }`} />
        <div className={`absolute left-1/4 top-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 transition-all ${
          readingMode === 'dark' ? 'bg-purple-500/5' : 'bg-purple-200/20'
        }`} />
        <div className={`absolute right-1/4 bottom-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 transition-all ${
          readingMode === 'dark' ? 'bg-blue-500/5' : 'bg-blue-200/20'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-semibold mb-6 transition-all ${
            readingMode === 'dark'
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
              : 'bg-purple-50 border-purple-200 text-purple-600'
          }`}>
            <Scale size={14} />
            <span>StaffAdda Compliance Hub</span>
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 transition-colors ${
            readingMode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Terms & Conditions
          </h1>
          <p className={`text-sm md:text-base max-w-xl mx-auto mb-8 font-medium transition-colors ${
            readingMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Please read these terms carefully. By accessing or using StaffAdda, you agree to be bound by these legal rules.
          </p>
          
          <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-semibold border rounded-2xl py-3 px-6 max-w-md mx-auto transition-all ${
            readingMode === 'dark'
              ? 'bg-slate-900/40 border-white/5 text-slate-400'
              : 'bg-white/60 border-slate-200 text-slate-600 shadow-sm'
          }`}>
            <span>Last Updated: <strong className={readingMode === 'dark' ? 'text-white' : 'text-slate-800'}>June 10, 2026</strong></span>
            <span className={`hidden sm:inline ${readingMode === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}>•</span>
            <span>Version: <strong className={readingMode === 'dark' ? 'text-white' : 'text-slate-800'}>v3.4</strong></span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Sticky controls & Sidebar Index */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              
              {/* Reading Settings Card */}
              <div className={`rounded-2xl p-5 border transition-all ${
                readingMode === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Reading Settings</span>
                  <Bookmark size={14} className="text-slate-300" />
                </h3>
                
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setReadingMode('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                      readingMode === 'light' 
                        ? 'bg-slate-100 border-slate-300 text-slate-800' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button 
                    onClick={() => setReadingMode('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                      readingMode === 'dark' 
                        ? 'bg-slate-950 border-slate-800 text-white' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>

                {/* Local search in document */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search terms (e.g. intellectual)"
                    className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs font-medium outline-none transition-all ${
                      readingMode === 'dark' 
                        ? 'bg-slate-950 border-slate-800 focus:bg-slate-900 focus:border-purple-500 text-slate-100' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 focus:border-purple-500 focus:bg-white text-slate-700'
                    }`}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold px-1.5 py-0.5 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Index Card */}
              <div className={`rounded-2xl p-5 border transition-all max-h-[440px] flex flex-col ${
                readingMode === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                  Document Index
                </h3>
                <div className="overflow-y-auto pr-1 space-y-1 flex-1 scrollbar-thin">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                        activeSection === item.id 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm' 
                          : (readingMode === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600')
                      }`}
                    >
                      <span className="truncate pr-2">{item.label}</span>
                      <ChevronRight size={12} className={`shrink-0 transition-transform ${
                        activeSection === item.id ? 'translate-x-0.5' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Terms Content */}
          <div className="lg:col-span-3">
            
            {/* ── SECTION: SUMMARY OF KEY POINTS ── */}
            <div 
              ref={sectionRefs.summary}
              id="summary"
              className={`rounded-3xl p-6 sm:p-8 mb-8 border border-slate-200/80 shadow-sm transition-all ${
                readingMode === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <FileText className="text-purple-500 w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-purple-500 uppercase">Dashboard</span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Terms Overview</h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Bookmark size={15} className="text-purple-500" />
                    <span>Intellectual Property</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    All code, designs, and content belong strictly to StaffAdda. You are granted a limited license for personal use.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Lock size={15} className="text-blue-500" />
                    <span>User Accounts</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    You must keep your credentials secure. Only users 18 years or older are permitted to register.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <ShieldAlert size={15} className="text-red-500" />
                    <span>Prohibited Actions</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    No automated data scraping, bots, system disruption, copyright infringements, or competition endeavors.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <AlertTriangle size={15} className="text-amber-500" />
                    <span>Dispute Resolution</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Governed by the laws of Karnataka. All disputes will be settled via binding arbitration in Bangalore.
                  </p>
                </div>
              </div>

              <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-4 flex gap-3 items-start">
                <Info size={16} className="text-purple-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  These overview cards provide quick references to key segments. Read the full text below or select sections via the Document Index.
                </p>
              </div>
            </div>

            {/* ── FULL TERMS TEXT WRAPPER ── */}
            <div className={`rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm transition-all ${
              readingMode === 'dark' 
                ? 'bg-slate-900 text-slate-300 border-slate-800' 
                : 'bg-white text-slate-700'
            }`}>
              
              {/* Introduction */}
              <article ref={sectionRefs.intro} id="intro" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">Introduction</h2>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {highlightText("AGREEMENT TO TERMS", searchQuery)}
                  </p>
                  <p>
                    {highlightText("These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Saivras Consultancy Services (“we,” “us” or “our”), concerning your access to and use of the staffadda.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).", searchQuery)}
                  </p>
                  <p>
                    {highlightText("You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms and Conditions to stay informed of updates.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("The Site is intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to register for the Site.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 1 */}
              <article ref={sectionRefs.sec1} id="sec1" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">1. AGREEMENT TO TERMS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("By logging in, browsing, or listing openings on the Site, you consent to comply with all terms laid out here. Those who choose to access the Site from other locations do so on their own initiative and are solely responsible for compliance with local laws.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article ref={sectionRefs.sec2} id="sec2" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">2. INTELLECTUAL PROPERTY RIGHTS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Except as expressly provided in these Terms and Conditions, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 3 */}
              <article ref={sectionRefs.sec3} id="sec3" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">3. USER REPRESENTATIONS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and agree to comply with these Terms; (4) you are not under 18 years of age; (5) you will not access the Site through automated or non-human means; (6) you will not use the Site for any illegal purpose; and (7) your use of the Site will not violate any applicable law or regulation.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 4 */}
              <article ref={sectionRefs.sec4} id="sec4" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">4. USER REGISTRATION</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine that such username is inappropriate, obscene, or otherwise objectionable.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 5 */}
              <article ref={sectionRefs.sec5} id="sec5" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">5. PROHIBITED ACTIVITIES</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("You may not access or use the Site for any purpose other than that for which we make the Site available. Prohibited actions include: scraping data to compile a database, unauthorized framing or linking, tricking or defrauding users to access passwords, bypass security features, reverse-engineer site software, distribute trojan horses or malware, and using automated spiders or scrapers.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article ref={sectionRefs.sec6} id="sec6" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">6. USER GENERATED CONTRIBUTIONS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("The Site may invite you to chat, contribute to, or participate in blogs, forums, and other functionality. Any Contributions you transmit may be treated as non-confidential. You represent that your contributions do not infringe the copyright, patent, trademark or moral rights of third parties, and are not obscene, lewd, or defamatory.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article ref={sectionRefs.sec7} id="sec7" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">7. CONTRIBUTION LICENSE</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("By posting your Contributions, you automatically grant to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, worldwide license to host, use, copy, reproduce, disclose, publish, archive, and distribute such Contributions. We do not assert ownership over your Contributions; you retain full ownership.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 8 */}
              <article ref={sectionRefs.sec8} id="sec8" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">8. GUIDELINES FOR REVIEWS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("When posting a review on candidates or employers, you must have firsthand experience. Reviews must not contain abusive, racist, or discriminatory statements. We assume no liability for reviews posted on the platform.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article ref={sectionRefs.sec9} id="sec9" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">9. MOBILE APPLICATION LICENSE</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("If you access the Site via our mobile application, we grant you a revocable, limited right to install the application. You agree not to reverse-engineer, decompile, or create competitive products from the application. App Distributors (like Google Play or Apple App Store) are third-party beneficiaries of these terms.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 10 */}
              <article ref={sectionRefs.sec10} id="sec10" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">10. SOCIAL MEDIA INTEGRATION</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("You may link your account with Third-Party Accounts. By doing so, you represent that you have the right to grant us access to your profile picture, email list, and friends lists strictly under the parameter configurations of your social media provider.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article ref={sectionRefs.sec11} id="sec11" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">11. SUBMISSIONS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("Any suggestions, feedback, or comments you submit to us become our sole property. We are entitled to unrestricted use of submissions for any lawful purpose without compensating you.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 12 */}
              <article ref={sectionRefs.sec12} id="sec12" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">12. THIRD-PARTY WEBSITES AND CONTENT</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("The Site may contain links to Third-Party Websites. We do not inspect, monitor, or verify the accuracy of such websites and we hold no liability for transactions completed on third-party domains.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 13 */}
              <article ref={sectionRefs.sec13} id="sec13" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">13. ADVERTISERS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We may display advertisements. Advertisers take full responsibility for campaigns they launch, including copyright permissions. Advertisements are subject to our DMCA policy provisions.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 14 */}
              <article ref={sectionRefs.sec14} id="sec14" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">14. SITE MANAGEMENT</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We reserve the right to monitor the Site for violations, take legal action against infringers, limit accessibility of contributions, and manage the platform to protect our proprietary code.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 15 */}
              <article ref={sectionRefs.sec15} id="sec15" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">15. PRIVACY POLICY</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We care about data privacy. Please review our Privacy Policy posted on the Site. By using the Site, you consent to our Privacy Policy, which is incorporated into these terms. Please note the Site is hosted in the United States and India. If you access it from other regions, you consent to data transfers.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 16 */}
              <article ref={sectionRefs.sec16} id="sec16" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">16. DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) POLICY</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("If you believe copyright materials are infringed, please notify our Designated Copyright Agent:", searchQuery)}
                  </p>
                  <div className={`p-5 rounded-2xl border ${
                    readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">Designated Copyright Agent</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Attn: Copyright Agent<br />
                      Saivras Consultancy Services<br />
                      Company address- 2nd floor, near IOCL, 70 feet bypass road anisabad patna 800002<br />
                      Email: career@staffadda.in
                    </p>
                  </div>
                </div>
              </article>

              {/* Section 17 */}
              <article ref={sectionRefs.sec17} id="sec17" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">17. COPYRIGHT INFRINGEMENTS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We respect rights. If you notice any copyright violations, write to us with full identification details, link URLs, and a good faith declaration statement.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 18 */}
              <article ref={sectionRefs.sec18} id="sec18" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">18. TERM AND TERMINATION</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("These Terms remain in effect while you use the Site. We reserve the right to deny access to the Site (including blocking IP addresses) to any person for any reason or no reason, without warning or liability.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 19 */}
              <article ref={sectionRefs.sec19} id="sec19" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">19. MODIFICATIONS AND OUTAGES</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We reserve the right to change or modify contents at any time without notice. We have no obligation to update details. We assume no liability for website outages, disruptions, or maintenance downtime.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 20 */}
              <article ref={sectionRefs.sec20} id="sec20" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">20. GOVERNING LAW</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("These Terms and Conditions and your use of the Site are governed by and construed in accordance with the laws of the State of Karnataka, India, without regard to its conflict of law principles.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 21 */}
              <article ref={sectionRefs.sec21} id="sec21" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">21. DISPUTE RESOLUTION</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {highlightText("Binding Arbitration", searchQuery)}
                  </p>
                  <p>
                    {highlightText("To expedite resolution, any Dispute relating to these Terms will be finally and exclusively resolved by binding arbitration conducted in Bangalore, Karnataka. The arbitration shall be conducted in accordance with standard corporate rules. Any action must be commenced within one (1) year after the cause of action arose.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 22 */}
              <article ref={sectionRefs.sec22} id="sec22" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">22. CORRECTIONS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("There may be typographical errors, inaccuracies, or omissions on the Site. We reserve the right to correct any errors and to change or update information without prior notice.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 23 */}
              <article ref={sectionRefs.sec23} id="sec23" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">23. LEGAL DISCLAIMER</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {highlightText("THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 24 */}
              <article ref={sectionRefs.sec24} id="sec24" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">24. LIMITATIONS OF LIABILITY</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {highlightText("IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, OR INCIDENTAL DAMAGES.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 25 - Completed */}
              <article ref={sectionRefs.sec25} id="sec25" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">25. INDEMNIFICATION</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of your Contributions, use of the Site, or breach of these Terms and Conditions.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 26 - Completed */}
              <article ref={sectionRefs.sec26} id="sec26" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">26. USER DATA RECORDS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 27 - Completed */}
              <article ref={sectionRefs.sec27} id="sec27" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">27. ELECTRONIC SIGNATURES & COMMUNICATIONS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SITE.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 28 - Completed */}
              <article ref={sectionRefs.sec28} id="sec28" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">28. CALIFORNIA USERS AND RESIDENTS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("If any complaint with us is not satisfactorily resolved, you may contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 29 - Completed */}
              <article ref={sectionRefs.sec29} id="sec29" className="mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">29. MISCELLANEOUS TERMS</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("These Terms and Conditions and any policies or operating rules posted by us on the Site constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision. We may assign any or all of our rights and obligations to others at any time.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("If any provision or part of a provision of these Terms and Conditions is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Terms and Conditions and does not affect the validity and enforceability of any remaining provisions.", searchQuery)}
                  </p>
                </div>
              </article>

            </div>
          </div>
        </div>
      </div>
      
      {/* Mini CTA Panel */}
      <section className={`py-8 text-center text-xs font-medium border-t transition-all ${
        readingMode === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Questions? Read our <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">Privacy Policy</Link> or visit the support portal.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
