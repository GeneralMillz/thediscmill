import { useState, useEffect } from 'react';
import { Disc } from '../types';
import { fetchDiscs } from '../services/discs';

export function useDiscs() {
  const [data, setData] = useState<Disc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscs()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
