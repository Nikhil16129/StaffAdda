import { useState } from 'react';
import { Mail, MapPin, Phone, HelpCircle, BookOpen, Users, Shield } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const newMessage = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      created_at: new Date().toISOString()
    };

    try {
      // Try writing to Supabase contact_messages table
      const { error } = await supabase
        .from('contact_messages')
        .insert([newMessage]);

      if (error) throw error;
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      alert('Your message has been sent successfully!');
    } catch (err) {
      console.warn('Supabase insert failed, falling back to localStorage:', err.message);
      
      // Fallback: Save to localStorage contact_messages
      try {
        const localMsgs = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        localMsgs.push({
          id: 'local_' + Date.now(),
          ...newMessage
        });
        localStorage.setItem('contact_messages', JSON.stringify(localMsgs));
        setSuccess(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        alert('Your message has been saved successfully!');
      } catch (localErr) {
        console.error('LocalStorage write failed:', localErr);
        alert('Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300">
      <Navbar />

      {/* Header Title Section */}
      <section className="pt-28 pb-12 text-center bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Whether you're looking for your next dream job or searching for the perfect
            talent, our team is here to support you every step of the way.
          </p>
        </div>
      </section>

      {/* Main Grid Container */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column (Info Panels & Instant Help) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Email Us */}
            <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Mail className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Email Us</h3>
                <p className="text-sm font-semibold text-gray-700">career@staffadda.in</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Expected response: within 24 hours</p>
              </div>
            </div>

            {/* Our Office */}
            <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <MapPin className="text-purple-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Our Office</h3>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                  2nd floor, near IOCL, 70 feet bypass road anisabad patna 800002
                </p>
              </div>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Phone className="text-emerald-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">Phone Support</h3>
                <a href="tel:7808009991" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors block">7808009991</a>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            {/* Need Instant Help */}
            <div className="bg-slate-100/60 rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Need instant help?</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                  <HelpCircle size={14} className="text-blue-500 shrink-0" />
                  <span>FAQ Center</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                  <BookOpen size={14} className="text-blue-500 shrink-0" />
                  <span>Documentation</span>
                </a>
                <a href="#" className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                  <Users size={14} className="text-blue-500 shrink-0" />
                  <span>Community</span>
                </a>
                <a href="/privacy" className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline">
                  <Shield size={14} className="text-blue-500 shrink-0" />
                  <span>Privacy Policy</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column (Send us a Message Form Card) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 bg-gray-50/50 focus:bg-white transition-colors"
                    />
                  </div>
                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 bg-gray-50/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Job Inquiry / Business Partnership"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 bg-gray-50/50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full text-sm px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 bg-gray-50/50 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Send Message Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-colors duration-200 shrink-0"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Patna Headquarters Panel */}
      <section className="bg-slate-100/50 border-t border-gray-150 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-blue-600 w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Our Patna Headquarters</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-6">
            2nd floor, near IOCL, 70 feet bypass road anisabad, Patna 800002
          </p>

          <div 
            className="max-w-3xl mx-auto rounded-3xl border border-gray-200 shadow-md h-56 flex items-center justify-center overflow-hidden relative"
            style={{ 
              backgroundImage: "url('/patna_map.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px]" />

            <a
              href="https://www.google.com/maps/search/?api=1&query=2nd+floor,+near+IOCL,+70+feet+bypass+road+anisabad+patna+800002"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
