import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildCanonical, buildFAQSchema, buildItemListSchema, SITE_URL } from '../utils/seo';

interface Term {
  term: string;
  definition: string;
  related?: { label: string; href: string }[];
}

const TERMS: Term[] = [
  {
    term: 'Ace',
    definition: 'A hole-in-one in disc golf. Throwing from the tee pad and landing in the basket on the first throw.',
  },
  {
    term: 'Anhyzer',
    definition: 'A release angle where the disc is tilted so the top faces away from the thrower. For RHBH throws, an anhyzer release tilts the left edge up, causing the disc to turn right early in flight.',
    related: [{ label: 'Best Understable Discs', href: '/best/backhand-discs' }],
  },
  {
    term: 'Birdie',
    definition: 'Completing a hole one stroke under par. One of the most common scoring targets for recreational and competitive players.',
  },
  {
    term: 'Bogey',
    definition: 'Completing a hole one stroke over par.',
  },
  {
    term: 'Disc Speed',
    definition: 'A flight number (1–14) indicating how fast a disc needs to be thrown to achieve its rated flight. Higher speed discs require more arm speed and generate more distance potential — but only when thrown correctly.',
    related: [{ label: 'Best Distance Drivers', href: '/best/distance-drivers' }, { label: 'Best Low Power Discs', href: '/best/low-power' }],
  },
  {
    term: 'Fade',
    definition: 'The last flight number (0–5). Describes how hard a disc hooks at the end of its flight. Fade 0–1 lands nearly straight. Fade 4–5 snaps hard left (RHBH) at the finish. Critical for overstable disc selection.',
    related: [{ label: 'Best Wind Discs', href: '/best/wind' }, { label: 'Best Forehand Discs', href: '/best/forehand-discs' }],
  },
  {
    term: 'Flex Shot',
    definition: 'Throwing an overstable disc on an anhyzer angle so it first turns right (RHBH), then fades back left. Creates an S-curve flight path useful for navigating obstacles.',
    related: [{ label: 'Best Stable Drivers', href: '/best/stable-drivers' }],
  },
  {
    term: 'Glide',
    definition: 'The second flight number (1–7). Measures a disc\'s ability to maintain loft during flight. High glide discs stay in the air longer and achieve more distance. Low glide discs drop faster — better in wind.',
    related: [{ label: 'Best Distance Drivers', href: '/best/distance-drivers' }],
  },
  {
    term: 'Grenade',
    definition: 'A throw where the disc is released with the bottom facing up, steeply on a hyzer angle. The disc turns over and falls nearly straight down — useful for overhanging tree branches.',
  },
  {
    term: 'Hyzer',
    definition: 'A release angle where the disc is tilted so the top faces toward the thrower. For RHBH throws, hyzer tilts the right edge up. The disc finishes left and lands flat. Used for controlled, predictable shots.',
    related: [{ label: 'Best Overstable Discs', href: '/best/wind' }],
  },
  {
    term: 'Hyzerflip',
    definition: 'Throwing an understable disc on a hyzer angle so it initially fades left, then flips to flat or turnover mid-flight. Creates maximum distance for lower-power players.',
    related: [{ label: 'Best Low Power Discs', href: '/best/low-power' }, { label: 'Best Backhand Discs', href: '/best/backhand-discs' }],
  },
  {
    term: 'Mandatory (Mando)',
    definition: 'A required flight path on a hole. The disc must pass a specific side of a designated tree or marker. Missing a mando results in a penalty stroke and returning to the mando point.',
  },
  {
    term: 'Nose Angle',
    definition: 'The angle of the disc\'s leading edge during flight relative to the ground. Nose-up flight adds drag and reduces distance. Nose-down flight is more aerodynamic but increases turnover risk.',
  },
  {
    term: 'OAT (Off-Axis Torque)',
    definition: 'Wobble imparted to a disc during release. High OAT causes a disc to behave less predictably than its rated flight numbers suggest. Smooth, clean releases minimize OAT.',
  },
  {
    term: 'OB (Out of Bounds)',
    definition: 'Any area outside the marked boundary of the course. Landing OB results in a one-stroke penalty. The disc is played from a designated drop zone or the point where it crossed OB.',
  },
  {
    term: 'Overstable',
    definition: 'A disc that resists turning at high speed and fades hard at the end of flight. Characterized by low or positive turn and high fade. Ideal for wind, forehand throws, and controlled shot-shaping.',
    related: [{ label: 'Best Wind Discs', href: '/best/wind' }, { label: 'Best Forehand Discs', href: '/best/forehand-discs' }],
  },
  {
    term: 'Putt & Approach (P&A)',
    definition: 'A disc designed primarily for putting and short approach shots. Typically a slow putter with predictable, low-glide flight for accuracy rather than distance.',
    related: [{ label: 'Best Putters', href: '/best/putters' }],
  },
  {
    term: 'Rim Width',
    definition: 'The distance from the outside of the disc to the inner edge of the flight plate. Wider rims = higher speed ratings. Distance drivers have the widest rims. Putters have the narrowest.',
    related: [{ label: 'Best Distance Drivers', href: '/best/distance-drivers' }, { label: 'Best Putters', href: '/best/putters' }],
  },
  {
    term: 'Roller',
    definition: 'A shot where the disc is released on a steep anhyzer angle so it lands on its edge and rolls along the ground. Used for long straight shots through tunnels or under trees.',
  },
  {
    term: 'Skip Shot',
    definition: 'Intentionally throwing a disc so it hits the ground at a shallow angle and skips forward. Useful for reaching targets behind obstacles at ground level. Overstable discs skip more reliably.',
  },
  {
    term: 'Stability',
    definition: 'A descriptor combining turn and fade to characterize overall disc flight: Very Understable, Understable, Neutral, Stable, Overstable, or Very Overstable. Used to match a disc to a player\'s power level and throw style.',
    related: [{ label: 'Disc Recommender', href: '/recommend' }, { label: 'Disc Finder', href: '/disc-finder' }],
  },
  {
    term: 'Tomahawk',
    definition: 'An overhead throw where the disc is held vertically and thrown like an axe. The disc turns over, falls quickly, and can travel in an arc useful for overhanging obstacles.',
  },
  {
    term: 'Torque',
    definition: 'Rotational force on a disc during flight. Discs with low glide or poor aerodynamics generate more torque, destabilizing flight. Off-axis torque from release imperfections also causes inconsistent flights.',
  },
  {
    term: 'Turn',
    definition: 'The third flight number (-5 to +1). Describes high-speed disc behavior. Negative turn means the disc turns right for RHBH at high speed (understable). 0 or positive turn means it resists turning (overstable at high speed).',
    related: [{ label: 'Best Backhand Discs', href: '/best/backhand-discs' }, { label: 'Best Understable Discs', href: '/best/low-power' }],
  },
  {
    term: 'Understable',
    definition: 'A disc with a negative turn rating that turns right (RHBH) at high speed. Ideal for hyzerflip shots, turnover lines, distance at lower power levels, and beginners who can\'t generate enough arm speed for neutral/overstable discs.',
    related: [{ label: 'Best Discs for Beginners', href: '/best/beginners' }, { label: 'Best Backhand Discs', href: '/best/backhand-discs' }],
  },
];

