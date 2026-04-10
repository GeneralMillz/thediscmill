import { useState, useEffect } from 'react';
import { searchPDGA } from '../services/search';

export function useSearch(query: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchPDGA(query)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return { data, loading, error };
}
