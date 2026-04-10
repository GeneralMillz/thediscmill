import { useState, useEffect } from 'react';
import { Event } from '../types';
import { fetchEvents } from '../services/events';

export function useEvents(state: string) {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchEvents(state)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [state]);

  return { data, loading, error };
}
