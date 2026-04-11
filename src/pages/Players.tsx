import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Users, Search, Star, MapPin, Award, Loader2, AlertCircle, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { searchPlayers } from '../services/players';

const FEATURED_PDGA_NUMBERS = ['44968', '37523', '29190', '49297'];
const FEATURED_NAMES = ['Paul McBeth', 'Ricky Wysocki', 'Paige Pierce', 'Calvin Heimburg'];

function RatingBadge({ rating }: { rating: number }) {
  const color =
    rating >= 1000 ? 'bg-purple-100 text-purple-700' :
    rating >= 950  ? 'bg-indigo-100 text-indigo-700' :
    rating >= 900  ? 'bg-blue-100 text-blue-700' :
    rating >= 850  ? 'bg-green-100 text-green-700' :
    rating > 0     ? 'bg-gray-100 text-gray-600' :
                     'bg-gray-50 text-gray-400';
  return (
    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${color}`}>
      {rating > 0 ? rating : 'N/A'}
    </span>
  );
}

function PlayerCard({ player, index }: { player: Player; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/player/${player.id}`}
        className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
      >
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
          <UserCircle className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{player.name}</h3>
            {player.classification && (
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {player.classification}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {player.pdgaNumber && (
              <span className="text-xs text-gray-400 font-mono">#{player.pdgaNumber}</span>
            )}
            {player.location && (
              <span className="text-xs text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />{player.location}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <RatingBadge rating={player.rating} />
          </div>
          <span className="text-[10px] text-gray-400">Rating</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function Players() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const doSearch = useCallback(async (q: string, p = 0) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    if (p === 0) setSearched(true);
    try {
      const players = await searchPlayers(q.trim(), p);
      if (p === 0) setResults(players);
      else setResults(prev => [...prev, ...players]);
      setPage(p);
      setHasMore(players.length >= 20);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') doSearch(query, 0);
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>PDGA Player Search | The Disc Mill</title>
        <meta name="description" content="Search PDGA-rated disc golf players, ratings, and career stats." />
      </Helmet>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Users className="text-white w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Player Intelligence</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 ml-0 sm:ml-[52px]">
          Search the PDGA database — live ratings, classifications, and career profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main search column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search bar */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Search PDGA Database</h2>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name or PDGA #..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                />
              </div>
              <button
                onClick={() => doSearch(query, 0)}
                disabled={loading || !query.trim()}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Data sourced live from PDGA.com — results may take a few seconds.
            </p>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16 text-gray-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                <p className="text-sm">Searching PDGA database...</p>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800">Search failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <p className="text-xs text-red-400 mt-2">The PDGA may be temporarily unavailable. Try again in a moment.</p>
                </div>
              </motion.div>
            )}

            {!loading && !error && searched && results.length === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Users className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
                <p className="font-bold text-gray-700 dark:text-gray-300">No players found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different name or PDGA number.</p>
              </motion.div>
            )}

            {!loading && !error && results.length > 0 && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-gray-700 dark:text-gray-300">{results.length} player{results.length !== 1 ? 's' : ''} found</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Click a player to see full profile</span>
                </div>
                {results.map((player, i) => (
                  <React.Fragment key={player.id || i}>
                    <PlayerCard player={player} index={i} />
                  </React.Fragment>
                ))}
                {hasMore && (
                  <button
                    onClick={() => doSearch(query, page + 1)}
                    disabled={loading}
                    className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 transition-colors disabled:opacity-40"
                  >
                    Load more results
                  </button>
                )}
              </motion.div>
            )}

            {!searched && !loading && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 to-white dark:to-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-3xl p-8 text-center">
                <Search className="w-12 h-12 text-indigo-200 dark:text-indigo-800 mx-auto mb-4" />
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">Search any PDGA player</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                  Enter a name and press Search or hit Enter to pull live data from the PDGA database.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick-jump to top pros */}
          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-300" />
              Top Professionals
            </h3>
            <div className="space-y-3">
              {FEATURED_PDGA_NUMBERS.map((num, i) => (
                <Link
                  key={num}
                  to={`/player/${num}`}
                  className="flex items-center justify-between border-b border-indigo-800 pb-3 last:border-0 hover:text-indigo-300 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500 font-bold text-xs w-4">{i + 1}</span>
                    <span className="font-medium text-sm">{FEATURED_NAMES[i]}</span>
                  </div>
                  <span className="text-indigo-400 font-mono text-xs">#{num}</span>
                </Link>
              ))}
            </div>
            <p className="text-indigo-400 text-xs mt-4 leading-relaxed">
              Click any player to view their live PDGA profile with ratings history.
            </p>
          </div>

          {/* Stats panel */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              PDGA Facts
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Registered Members', value: '250,000+' },
                { label: 'Countries Represented', value: '50+' },
                { label: 'Active Pros (FPO/MPO)', value: '2,000+' },
                { label: 'Rating Scale', value: '0 – 1100+' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating guide */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Rating Guide</h3>
            <div className="space-y-2">
              {[
                { range: '1000+', label: 'World Class', color: 'bg-purple-100 text-purple-700' },
                { range: '950–999', label: 'Professional', color: 'bg-indigo-100 text-indigo-700' },
                { range: '900–949', label: 'Advanced', color: 'bg-blue-100 text-blue-700' },
                { range: '850–899', label: 'Intermediate+', color: 'bg-green-100 text-green-700' },
                { range: 'Under 850', label: 'Recreational', color: 'bg-gray-100 text-gray-600' },
              ].map(({ range, label, color }) => (
                <div key={range} className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{range}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
