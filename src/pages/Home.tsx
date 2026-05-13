import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Disc, ArrowRight, MapPin, Trophy, Zap, QrCode, ShoppingBag, BookOpen, Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: Disc,
    title: 'Disc Catalog',
    desc: '200+ PDGA-approved discs with flight numbers, stability ratings, and honest beginner notes.',
    link: '/discs',
    cta: 'Browse Discs',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'hover:border-indigo-200',
  },
  {
    icon: MapPin,
    title: 'National Courses',
    desc: 'Every course in the PDGA directory. Location, holes, and ratings updated live.',
    link: '/courses',
    cta: 'Find Courses',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-200',
  },
  {
    icon: ShoppingBag,
    title: 'Bag Builder',
    desc: 'Build your perfect bag slot-by-slot. Search any disc, compare flight numbers, and buy instantly.',
    link: '/bag-builder',
    cta: 'Build My Bag',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'hover:border-green-200',
  },
  {
    icon: QrCode,
    title: 'Disc Return Network',
    desc: 'Lost disc? Create a free QR return tag. Found one? Scan to return it. No app needed.',
    link: '/disc-return',
    cta: 'Create My Tag',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'hover:border-violet-200',
  },
  {
    icon: Trophy,
    title: 'PDGA Events',
    desc: 'Live tournament results and leaderboards, pulled directly from PDGA.com.',
    link: '/events',
    cta: 'View Events',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'hover:border-orange-200',
  },
  {
    icon: Users,
    title: 'Player Search',
    desc: 'Search any PDGA player by name or number. Live ratings, classification, and career stats.',
    link: '/players',
    cta: 'Search Players',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-200',
  },
  {
    icon: Zap,
    title: 'Throw Analyzer',
    desc: 'AI-powered flight path simulation and form analysis. Powered by Gemini.',
    link: '/analyzer',
    cta: 'Analyze Throw',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'hover:border-yellow-200',
  },
  {
    icon: BookOpen,
    title: 'Gear Guides',
    desc: '8 honest, evergreen buying guides covering every category. No hype, just what works.',
    link: '/guides',
    cta: 'Read Guides',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'hover:border-teal-200',
  },
];

const STATS = [
  { value: '200+', label: 'PDGA Discs' },
  { value: '14,000+', label: 'Courses Nationwide' },
  { value: '250k+',   label: 'PDGA Players' },
];

export function Home() {
  return (
    <div className="pb-8 lg:pb-12">
      <Helmet>
        <title>The Disc Mill | National Disc Golf Intelligence</title>
        <meta name="description" content="Find discs, courses, players, and events. Free, open-data disc golf platform." />
      </Helmet>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 py-28 sm:py-36">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-700/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center bg-white/10 backdrop-blur border border-white/20 text-indigo-200 text-xs font-bold px-4 py-2 rounded-full mb-8 gap-2"
            >
              <Disc className="w-3.5 h-3.5" />
              The #1 Open-Data Disc Golf Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-[0.95]"
            >
              The Disc Mill
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xl sm:text-2xl text-indigo-100/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              National course intelligence, live PDGA data, and disc analytics.
              Everything you need to master the game — free, forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/discs"
                className="inline-flex items-center justify-center bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/40"
              >
                <Search className="mr-2 w-5 h-5" />
                Find Your Disc
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/disc-return"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                <QrCode className="mr-2 w-5 h-5" />
                Disc Return Network
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-indigo-300 text-sm mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Everything You Need</h2>
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              One Platform. The Entire Game.
            </p>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Live data from PDGA.com. No accounts. No paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={feature.link}
                    className={`block card-interactive rounded-3xl p-6 h-full group`}
                  >
                    <div className={`w-12 h-12 ${feature.bg} dark:bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{feature.desc}</p>
                    <div className={`inline-flex items-center text-sm font-bold ${feature.color} gap-1`}>
                      {feature.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disc Return CTA strip */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-violet-900 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Lost a disc? We can help.
            </h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              The Disc Hero Return Network creates free QR return tags encoded with your contact info.
              No app needed, no server, no account. Just your disc coming home.
            </p>
            <Link
              to="/disc-return"
              className="inline-flex items-center bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-colors shadow-xl"
            >
              Create a Free Return Tag
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
