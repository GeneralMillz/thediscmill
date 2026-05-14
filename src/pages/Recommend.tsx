import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight, ChevronLeft } from 'lucide-react';
import { SEO } from '../components/SEO';
import { DiscCard } from '../components/DiscCard';
import { useDiscs } from '../hooks/useDiscs';
import { Disc } from '../types';
import { buildCanonical, SITE_URL } from '../utils/seo';

// ─── Quiz config ─────────────────────────────────────────────────────────────

type Power    = 'low' | 'medium' | 'high' | 'elite';
type Style    = 'backhand' | 'forehand' | 'both';
type Stability = 'understable' | 'neutral' | 'overstable';

interface Answers {
  power?:    Power;
  style?:    Style;
  stability?: Stability;
}

const STEPS = [
  {
    id: 'power',
    question: 'How would you describe your arm speed?',
    options: [
      { value: 'low',    label: 'Low power',    desc: 'Under 200 ft, just getting started' },
      { value: 'medium', label: 'Medium power',  desc: '200–300 ft, recreational player' },
      { value: 'high',   label: 'High power',    desc: '300–400 ft, regular competitor' },
      { value: 'elite',  label: 'Elite power',   desc: '400+ ft, serious tournament player' },
    ],
  },
  {
    id: 'style',
    question: 'What\'s your primary throwing style?',
    options: [
      { value: 'backhand', label: 'Backhand',         desc: 'Standard RHBH or LHBH throw' },
      { value: 'forehand', label: 'Forehand (sidearm)', desc: 'RHFH or LHFH throw' },
      { value: 'both',     label: 'Both equally',     desc: 'Comfortable with either' },
    ],
  },
  {
    id: 'stability',
    question: 'What flight shape do you prefer?',
    options: [
      { value: 'understable', label: 'Understable', desc: 'Turns right (RHBH), hyzerflips, max distance' },
      { value: 'neutral',     label: 'Neutral',      desc: 'Straight flight, easy to control' },
      { value: 'overstable',  label: 'Overstable',   desc: 'Reliable fade, wind-resistant, forehand-friendly' },
    ],
  },
] as const;

// ─── Recommendation engine ────────────────────────────────────────────────────

function scoreDisc(disc: Disc, answers: Answers): number {
  let score = 0;
  const { power, style, stability } = answers;

  // Power → speed range
  if (power === 'low')    score += disc.speed <= 5 ? 20 : disc.speed <= 7 ? 8 : 0;
  if (power === 'medium') score += disc.speed >= 6 && disc.speed <= 9  ? 20 : disc.speed <= 11 ? 8 : 0;
  if (power === 'high')   score += disc.speed >= 9 && disc.speed <= 12 ? 20 : 5;
  if (power === 'elite')  score += disc.speed >= 11 ? 20 : disc.speed >= 9 ? 8 : 0;

  // Style → stability preference
  if (style === 'forehand') score += disc.fade >= 3 ? 15 : disc.fade >= 2 ? 5 : 0;
  if (style === 'backhand') score += disc.turn <= -1 ? 10 : 0;

  // Stability preference
  if (stability === 'understable') score += disc.turn <= -2 ? 20 : disc.turn <= -1 ? 10 : 0;
  if (stability === 'neutral')     score += Math.abs(disc.turn ?? 0) <= 1 && disc.fade <= 2 ? 20 : 8;
  if (stability === 'overstable')  score += disc.fade >= 3 ? 20 : disc.fade >= 2 ? 8 : 0;

  // Glide bonus
  score += (disc.glide ?? 0);

  return score;
}

export function Recommend() {
  const { pathname } = useLocation();
  const { data: allDiscs, loading } = useDiscs();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const handleAnswer = (field: keyof Answers, value: string) => {
    const next = { ...answers, [field]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
    }
  };

  const results = useMemo(() => {
    if (!done || !allDiscs.length) return { drivers: [], mids: [], putters: [] };
    const scored = allDiscs.map(d => ({ disc: d, score: scoreDisc(d, answers) }));
    const top = (cat: string) =>
      scored.filter(x => x.disc.category === cat).sort((a, b) => b.score - a.score).slice(0, 3).map(x => x.disc);
    return {
      drivers: top('Distance Driver').length ? top('Distance Driver') : top('Fairway Driver'),
      mids: top('Midrange'),
      putters: top('Putter'),
    };
  }, [done, allDiscs, answers]);

  const canonicalUrl = buildCanonical(pathname);

  return (
    <div className="pt-20 pb-16 px-4 max-w-3xl mx-auto">
      <SEO
        title="Disc Golf Disc Recommender | Find Your Perfect Disc"
        description="Answer 3 questions and get personalized disc golf disc recommendations based on your power level, throwing style, and preferred flight shape."
        canonicalUrl={canonicalUrl}
      />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Disc Recommender</h1>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {/* Progress */}
            <div className="flex gap-2 mb-8">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>

            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Question {step + 1} of {STEPS.length}</p>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{STEPS[step].question}</h2>

            <div className="space-y-3">
              {STEPS[step].options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(STEPS[step].id as keyof Answers, opt.value)}
                  className="w-full text-left p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{opt.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="mt-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-4 mb-8 flex items-center justify-between">
              <p className="text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                {answers.power} power · {answers.style} · {answers.stability}
              </p>
              <button onClick={() => { setAnswers({}); setStep(0); setDone(false); }} className="text-xs text-indigo-600 font-bold hover:underline">
                Restart
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : (
              <div className="space-y-10">
                {[
                  { label: 'Recommended Drivers',  discs: results.drivers  },
                  { label: 'Recommended Midranges', discs: results.mids     },
                  { label: 'Recommended Putters',   discs: results.putters  },
                ].map(({ label, discs }) => (
                  <div key={label}>
                    <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">{label}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {discs.map((disc, i) => (
                        <motion.div key={disc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                          <DiscCard disc={disc} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4 text-sm">
              <Link to="/disc-finder" className="text-indigo-600 font-semibold hover:underline">Disc Finder →</Link>
              <Link to="/discs" className="text-indigo-600 font-semibold hover:underline">Full Catalog →</Link>
              <Link to="/bag-builder" className="text-indigo-600 font-semibold hover:underline">Build Your Bag →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
