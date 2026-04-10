import React from 'react';
import { Search, Navigation, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { US_STATES } from '../../constants/usStates';
import { cn } from '../../utils';

// ─── Option constants ────────────────────────────────────────────────────────

export const HOLE_OPTIONS = [
  { label: 'Any holes',  value: '' },
  { label: '9 holes',    value: '9' },
  { label: '18 holes',   value: '18' },
  { label: '27 holes',   value: '27' },
  { label: '36+ holes',  value: '36' },
] as const;

export const DIFFICULTY_OPTIONS = [
  { label: 'Any difficulty', value: '' },
  { label: 'Beginner',       value: 'Beginner' },
  { label: 'Intermediate',   value: 'Intermediate' },
  { label: 'Advanced',       value: 'Advanced' },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type GeoState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied'; reason: string };

export interface CourseFilters {
  search: string;
  state: string;
  holes: string;
  difficulty: string;
  nearMe: boolean;
}

interface CourseFilterBarProps {
  filters: CourseFilters;
  geo: GeoState;
  activeCount: number;
  onSearchChange: (v: string) => void;
  onStateChange: (v: string) => void;
  onHolesChange: (v: string) => void;
  onDifficultyChange: (v: string) => void;
  onNearMeToggle: () => void;
  onClear: () => void;
}

// ─── Styled select wrapper ────────────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  children,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  'aria-label': string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'appearance-none h-10 pl-3 pr-8 rounded-xl border text-sm font-medium',
          'bg-white text-gray-700 border-gray-200',
          'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none',
          'transition-colors cursor-pointer',
          value && 'border-indigo-400 bg-indigo-50 text-indigo-700'
        )}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CourseFilterBar({
  filters,
  geo,
  activeCount,
  onSearchChange,
  onStateChange,
  onHolesChange,
  onDifficultyChange,
  onNearMeToggle,
  onClear,
}: CourseFilterBarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="sticky top-16 lg:top-16 z-30 mb-6">
      {/* ── Main bar ──────────────────────────────────────────────────────── */}
      <div className={cn(
        'bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-sm',
        'px-4 py-3'
      )}>
        {/* Row 1: search + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              placeholder="Course name, city, or state…"
              value={filters.search}
              onChange={e => onSearchChange(e.target.value)}
              aria-label="Search courses"
              className={cn(
                'w-full h-10 pl-9 pr-4 rounded-xl border text-sm',
                'bg-white text-gray-900 placeholder-gray-400 border-gray-200',
                'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none',
                'transition-colors'
              )}
            />
            {filters.search && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop: inline filters */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <InlineFilters
              filters={filters}
              geo={geo}
              onStateChange={onStateChange}
              onHolesChange={onHolesChange}
              onDifficultyChange={onDifficultyChange}
              onNearMeToggle={onNearMeToggle}
            />
            {(activeCount > 0) && (
              <button
                onClick={onClear}
                aria-label="Clear all filters"
                className="flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Mobile: filter toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle filters"
            className={cn(
              'lg:hidden flex items-center gap-1.5 h-10 px-3 rounded-xl border text-sm font-semibold transition-all shrink-0',
              mobileOpen || activeCount > 0
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: mobile expanded filters */}
        {mobileOpen && (
          <div className="lg:hidden pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              {/* State — full-width on its own row */}
              <div className="col-span-2">
                <StateSelect value={filters.state} onChange={onStateChange} />
              </div>
              <HolesSelect value={filters.holes} onChange={onHolesChange} />
              <DifficultySelect value={filters.difficulty} onChange={onDifficultyChange} />
            </div>

            <div className="flex items-center gap-2">
              <NearMeButton geo={geo} active={filters.nearMe} onToggle={onNearMeToggle} />
              {activeCount > 0 && (
                <button
                  onClick={() => { onClear(); setMobileOpen(false); }}
                  className="flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Geo error banner */}
      {geo.status === 'denied' && (
        <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <Navigation className="w-4 h-4 shrink-0" />
          Location unavailable: {geo.reason}
        </div>
      )}

      {/* Near Me active note */}
      {filters.nearMe && geo.status === 'granted' && (
        <div className="mt-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm px-4 py-3 rounded-xl">
          Sorted by distance from your location. Courses without GPS coordinates appear at the end.
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StateSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <FilterSelect value={value} onChange={onChange} aria-label="Filter by state">
      <option value="">All States</option>
      {US_STATES.map(s => (
        <option key={s.abbr} value={s.abbr}>{s.name} ({s.abbr})</option>
      ))}
    </FilterSelect>
  );
}

function HolesSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <FilterSelect value={value} onChange={onChange} aria-label="Filter by hole count">
      {HOLE_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </FilterSelect>
  );
}

function DifficultySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <FilterSelect value={value} onChange={onChange} aria-label="Filter by difficulty">
      {DIFFICULTY_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </FilterSelect>
  );
}

function NearMeButton({
  geo,
  active,
  onToggle,
}: {
  geo: GeoState;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={geo.status === 'loading'}
      aria-pressed={active}
      aria-label={active ? 'Disable Near Me filter' : 'Enable Near Me filter'}
      className={cn(
        'flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all border',
        active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
          : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50',
        geo.status === 'loading' && 'opacity-60 cursor-wait'
      )}
    >
      <Navigation className={cn('w-4 h-4', geo.status === 'loading' && 'animate-pulse')} />
      {geo.status === 'loading' ? 'Locating…' : active ? 'Near Me ✓' : 'Near Me'}
    </button>
  );
}

function InlineFilters({
  filters,
  geo,
  onStateChange,
  onHolesChange,
  onDifficultyChange,
  onNearMeToggle,
}: {
  filters: CourseFilters;
  geo: GeoState;
  onStateChange: (v: string) => void;
  onHolesChange: (v: string) => void;
  onDifficultyChange: (v: string) => void;
  onNearMeToggle: () => void;
}) {
  return (
    <>
      <StateSelect value={filters.state} onChange={onStateChange} />
      <HolesSelect value={filters.holes} onChange={onHolesChange} />
      <DifficultySelect value={filters.difficulty} onChange={onDifficultyChange} />
      <NearMeButton geo={geo} active={filters.nearMe} onToggle={onNearMeToggle} />
    </>
  );
}
