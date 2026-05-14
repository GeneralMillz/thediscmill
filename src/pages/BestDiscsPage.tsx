import React, { useMemo } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { DiscCard, FlightPathArc, brandAccent } from '../components/DiscCard';
import { DiscImage } from '../components/DiscImage';
import { useDiscs } from '../hooks/useDiscs';
import { Disc } from '../types';
import {
  buildCanonical,
  buildFAQSchema,
  buildItemListSchema,
  SITE_URL,
} from '../utils/seo';
import { buildAmazonLink } from '../utils/amazon';

// ─── Curated glow/lightweight disc names (no plastic data in schema) ─────────
const GLOW_DISC_NAMES = [
  'Aviar', 'Buzz', 'Buzzz', 'Berg', 'Judge', 'Ion', 'Envy', 'Luna',
  'Proxy', 'Shield', 'Roc3', 'Mako3', 'Phantom', 'Harp',
];
const LIGHTWEIGHT_DISC_NAMES = [
  'Aviar', 'Birdie', 'Pure', 'Mako3', 'Wizard', 'Anode', 'Envy',
  'Ion', 'Pixel', 'Judge', 'Dagger', 'Dart', 'Comet',
];

// ─── Page config ─────────────────────────────────────────────────────────────

interface PageConfig {
  title: string;
  h1: string;
  description: string;
  intro: string;
  filter: (d: Disc) => boolean;
  score: (d: Disc) => number;
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
}

