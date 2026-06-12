import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  ArrowRight, 
  Mail, 
  FileText, 
  Info, 
  Lock, 
  Scale, 
  Users, 
  HelpCircle, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PrivacyPolicyPage() {
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
  };

  const menuItems = [
    { id: 'summary', label: 'Summary' },
    { id: 'intro', label: 'Introduction' },
    { id: 'sec1', label: '1. What Info We Collect' },
    { id: 'sec2', label: '2. How We Process Info' },
    { id: 'sec3', label: '3. Legal Bases We Rely On' },
    { id: 'sec4', label: '4. Sharing Your Info' },
    { id: 'sec5', label: '5. Third-Party Websites' },
    { id: 'sec6', label: '6. Cookies & Tracking' },
    { id: 'sec7', label: '7. Social Media Logins' },
    { id: 'sec8', label: '8. International Transfers' },
    { id: 'sec9', label: '9. Data Retention Period' },
    { id: 'sec10', label: '10. Security Safeguards' },
    { id: 'sec11', label: '11. Protection of Minors' },
    { id: 'sec12', label: '12. Your Privacy Rights' },
    { id: 'sec13', label: '13. Do-Not-Track Controls' },
    { id: 'sec14', label: '14. California Privacy Rights' },
    { id: 'sec15', label: '15. Other US State Rights' },
    { id: 'sec16', label: '16. Policy Updates' },
    { id: 'sec17', label: '17. Manage Your Data' },
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

  // Helper to highlight search matches
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
            ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950'
            : 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-100 to-slate-50'
        }`} />
        <div className={`absolute left-1/4 top-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 transition-all ${
          readingMode === 'dark' ? 'bg-blue-500/5' : 'bg-blue-200/20'
        }`} />
        <div className={`absolute right-1/4 bottom-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 transition-all ${
          readingMode === 'dark' ? 'bg-purple-500/5' : 'bg-purple-200/20'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-xs font-semibold mb-6 transition-all ${
            readingMode === 'dark'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            <Shield size={14} />
            <span>StaffAdda Trust & Privacy Hub</span>
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 transition-colors ${
            readingMode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Privacy Policy
          </h1>
          <p className={`text-sm md:text-base max-w-xl mx-auto mb-8 font-medium transition-colors ${
            readingMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            At StaffAdda, we value your privacy. We are committed to transparency and secure handling of your data.
          </p>
          
          <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-semibold border rounded-2xl py-3 px-6 max-w-md mx-auto transition-all ${
            readingMode === 'dark'
              ? 'bg-slate-900/40 border-white/5 text-slate-400'
              : 'bg-white/60 border-slate-200 text-slate-600 shadow-sm'
          }`}>
            <span>Last Updated: <strong className={readingMode === 'dark' ? 'text-white' : 'text-slate-800'}>June 10, 2026</strong></span>
            <span className={`hidden sm:inline ${readingMode === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}>•</span>
            <span>Version: <strong className={readingMode === 'dark' ? 'text-white' : 'text-slate-800'}>v2.1</strong></span>
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
                  <HelpCircle size={14} className="text-slate-300" />
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
                    placeholder="Search terms (e.g. cookies)"
                    className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs font-medium outline-none transition-all ${
                      readingMode === 'dark' 
                        ? 'bg-slate-950 border-slate-800 focus:bg-slate-900 focus:border-blue-500 text-slate-100' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white text-slate-700'
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
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm' 
                          : (readingMode === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600')
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

          {/* Right Column: Privacy Content */}
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
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <FileText className="text-blue-500 w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Dashboard</span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Key Points Summary</h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Eye size={15} className="text-blue-500" />
                    <span>Personal Info We Process</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Depends on how you interact with StaffAdda: e.g. account setup, job applications, payment details, and website activity tracking.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Lock size={15} className="text-teal-500" />
                    <span>Sensitive Personal Data</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    We only collect minimal credentials or location data with your express consent as permitted by applicable law.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Users size={15} className="text-purple-500" />
                    <span>Third-Party Sharing</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Data sharing occurs strictly in context: with payment gateways (Stripe), hosting providers, social login widgets, or partner employers.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  readingMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-2">
                    <Scale size={15} className="text-indigo-500" />
                    <span>Your Rights Control</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    You have complete rights to access, update, export, rectify, or request erasure of your data by writing to us at any time.
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3 items-start">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  This summary provides key highlights from our privacy notice. Please read the full sections below or use the document index sidebar on the left to navigate directly.
                </p>
              </div>
            </div>

            {/* ── FULL POLICY TEXT WRAPPER ── */}
            <div className={`rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm transition-all ${
              readingMode === 'dark' 
                ? 'bg-slate-900 text-slate-300 border-slate-800' 
                : 'bg-white text-slate-700'
            }`}>
              
              {/* Introduction */}
              <article ref={sectionRefs.intro} id="intro" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">Introduction</h2>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("This privacy notice for Saivras Consultancy Services (doing business as StaffAdda) (“Company,” “we,” “us,” or “our“), describes how and why we might collect, store, use, and/or share (“process“) your information when you use our services (“Services“), such as when you:", searchQuery)}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      {highlightText("Visit our website at https://staffadda.com, or any website of ours that links to this privacy notice.", searchQuery)}
                    </li>
                    <li>
                      {highlightText("Download and use our applications, such as our mobile application — StaffAdda Mobile App, our Facebook application — StaffAdda Facebook Portal, or any other application of ours that links to this privacy notice.", searchQuery)}
                    </li>
                    <li>
                      {highlightText("Engage with us in other related ways — including any sales, marketing, or events.", searchQuery)}
                    </li>
                  </ul>
                  <p>
                    {highlightText("Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at career@staffadda.in.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 1 */}
              <article ref={sectionRefs.sec1} id="sec1" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">1. WHAT INFORMATION DO WE COLLECT?</h3>
                
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 text-sm sm:text-base">Personal information you disclose to us</h4>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We collect personal information that you provide to us.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include names, contact details, resumes, employment history, and billing info.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Sensitive Information. When necessary, with your consent or as otherwise permitted by applicable law, we process standard account access parameters or geo-location indices. We do not collect high-risk sensitive health details.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Payment Data. We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is processed and stored securely by Stripe. You may find their privacy notice link here: https://stripe.com/privacy.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article ref={sectionRefs.sec2} id="sec2" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We process your personal information for a variety of reasons, depending on how you interact with our Services, including:", searchQuery)}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{highlightText("To facilitate account creation and authentication and otherwise manage user accounts.", searchQuery)}</li>
                    <li>{highlightText("To deliver and facilitate delivery of services to the user.", searchQuery)}</li>
                    <li>{highlightText("To respond to user inquiries and offer support to users.", searchQuery)}</li>
                    <li>{highlightText("To send administrative information to you.", searchQuery)}</li>
                    <li>{highlightText("To fulfill and manage your orders.", searchQuery)}</li>
                    <li>{highlightText("To request feedback.", searchQuery)}</li>
                    <li>{highlightText("To protect our Services and prevent fraud.", searchQuery)}</li>
                  </ul>
                </div>
              </article>

              {/* Section 3 */}
              <article ref={sectionRefs.sec3} id="sec3" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("If you are located in the EU or UK, the GDPR and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we rely on standard legal grounds such as Consent, Performance of a Contract, Legitimate Interests, and Legal Obligations.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("If you are located in Canada, we process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent).", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 4 */}
              <article ref={sectionRefs.sec4} id="sec4" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We may share information in specific situations described in this section and/or with the following categories of third parties.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We share data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf. These include cloud providers, payment processors (Stripe), data analytics service providers, and hosting providers.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 5 */}
              <article ref={sectionRefs.sec5} id="sec5" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("The Services may link to third-party websites, online services, or mobile applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such websites.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article ref={sectionRefs.sec6} id="sec6" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We may use cookies and other tracking technologies to collect and store your information.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific details are outlined in our cookie settings panel.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article ref={sectionRefs.sec7} id="sec7" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: If you choose to register or log in to our services using a social media account, we may have access to certain information about you.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Where you choose to register using social networks, we receive profile details like name, email address, and photo from your provider. We use this strictly to facilitate dashboard access.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 8 */}
              <article ref={sectionRefs.sec8} id="sec8" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">8. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We may transfer, store, and process your information in countries other than your own.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Our servers are located in India and the United States. We have implemented Standard Contractual Clauses (SCCs) and corporate directives to ensure all processed data receives equivalent legal protection.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article ref={sectionRefs.sec9} id="sec9" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">9. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We retain your information for up to 12 months past the termination or closing of your StaffAdda account, unless statutory retention limits (such as tax compliance audits) mandate longer storage.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 10 */}
              <article ref={sectionRefs.sec10} id="sec10" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">10. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We aim to protect your personal information through a system of organizational and technical security measures.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We use encryption, firewalls, and regular vulnerability scanning. While we do our absolute best, no system is 100% secure; thus, accessing StaffAdda must be done in a secure browsing environment.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article ref={sectionRefs.sec11} id="sec11" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">11. DO WE COLLECT INFORMATION FROM MINORS?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: We do not knowingly collect data from or market to children under 18 years of age.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("By registering, you confirm you are at least 18. If we notice we have mistakenly stored minor profiles, we will immediately close the accounts and wipe the files.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 12 */}
              <article ref={sectionRefs.sec12} id="sec12" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">12. WHAT ARE YOUR PRIVACY RIGHTS?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Under laws like GDPR, you can review, restrict, object, or request a complete export of your user data by contacting us directly at career@staffadda.in.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 13 */}
              <article ref={sectionRefs.sec13} id="sec13" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">13. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("Most web browsers include a Do-Not-Track (“DNT”) feature. At this stage, no uniform tech standard is agreed. As such, we do not currently respond to DNT browser signals.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 14 */}
              <article ref={sectionRefs.sec14} id="sec14" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">14. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
                
                <div className="space-y-4 text-sm sm:text-base leading-relaxed mb-6">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Under California Civil Code Section 1798.83 (Shine the Light), California residents can request details once a year on shared direct marketing categories.", searchQuery)}
                  </p>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-800">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950/60 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 border-r border-slate-200 dark:border-slate-800">Category</th>
                        <th className="p-3 border-r border-slate-200 dark:border-slate-800">Examples</th>
                        <th className="p-3">Collected</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {[
                        { cat: 'A. Identifiers', ex: 'Real name, alias, address, email, IP address', col: 'YES' },
                        { cat: 'B. Personal Info Categories', ex: 'Name, signature, education, employment status', col: 'YES' },
                        { cat: 'C. Protected Classifications', ex: 'Gender, date of birth', col: 'NO' },
                        { cat: 'D. Commercial Info', ex: 'Purchase history, payment gateway records', col: 'YES' },
                        { cat: 'E. Biometric Info', ex: 'Fingerprints, voice scans', col: 'NO' },
                        { cat: 'F. Network Activity', ex: 'Browsing history, interactions with page elements', col: 'YES' },
                        { cat: 'G. Geolocation Data', ex: 'Approximate IP geolocation parameters', col: 'YES' },
                        { cat: 'H. Audio/Visual Info', ex: 'Profile photos, recorded interview snippets', col: 'NO' },
                        { cat: 'I. Professional/Employment Info', ex: 'Resumes, work experience certifications', col: 'YES' },
                        { cat: 'J. Education Information', ex: 'Degrees, transcript transcripts uploaded', col: 'YES' },
                        { cat: 'K. Inferences Drawn', ex: 'Profile summarizing optimal match indicators', col: 'YES' },
                        { cat: 'L. Sensitive Personal Info', ex: 'Portal account credentials', col: 'YES' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                          <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">{row.cat}</td>
                          <td className="p-3 border-r border-slate-200 dark:border-slate-800">{highlightText(row.ex, searchQuery)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              row.col === 'YES' ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {row.col}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm leading-relaxed">
                  {highlightText("We will retain collected metrics for a standard 12-month period past user termination. You may opt out of data sharing by submitting a Do Not Sell request.", searchQuery)}
                </p>
              </article>

              {/* Section 15 - Completed */}
              <article ref={sectionRefs.sec15} id="sec15" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">15. DO OTHER US STATE RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: Yes. If you reside in Virginia, Colorado, Connecticut, Utah, or Oregon, you have specific consumer data rights under state laws.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("Under laws such as the Virginia Consumer Data Protection Act (VCDPA) and Colorado Privacy Act (CPA), state residents possess:", searchQuery)}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>{highlightText("The right to confirm whether we are processing personal records.", searchQuery)}</li>
                    <li>{highlightText("The right to correct inaccuracies in data fields.", searchQuery)}</li>
                    <li>{highlightText("The right to delete personal data provided or obtained.", searchQuery)}</li>
                    <li>{highlightText("The right to obtain a portable copy of data files.", searchQuery)}</li>
                    <li>{highlightText("The right to opt-out of processing for targeted ads or profiling in furtherance of decisions that produce legal effects.", searchQuery)}</li>
                  </ul>
                  <p>
                    {highlightText("To exercise these rights, please submit a query via career@staffadda.in. You have the right to appeal any denial of requests by contacting us using the same email address.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 16 - Completed */}
              <article ref={sectionRefs.sec16} id="sec16" className="mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">16. DO WE MAKE UPDATES TO THIS NOTICE?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p className="italic font-medium text-slate-500 dark:text-slate-400">
                    {highlightText("In Short: Yes, we will update this notice as necessary to remain compliant with relevant laws.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("We may update this privacy notice from time to time. The updated version will be indicated by an updated \"Revised\" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.", searchQuery)}
                  </p>
                </div>
              </article>

              {/* Section 17 - Completed */}
              <article ref={sectionRefs.sec17} id="sec17" className="mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h3>
                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    {highlightText("Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances.", searchQuery)}
                  </p>
                  <p>
                    {highlightText("To request to review, update, or delete your personal information, please visit your user account settings under Dashboard or submit a request by email to career@staffadda.in. We will respond to your request within 30 days.", searchQuery)}
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
          <p>Questions? Read our <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Terms of Service</Link> or visit the support portal.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