// Group by first letter
const LETTERS = Array.from(new Set(TERMS.map(t => t.term[0].toUpperCase()))).sort();
const BY_LETTER = Object.fromEntries(
  LETTERS.map(l => [l, TERMS.filter(t => t.term[0].toUpperCase() === l)])
);

export function Glossary() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string | null>(null);
  const canonicalUrl = buildCanonical(pathname);

  const jsonLd = [
    buildFAQSchema(
      TERMS.slice(0, 12).map(t => ({ question: `What is ${t.term} in disc golf?`, answer: t.definition }))
    ),
    buildItemListSchema('Disc Golf Glossary', TERMS.map(t => ({ name: t.term, url: `${SITE_URL}/glossary#${t.term.toLowerCase().replace(/\s+/g, '-')}` }))),
  ];

  return (
    <div className="pt-20 pb-16 px-4 max-w-4xl mx-auto">
      <SEO
        title="Disc Golf Glossary | Terms, Definitions & Flight Numbers Explained"
        description="Complete disc golf glossary — hyzer, anhyzer, turn, fade, glide, OAT, flex shot, roller, and 20+ more terms explained with examples and disc recommendations."
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Disc Golf Glossary</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 ml-[52px] mb-10">Every term you need to understand disc selection, shot shaping, and flight numbers.</p>

      {/* Alphabet index */}
      <div className="flex flex-wrap gap-2 mb-10 sticky top-14 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm py-3 z-10 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800">
        {LETTERS.map(l => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-black text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
          >
            {l}
          </a>
        ))}
      </div>

      {/* Terms */}
      <div className="space-y-10">
        {LETTERS.map(l => (
          <div key={l} id={`letter-${l}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-black text-indigo-600">{l}</span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="space-y-4">
              {BY_LETTER[l].map(term => (
                <motion.div
                  key={term.term}
                  id={term.term.toLowerCase().replace(/\s+/g, '-')}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"
                >
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">{term.term}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{term.definition}</p>
                  {term.related && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {term.related.map(r => (
                        <Link key={r.href} to={r.href} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                          {r.label} <ChevronRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
        <Link to="/discs" className="text-indigo-600 font-semibold hover:underline">Browse Disc Catalog →</Link>
        <Link to="/recommend" className="text-indigo-600 font-semibold hover:underline">Get Disc Recommendations →</Link>
        <Link to="/disc-finder" className="text-indigo-600 font-semibold hover:underline">Find Your Disc →</Link>
        <Link to="/guides" className="text-indigo-600 font-semibold hover:underline">Read Buying Guides →</Link>
      </div>
    </div>
  );
}
