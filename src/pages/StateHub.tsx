import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildCanonical, buildItemListSchema, SITE_URL } from '../utils/seo';

interface StateConfig {
  name: string;
  abbr: string;
  headline: string;
  description: string;
  accentColor: string;
  highlights: string[];
  topCities: string[];
  pdgaUrl: string;
}

const STATE_CONFIGS: Record<string, StateConfig> = {
  michigan: {
    name: 'Michigan', abbr: 'MI',
    headline: 'Disc Golf in Michigan',
    description: 'Michigan is home to 500+ disc golf courses, the DGPT\'s most scenic venues, and a passionate year-round disc golf community.',
    accentColor: '#003DA5',
    highlights: ['500+ PDGA-rated courses', 'Northwood Hills • Timber Ridge • Milham Park', 'DGPT stops in summer season'],
    topCities: ['Grand Rapids', 'Kalamazoo', 'Ann Arbor', 'Detroit', 'Traverse City'],
    pdgaUrl: 'https://www.pdga.com/course-directory/advanced?State=MI&Country=US',
  },
  texas: {
    name: 'Texas', abbr: 'TX',
    headline: 'Disc Golf in Texas',
    description: 'Texas has one of the largest disc golf scenes in the US — year-round playable weather, 600+ courses, and multiple DGPT events annually.',
    accentColor: '#BF0A30',
    highlights: ['600+ PDGA-rated courses', 'Selah Ranch • Reveille Peak Ranch', 'Year-round playable weather'],
    topCities: ['Dallas', 'Austin', 'Houston', 'San Antonio', 'Fort Worth'],
    pdgaUrl: 'https://www.pdga.com/course-directory/advanced?State=TX&Country=US',
  },
  california: {
    name: 'California', abbr: 'CA',
    headline: 'Disc Golf in California',
    description: 'California disc golf spans coastal parks, mountain courses, and desert tracks — from Golden Gate Park to DeLaveaga in Santa Cruz.',
    accentColor: '#003DA5',
    highlights: ['DeLaveaga (Santa Cruz) — legendary layout', 'Golden Gate Park beginner courses', 'Year-round desert & coastal play'],
    topCities: ['San Francisco', 'Los Angeles', 'San Diego', 'Santa Cruz', 'Sacramento'],
    pdgaUrl: 'https://www.pdga.com/course-directory/advanced?State=CA&Country=US',
  },
  ohio: {
    name: 'Ohio', abbr: 'OH',
    headline: 'Disc Golf in Ohio',
    description: 'Ohio punches above its weight in disc golf — dense course coverage, top-tier rated courses, and a deep competitive community.',
    accentColor: '#BB0000',
    highlights: ['400+ PDGA-rated courses', 'Hawk\'s Nest • Firefly', 'Strong Am and Pro player base'],
    topCities: ['Columbus', 'Cincinnati', 'Cleveland', 'Dayton', 'Toledo'],
    pdgaUrl: 'https://www.pdga.com/course-directory/advanced?State=OH&Country=US',
  },
  florida: {
    name: 'Florida', abbr: 'FL',
    headline: 'Disc Golf in Florida',
    description: 'Florida\'s flat terrain and year-round sun make it one of the most accessible disc golf destinations in the US. Over 400 courses statewide.',
    accentColor: '#0021A5',
    highlights: ['400+ PDGA-rated courses', 'Flat wooded parkland courses', 'Winter circuit hub for touring pros'],
    topCities: ['Tampa', 'Orlando', 'Jacksonville', 'Miami', 'Gainesville'],
    pdgaUrl: 'https://www.pdga.com/course-directory/advanced?State=FL&Country=US',
  },
};

export function StateHub() {
  const { pathname } = useLocation();
  // Derive state key from pathname (e.g. /michigan → 'michigan')
  const stateKey = pathname.replace(/^\//, '').split('/')[0].toLowerCase();
  const config = STATE_CONFIGS[stateKey];
  const canonicalUrl = buildCanonical(pathname);

  const jsonLd = buildItemListSchema(
    config ? `Disc Golf Courses in ${config.name}` : 'Disc Golf State Hub',
    []
  );

  if (!config) return (
    <div className="pt-32 text-center">
      <p className="text-gray-500 dark:text-gray-400">State not found.</p>
      <Link to="/courses" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">Browse all courses →</Link>
    </div>
  );

  return (
    <div className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
      <SEO
        title={`${config.headline} | Courses, Events & Community`}
        description={config.description}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <div
        className="rounded-3xl p-8 mb-10 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.accentColor}ee, ${config.accentColor}88)` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <p className="text-sm font-black uppercase tracking-widest opacity-75 mb-2 relative z-10">State Hub</p>
        <h1 className="text-5xl font-black mb-4 relative z-10">{config.headline}</h1>
        <p className="text-lg opacity-80 max-w-2xl relative z-10">{config.description}</p>
        <div className="flex flex-wrap gap-3 mt-6 relative z-10">
          {config.highlights.map((h, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/20 rounded-xl text-sm font-semibold backdrop-blur-sm">{h}</span>
          ))}
        </div>
      </div>

      {/* Top cities */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {config.topCities.map(city => (
          <div key={city} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center">
            <MapPin className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900 dark:text-white">{city}</p>
          </div>
        ))}
      </div>

      {/* Course directory link */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Find Courses in {config.name}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Browse the PDGA's full directory of courses in {config.name}, including ratings, reviews, and directions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={config.pdgaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            PDGA Course Directory — {config.abbr} →
          </a>
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            The Disc Mill Course Directory →
          </Link>
        </div>
      </div>

      {/* Internal links */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-wrap gap-4 text-sm">
        <Link to="/courses"  className="text-indigo-600 font-semibold hover:underline">Course Directory →</Link>
        <Link to="/events"   className="text-indigo-600 font-semibold hover:underline">Upcoming Events →</Link>
        <Link to="/discs"    className="text-indigo-600 font-semibold hover:underline">Disc Catalog →</Link>
        <Link to="/recommend" className="text-indigo-600 font-semibold hover:underline">Get Disc Recommendations →</Link>
        <Link to="/best/beginners" className="text-indigo-600 font-semibold hover:underline">Best Beginner Discs →</Link>
      </div>
    </div>
  );
}
