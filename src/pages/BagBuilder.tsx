import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Search, Plus, X, ShoppingBag, Disc, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDiscs } from '../hooks/useDiscs';
import { Disc as DiscType } from '../types';
import { WhereToBuy } from '../components/monetization/WhereToBuy';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlotDef {
  id: string;
  role: string;
  label: string;
  description: string;
  category: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

// ─── Slot definitions ─────────────────────────────────────────────────────────

const BAG_SLOTS: SlotDef[] = [
  { id: 'putter1', role: 'Putter', label: 'Putter #1', description: 'Your go-to putting disc', category: 'Putter', accent: '#60a5fa', accentBg: 'rgba(59,130,246,0.1)', accentBorder: 'rgba(96,165,250,0.25)' },
  { id: 'putter2', role: 'Putter', label: 'Putter #2 / Roller', description: 'Second putter or throwing putter', category: 'Putter', accent: '#60a5fa', accentBg: 'rgba(59,130,246,0.1)', accentBorder: 'rgba(96,165,250,0.25)' },
  { id: 'mid1', role: 'Midrange', label: 'Midrange #1', description: 'Straight-flying midrange', category: 'Midrange', accent: '#34d399', accentBg: 'rgba(16,185,129,0.1)', accentBorder: 'rgba(52,211,153,0.25)' },
  { id: 'mid2', role: 'Midrange', label: 'Midrange #2', description: 'Overstable approach disc', category: 'Midrange', accent: '#34d399', accentBg: 'rgba(16,185,129,0.1)', accentBorder: 'rgba(52,211,153,0.25)' },
  { id: 'fairway1', role: 'Fairway Driver', label: 'Fairway #1', description: 'Controlled fairway driver', category: 'Fairway Driver', accent: '#fb923c', accentBg: 'rgba(249,115,22,0.1)', accentBorder: 'rgba(251,146,60,0.25)' },
  { id: 'fairway2', role: 'Fairway Driver', label: 'Fairway #2', description: 'Hyzer flip or flex shot', category: 'Fairway Driver', accent: '#fb923c', accentBg: 'rgba(249,115,22,0.1)', accentBorder: 'rgba(251,146,60,0.25)' },
  { id: 'driver1', role: 'Distance Driver', label: 'Driver #1', description: 'Primary distance driver', category: 'Distance Driver', accent: '#f87171', accentBg: 'rgba(239,68,68,0.1)', accentBorder: 'rgba(248,113,113,0.25)' },
  { id: 'driver2', role: 'Distance Driver', label: 'Driver #2', description: 'Overstable driver for headwinds', category: 'Distance Driver', accent: '#f87171', accentBg: 'rgba(239,68,68,0.1)', accentBorder: 'rgba(248,113,113,0.25)' },
  { id: 'driver3', role: 'Distance Driver', label: 'Driver #3', description: 'Understable roller or turnover disc', category: 'Distance Driver', accent: '#f87171', accentBg: 'rgba(239,68,68,0.1)', accentBorder: 'rgba(248,113,113,0.25)' },
];

const SLOT_GROUPS = [
  { label: 'Putters', slots: ['putter1', 'putter2'], accent: '#60a5fa' },
  { label: 'Midranges', slots: ['mid1', 'mid2'], accent: '#34d399' },
  { label: 'Fairway Drivers', slots: ['fairway1', 'fairway2'], accent: '#fb923c' },
  { label: 'Distance Drivers', slots: ['driver1', 'driver2', 'driver3'], accent: '#f87171' },
];

const BAG_TIPS = [
  'Start with a putter you trust. Consistency in putting wins more than distance.',
  'A stable midrange covers more situations than any other disc.',
  'Beginners: skip the distance driver until you can throw 250 ft consistently.',
  'Carry at least one overstable disc for headwinds and spike hyzer shots.',
  'Your bag should have a disc for every shot shape: hyzer, flat, and anhyzer.',
];

// ─── Shared inline style tokens ───────────────────────────────────────────────

const T = {
  surface: 'var(--color-surface-2)',
  surface1: 'var(--color-surface-1)',
  border: 'var(--color-border)',
  borderHover: 'var(--color-border-hover)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  accent: 'var(--color-accent)',
  accentGlow: 'var(--color-accent-glow)',
  fontDisplay: 'var(--font-display)',
  fontSans: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
};

// ─── FlightPill ───────────────────────────────────────────────────────────────

function FlightPill({ disc }: { disc: DiscType }) {
  if (!disc.speed) return null;
  const nums = [disc.speed, disc.glide, disc.turn, disc.fade];
  const labels = ['SPD', 'GLI', 'TRN', 'FAD'];
  return (
    <div className="flight-strip" style={{ fontSize: 11 }}>
      {nums.map((n, i) => (
        <div key={i} className="flight-strip-cell">
          <span className="flight-strip-label">{labels[i]}</span>
          <span style={{ color: T.textPrimary, fontFamily: T.fontMono, fontWeight: 700 }}>{n}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DiscPicker modal ─────────────────────────────────────────────────────────

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
    return discs.filter(d =>
      d.category.toLowerCase().includes(cat) || cat.includes(d.category.toLowerCase())
    );
  }, [discs, slot.category]);

  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions.slice(0, 24);
    const q = query.toLowerCase();
    return discs.filter(d =>
      d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [discs, suggestions, query]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(5,8,16,0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: 16,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          width: '100%', maxWidth: 520,
          maxHeight: '82vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '18px 20px 16px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: slot.accentBg,
            border: `1px solid ${slot.accentBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Disc size={16} color={slot.accent} strokeWidth={1.75} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
              Choose {slot.label}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{slot.description}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'transparent', border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: T.textMuted,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = T.surface1)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={14} />
          </button>
        </div>

        {/* Search input */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or brand…"
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12,
                height: 38, borderRadius: 10,
                background: T.surface1,
                border: `1px solid ${T.border}`,
                color: T.textPrimary,
                fontFamily: T.fontSans, fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.currentTarget.style.borderColor = T.accent}
              onBlur={e => e.currentTarget.style.borderColor = T.border}
            />
          </div>
          {!query && (
            <div style={{ fontSize: 10, color: T.textMuted, marginTop: 8, letterSpacing: '0.08em' }}>
              {suggestions.length} suggested {slot.category.toLowerCase()}s
            </div>
          )}
        </div>

        {/* Results list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 10px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted, fontSize: 13 }}>
              No discs found
            </div>
          ) : filtered.map(disc => (
            <button
              key={disc.id}
              onClick={() => onSelect(disc)}
              style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12,
                background: 'transparent', border: 'none', cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = slot.accentBg)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: slot.accentBg,
                border: `1px solid ${slot.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Disc size={16} color={slot.accent} strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 13, color: T.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {disc.name}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {disc.brand}
                </div>
              </div>
              {disc.speed > 0 && (
                <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.textMuted, flexShrink: 0, letterSpacing: '0.04em' }}>
                  {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
                </div>
              )}
              <ArrowRight size={13} color={T.textMuted} style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── SlotCard ─────────────────────────────────────────────────────────────────

interface SlotCardProps {
  slot: SlotDef;
  disc: DiscType | null;
  onAdd: () => void;
  onRemove: () => void;
}

function SlotCard({ slot, disc, onAdd, onRemove }: SlotCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: disc ? T.surface : 'transparent',
        border: disc
          ? `1px solid ${hovered ? T.borderHover : T.border}`
          : `1px dashed ${T.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: disc && hovered ? '0 8px 28px rgba(0,0,0,0.35)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: disc ? slot.accentBg : 'rgba(148,163,184,0.06)',
          border: `1px solid ${disc ? slot.accentBorder : T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <Disc size={18} color={disc ? slot.accent : T.textMuted} strokeWidth={1.75} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: disc ? slot.accent : T.textMuted,
            fontFamily: T.fontSans, marginBottom: 2,
          }}>
            {slot.role}
          </div>
          <div style={{
            fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14,
            color: T.textPrimary,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {disc ? disc.name : slot.label}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {disc ? `${disc.brand}` : slot.description}
          </div>
        </div>

        {/* Actions */}
        {disc ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setExpanded(v => !v)}
              title={expanded ? 'Collapse' : 'Where to buy'}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: expanded ? slot.accentBg : 'transparent',
                border: `1px solid ${expanded ? slot.accentBorder : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: expanded ? slot.accent : T.textMuted,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = T.surface1; }}
              onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}
            >
              {expanded ? <ChevronUp size={14} /> : <ShoppingBag size={14} />}
            </button>
            <button
              onClick={onRemove}
              title="Remove"
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'transparent',
                border: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: T.textMuted,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(129,140,248,0.1)',
              border: '1px solid rgba(129,140,248,0.25)',
              color: T.accent,
              padding: '7px 12px', borderRadius: 10,
              fontFamily: T.fontSans, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.18)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.25)'; }}
          >
            <Plus size={12} strokeWidth={2.5} />
            Add Disc
          </button>
        )}
      </div>

      {/* Flight numbers strip */}
      {disc && (
        <div style={{ padding: '0 16px 14px' }}>
          <FlightPill disc={disc} />
        </div>
      )}

      {/* WhereToBuy expand */}
      <AnimatePresence>
        {disc && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: `1px solid ${T.border}`, padding: 16 }}>
              <WhereToBuy sku={disc.name.toLowerCase().replace(/\s+/g, '-')} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BagSummary sidebar ───────────────────────────────────────────────────────

function BagSummary({ bag }: { bag: Record<string, DiscType | null> }) {
  const filled = Object.values(bag).filter(Boolean) as DiscType[];
  const total = BAG_SLOTS.length;
  const pct = Math.round((filled.length / total) * 100);

  return (
    <div style={{
      background: 'linear-gradient(160deg, #0c1222 0%, #111827 100%)',
      border: `1px solid rgba(129,140,248,0.15)`,
      borderRadius: 16, padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.1), transparent)',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14, color: T.textPrimary }}>
            Bag Progress
          </span>
          <span style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 18, color: T.accent }}>
            {filled.length}/{total}
          </span>
        </div>

        {/* Progress track */}
        <div style={{ height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              height: '100%', borderRadius: 4,
              background: 'linear-gradient(90deg, #3730a3, #818cf8)',
              boxShadow: '0 0 10px rgba(129,140,248,0.5)',
            }}
          />
        </div>

        {filled.length === 0 ? (
          <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>
            Add discs to start building your bag.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filled.map(disc => (
              <div key={disc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {disc.name}
                </span>
                <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textMuted, flexShrink: 0 }}>
                  {disc.speed}/{disc.glide}/{disc.turn}/{disc.fade}
                </span>
              </div>
            ))}
          </div>
        )}

        {filled.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid rgba(148,163,184,0.08)` }}>
            <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textMuted, lineHeight: 1.6 }}>
              Click the bag icon on any disc to see where to buy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tips sidebar card ────────────────────────────────────────────────────────

function BagTips() {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16, padding: 24,
    }}>
      <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 14, color: T.textPrimary, marginBottom: 16 }}>
        Bag Building Tips
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {BAG_TIPS.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{
              fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
              color: T.accent, flexShrink: 0, paddingTop: 1,
            }}>
              0{i + 1}
            </span>
            <p style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: T.textSecondary, margin: 0 }}>
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div style={{ paddingTop: 80, paddingBottom: 48, paddingLeft: 20, paddingRight: 20, maxWidth: 1280, margin: '0 auto' }}>
      <SEO
        title="Bag Builder | The Disc Mill"
        description="Build your disc golf bag slot by slot with flight data and expert recommendations."
        canonicalUrl="https://thediscmill.com/bag-builder"
      />

      {/* ── Page header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 48 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(129,140,248,0.12)',
            border: '1px solid rgba(129,140,248,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.2)',
          }}>
            <ShoppingBag size={20} color={T.accent} strokeWidth={1.75} />
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 900, fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 1, color: T.textPrimary, margin: 0 }}>
            Bag Builder
          </h1>
        </div>
        <p style={{ fontFamily: T.fontSans, fontSize: 15, fontWeight: 300, lineHeight: 1.6, color: T.textMuted, margin: 0, paddingLeft: 58 }}>
          Build your perfect disc golf bag. Click any slot to search{' '}
          <span style={{ color: T.accent, fontWeight: 500 }}>
            {loading ? '…' : discs.length.toLocaleString()} discs
          </span>.
        </p>
      </motion.div>

      {/* ── Main layout ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 28, alignItems: 'start' }}
        className="bag-layout"
      >
        {/* Slot groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {SLOT_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
              }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: group.accent, flexShrink: 0 }} />
                <span style={{
                  fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: group.accent,
                }}>
                  {group.label}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.slots.map(slotId => {
                  const slot = BAG_SLOTS.find(s => s.id === slotId)!;
                  return (
                    <SlotCard
                      key={slotId}
                      slot={slot}
                      disc={bag[slotId]}
                      onAdd={() => setActiveSlot(slot)}
                      onRemove={() => removeDisc(slotId)}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>
          <BagSummary bag={bag} />
          <BagTips />
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .bag-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

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