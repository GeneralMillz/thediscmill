import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEvents } from '../hooks/useEvents';
import { Calendar, MapPin, Trophy, Search, Loader2, AlertCircle, Filter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { US_STATES, STATE_NAME } from '../constants/usStates';

const TIER_COLORS: Record<string, string> = {
  'ES':     'bg-yellow-100 text-yellow-800 border-yellow-200',
  'A-Tier': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'B-Tier': 'bg-blue-100 text-blue-800 border-blue-200',
  'C-Tier': 'bg-green-100 text-green-800 border-green-200',
  'XM':     'bg-purple-100 text-purple-800 border-purple-200',
  'NT':     'bg-orange-100 text-orange-800 border-orange-200',
};

function tierStyle(tier: string): string {
  for (const key of Object.keys(TIER_COLORS)) {
    if (tier.includes(key)) return TIER_COLORS[key];
  }
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

const STATUS_STYLES: Record<string, string> = {
  'Current': 'bg-green-100 text-green-700',
  'Final':   'bg-gray-100 text-gray-500',
  'Upcoming':'bg-blue-100 text-blue-700',
};

function statusStyle(status: string): string {
  for (const key of Object.keys(STATUS_STYLES)) {
    if (status.toLowerCase().includes(key.toLowerCase())) return STATUS_STYLES[key];
  }
  return 'bg-gray-100 text-gray-500';
}

export function Events() {
  const [stateFilter, setStateFilter] = useState('');
  const { data: events, loading, error } = useEvents(stateFilter);
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const tiers = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => { if (e.tier) set.add(e.tier); });
    return ['All', ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    // Build state match patterns only once per filter change
    // stateAbbr is 2 letters (e.g. "MI") — too short for raw substring match.
    // Require ", mi" so "Miami, FL" doesn't match when filtering for Michigan.
    const stateAbbrLower = stateFilter.toLowerCase();
    const stateFull = stateFilter ? (STATE_NAME[stateFilter] ?? '').toLowerCase() : '';

    return events.filter(e => {
      const matchQuery = !q || e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      const matchTier = tierFilter === 'All' || e.tier === tierFilter;
      const loc = e.location.toLowerCase();
      const matchState = !stateFilter ||
        // ", mi" — matches "Grand Rapids, MI" but not "Miami, FL"
        loc.includes(`, ${stateAbbrLower}`) ||
        // " mi" at end — matches bare "Grand Rapids MI" edge case
        loc.endsWith(` ${stateAbbrLower}`) ||
        // Full state name — matches "Grand Rapids, Michigan"
        (stateFull !== '' && loc.includes(stateFull));
      return matchQuery && matchTier && matchState;
    });
  }, [events, query, tierFilter, stateFilter]);

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Disc Golf Events | The Disc Mill</title>
        <meta name="description" content="Find PDGA disc golf tournaments and events by state." />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">PDGA Events</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg ml-0 sm:ml-[52px]">Live tournament data from PDGA.com.</p>
        </div>

        {/* State + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={stateFilter}
            onChange={e => { setStateFilter(e.target.value); setQuery(''); setTierFilter('All'); }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm bg-white dark:bg-gray-800"
          >
            <option value="">Select a state...</option>
            {US_STATES.map(s => (
              <option key={s.abbr} value={s.abbr}>{s.name}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search events or location..."
              className="pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tier filter pills */}
      {tiers.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-gray-400" />
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                tierFilter === tier
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      )}

      {/* Idle — no state selected */}
      {!stateFilter && !loading && (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a state to browse events</h3>
          <p className="text-gray-500 dark:text-gray-400">Choose a state above to load PDGA tournaments for that area.</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-24 gap-4 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
          <p className="text-sm">Loading events from PDGA...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-800">Could not load events</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Events list */}
      {!loading && stateFilter && (
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700"
            >
              <Calendar className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
              <p className="font-bold text-gray-700 dark:text-gray-300">No events match your filters</p>
              <button
                onClick={() => { setQuery(''); setTierFilter('All'); }}
                className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
              </div>

              {filtered.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Index or tier icon */}
                    <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{event.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {event.location && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 shrink-0" />
                            {event.location}
                          </span>
                        )}
                        {event.date && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1 shrink-0" />
                            {event.date}
                          </span>
                        )}
                        {event.status && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle(event.status)}`}>
                            {event.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {event.tier && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tierStyle(event.tier)}`}>
                        {event.tier}
                      </span>
                    )}
                    <Link
                      to={`/event/${event.id}`}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Leaderboard
                    </Link>
                  </div>
                </motion.div>
              ))}

              <div className="pt-4 text-center">
                <a
                  href="https://www.pdga.com/tour/search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all events on PDGA.com
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
