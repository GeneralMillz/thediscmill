import React from 'react';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { Disc, ArrowRight, MapPin, Trophy, Zap, QrCode, ShoppingBag, BookOpen, Users, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: Disc,
    title: 'Disc Catalog',
    desc: '200+ PDGA-approved discs with flight numbers, stability ratings, and honest beginner notes.',
    link: '/discs',
    cta: 'Browse Discs',
    accent: '#818cf8',
    accentBg: 'rgba(99,102,241,0.08)',
    accentBorder: 'rgba(99,102,241,0.2)',
  },
  {
    icon: MapPin,
    title: 'National Courses',
    desc: 'Every course in the PDGA directory. Location, holes, and ratings updated live.',
    link: '/courses',
    cta: 'Find Courses',
    accent: '#60a5fa',
    accentBg: 'rgba(59,130,246,0.08)',
    accentBorder: 'rgba(59,130,246,0.2)',
  },
  {
    icon: ShoppingBag,
    title: 'Bag Builder',
    desc: 'Build your perfect bag slot-by-slot. Search any disc, compare flight numbers, and buy instantly.',
    link: '/bag-builder',
    cta: 'Build My Bag',
    accent: '#34d399',
    accentBg: 'rgba(16,185,129,0.08)',
    accentBorder: 'rgba(16,185,129,0.2)',
  },
  {
    icon: QrCode,
    title: 'Disc Return Network',
    desc: 'Lost disc? Create a free QR return tag. Found one? Scan to return it. No app needed.',
    link: '/disc-return',
    cta: 'Create My Tag',
    accent: '#a78bfa',
    accentBg: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.2)',
  },
  {
    icon: Trophy,
    title: 'PDGA Events',
    desc: 'Live tournament results and leaderboards, pulled directly from PDGA.com.',
    link: '/events',
    cta: 'View Events',
    accent: '#fb923c',
    accentBg: 'rgba(249,115,22,0.08)',
    accentBorder: 'rgba(249,115,22,0.2)',
  },
  {
    icon: Users,
    title: 'Player Search',
    desc: 'Search any PDGA player by name or number. Live ratings, classification, and career stats.',
    link: '/players',
    cta: 'Search Players',
    accent: '#f472b6',
    accentBg: 'rgba(236,72,153,0.08)',
    accentBorder: 'rgba(236,72,153,0.2)',
  },
  {
    icon: Zap,
    title: 'Throw Analyzer',
    desc: 'AI-powered flight path simulation and form analysis. Powered by Gemini.',
    link: '/analyzer',
    cta: 'Analyze Throw',
    accent: '#fbbf24',
    accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    icon: BookOpen,
    title: 'Gear Guides',
    desc: '8 honest, evergreen buying guides covering every category. No hype, just what works.',
    link: '/guides',
    cta: 'Read Guides',
    accent: '#2dd4bf',
    accentBg: 'rgba(20,184,166,0.08)',
    accentBorder: 'rgba(20,184,166,0.2)',
  },
];

const STATS = [
  { value: '200+', label: 'PDGA Discs', icon: Disc },
  { value: '14,000+', label: 'Courses Nationwide', icon: MapPin },
  { value: '250k+', label: 'PDGA Players', icon: Users },
];

