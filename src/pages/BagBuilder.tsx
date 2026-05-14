import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Search, Plus, X, ShoppingBag, Disc, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDiscs } from '../hooks/useDiscs';
import { Disc as DiscType } from '../types';
import { WhereToBuy } from '../components/monetization/WhereToBuy';

// ─── Bag slot definitions ────────────────────────────────────────────────────

interface SlotDef {
  id: string;
  role: string;
  label: string;
  description: string;
  category: string;
  color: string;
  bg: string;
}

const BAG_SLOTS: SlotDef[] = [
  { id: 'putter1',   role: 'Putter',          label: 'Putter #1',          description: 'Your go-to putting disc',              category: 'Putter',   color: 'text-blue-600',    bg: 'bg-blue-50' },
  { id: 'putter2',   role: 'Putter',          label: 'Putter #2 / Roller', description: 'Second putter or throwing putter',     category: 'Putter',   color: 'text-blue-600',    bg: 'bg-blue-50' },
  { id: 'mid1',      role: 'Midrange',        label: 'Midrange #1',        description: 'Straight-flying midrange',             category: 'Midrange', color: 'text-green-600',   bg: 'bg-green-50' },
  { id: 'mid2',      role: 'Midrange',        label: 'Midrange #2',        description: 'Overstable approach disc',             category: 'Midrange', color: 'text-green-600',   bg: 'bg-green-50' },
  { id: 'fairway1',  role: 'Fairway Driver',  label: 'Fairway #1',         description: 'Controlled fairway driver',            category: 'Fairway Driver', color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'fairway2',  role: 'Fairway Driver',  label: 'Fairway #2',         description: 'Hyzer flip or flex shot',              category: 'Fairway Driver', color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'driver1',   role: 'Distance Driver', label: 'Driver #1',          description: 'Primary distance driver',              category: 'Distance Driver', color: 'text-red-600',   bg: 'bg-red-50' },
  { id: 'driver2',   role: 'Distance Driver', label: 'Driver #2',          description: 'Overstable driver for headwinds',      category: 'Distance Driver', color: 'text-red-600',   bg: 'bg-red-50' },
  { id: 'driver3',   role: 'Distance Driver', label: 'Driver #3',          description: 'Understable roller or turnover',       category: 'Distance Driver', color: 'text-red-600',   bg: 'bg-red-50' },
];

// ─── Disc picker modal ────────────────────────────────────────────────────────

interface PickerProps {
  slot: SlotDef;
  discs: DiscType[];
  onSelect: (disc: DiscType) => void;
  onClose: () => void;
}

function DiscPicker({ slot, discs, onSelect, onClose }: PickerProps) {
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    const cat = slot.category.toLowerCase();
    return discs.filter(d => {
      const matchCat = d.category.toLowerCase().includes(cat) || cat.includes(d.category.toLowerCase());
      return matchCat;
    });
  }, [discs, slot.category]);

  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions.slice(0, 24);
    const q = query.toLowerCase();
    return discs
      .filter(d => d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q))
      .slice(0, 24);
  }, [discs, suggestions, query]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Choose {slot.label}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">{slot.description}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search all discs by name or brand..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {!query && (
            <p className="text-xs text-gray-400 mt-2 px-1">
              Showing {suggestions.length} suggested {slot.category.toLowerCase()}s
            </p>
          )}
        </div>

        {/* Disc list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No discs found</div>
          ) : (
            filtered.map(disc => (
              <button
                key={disc.id}
                onClick={() => onSelect(disc)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors group"
              >
                <div className={`w-9 h-9 ${slot.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Disc className={`w-5 h-5 ${slot.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{disc.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{disc.brand}</div>
                </div>
                {disc.speed > 0 && (
                  <div className="text-xs text-gray-400 font-mono shrink-0">
                    {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
                  </div>
                )}
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Slot card ────────────────────────────────────────────────────────────────

interface SlotCardProps {
  slot: SlotDef;
  disc: DiscType | null;
  onAdd: () => void;
  onRemove: () => void;
}

function SlotCard({ slot, disc, onAdd, onRemove }: SlotCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-2xl overflow-hidden transition-all ${disc ? 'border-gray-200 dark:border-gray-700 shadow-sm' : 'border-dashed border-gray-300 dark:border-gray-600'}`}>
      <div className="p-4 flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 ${slot.bg} rounded-xl flex items-center justify-center shrink-0`}>
          <Disc className={`w-5 h-5 ${slot.color}`} />
        </div>

        {/* Slot info */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{slot.role}</div>
          <div className="font-bold text-gray-900 dark:text-white text-sm truncate">{disc ? disc.name : slot.label}</div>
          {disc ? (
            <div className="text-xs text-gray-400 dark:text-gray-500">{disc.brand} · {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}</div>
          ) : (
            <div className="text-xs text-gray-400 dark:text-gray-500">{slot.description}</div>
          )}
        </div>

        {/* Actions */}
        {disc ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-500"
              title={expanded ? 'Collapse' : 'Where to buy'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
            <button
              onClick={onRemove}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-gray-300"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Disc
          </button>
        )}
      </div>

      {/* Expandable WhereToBuy */}
      {disc && expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <WhereToBuy sku={disc.name.toLowerCase().replace(/\s+/g, '-')} />
        </div>
      )}
    </div>
  );
}