const CONFIGS: Record<string, PageConfig> = {
  beginners: {
    title: 'Best Discs for Beginners 2025',
    h1: 'Best Discs for Beginners',
    description: 'The 10 best disc golf discs for beginners in 2025. Low-speed, forgiving plastics that teach proper form without fighting the disc.',
    intro: 'New players need discs that fly straight, forgive off-axis torque, and don\'t require elite arm speed. High-speed drivers will turn over and crash every time. Start here.',
    filter: d => (d.speed ?? 0) <= 6 && (d.fade ?? 0) <= 2 && d.category !== 'Distance Driver',
    score: d => (6 - (d.speed ?? 6)) * 2 + (2 - (d.fade ?? 2)) * 3,
    faqs: [
      { question: 'What disc should a beginner start with?', answer: 'A putter or mid-range with speed 3–5 and fade 1–2. Avoid distance drivers — they require 60+ mph arm speed to fly correctly.' },
      { question: 'Should beginners use understable or overstable discs?', answer: 'Understable or neutral. Overstable discs require more power and will crash immediately for beginners.' },
      { question: 'How many discs does a beginner need?', answer: 'Three: a putter, a mid-range, and one fairway driver. That\'s a complete bag for your first year.' },
    ],
    related: [
      { label: 'Best Putters', href: '/best/putters' },
      { label: 'Best Midranges', href: '/best/midranges' },
      { label: 'Best Low Power Discs', href: '/best/low-power' },
    ],
  },

  'distance-drivers': {
    title: 'Best Distance Drivers 2025 | Maximum Reach',
    h1: 'Best Distance Drivers',
    description: 'The best disc golf distance drivers in 2025 ranked by speed, glide, and flight consistency. For players with 60+ mph arm speed.',
    intro: 'Distance drivers have the widest rims and highest speed ratings. They require serious arm speed to fly correctly — for players under 300 feet, a fairway driver will go further.',
    filter: d => d.category === 'Distance Driver' && (d.speed ?? 0) >= 10,
    score: d => (d.speed ?? 0) * 1.5 + (d.glide ?? 0),
    faqs: [
      { question: 'What speed driver should I throw?', answer: 'Match the driver speed to your arm speed. Most players under 350 feet throw a speed 9–11 most accurately.' },
      { question: 'What\'s the most popular distance driver?', answer: 'The Innova Destroyer and Discraft Zeus are the most thrown distance drivers at every level.' },
      { question: 'Do distance drivers actually go further?', answer: 'Only if you can generate enough spin and speed. For most recreational players, a fairway driver goes further because they can control it.' },
    ],
    related: [
      { label: 'Best Stable Drivers', href: '/best/stable-drivers' },
      { label: 'Best High Power Discs', href: '/best/high-power' },
      { label: 'Best Forehand Discs', href: '/best/forehand-discs' },
    ],
  },

  putters: {
    title: 'Best Disc Golf Putters 2025',
    h1: 'Best Disc Golf Putters',
    description: 'The best disc golf putters in 2025 — for putting, approach shots, and driving. Straight-flying, reliable, and consistent.',
    intro: 'Putters are the most versatile discs in the bag. A neutral putter covers 10-foot tap-ins and 200-foot approach shots equally well. Never underestimate the putter.',
    filter: d => d.category === 'Putter',
    score: d => (d.glide ?? 0) * 2 + Math.max(0, 2 - Math.abs(d.turn ?? 0)) + (3 - Math.min(3, d.fade ?? 0)),
    faqs: [
      { question: 'How many putters should I carry?', answer: 'At minimum two: one for putting, one for approach shots. Many advanced players carry 3–5 putters for different situations.' },
      { question: 'What\'s a good beginner putter?', answer: 'The Innova Aviar, Discraft Magnet, or Dynamic Discs Judge. All are neutral, straight-flying, and widely available.' },
      { question: 'Should I use a beadless or beaded putter?', answer: 'Personal preference. Beaded putters sit deeper in the hand and stick in chains better. Beadless putters are smoother on release.' },
    ],
    related: [
      { label: 'Best Discs for Beginners', href: '/best/beginners' },
      { label: 'Best Midranges', href: '/best/midranges' },
      { label: 'Best Low Power Discs', href: '/best/low-power' },
    ],
  },

  midranges: {
    title: 'Best Disc Golf Midranges 2025',
    h1: 'Best Midrange Discs',
    description: 'The best disc golf midrange discs in 2025 — for control, accuracy, and consistency at 150–350 feet.',
    intro: 'Mid-ranges win disc golf matches. Players who throw midranges 250+ feet accurately beat power throwers every time. These are the most accurate, consistent midranges for every level.',
    filter: d => d.category === 'Midrange',
    score: d => (d.glide ?? 0) * 2 + Math.max(0, 2 - Math.abs(d.turn ?? 0)) * 1.5,
    faqs: [
      { question: 'What is the most popular midrange?', answer: 'The Discraft Buzzz is the most widely thrown midrange ever made. The Innova Roc3 is a close second.' },
      { question: 'When should I throw a midrange vs a putter?', answer: 'For shots 150–350 feet with tight fairways. Midranges resist wind better than putters and have more consistent fade than fairway drivers.' },
      { question: 'Are midranges good for beginners?', answer: 'Yes — they\'re the ideal beginner disc. Lower speed than drivers, more distance than putters.' },
    ],
    related: [
      { label: 'Best Putters', href: '/best/putters' },
      { label: 'Best Fairway Drivers', href: '/best/distance-drivers' },
      { label: 'Best Backhand Discs', href: '/best/backhand-discs' },
    ],
  },

  'forehand-discs': {
    title: 'Best Discs for Forehand (Sidearm) Throws 2025',
    h1: 'Best Discs for Forehand Throws',
    description: 'The best disc golf discs for forehand (sidearm) throws in 2025. Overstable, torque-resistant, and reliable for sidearm players.',
    intro: 'Forehand throws generate more torque than backhands. Understable discs will flip over immediately. Overstable discs with fade 3–5 hold their line and finish predictably on a forehand release.',
    filter: d => (d.fade ?? 0) >= 3,
    score: d => (d.fade ?? 0) * 2 + Math.max(0, d.turn ?? 0),
    faqs: [
      { question: 'Why do forehand throwers need overstable discs?', answer: 'Forehand mechanics put more torque on the disc. Overstable discs resist this torque and fly on a controlled line rather than flipping over.' },
      { question: 'What\'s the best forehand disc for beginners?', answer: 'The Discraft Zone or Innova Roc3. Both are forgiving on forehand releases and hold their angle reliably.' },
      { question: 'Can I throw understable discs forehand?', answer: 'Yes but they will hyzerflip quickly. Some players use this intentionally for roller shots or hyzerflip lines.' },
    ],
    related: [
      { label: 'Best Wind Discs', href: '/best/wind' },
      { label: 'Best Distance Drivers', href: '/best/distance-drivers' },
      { label: 'Best Stable Drivers', href: '/best/stable-drivers' },
    ],
  },

  'backhand-discs': {
    title: 'Best Discs for Backhand Throws 2025',
    h1: 'Best Discs for Backhand Throws',
    description: 'The best understable and neutral discs for backhand disc golf throws in 2025. Max distance and turnover shots.',
    intro: 'Backhand throws generate maximum spin. Understable discs complement this by turning right (RHBH) at high speed, adding distance and creating turnover shot shapes.',
    filter: d => (d.turn ?? 0) <= -2 && d.category !== 'Distance Driver',
    score: d => Math.abs(d.turn ?? 0) + (d.glide ?? 0),
    faqs: [
      { question: 'What is an understable disc?', answer: 'An understable disc has a negative turn rating (typically -2 to -5) and will turn right for right-hand backhand throws at high speed.' },
      { question: 'Best disc for turnover shots?', answer: 'The Innova Leopard3, Discraft Avenger SS, or Dynamic Discs Escape are classic turnover discs that hold a hyzerflip or turnover line reliably.' },
      { question: 'Should beginners use understable discs?', answer: 'Yes — understable discs fly straighter at lower arm speeds, making them ideal for beginners who can\'t generate enough power to flip an overstable disc.' },
    ],
    related: [
      { label: 'Best Discs for Beginners', href: '/best/beginners' },
      { label: 'Best Low Power Discs', href: '/best/low-power' },
      { label: 'Best Midranges', href: '/best/midranges' },
    ],
  },

  wind: {
    title: 'Best Disc Golf Discs for Wind 2025',
    h1: 'Best Discs for Wind',
    description: 'The most overstable disc golf discs for throwing into headwinds in 2025. Discs that resist turning over in windy conditions.',
    intro: 'Wind is the great equalizer. Understable discs flip over in headwinds. Overstable discs with fade 4–5 cut through wind and hold their line when others crash. These are the field-proven wind beaters.',
    filter: d => (d.fade ?? 0) >= 4 || ((d.fade ?? 0) >= 3 && (d.turn ?? 0) >= 0),
    score: d => (d.fade ?? 0) * 2 - (d.turn ?? 0),
    faqs: [
      { question: 'How does wind affect disc flight?', answer: 'Headwind acts as extra speed, flipping understable discs. Tailwind removes speed, making discs fade earlier. Overstable discs manage both better.' },
      { question: 'Should I throw harder in the wind?', answer: 'Counterintuitively, throwing harder into a headwind makes things worse. Slow down your release and use a more overstable disc on a hyzer angle.' },
      { question: 'Best approach discs for wind?', answer: 'The Kastaplast Berg, Innova Gator, or Discraft Zone. All are extremely overstable and stop hard in wind.' },
    ],
    related: [
      { label: 'Best Forehand Discs', href: '/best/forehand-discs' },
      { label: 'Best Stable Drivers', href: '/best/stable-drivers' },
      { label: 'Best Distance Drivers', href: '/best/distance-drivers' },
    ],
  },

  'low-power': {
    title: 'Best Discs for Low Power Players 2025',
    h1: 'Best Discs for Low Power',
    description: 'The best understable disc golf discs for players under 200 feet in 2025. Discs that fly correctly without elite arm speed.',
    intro: 'Most discs are designed for players with 55+ mph arm speed. These discs fly correctly at lower power levels — giving beginners and casual players the distance and control they\'re looking for.',
    filter: d => (d.speed ?? 0) <= 7 && (d.turn ?? 0) <= -1,
    score: d => Math.abs(d.turn ?? 0) - (d.speed ?? 7) * 0.5,
    faqs: [
      { question: 'What arm speed do I need for a distance driver?', answer: 'Most distance drivers need 55–65 mph arm speed to fly as advertised. Below that, they fade over immediately.' },
      { question: 'Will a slower disc really go further for me?', answer: 'Yes, for most players under 300 feet. A speed 7 understable disc will fly further than a speed 13 overstable driver thrown by the same player.' },
      { question: 'What\'s the single best disc recommendation for beginners?', answer: 'The Innova Leopard3. Low speed, high glide, understable — flies straight even at low power.' },
    ],
    related: [
      { label: 'Best Discs for Beginners', href: '/best/beginners' },
      { label: 'Best Backhand Discs', href: '/best/backhand-discs' },
      { label: 'Best Putters', href: '/best/putters' },
    ],
  },

  'high-power': {
    title: 'Best Discs for High Power Players 2025',
    h1: 'Best Discs for High Power',
    description: 'The best disc golf discs for advanced players with high arm speed in 2025. Speed 12–14 drivers that unlock maximum distance.',
    intro: 'High-power players need discs that can handle the speed and torque of a full-power throw. These discs are designed for players throwing 350+ feet who need max distance and reliable flight at high speeds.',
    filter: d => (d.speed ?? 0) >= 12,
    score: d => (d.speed ?? 0) + (d.glide ?? 0) * 0.5,
    faqs: [
      { question: 'What speed rating is best for advanced players?', answer: 'Most touring pros throw speed 12–13 for maximum distance. Speed 14 discs are specialty weapons, not everyday drivers.' },
      { question: 'Do high-speed discs go further?', answer: 'Only if you generate enough arm speed. Throwing a speed 14 disc at moderate power results in less distance than a speed 11 thrown at full power.' },
      { question: 'What are the most popular pro distance drivers?', answer: 'Innova Boss, Discraft Zeus, Discraft Nuke, Dynamic Discs Raider, and Innova Destroyer are the most common on professional tours.' },
    ],
    related: [
      { label: 'Best Distance Drivers', href: '/best/distance-drivers' },
      { label: 'Best Forehand Discs', href: '/best/forehand-discs' },
      { label: 'Best Stable Drivers', href: '/best/stable-drivers' },
    ],
  },

  'glow-discs': {
    title: 'Best Glow Disc Golf Discs 2025 | Night Rounds',
    h1: 'Best Glow Discs for Night Rounds',
    description: 'The best glow-in-the-dark disc golf discs for night rounds in 2025. Putters, mids, and drivers available in glow plastic.',
    intro: 'Night disc golf is one of the fastest-growing formats. Glow discs are available in most major product lines — putters and mids are most popular since they\'re easier to track in the dark.',
    filter: d => GLOW_DISC_NAMES.some(n => d.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(d.name.toLowerCase())),
    score: d => (d.speed ?? 0) <= 7 ? 10 : 5,
    faqs: [
      { question: 'How do glow discs work?', answer: 'They use phosphorescent plastic that charges under UV/sunlight and glows in the dark. Shine a UV flashlight on them between holes to recharge.' },
      { question: 'What\'s the best glow disc?', answer: 'The Innova DX Aviar and Discraft Glo Zone are the most popular glow discs. MVP also makes excellent glow plastic across their full lineup.' },
      { question: 'Do I need LED discs or glow plastic?', answer: 'For casual night rounds, glow plastic is fine. For competitive night leagues, LED discs (Glow Battle, Night Hawk) are brighter and easier to find.' },
    ],
    related: [
      { label: 'Best Putters', href: '/best/putters' },
      { label: 'Best Midranges', href: '/best/midranges' },
      { label: 'Best Discs for Beginners', href: '/best/beginners' },
    ],
  },

  'lightweight-discs': {
    title: 'Best Lightweight Disc Golf Discs 2025',
    h1: 'Best Lightweight Discs',
    description: 'The best lightweight disc golf discs in 2025 for juniors, seniors, and players building arm strength.',
    intro: 'Lightweight discs (150–160g) are ideal for juniors, seniors, and players working on arm speed. They fly further at lower power levels. These putters and mids are the most commonly available under 165g.',
    filter: d => LIGHTWEIGHT_DISC_NAMES.some(n => d.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(d.name.toLowerCase())),
    score: d => (d.speed ?? 0) <= 5 ? 10 : 6,
    faqs: [
      { question: 'What weight disc should a beginner use?', answer: 'For adults: 150–165g for maximum distance. For juniors under 12: 130–150g. For seniors: 150–165g for better range of motion.' },
      { question: 'Do lighter discs go further?', answer: 'For lower arm speeds, yes. Lighter discs require less force to reach optimal spin rates. For power throwers, heavier discs resist wind better.' },
      { question: 'Where to buy lightweight discs?', answer: 'Infinite Discs and Disc Golf United stock large selections of light-weight runs. Many are limited production.' },
    ],
    related: [
      { label: 'Best Discs for Beginners', href: '/best/beginners' },
      { label: 'Best Low Power Discs', href: '/best/low-power' },
      { label: 'Best Putters', href: '/best/putters' },
    ],
  },

  'stable-drivers': {
    title: 'Best Straight & Stable Disc Golf Drivers 2025',
    h1: 'Best Stable Drivers',
    description: 'The best neutral and stable disc golf drivers in 2025 — predictable, straight-flying, and reliable in all conditions.',
    intro: 'Stable drivers fly straight with a predictable, controlled fade at the end. No violent turn, no snap hook. These are the workhorses of every serious bag — reliable in all conditions and arm speeds.',
    filter: d =>
      (d.category === 'Distance Driver' || d.category === 'Fairway Driver') &&
      (d.turn ?? 0) >= -2 && (d.turn ?? 0) <= 0 &&
      (d.fade ?? 0) >= 2 && (d.fade ?? 0) <= 4,
    score: d => (d.glide ?? 0) * 2 + (5 - Math.abs((d.turn ?? 0) + 1)),
    faqs: [
      { question: 'What makes a driver "stable"?', answer: 'A turn of 0 to -1 and a fade of 2–3. Flies relatively straight with a clean, reliable finish. Neither flips nor snaps hard left.' },
      { question: 'Best all-around driver for every player?', answer: 'The Innova Teebird is the most universally recommended stable fairway driver. The Discraft Buzzz OS fills the same role for mid-range players.' },
      { question: 'Should beginners use stable or understable drivers?', answer: 'Understable. Stable and overstable drivers will fade left immediately for most beginners. Start understable and work toward stable as power develops.' },
    ],
    related: [
      { label: 'Best Distance Drivers', href: '/best/distance-drivers' },
      { label: 'Best Wind Discs', href: '/best/wind' },
      { label: 'Best Forehand Discs', href: '/best/forehand-discs' },
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function BestDiscsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { data: allDiscs, loading } = useDiscs();

  const config = slug ? CONFIGS[slug] : undefined;

  const ranked = useMemo(() => {
    if (!config || !allDiscs.length) return [];
    return allDiscs
      .filter(config.filter)
      .sort((a, b) => config.score(b) - config.score(a))
      .slice(0, 10);
  }, [allDiscs, config]);

  if (!config) {
    return (
      <div className="pt-32 text-center text-gray-500 dark:text-gray-400">
        <p className="text-xl mb-4">Page not found.</p>
        <Link to="/discs" className="text-indigo-600 font-bold hover:underline">← Browse All Discs</Link>
      </div>
    );
  }

  const canonicalUrl = buildCanonical(pathname);

  const jsonLd = [
    buildItemListSchema(config.title,
      ranked.map(d => ({
        name: `${d.brand} ${d.name}`,
        url: `${SITE_URL}/disc/${d.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        description: d.description,
      }))
    ),
    buildFAQSchema(config.faqs),
  ];

  return (
    <div className="pt-20 pb-16 px-4 max-w-6xl mx-auto">
      <SEO
        title={config.title}
        description={config.description}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {config.h1}
          </h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl ml-[52px]">
          {config.intro}
        </p>
      </motion.div>

      {/* ── Disc grid ── */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : ranked.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>No discs found for this category in the current catalog.</p>
          <Link to="/discs" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">Browse full catalog →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ranked.map((disc, i) => {
            const accent = brandAccent(disc.brand);
            return (
              <motion.div
                key={disc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                {/* Rank badge */}
                <div
                  className="absolute -top-3 -left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg"
                  style={{ background: accent.hex }}
                >
                  {i + 1}
                </div>
                <DiscCard disc={disc} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── FAQ section ── */}
      <div className="mb-14">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Internal links ── */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-10">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Related Lists</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {config.related.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            >
              {link.label}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/discs" className="text-sm text-indigo-600 hover:underline font-semibold">Browse Full Catalog →</Link>
          <Link to="/disc-finder" className="text-sm text-indigo-600 hover:underline font-semibold">Use Disc Finder →</Link>
          <Link to="/guides" className="text-sm text-indigo-600 hover:underline font-semibold">Read Buying Guides →</Link>
          <Link to="/bag-builder" className="text-sm text-indigo-600 hover:underline font-semibold">Build Your Bag →</Link>
        </div>
      </div>
    </div>
  );
}
