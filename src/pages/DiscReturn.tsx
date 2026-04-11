import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, QrCode, Smartphone, Heart, ArrowRight, CheckCircle, Globe, Zap, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroStats } from '../components/discReturn/HeroStats';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: QrCode,
    title: 'Create Your Tag',
    desc: 'Enter your name and contact info. We generate a unique QR code that encodes your info — no servers, no accounts.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    step: '02',
    icon: Smartphone,
    title: 'Print & Attach',
    desc: 'Print the tag, laminate it, and attach it to your disc. Some players stamp directly onto the disc.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    step: '03',
    icon: Globe,
    title: 'Anyone Can Scan',
    desc: 'When someone finds your disc, they scan the QR code with any phone camera. No app needed — it opens instantly.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    step: '04',
    icon: Heart,
    title: 'Disc Returned',
    desc: 'The finder sees your contact info and can message or call you directly. Pure community, zero friction.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
];

const FEATURES = [
  { icon: Shield, label: 'Zero backend', desc: 'All data is encoded in the QR code itself — nothing stored anywhere.' },
  { icon: Zap,    label: 'Instant scan', desc: 'Works with any smartphone camera. No app download required.' },
  { icon: Users,  label: 'Free forever', desc: 'Community-first. No accounts, no fees, no tracking.' },
  { icon: Globe,  label: 'Works anywhere', desc: 'Any course, any country. The QR code is the complete return system.' },
];

export function DiscReturn() {
  return (
    <div className="pb-8">
      <Helmet>
        <title>Disc Return Network | The Disc Mill</title>
        <meta name="description" content="Register your disc for free. If found, it finds its way back to you." />
      </Helmet>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-24 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400 via-indigo-800 to-indigo-900" />
        </div>
        {/* Decorative large QR icon */}
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <QrCode className="w-96 h-96 text-white" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 gap-2"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-300" />
            The Disc Mill — Hero Return Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6"
          >
            Never Lose a<br />
            <span className="text-indigo-300">Disc Forever</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The fastest, most ethical way to return lost discs. No apps, no accounts, no servers.
            Just a QR code, community spirit, and your disc back in your bag.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/disc-return/create"
              className="inline-flex items-center justify-center bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/30"
            >
              <QrCode className="mr-3 w-5 h-5" />
              Create My Tag
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors"
            >
              How It Works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              '100% Free',
              'No App Needed',
              'Works Worldwide',
              'Privacy First',
            ].map(badge => (
              <div key={badge} className="flex items-center gap-2 text-indigo-200 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hero Stats */}
      <section className="bg-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <HeroStats />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Four simple steps. No app, no account, no server.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="text-xs font-black text-gray-300 dark:text-gray-600 mb-1">{step}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA split */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lost a disc */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/disc-return/create"
              className="group block bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-3">I Lost a Disc</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Create a unique return tag with your contact info encoded inside a QR code. Print it, attach it, and know your disc can always find its way home.
              </p>
              <div className="inline-flex items-center font-bold text-sm bg-white/20 px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                Create Your Tag
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* Found a disc */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-8 rounded-3xl">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-black mb-3">I Found a Disc</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Simply open your phone's camera app and point it at the QR code on the disc. The return page opens instantly — no app needed.
              </p>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Works with any smartphone camera
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  No app download required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  Contact info displayed instantly
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Why The Disc Mill Return Network?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-sm mb-1">{label}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
