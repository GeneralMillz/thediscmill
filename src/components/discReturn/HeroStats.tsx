import React, { useEffect, useState } from 'react';
import { Award, Clock, Zap, Target } from 'lucide-react';
import { formatDate } from '../../utils';

export function HeroStats() {
  const [stats, setStats] = useState({
    returns: 0,
    lastReturn: null as number | null,
    level: 'Novice Hero'
  });

  useEffect(() => {
    const updateStats = () => {
      const returns = parseInt(sessionStorage.getItem('hero_returns') || '0');
      const lastReturn = sessionStorage.getItem('hero_last_return');
      
      let level = 'Novice Hero';
      if (returns >= 10) level = 'Legendary Hero';
      else if (returns >= 5) level = 'Master Hero';
      else if (returns >= 2) level = 'Veteran Hero';
      else if (returns >= 1) level = 'Active Hero';

      setStats({
        returns,
        lastReturn: lastReturn ? parseInt(lastReturn) : null,
        level
      });
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <div className="flex items-center text-indigo-300 mb-2">
          <Award className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Hero Level</span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight">{stats.level}</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <div className="flex items-center text-indigo-300 mb-2">
          <Target className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Total Returns</span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight">{stats.returns} Discs</div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <div className="flex items-center text-indigo-300 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Last Heroic Act</span>
        </div>
        <div className="text-xl font-bold text-white tracking-tight">
          {stats.lastReturn ? formatDate(stats.lastReturn) : 'None Yet'}
        </div>
      </div>
    </div>
  );
}
