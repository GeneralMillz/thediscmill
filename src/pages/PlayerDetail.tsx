import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { fetchPlayer } from '../services/players';
import { Player } from '../types';
import { User, Trophy, Star, MapPin, ArrowLeft, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency } from '../utils';

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayer(id)
        .then(setPlayer)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="pt-40 text-center">Loading player intelligence...</div>;
  if (!player) return <div className="pt-40 text-center">Player not found.</div>;

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>{player!.name} — PDGA #{player!.pdgaNumber} | The Disc Mill</title>
        <meta name="description" content={`${player!.name}, PDGA #${player!.pdgaNumber}. Rating: ${player!.rating}. ${player!.location}.`} />
      </Helmet>
      <Link to="/players" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Players
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-16 h-16 text-indigo-200" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-gray-500">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-indigo-600" />
                    PDGA #{player.pdgaNumber}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-indigo-600" />
                    {player.location || 'Location Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Rating</div>
                <div className="text-2xl font-bold text-indigo-600">{player.rating || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Career Wins</div>
                <div className="text-2xl font-bold text-gray-900">{player.careerWins}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Earnings</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(player.careerEarnings)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Member Since</div>
                <div className="text-2xl font-bold text-gray-900">{player.memberSince || '2015'}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Trophy className="mr-2 text-indigo-600" />
              Recent Performance
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                      {i * 2}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Major Championship {i}</div>
                      <div className="text-xs text-gray-500">April {10 + i}, 2026</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">-12</div>
                    <div className="text-xs text-gray-400">Final Score</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Star className="mr-2 w-5 h-5 text-indigo-400" />
              Player Bag
            </h3>
            <div className="space-y-4">
              {['Distance Driver', 'Fairway Driver', 'Midrange', 'Putter'].map(cat => (
                <div key={cat} className="flex justify-between items-center p-3 bg-indigo-800 rounded-xl">
                  <span className="text-sm">{cat}</span>
                  <span className="text-xs font-bold bg-indigo-700 px-2 py-1 rounded">Top Choice</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-xl mb-4">Classification</h3>
            <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
              Professional
            </div>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              This player is currently active in the professional circuit and maintains a top-tier PDGA rating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
