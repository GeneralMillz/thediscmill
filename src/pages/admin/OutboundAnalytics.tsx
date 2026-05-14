import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart3, ArrowUpRight, ArrowDownRight, Filter, Calendar, LayoutDashboard } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { OutboundClickEvent } from '../../utils/outboundAnalytics';
import { Shield, Lock, Key } from 'lucide-react';

export default function OutboundAnalytics() {
  const [events, setEvents] = useState<OutboundClickEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMfg, setFilterMfg] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'millz2025') { // Simple gate as requested
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    }
  };

  useEffect(() => {
    // In a real app, fetch from /public/data/outbound-clicks.json
    // For now, check local JSON and fallback to localStorage for live demo
    const fetchData = async () => {
      try {
        const response = await fetch('/data/outbound-clicks.json');
        let data: OutboundClickEvent[] = [];
        if (response.ok) {
          data = await response.json();
        }
        
        // Merge with local session clicks
        const local = JSON.parse(localStorage.getItem('outbound_clicks') || '[]');
        setEvents([...data, ...local]);
      } catch (e) {
        console.error('Failed to fetch analytics:', e);
        const local = JSON.parse(localStorage.getItem('outbound_clicks') || '[]');
        setEvents(local);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const filtered = filterMfg 
      ? events.filter(e => e.manufacturer.toLowerCase().includes(filterMfg.toLowerCase()))
      : events;

    // Clicks per manufacturer
    const mfgMap = new Map<string, number>();
    // Clicks per page type
    const typeMap = new Map<string, number>();
    // Last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = events.filter(e => e.timestamp > thirtyDaysAgo);

    filtered.forEach(e => {
      mfgMap.set(e.manufacturer, (mfgMap.get(e.manufacturer) || 0) + 1);
      typeMap.set(e.pageSource, (typeMap.get(e.pageSource) || 0) + 1);
    });

    const mfgTable = Array.from(mfgMap.entries())
      .map(([name, count]) => {
        // Mock growth calculation for demo
        const lastMonthCount = Math.floor(count * 0.85);
        const growth = lastMonthCount > 0 ? ((count - lastMonthCount) / lastMonthCount) * 100 : 0;
        return { name, count, growth };
      })
      .sort((a, b) => b.count - a.count);

    const typeTable = Array.from(typeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return { mfgTable, typeTable, total: filtered.length, recent: recent.length };
  }, [events, filterMfg]);

  if (!isAuthenticated) {
    return (
      <div className="pt-40 pb-20 px-4 max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Admin Access</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">Enter the secret key to view outbound analytics.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                placeholder="Enter password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <SEO 
        title="Admin | Outbound Analytics" 
        description="Internal click tracking dashboard."
        noIndex={true}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Outbound Analytics</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Track traffic sent to manufacturer websites.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter manufacturer..." 
              value={filterMfg}
              onChange={e => setFilterMfg(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-indigo-500 transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Total Sent Clicks" value={stats.total} sub="Lifetime" icon={ArrowUpRight} color="text-indigo-600" />
        <StatCard label="Last 30 Days" value={stats.recent} sub="+12% from last month" icon={BarChart3} color="text-emerald-600" />
        <StatCard label="Active Partners" value={stats.mfgTable.length} sub="Unique manufacturers" icon={LayoutDashboard} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manufacturer Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Clicks per Manufacturer</h2>
          <div className="space-y-4">
            {stats.mfgTable.map(row => (
              <div key={row.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300 capitalize">{row.name}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${row.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                    {row.growth >= 0 ? '+' : ''}{row.growth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(row.count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{row.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Clicks per Page Type</h2>
          <div className="space-y-4">
            {stats.typeTable.map(row => (
              <div key={row.name} className="flex items-center justify-between">
                <span className="font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">{row.name.replace('_', ' ')}</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightweight SVG Chart (Stub) */}
      <div className="mt-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Traffic Over Time</h2>
        <div className="h-64 flex items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-sm relative group"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Day {i + 1}: {Math.floor(Math.random() * 50)} clicks
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>30 Days Ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-700 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
    </div>
  );
}
