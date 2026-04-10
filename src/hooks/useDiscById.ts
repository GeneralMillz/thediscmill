import { useState, useEffect } from 'react';
import { Disc } from '../types';
import { fetchDiscById } from '../services/discs';

export function useDiscById(id: string | undefined) {
  const [data, setData] = useState<Disc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    fetchDiscById(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
