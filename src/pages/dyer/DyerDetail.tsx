import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Globe, Instagram, ShoppingBag, 
  Palette, Star, Zap
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { buildCanonical } from '../../utils/seo';
import { trackOutboundClick } from '../../utils/outboundAnalytics';

interface Dyer {
  slug: string;
  name: string;
  location: string;
  state: string;
  avatar: string;
  specialty: string;
  styles: string[];
  bio: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  shop_url: string;
  brandAccent: string;
  gallery: { url: string; label: string }[];
}

export default function DyerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const [dyer, setDyer] = useState<Dyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/dyers.json')
      .then(res => res.json())
      .then(data => {
        const found = Array.isArray(data) ? data.find((d: Dyer) => d.slug === slug) : null;
        
        if (found) {
          setDyer(found);
        } else if (!data || data.length === 0) {
          setDyer({
            slug: 'example',
            name: 'Example Creator Spotlight',
            location: 'Michigan Hub',
            state: 'MI',
            avatar: '/assets/dyer-placeholder.png',
            specialty: 'Cell Dyes / Stencil Art / Spin Dyes',
            styles: ['Cell Dye', 'Stencil'],
            bio: 'This is a preview of how your dyer spotlight will look. Showcase your unique story, studio process, and custom work to thousands of daily visitors. Link directly to your shop and social channels.',
            shop_url: '/partners',
            brandAccent: '#6366f1',
            gallery: [
              { url: '/assets/dyer-placeholder.png', label: 'Example Gallery Work 1' },
              { url: '/assets/dyer-placeholder.png', label: 'Example Gallery Work 2' },
              { url: '/assets/dyer-placeholder.png', label: 'Example Gallery Work 3' }
            ]
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading || !dyer) return null;

  const isExample = dyer.slug === 'example';

  const canonicalUrl = buildCanonical(pathname);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: dyer.name,
      description: dyer.bio,
      image: dyer.avatar,
      address: {
        '@type': 'PostalAddress',
        addressLocality: dyer.location,
        addressRegion: dyer.state
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Custom Discs by ${dyer.name}`,
      itemListElement: dyer.gallery.map((img, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: img.label,
        image: img.url
      }))
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors min-h-screen">
      <SEO 
        title={`${dyer.name} | Dyer Spotlight`} 
        description={dyer.bio}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      {isExample && (
        <div className="bg-indigo-600 text-white px-8 py-5 flex flex-col md:flex-row items-center justify-center gap-6 shadow-xl relative z-20">
          <div className="flex items-center gap-3">
             <Zap size={20} className="fill-current text-amber-400" />
             <p className="font-bold text-lg">This is an example spotlight. Want your own page?</p>
          </div>
          <Link to="/partners" className="px-8 py-2.5 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all shadow-lg">
             Apply Now
          </Link>
        </div>
      )}

      <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <Link to="/dyers" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: dyer.brandAccent }} />
              <div className="relative z-10 text-center">
                <div className="w-40 h-40 mx-auto rounded-[3rem] border-8 border-gray-50 dark:border-gray-800 shadow-xl mb-8 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {isExample ? (
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">Avatar</span>
                  ) : (
                    <img src={dyer.avatar} alt={dyer.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">{dyer.name}</h1>
                <div className="flex items-center justify-center gap-2 mb-10">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{dyer.location}</p>
                   {dyer.state === 'MI' && (
                     <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black rounded uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                        MI Hub
                     </span>
                   )}
                </div>
                
                <div className="flex justify-center gap-4 mb-10">
                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-300"><Instagram size={24} /></div>
                   <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-300"><Globe size={24} /></div>
                </div>

                <a 
                  href={dyer.shop_url}
                  onClick={() => !isExample && trackOutboundClick({ url: dyer.shop_url, manufacturer: dyer.slug, label: dyer.name, pageSource: 'dyer_detail', category: 'dyer_click' })}
                  target={isExample ? '_self' : '_blank'}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-3 text-lg"
                >
                  {isExample ? 'Apply for Spotlight' : 'Visit Shop'} <ShoppingBag size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Story & Gallery */}
          <div className="lg:col-span-2">
             <div className="mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                   <Palette size={12} /> Artist Background
                </div>
                <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter">
                   {dyer.bio}
                </p>
             </div>

             <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 flex items-center gap-3">
                   <Palette className="text-indigo-600" /> Featured Work
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {dyer.gallery.map((img, i) => (
                      <div key={i} className="aspect-square rounded-[3rem] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group shadow-lg flex items-center justify-center overflow-hidden">
                         {isExample ? (
                           <span className="text-[10px] font-black text-gray-200 dark:text-gray-700 uppercase tracking-[0.4em]">Artwork</span>
                         ) : (
                           <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={img.label} />
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
