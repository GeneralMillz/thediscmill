import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { 
  Disc, ArrowRight, MapPin, Trophy, Zap, QrCode, 
  ShoppingBag, BookOpen, Users, Search, ChevronRight,
  ExternalLink, Calendar, Target, Palette, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DiscOfTheDay from '../components/DiscOfTheDay';
import DyerSpotlight from '../components/DyerSpotlight';
import { trackOutboundClick } from '../utils/outboundAnalytics';

const MI_COURSES = [
  { name: 'Addison Oaks', city: 'Leonard', url: 'https://www.udisc.com/courses/addison-oaks-p-x-D' },
  { name: 'Stony Creek', city: 'Shelby Twp', url: 'https://www.udisc.com/courses/stony-creek-metropark-green-D0X1' },
  { name: 'River Bends', city: 'Shelby Twp', url: 'https://www.udisc.com/courses/river-bends-park-r-p-g-r' },
  { name: 'Firefighters', city: 'Troy', url: 'https://www.udisc.com/courses/firefighters-park-o2zC' },
  { name: 'Kensington', city: 'Milford', url: 'https://www.udisc.com/courses/kensington-metropark-black-locust-north-s-n-r-U' },
];

const GUIDES = [
  { title: 'Best for Beginners', slug: 'beginners', icon: Star },
  { title: 'Best Putters', slug: 'putters', icon: Disc },
  { title: 'Best Drivers', slug: 'distance-drivers', icon: Zap },
  { title: 'Glow Discs', slug: 'glow-discs', icon: Target },
];

export function Home() {
  const [stats, setStats] = useState({ discs: 0, brands: 0, clicks: 0, blogs: 0 });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real stats
    Promise.all([
      fetch('/data/discs.json').then(res => res.json()),
      fetch('/data/manufacturers.json').then(res => res.json()),
      fetch('/data/blog.json').then(res => res.json()),
      fetch('/data/rollups/clicks_by_manufacturer_monthly.json').then(res => res.json()).catch(() => ({})),
      fetch('/data/events.json').then(res => res.json()).catch(() => []),
    ]).then(([discs, mfgs, blogs, clicksData, eventsData]) => {
      // Calculate total clicks from rollups
      let totalClicks = 0;
      Object.values(clicksData).forEach((month: any) => {
        Object.values(month).forEach((count: any) => {
          totalClicks += count;
        });
      });

      setStats({
        discs: discs.length,
        brands: mfgs.length,
        clicks: totalClicks,
        blogs: blogs.length
      });
      setEvents(eventsData.slice(0, 3));
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="The Disc Mill | Disc Golf Intelligence Hub"
        description="Your high-performance disc golf database. Browse 200+ discs, find local courses, and support independent disc dyers."
        canonicalUrl="https://thediscmill.com/"
        isRootEntity={true}
      />

      {/* ── Real Data Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8"
          >
            <Zap size={12} className="fill-current" /> Intelligence Hub
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
            The Disc <br /><span className="text-indigo-500">Mill.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Professionalizing the creator economy. National course intelligence, live analytics, and verified dyer spotlights.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to="/discs" className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-2xl shadow-indigo-500/20">
              Find your new disc <ArrowRight size={20} />
            </Link>
            <Link to="/dyers" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-xl">
              Meet Creators <Palette size={20} />
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 backdrop-blur-2xl">
            <div className="p-8 border-r border-white/5">
              <div className="text-3xl font-black mb-1">{stats.discs}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Discs Cataloged</div>
            </div>
            <div className="p-8 border-r border-white/5">
              <div className="text-3xl font-black mb-1">{stats.brands}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manufacturers</div>
            </div>
            <div className="p-8">
              <div className="text-3xl font-black mb-1">{stats.blogs}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Intelligence Briefs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disc of the Day ────────────────────────────────────────── */}
      <DiscOfTheDay />

      {/* ── Featured Guides ────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Market Intelligence</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">The Best Discs <br />for 2025.</h3>
            </div>
            <Link to="/guides" className="flex items-center gap-2 text-indigo-600 font-black hover:gap-3 transition-all">
              All Buying Guides <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUIDES.map(guide => (
              <Link 
                key={guide.slug} 
                to={`/best/${guide.slug}`}
                className="group p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 hover:border-indigo-500 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                  <guide.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{guide.title}</h4>
                <p className="text-sm text-gray-500 mb-6">Explore the highest rated discs in this category.</p>
                <span className="inline-flex items-center gap-1 text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                  View Guide <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Spotlight ──────────────────────────────────────── */}
      <DyerSpotlight />

      {/* ── Two Column: Courses & Events ──────────────────────────── */}
      <section className="py-24 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Michigan Courses */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <MapPin className="text-indigo-600" /> Top MI Courses
                </h3>
                <Link to="/michigan" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  State Hub →
                </Link>
              </div>
              <div className="space-y-4">
                {MI_COURSES.map(course => (
                  <a 
                    key={course.name}
                    href={course.url}
                    onClick={() => trackOutboundClick({ url: course.url, label: course.name, pageSource: 'home_courses', category: 'course_click' })}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500 transition-all group"
                  >
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{course.name}</div>
                      <div className="text-xs text-gray-500">{course.city}, MI</div>
                    </div>
                    <ExternalLink size={18} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <Trophy className="text-indigo-600" /> Recent Events
                </h3>
                <Link to="/events" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
                  Full Schedule →
                </Link>
              </div>
              <div className="space-y-4">
                {events.length > 0 ? events.map(event => (
                  <a 
                    key={event.id}
                    href={event.url}
                    onClick={() => trackOutboundClick({ url: event.url, label: event.name, pageSource: 'home_events', category: 'event_click' })}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-6 p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 hover:border-indigo-500 transition-all group"
                  >
                    <div className="text-center">
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">Aug</div>
                      <div className="text-2xl font-black text-indigo-900 dark:text-white leading-none">15</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{event.name}</div>
                      <div className="text-xs text-gray-500">{event.location}</div>
                    </div>
                    <ArrowRight size={20} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                )) : (
                  <p className="text-gray-500">Loading events...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disc Return Network (CTA) ──────────────────────────────── */}
      <section className="py-24 bg-indigo-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 md:p-20 rounded-[4rem] text-center text-white">
            <div className="w-20 h-20 bg-white text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl">
              <QrCode size={40} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Lost a disc? <br />We'll bring it home.</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the National Disc Return Network. Create a free QR tag for your bag. No app, no fees, just community.
            </p>
            <Link to="/disc-return" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl">
              Create My Free Tag <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}