// ─── Bag summary ─────────────────────────────────────────────────────────────

function BagSummary({ bag }: { bag: Record<string, DiscType | null> }) {
  const filled = Object.values(bag).filter(Boolean);
  const total = BAG_SLOTS.length;
  const pct = Math.round((filled.length / total) * 100);

  return (
    <div className="bg-indigo-900 text-white rounded-3xl p-6">
      <h3 className="font-bold mb-4">Bag Progress</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-indigo-800 rounded-full h-2.5">
          <div
            className="bg-indigo-300 h-2.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-black text-indigo-300">{filled.length}/{total}</span>
      </div>

      {filled.length === 0 ? (
        <p className="text-indigo-300 text-sm">Add discs to start building your bag.</p>
      ) : (
        <div className="space-y-2">
          {filled.map(disc => (
            <div key={disc!.id} className="flex items-center justify-between text-sm">
              <span className="text-indigo-100 truncate">{disc!.name}</span>
              <span className="text-indigo-400 font-mono text-xs">{disc!.speed}/{disc!.glide}/{disc!.turn}/{disc!.fade}</span>
            </div>
          ))}
        </div>
      )}

      {filled.length > 0 && (
        <div className="mt-4 pt-4 border-t border-indigo-800">
          <p className="text-xs text-indigo-400">
            Click the bag icon on any disc to see where to buy with affiliate links.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Category groups ──────────────────────────────────────────────────────────

const SLOT_GROUPS = [
  { label: 'Putters', slots: ['putter1', 'putter2'], color: 'text-blue-600' },
  { label: 'Midranges', slots: ['mid1', 'mid2'], color: 'text-green-600' },
  { label: 'Fairway Drivers', slots: ['fairway1', 'fairway2'], color: 'text-orange-600' },
  { label: 'Distance Drivers', slots: ['driver1', 'driver2', 'driver3'], color: 'text-red-600' },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export function BagBuilder() {
  const { data: discs, loading } = useDiscs();
  const [bag, setBag] = useState<Record<string, DiscType | null>>(() =>
    Object.fromEntries(BAG_SLOTS.map(s => [s.id, null]))
  );
  const [activeSlot, setActiveSlot] = useState<SlotDef | null>(null);

  const setDisc = (slotId: string, disc: DiscType) => {
    setBag(prev => ({ ...prev, [slotId]: disc }));
    setActiveSlot(null);
  };

  const removeDisc = (slotId: string) => {
    setBag(prev => ({ ...prev, [slotId]: null }));
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <SEO
        title="Bag Builder | Virtual Bag Organizer"
        description="Build your disc golf bag slot by slot with flight data and expert recommendations."
        canonicalUrl="https://thediscmill.com/bag-builder"
      />
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Bag Builder</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 ml-0 sm:ml-[52px]">
          Build your perfect disc golf bag. Click any slot to search {loading ? '...' : discs.length.toLocaleString()} discs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Slot groups */}
        <div className="lg:col-span-2 space-y-8">
          {SLOT_GROUPS.map(group => (
            <div key={group.label}>
              <h2 className={`text-sm font-black uppercase tracking-widest mb-3 ${group.color}`}>
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.slots.map(slotId => {
                  const slot = BAG_SLOTS.find(s => s.id === slotId)!;
                  return (
                    <React.Fragment key={slotId}>
                      <SlotCard
                        slot={slot}
                        disc={bag[slotId]}
                        onAdd={() => setActiveSlot(slot)}
                        onRemove={() => removeDisc(slotId)}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BagSummary bag={bag} />

          {/* Tips */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bag Building Tips</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {[
                'Start with a putter you trust. Consistency in putting wins more than distance.',
                'A stable midrange covers more situations than any other disc.',
                'Beginners: skip the distance driver until you can throw 250ft consistently.',
                'Carry at least one overstable disc for headwind and spike hyzer shots.',
                'Your bag should have a disc for every shot shape: hyzer, flat, and anhyzer.',
              ].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disc picker modal */}
      <AnimatePresence>
        {activeSlot && (
          <DiscPicker
            slot={activeSlot}
            discs={discs}
            onSelect={(disc) => setDisc(activeSlot.id, disc)}
            onClose={() => setActiveSlot(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
