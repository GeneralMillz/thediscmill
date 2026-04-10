import { useState, useEffect } from 'react';
import { Player } from '../types';
import { fetchPlayer } from '../services/players';

export function usePlayer(playerId: string) {
  const [data, setData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) return;
    fetchPlayer(playerId)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  return { data, loading, error };
}
