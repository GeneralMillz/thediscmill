import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Disc } from 'lucide-react';
import { useCourseDirectory } from '../hooks/useCourseDirectory';
import { Course } from '../types';
import { cn } from '../utils';
import {
  CourseFilterBar,
  CourseFilters,
  GeoState,
} from '../components/courses/CourseFilterBar';
import { STATE_NAME } from '../constants/usStates';

// ─── Distance helpers ────────────────────────────────────────────────────────

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function milesFrom(userLat: number, userLng: number, course: Course): number | null {
  if (!course.coordinates) return null;
  return (
    haversineKm(userLat, userLng, course.coordinates.lat, course.coordinates.lng) *
    0.621371
  );
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner:     'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced:     'bg-red-100 text-red-700',
};

function difficultyStyle(d: string) {
  return DIFFICULTY_STYLES[d] || 'bg-gray-100 text-gray-500';
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-16" />
        <div className="h-4 bg-gray-100 rounded w-20" />
      </div>
    </div>
  );
}

// ─── Course card ──────────────────────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
  distanceMi: number | null;
  index: number;
}

function CourseCard({ course, distanceMi, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.4) }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-200 active:scale-[0.99] transition-all duration-200 flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Name + holes badge */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-base text-gray-900 leading-snug">
            <Link to={`/course/${course.id}`} className="hover:text-indigo-600 transition-colors">
              {course.name}
            </Link>
          </h3>
          {course.holes > 0 && (
            <span className="shrink-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">
              {course.holes}H
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="truncate">
            {course.city && course.state
              ? `${course.city}, ${STATE_NAME[course.state] ?? course.state}`
              : course.location || 'Location unknown'}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-auto">
          {course.difficulty && course.difficulty !== 'Unknown' && (
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', difficultyStyle(course.difficulty))}>
              {course.difficulty}
            </span>
          )}
          {course.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {distanceMi !== null && (
              <span className="flex items-center text-xs font-medium text-indigo-600">
                <Navigation className="w-3 h-3 mr-1" />
                {distanceMi < 10 ? distanceMi.toFixed(1) : Math.round(distanceMi)} mi
              </span>
            )}
            {course.rating > 0 && (
              <span className="text-xs text-amber-600 font-medium">
                ★ {course.rating.toFixed(1)}
              </span>
            )}
          </div>
          <Link
            to={`/course/${course.id}`}
            className="text-indigo-600 text-xs font-bold hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function Courses() {
  // Raw filter state (search input is debounced before applying)
  const [searchRaw, setSearchRaw]         = useState('');
  const [stateFilter, setStateFilter]     = useState('');
  const [holesFilter, setHolesFilter]     = useState('');
  const [difficultyFilter, setDifficulty] = useState('');
  const [nearMe, setNearMe]               = useState(false);
  const [geo, setGeo]                     = useState<GeoState>({ status: 'idle' });

  const { data: courses, loading, error, dataSource } = useCourseDirectory(stateFilter);

  // 280ms debounce on the free-text search
  const search = useDebounced(searchRaw, 280);

  // ── Near Me ──────────────────────────────────────────────────────────────
  function handleNearMeToggle() {
    if (nearMe) {
      setNearMe(false);
      return;
    }
    if (!navigator.geolocation) {
      setGeo({ status: 'denied', reason: 'Geolocation is not supported by your browser.' });
      return;
    }
    setGeo({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeo({ status: 'granted', lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
      },
      err => {
        setGeo({ status: 'denied', reason: err.message });
        setNearMe(false);
      },
      { timeout: 8000, maximumAge: 300_000 }
    );
  }

  // ── Composed filter + sort ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    let list = courses.filter(c => {
      // Search: name, city, state abbr, state full name, or location string
      const stateFullName = STATE_NAME[c.state] ?? '';
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        stateFullName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      // State: match abbreviation (canonical dropdown)
      const matchState = !stateFilter || c.state === stateFilter;

      // Holes
      const matchHoles =
        !holesFilter ||
        (holesFilter === '9'  && c.holes === 9) ||
        (holesFilter === '18' && c.holes === 18) ||
        (holesFilter === '27' && c.holes === 27) ||
        (holesFilter === '36' && c.holes >= 36);

      // Difficulty
      const matchDifficulty = !difficultyFilter || c.difficulty === difficultyFilter;

      return matchSearch && matchState && matchHoles && matchDifficulty;
    });

    // Sort by distance when Near Me is active
    if (nearMe && geo.status === 'granted') {
      const { lat, lng } = geo;
      list = [...list].sort((a, b) => {
        const da = milesFrom(lat, lng, a);
        const db = milesFrom(lat, lng, b);
        if (da === null && db === null) return 0;
        if (da === null) return 1;
        if (db === null) return -1;
        return da - db;
      });
    }

    return list;
  }, [courses, search, stateFilter, holesFilter, difficultyFilter, nearMe, geo]);

  // Active filter count (for badge on mobile toggle)
  const activeCount = [searchRaw, stateFilter, holesFilter, difficultyFilter, nearMe ? '1' : ''].filter(Boolean).length;

  function clearFilters() {
    setSearchRaw('');
    setStateFilter('');
    setHolesFilter('');
    setDifficulty('');
    setNearMe(false);
  }

  // Build props object for the filter bar
  const filters: CourseFilters = {
    search: searchRaw,
    state: stateFilter,
    holes: holesFilter,
    difficulty: difficultyFilter,
    nearMe,
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Course Finder | The Disc Mill</title>
        <meta name="description" content="Discover disc golf courses near you with hole counts, ratings, and directions." />
      </Helmet>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Disc className="text-white w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Course Directory</h1>
        </div>
        <p className="text-gray-500 ml-[52px]">
          Live from PDGA — browse, filter, or find courses near you.
        </p>
      </div>

      {/* Filter bar (sticky) */}
      <CourseFilterBar
        filters={filters}
        geo={geo}
        activeCount={activeCount}
        onSearchChange={setSearchRaw}
        onStateChange={setStateFilter}
        onHolesChange={setHolesFilter}
        onDifficultyChange={setDifficulty}
        onNearMeToggle={handleNearMeToggle}
        onClear={clearFilters}
      />

      {/* Result count + data source badge */}
      {!loading && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{filtered.length.toLocaleString()}</span>{' '}
            course{filtered.length !== 1 ? 's' : ''}
            {activeCount > 0 ? ' matching filters' : ''}
          </p>
          {dataSource && (
            <span className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              dataSource === 'live'  ? 'bg-green-100 text-green-700' :
              dataSource === 'cache' ? 'bg-blue-100 text-blue-700' :
                                       'bg-amber-100 text-amber-700'
            )}>
              {dataSource === 'live'  ? 'Live from PDGA' :
               dataSource === 'cache' ? 'Cached' :
                                        'Fallback data'}
            </span>
          )}
        </div>
      )}

      {/* Course grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-5 rounded-xl border border-red-200">
          <p className="font-semibold mb-1">Could not load courses</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : !stateFilter ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Disc className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select a state to browse courses</h3>
          <p className="text-gray-500">Use the State filter above to load courses for your area.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Disc className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
          <button
            onClick={clearFilters}
            className="text-indigo-600 font-semibold hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course, idx) => {
              const dist =
                nearMe && geo.status === 'granted'
                  ? milesFrom(geo.lat, geo.lng, course)
                  : null;
              return (
                <React.Fragment key={course.id || course.name + idx}>
                  <CourseCard course={course} distanceMi={dist} index={idx} />
                </React.Fragment>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
