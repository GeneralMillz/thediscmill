import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { fetchEventDetail } from '../services/events';
import { Event } from '../types';
import { Calendar, MapPin, Trophy, ArrowLeft, Users, Info, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventDetail(id)
        .then(setEvent)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="pt-40 text-center text-gray-500 dark:text-gray-400">Loading event intelligence...</div>;
  if (!event) return <div className="pt-40 text-center text-gray-500 dark:text-gray-400">Event not found.</div>;

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>{event!.name} | Disc Golf Tournament — The Disc Mill</title>
        <meta name="description" content={`${event!.name} — ${event!.tier} event in ${event!.location}. Date: ${event!.date}.`} />
      </Helmet>
      <Link to="/events" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-indigo-900 text-white p-10 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  A-Tier Event
                </div>
                <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
                <div className="flex flex-wrap gap-6 text-indigo-100">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    April 12-14, 2026
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    International Disc Golf Center
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
              <h2 className="text-2xl font-bold mb-8 flex items-center dark:text-white">
                <Activity className="mr-2 text-indigo-600" />
                Live Leaderboard
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-xs">Pos</th>
                      <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-xs">Player</th>
                      <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-xs">Score</th>
                      <th className="pb-4 font-bold text-gray-400 dark:text-gray-500 uppercase text-xs">Thru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white">{i}</td>
                        <td className="py-4">
                          <Link to={`/player/${i * 1000}`} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Pro Player {i}
                          </Link>
                        </td>
                        <td className="py-4 font-mono font-bold text-green-600 dark:text-green-400">-{15 - i}</td>
                        <td className="py-4 text-gray-500 dark:text-gray-400">F</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center dark:text-white">
              <Users className="mr-2 w-5 h-5 text-indigo-600" />
              Field Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Players</span>
                <span className="font-bold">144</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Avg Rating</span>
                <span className="font-bold">1012</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Cut Line</span>
                <span className="font-bold text-red-600">+2</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-xl mb-6 flex items-center dark:text-white">
              <Info className="mr-2 w-5 h-5 text-indigo-600" />
              Event Info
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This event is part of the PDGA National Tour. Live scoring is provided by PDGA Live. 
              The Disc Mill provides real-time intelligence and historical context for every shot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
