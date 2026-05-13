import { useState, useEffect } from 'react';
import { Disc } from '../types';
import { fetchDiscById, fetchDiscBySlug } from '../services/discs';

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

export function useDiscBySlug(brandSlug: string | undefined, discSlug: string | undefined) {
  const [data, setData] = useState<Disc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandSlug || !discSlug) { setLoading(false); return; }
    setLoading(true);
    fetchDiscBySlug(brandSlug, discSlug)
      .then(setData)
      .finally(() => setLoading(false));
  }, [brandSlug, discSlug]);

  return { data, loading };
}
