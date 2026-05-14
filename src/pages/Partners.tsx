import React from 'react';
import { motion } from 'motion/react';
import { Mail, BarChart2, Globe, Shield, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildCanonical } from '../utils/seo';
import { useLocation, Link } from 'react-router-dom';

export default function Partners() {
  const { pathname } = useLocation();
  const canonicalUrl = buildCanonical(pathname);
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = React.useState({ name: '', company: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setStatus('success');
      else throw new Error('Failed');
    } catch {
      setStatus('idle');
      alert('Failed to send inquiry. Please try again or email hello@thediscmill.com');
    }
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <SEO
        title="Partner With Us | The Disc Mill Business Development"
        description="Connect with the national disc golf intelligence platform. Partner with The Disc Mill to reach 100k+ monthly active disc golfers."
        canonicalUrl={canonicalUrl}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-6"
        >
          <Zap className="w-3.5 h-3.5 fill-current" /> Business Development
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
          The National Disc Golf <br /> <span className="text-indigo-600">Intelligence Platform.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The Disc Mill provides manufacturers with data-driven insights, high-intent traffic, and a direct channel to the most active players in the sport.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="mailto:hello@thediscmill.com?subject=Partnership Inquiry"
            className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-500/20"
          >
            Contact Business Development <Mail className="w-5 h-5" />
          </a>
          <a 
            href="mailto:hello@thediscmill.com?subject=Media Kit Request"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-black rounded-2xl hover:border-indigo-500 transition-all"
          >
            Request Media Kit (2025)
          </a>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <PartnerStat 
          icon={Users} 
          label="Target Audience" 
          value="High-Intent" 
          sub="Focused on active gear-buying players" 
        />
        <PartnerStat 
          icon={BarChart2} 
          label="Traffic proof" 
          value="Verified" 
          sub="Live outbound referral tracking" 
        />
        <PartnerStat 
          icon={Globe} 
          label="Search Visibility" 
          value="Optimized" 
          sub="High-performance SEO architecture" 
        />
      </section>

      {/* Value Props */}
      <section className="max-w-6xl mx-auto mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Why Partner With Us?</h2>
            <div className="space-y-8">
              <ValueItem 
                title="Verified Outbound Analytics" 
                desc="Every click we send to your site is tracked and reported. We prove our value before you even ask." 
              />
              <ValueItem 
                title="Search Engine Dominance" 
                desc="Our 'Best Of' and comparison pages rank #1 for high-intent keywords like 'best distance drivers'." 
              />
              <ValueItem 
                title="Clean, Data-First UX" 
                desc="No intrusive ads or cluttered layouts. We present your discs with the respect and clarity they deserve." 
              />
            </div>
          </div>
          <div className="bg-gray-900 rounded-[2.5rem] p-10 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[120px]" />
            <div className="relative z-10">
              <div className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Traffic Infrastructure
              </div>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                Our custom analytics layer captures every outbound referral, providing you with transparent, 
                verified traffic proof to justify your digital footprint.
              </p>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-4/5 bg-indigo-500 rounded-full" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-2/3 bg-indigo-500/50 rounded-full" />
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full w-3/4 bg-indigo-500/30 rounded-full" />
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                Live Referral Reporting Pipeline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action / Form */}
      <section className="max-w-4xl mx-auto bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-500/40">
        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4">Inquiry Received</h2>
            <p className="text-indigo-100 text-lg">Our business development team will contact you within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black mb-4">Ready to reach more players?</h2>
              <p className="text-indigo-100 text-lg">
                Join our partner program for enhanced branding, verified traffic reports, and early access to new data tools.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Name" 
                required 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-indigo-200"
              />
              <input 
                type="text" 
                placeholder="Company" 
                required 
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-indigo-200"
              />
              <input 
                type="email" 
                placeholder="Work Email" 
                required 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-indigo-200 sm:col-span-2"
              />
              <textarea 
                placeholder="How can we help?" 
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder:text-indigo-200 sm:col-span-2 resize-none"
              />
              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="sm:col-span-2 bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Inquiry'} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function PartnerStat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[2rem] p-8 hover:border-indigo-500 transition-all">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{value}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{sub}</p>
    </div>
  );
}

function ValueItem({ title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