// Inline styles that rely on your CSS token system
const S: Record<string, React.CSSProperties> = {
  // ── hero ──────────────────────────────────────────────────────────────────
  hero: {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #050810 0%, #0c1222 50%, #111827 100%)',
    padding: 'clamp(80px, 12vw, 140px) 24px clamp(80px, 12vw, 140px)',
  },
  heroNoise: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
  },
  heroGlow1: {
    position: 'absolute', width: '60vw', height: '60vw', maxWidth: 700, maxHeight: 700,
    borderRadius: '50%', top: '-20%', left: '-10%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)',
  },
  heroGlow2: {
    position: 'absolute', width: '50vw', height: '50vw', maxWidth: 600, maxHeight: 600,
    borderRadius: '50%', bottom: '-20%', right: '-5%', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
  },
  heroGrid: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(148,163,184,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.04) 1px,transparent 1px)',
    backgroundSize: '60px 60px',
  },

  // ── badge ─────────────────────────────────────────────────────────────────
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(129,140,248,0.1)',
    border: '1px solid rgba(129,140,248,0.25)',
    color: '#a5b4fc',
    fontSize: 11, fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '6px 14px', borderRadius: 999,
    marginBottom: 28,
  },

  // ── headline ──────────────────────────────────────────────────────────────
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(52px, 10vw, 96px)',
    fontWeight: 900, lineHeight: 0.9,
    letterSpacing: '-0.03em',
    color: '#f1f5f9',
    margin: '0 0 8px',
  },
  h1Accent: { color: '#818cf8' },
  heroSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'clamp(16px, 2.5vw, 20px)',
    fontWeight: 300, lineHeight: 1.65,
    color: 'rgba(148,163,184,0.75)',
    maxWidth: 540, margin: '20px auto 40px',
  },

  // ── CTA buttons ───────────────────────────────────────────────────────────
  ctaPrimary: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: '#818cf8',
    color: '#050810',
    padding: '14px 28px', borderRadius: 14,
    fontFamily: 'var(--font-display)',
    fontSize: 15, fontWeight: 800,
    textDecoration: 'none', border: 'none', cursor: 'pointer',
    boxShadow: '0 0 32px rgba(99,102,241,0.35), 0 4px 16px rgba(0,0,0,0.4)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  ctaSecondary: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    color: '#e2e8f0',
    padding: '14px 28px', borderRadius: 14,
    fontFamily: 'var(--font-display)',
    fontSize: 15, fontWeight: 700,
    textDecoration: 'none',
    border: '1px solid rgba(148,163,184,0.15)',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },

  // ── stats ─────────────────────────────────────────────────────────────────
  statsWrap: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 1,
    marginTop: 72,
    background: 'rgba(148,163,184,0.08)',
    border: '1px solid rgba(148,163,184,0.08)',
    borderRadius: 16, overflow: 'hidden',
  },
  statCell: {
    padding: '28px 16px', textAlign: 'center',
    background: 'rgba(12,18,34,0.6)',
    backdropFilter: 'blur(12px)',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 4vw, 40px)',
    fontWeight: 900, lineHeight: 1,
    color: '#f1f5f9', display: 'block',
  },
  statLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: 11, fontWeight: 400,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(148,163,184,0.5)',
    display: 'block', marginTop: 6,
  },

  // ── features section ──────────────────────────────────────────────────────
  featureSection: {
    background: 'var(--color-surface-0)',
    padding: 'clamp(60px, 8vw, 100px) 24px',
  },
  sectionEyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: 10, fontWeight: 700,
    letterSpacing: '0.3em', textTransform: 'uppercase',
    color: '#818cf8', marginBottom: 12, display: 'block',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.05,
    color: '#f1f5f9', margin: '0 0 12px',
  },
  sectionDesc: {
    fontFamily: 'var(--font-sans)',
    fontSize: 15, fontWeight: 300, lineHeight: 1.7,
    color: 'rgba(148,163,184,0.6)',
    maxWidth: 420, margin: '0 auto',
  },

  // ── feature card ──────────────────────────────────────────────────────────
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16, marginTop: 56,
  },

  // ── CTA strip ─────────────────────────────────────────────────────────────
  ctaStrip: {
    position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0c1222 0%, #111827 100%)',
    padding: 'clamp(60px, 8vw, 96px) 24px',
    borderTop: '1px solid rgba(148,163,184,0.06)',
  },
  ctaStripGlow: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(99,102,241,0.12), transparent)',
  },
  ctaStripIcon: {
    width: 64, height: 64, borderRadius: 18,
    background: 'rgba(129,140,248,0.1)',
    border: '1px solid rgba(129,140,248,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px',
  },
  ctaStripH: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.1,
    color: '#f1f5f9', margin: '0 0 16px',
  },
  ctaStripP: {
    fontFamily: 'var(--font-sans)',
    fontSize: 16, fontWeight: 300, lineHeight: 1.7,
    color: 'rgba(148,163,184,0.6)',
    maxWidth: 480, margin: '0 auto 36px',
  },
};

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={feature.link}
        className="disc-card"
        style={{
          display: 'block', padding: '24px',
          textDecoration: 'none', height: '100%',
          borderColor: 'rgba(148,163,184,0.1)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = feature.accentBorder}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: feature.accentBg,
          border: `1px solid ${feature.accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Icon size={20} color={feature.accent} strokeWidth={1.75} />
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15, fontWeight: 700,
          color: '#f1f5f9', marginBottom: 8,
        }}>
          {feature.title}
        </div>

        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13, fontWeight: 300, lineHeight: 1.65,
          color: 'rgba(148,163,184,0.55)',
          margin: '0 0 20px',
        }}>
          {feature.desc}
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontFamily: 'var(--font-sans)',
          fontSize: 12, fontWeight: 600,
          color: feature.accent,
          letterSpacing: '0.02em',
        }}>
          {feature.cta}
          <ChevronRight size={13} strokeWidth={2.5} />
        </div>

        {/* Subtle bottom accent line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 24, right: 24, height: 1,
          background: `linear-gradient(90deg, transparent, ${feature.accent}30, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }} className="card-accent-line" />
      </Link>
    </motion.div>
  );
}

