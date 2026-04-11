import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useLocation } from 'react-router-dom';
import { BookOpen, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { WhereToBuy } from '../components/monetization/WhereToBuy';
import { buildCanonical, SITE_URL } from '../utils/seo';

interface ProductCard {
  name: string;
  brand: string;
  asin?: string;
  sku?: string;
  price?: string;
  why: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  sponsored?: boolean;
}

interface Guide {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  intro: string;
  products: ProductCard[];
  closing: string;
}

const GUIDES: Guide[] = [
  {
    id: 'best-beginner-discs',
    title: 'Best Discs for Beginners',
    category: 'Equipment',
    excerpt: 'Starting your disc golf journey? These discs will help you learn the right way.',
    intro: 'Beginners need discs that are easy to throw straight, forgiving on poor releases, and cheap enough to lose in the woods without crying. Avoid high-speed drivers — they require serious arm speed to behave. Start here.',
    products: [
      { name: 'Aviar', brand: 'Innova', asin: 'B00B73BYG0', sku: 'aviar', why: 'The most popular beginner putter ever made. Flies straight, lands soft, teaches proper form.', level: 'Beginner' },
      { name: 'Mako3', brand: 'Innova', asin: 'B00GH6V8EE', sku: 'mako3', why: 'Ultra-neutral midrange. Goes exactly where you throw it — perfect for learning release angles.', level: 'Beginner' },
      { name: 'Leopard', brand: 'Innova', asin: 'B000ESEGNG', sku: 'leopard', why: 'Low-speed fairway driver that even beginners can turn over and get distance with.', level: 'Beginner' },
      { name: 'Buzzz', brand: 'Discraft', asin: 'B0019IWMKQ', sku: 'buzzz', why: 'Neutral midrange beloved by pros and beginners alike. One of the best discs ever made.', level: 'All Levels' },
      { name: 'Roc3', brand: 'Innova', asin: 'B00AYZS1QA', sku: 'roc3', why: 'Slight overstable midrange. Great for beginners who want reliable, straight-to-slight-left flights.', level: 'Beginner' },
    ],
    closing: 'The single best investment a beginner can make is a $12 putter and 1,000 field throws. Resist the urge to buy high-speed drivers — they will curve sharply and teach you bad habits.',
  },
  {
    id: 'best-putters-straight',
    title: 'Best Putters for Straight Throws',
    category: 'Equipment',
    excerpt: 'The straightest-flying putters for approach shots and circle 2 conversions.',
    intro: 'A straight-flying putter is the most versatile disc in the bag — use it for 10-foot taps and 200-foot hyzer bombs. These putters have minimal fade and predictable, dead-straight flight paths.',
    products: [
      { name: 'Aviar P&A', brand: 'Innova', asin: 'B07GCWNHQ9', sku: 'aviar-pa', why: 'Pan-and-approach legend. Zero fade, goes straight as an arrow.', level: 'All Levels' },
      { name: 'Harp', brand: 'Kastaplast', asin: 'B07K28PZ1J', sku: 'harp', why: 'Dead-straight flight, reliable fade, premium Swedish plastic. Best putter in the bag.', level: 'Intermediate' },
      { name: 'Luna', brand: 'MVP', asin: 'B07BZC3MWS', sku: 'luna', why: "Paul McBeth's signature putter. Beadless, comfortable, and straight as they come.", level: 'All Levels' },
      { name: 'Envy', brand: 'Axiom', asin: 'B077GKFXPZ', sku: 'envy', why: 'Gyro technology gives this beadless putter a uniquely neutral flight.', level: 'All Levels' },
      { name: 'Pure', brand: 'Latitude 64', asin: 'B00IELKIOU', sku: 'pure', why: 'Ultra-straight Swedish putter. Loved for fieldwork and approach shots.', level: 'Beginner' },
    ],
    closing: 'If you only carry one putter, make it a neutral, straight-flying one. It covers more situations than any other disc in your bag.',
  },
  {
    id: 'best-bags-new-players',
    title: 'Best Bags for New Players',
    category: 'Gear',
    excerpt: 'Comfortable, durable disc golf bags that won\'t break the bank.',
    intro: 'A good bag keeps your discs organized, your back comfortable, and your water bottle accessible. New players don\'t need a $200 cart — start with a solid backpack or shoulder bag.',
    products: [
      { name: 'Zuca Flyer', brand: 'Zuca', asin: 'B07KXH4P7Q', sku: 'zuca-flyer', why: 'Best value cart bag. Holds 25+ discs, has a seat, and is built to last years.', level: 'All Levels' },
      { name: 'Grip EQ AX5', brand: 'GripEQ', sku: 'ax5', why: 'Premium structured backpack with molded frame. Top-tier organization and back support.', level: 'Intermediate' },
      { name: 'Dynamic Discs Trooper', brand: 'Dynamic Discs', asin: 'B01N9RQBEK', sku: 'trooper', why: 'Best entry-level backpack under $60. Holds 18 discs and has a dedicated water bottle pocket.', level: 'Beginner' },
      { name: 'Upper Park Designs Ranger', brand: 'Upper Park', sku: 'ranger', why: 'Boutique bag with exceptional build quality. Makes you look like you know what you\'re doing.', level: 'Intermediate' },
      { name: 'Disc Golf United Starter Bag', brand: 'DGU', asin: 'B07P7LKD4Y', sku: 'dgu-starter', why: 'Budget-friendly shoulder bag. Perfect when you\'re only carrying 5-8 discs.', level: 'Beginner' },
    ],
    closing: 'Most beginners start with a shoulder bag or basic backpack. Once you\'re carrying 15+ discs, upgrade to a full backpack with a frame.',
  },
  {
    id: 'best-shoes-disc-golf',
    title: 'Best Shoes for Disc Golf',
    category: 'Apparel',
    excerpt: 'Trail-ready footwear that handles wet grass, roots, and rough terrain.',
    intro: 'Disc golf courses are wild. You\'ll be walking 4-6 miles through wet grass, muddy paths, and wooded trails. Grip, waterproofing, and ankle support matter more than looks.',
    products: [
      { name: 'Salomon XA Pro 3D', brand: 'Salomon', asin: 'B071WKCM7V', sku: 'salomon-xa-pro', why: 'The gold standard for disc golfers. Exceptional grip on wet grass and quick-lace closure.', level: 'All Levels' },
      { name: 'Adidas Terrex Swift R3', brand: 'Adidas', asin: 'B085QQCG2P', sku: 'adidas-terrex', why: 'Lightweight trail shoe with excellent lateral stability for pivoting during throws.', level: 'All Levels' },
      { name: 'Merrell Moab 3', brand: 'Merrell', asin: 'B09W87QHGV', sku: 'merrell-moab3', why: 'Waterproof comfort for long rounds. Legendary durability and wide toe box.', level: 'Beginner' },
      { name: 'New Balance Fresh Foam Hierro', brand: 'New Balance', asin: 'B01N0Y7MDC', sku: 'nb-hierro', why: 'Max cushioning for long walking rounds. Best for courses with sustained elevation.', level: 'All Levels' },
      { name: 'Under Armour Charged Bandit Trail', brand: 'Under Armour', asin: 'B07K4FNPC7', sku: 'ua-bandit', why: 'Aggressive outsole grips wet terrain. Budget-friendly at under $80.', level: 'Beginner' },
    ],
    closing: 'Never play in running shoes on wet courses. The lateral forces from throwing in a pivot will destroy them in one season. Invest in trail shoes.',
  },
  {
    id: 'best-rangefinders',
    title: 'Best Rangefinders for Disc Golf',
    category: 'Gear',
    excerpt: 'Know your exact distance to the basket and obstacles with these top rangefinders.',
    intro: 'A rangefinder removes guesswork. Know exactly whether that basket is 180ft or 230ft. The difference between a putter and a midrange. These are the best options for disc golfers.',
    products: [
      { name: 'Bushnell Phantom 3', brand: 'Bushnell', asin: 'B0CJ5KFHS5', sku: 'bushnell-phantom3', why: 'Built specifically for disc golf. Magnetic mount, disc golf mode, accurate to 1 yard.', level: 'All Levels' },
      { name: 'Bushnell Tour V6', brand: 'Bushnell', asin: 'B07MMCND8T', sku: 'bushnell-tourv6', why: 'Slope-compensating technology. Reads through trees and to chains at distance.', level: 'Advanced' },
      { name: 'Callaway 300 Pro', brand: 'Callaway', asin: 'B07D9Z89PB', sku: 'callaway-300pro', why: 'Budget-friendly with Pin Acquisition Technology. Works great on open courses.', level: 'Beginner' },
      { name: 'Shot Scope H4', brand: 'Shot Scope', asin: 'B09QXTQBHB', sku: 'shotscope-h4', why: 'GPS + laser hybrid. Also tracks stats and auto-maps courses.', level: 'Intermediate' },
    ],
    closing: 'Bushnell\'s disc golf rangefinders are purpose-built for the sport. The magnetic mount clips to your bag and the disc golf mode ignores background trees.',
  },
  {
    id: 'best-starter-sets',
    title: 'Best Starter Sets',
    category: 'Equipment',
    excerpt: 'Complete disc golf starter sets that give beginners everything they need to play.',
    intro: 'Starter sets bundle a putter, midrange, and driver at a discount. The catch: driver quality matters a lot. These sets have beginner-appropriate discs — not the overstable bricks most brands sneak into starter packs.',
    products: [
      { name: 'Innova Starter Set (Disc Golf)', brand: 'Innova', asin: 'B001MV9RA0', sku: 'innova-starter', why: 'DX plastic Aviar putter + Shark mid + Leopard driver. The classic beginner trifecta.', level: 'Beginner' },
      { name: 'Discraft Beginner Set', brand: 'Discraft', asin: 'B08B8RD6RS', sku: 'discraft-beginner', why: 'Includes Buzzz mid and a beginner-weight Surge driver. Excellent quality.', level: 'Beginner' },
      { name: 'Dynamic Discs Prime Starter Set', brand: 'Dynamic Discs', asin: 'B081HN5HW3', sku: 'dd-prime-starter', why: 'Judge putter + Tug E midrange + Escape driver. Good variety for a new player.', level: 'Beginner' },
      { name: 'MVP Neutron Starter Pack', brand: 'MVP', asin: 'B08B8RQMV1', sku: 'mvp-starter', why: 'Neutron plastic premium starter set. Better plastic than most, holds up to tree hits.', level: 'Beginner' },
    ],
    closing: 'The single most important thing about a starter set: make sure the driver is understable enough for a beginner to actually throw it. High-fade drivers will curve hard left and ruin the learning experience.',
  },
  {
    id: 'best-midranges-control',
    title: 'Best Midranges for Control',
    category: 'Equipment',
    excerpt: 'Midranges are the most underrated discs in disc golf. These are the best.',
    intro: 'Mid-ranges are where your game is built. If you can throw a midrange 250+ feet on a consistent line, you\'ll beat most recreational players. These are the best midranges for accuracy and control.',
    products: [
      { name: 'Buzzz', brand: 'Discraft', asin: 'B0019IWMKQ', sku: 'buzzz', why: 'The most popular disc ever made. Perfectly neutral flight — goes exactly where you aim.', level: 'All Levels' },
      { name: 'Roc3', brand: 'Innova', asin: 'B00AYZS1QA', sku: 'roc3', why: 'Slightly overstable control mid. The go-to for approach shots in the wind.', level: 'All Levels' },
      { name: 'Mako3', brand: 'Innova', asin: 'B00GH6V8EE', sku: 'mako3', why: 'Zero-fade midrange. Use it to learn exact release angles.', level: 'Beginner' },
      { name: 'Harp', brand: 'Kastaplast', asin: 'B07K28PZ1J', sku: 'harp', why: 'Overstable mid that holds any line with authority. Exceptional in wind.', level: 'Intermediate' },
      { name: 'Berg', brand: 'Kastaplast', asin: 'B07MJWNJXH', sku: 'berg', why: 'Beefy overstable approach disc. For spike hyzers and hard fades that need to stop.', level: 'Intermediate' },
    ],
    closing: 'Throwing 300 midrange drives in a field session will do more for your game than buying a new driver. The Buzzz is your anchor disc.',
  },
  {
    id: 'best-fairways-low-power',
    title: 'Best Fairway Drivers for Low Power',
    category: 'Equipment',
    excerpt: 'Fairway drivers that don\'t require elite arm speed to fly correctly.',
    intro: 'Most fairway drivers are designed for players with 60+ mph arm speed. These options fly correctly at lower power levels — giving beginners and casual players the distance and control they\'re looking for.',
    products: [
      { name: 'Leopard3', brand: 'Innova', asin: 'B01G3L6JEA', sku: 'leopard3', why: 'The best beginner driver ever made. Low fade, high turn, goes dead straight at low speeds.', level: 'Beginner' },
      { name: 'Teebird', brand: 'Innova', asin: 'B0001YTMKY', sku: 'teebird', why: 'The all-time great fairway driver. Slight overstable flight that every skill level can control.', level: 'All Levels' },
      { name: 'Escape', brand: 'Dynamic Discs', asin: 'B00YIID9VO', sku: 'escape', why: 'Understable driver that beginners can actually turn over for distance.', level: 'Beginner' },
      { name: 'Saint', brand: 'Latitude 64', asin: 'B00AAETLZE', sku: 'saint', why: 'Long, understable driver with a reliable flip-and-glide flight at low power.', level: 'Beginner' },
      { name: 'Thunderbird', brand: 'Innova', asin: 'B00A9BPJY6', sku: 'thunderbird', why: 'Control driver between Teebird and Boss. Extremely straight with minimal fade.', level: 'Intermediate' },
    ],
    closing: 'The Leopard3 is the single best disc recommendation for any player throwing under 300 feet. It rewards proper form and forgives poor releases better than any disc at its price point.',
  },
];

function LevelBadge({ level }: { level: ProductCard['level'] }) {
  const styles: Record<string, string> = {
    'Beginner':    'bg-green-100 text-green-700',
    'Intermediate':'bg-blue-100 text-blue-700',
    'Advanced':    'bg-purple-100 text-purple-700',
    'All Levels':  'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${styles[level]}`}>
      {level}
    </span>
  );
}

export function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const guide = GUIDES.find(g => g.id === id);

  if (!guide) {
    return (
      <div className="pt-20 pb-8 px-4 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guide not found</h1>
        <Link to="/guides" className="text-indigo-600 hover:underline">← Back to Guides</Link>
      </div>
    );
  }

  const canonicalUrl = buildCanonical(pathname);

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.title,
        description: guide.excerpt,
        url: canonicalUrl,
        publisher: {
          '@type': 'Organization',
          name: 'The Disc Mill',
          url: SITE_URL,
        },
      },
      {
        '@type': 'ItemList',
        name: guide.title,
        numberOfItems: guide.products.length,
        itemListElement: guide.products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.brand} ${p.name}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',   item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-3xl mx-auto">
      <Helmet>
        <title>{guide.title} | The Disc Mill</title>
        <meta name="description" content={guide.excerpt || `${guide.title} — disc golf buying guide from The Disc Mill.`} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Back */}
      <Link to="/guides" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-8 gap-1.5 font-medium">
        <ChevronLeft className="w-4 h-4" />
        All Guides
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{guide.category}</span>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mt-2 mb-4 leading-tight">{guide.title}</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">{guide.intro}</p>
      </motion.div>

      {/* Products */}
      <div className="space-y-6 mb-12">
        {guide.products.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm"
          >
            <div className="p-6">
              {/* Product header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-black text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{product.name}</h3>
                    {product.sponsored && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Sponsored</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</span>
                    <LevelBadge level={product.level} />
                  </div>
                </div>
              </div>

              {/* Why this disc */}
              <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{product.why}</p>
              </div>
            </div>

            {/* Where to buy — always search URL, never ASIN */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-4">
              <WhereToBuy
                amazonQuery={`${product.brand} ${product.name} disc golf`}
                sku={product.sku}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Closing */}
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-3xl p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{guide.closing}</p>
        </div>
      </div>

      {/* Affiliate disclosure */}
      <p className="mt-8 text-xs text-gray-400 leading-relaxed text-center">
        The Disc Mill may earn a small commission from qualifying purchases made through links on this page.
        This never influences our recommendations — these are honest picks based on community data.
      </p>

      {/* Back link */}
      <div className="mt-10 text-center">
        <Link to="/guides" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold">
          <ChevronLeft className="w-4 h-4" />
          View all guides
        </Link>
      </div>
    </div>
  );
}