export function Home() {
  return (
    <div>
      <SEO
        title="The Disc Mill | Disc Golf Database, Reviews & Gear"
        description="The ultimate disc golf intelligence platform. Browse 10,000+ discs, find local courses, and build your perfect bag."
        canonicalUrl="https://thediscmill.com/"
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.heroNoise} />
        <div style={S.heroGrid} />
        <div style={S.heroGlow1} />
        <div style={S.heroGlow2} />

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span style={S.badge}>
              <Disc size={12} />
              The #1 Open-Data Disc Golf Platform
            </span>
          </motion.div>

          <motion.h1
            style={S.h1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            The Disc<br />
            <span style={S.h1Accent}>Mill</span>
          </motion.h1>

          <motion.p
            style={S.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
          >
            National course intelligence, live PDGA data, and disc analytics.
            Everything you need to master the game — free, forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}
          >
            <Link
              to="/discs"
              style={S.ctaPrimary}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.5), 0 8px 24px rgba(0,0,0,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = S.ctaPrimary.boxShadow as string; }}
            >
              <Search size={16} strokeWidth={2.5} />
              Find Your Disc
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <Link
              to="/disc-return"
              style={S.ctaSecondary}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = S.ctaSecondary.background as string; e.currentTarget.style.borderColor = S.ctaSecondary.border as string; }}
            >
              <QrCode size={16} />
              Disc Return Network
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            style={S.statsWrap}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55 }}
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} style={S.statCell}>
                <Icon size={14} color="rgba(129,140,248,0.4)" style={{ margin: '0 auto 8px' }} />
                <span style={S.statValue}>{value}</span>
                <span style={S.statLabel}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────── */}
      <section style={S.featureSection}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 0 }}
          >
            <span style={S.sectionEyebrow}>Everything You Need</span>
            <h2 style={S.sectionTitle}>One platform.<br />The entire game.</h2>
            <p style={S.sectionDesc}>
              Live data from PDGA.com. No accounts. No paywalls.
            </p>
          </motion.div>

          <div style={S.featureGrid}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Disc Return CTA ──────────────────────────────────────────── */}
      <section style={S.ctaStrip}>
        <div style={S.ctaStripGlow} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={S.ctaStripIcon}>
              <QrCode size={28} color="#818cf8" strokeWidth={1.5} />
            </div>
            <h2 style={S.ctaStripH}>Lost a disc?<br />We can help.</h2>
            <p style={S.ctaStripP}>
              The Disc Hero Return Network creates free QR return tags encoded with your contact info.
              No app, no server, no account. Just your disc coming home.
            </p>
            <Link
              to="/disc-return"
              style={S.ctaPrimary}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.5), 0 8px 24px rgba(0,0,0,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = S.ctaPrimary.boxShadow as string; }}
            >
              Create a Free Return Tag
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}