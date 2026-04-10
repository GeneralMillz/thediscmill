import { useState, useEffect, useMemo } from 'react';
import { fetchProducts, Product } from '../services/products';

export interface FinderCriteria {
  armSpeed: number;
  stability: 'understable' | 'stable' | 'overstable';
  shotShape: 'straight' | 'hyzer' | 'anhyzer';
  experience: 'beginner' | 'intermediate' | 'advanced';
}

export function useDiscFinder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [criteria, setCriteria] = useState<FinderCriteria>({
    armSpeed: 35,
    stability: 'stable',
    shotShape: 'straight',
    experience: 'beginner',
  });

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const recommendations = useMemo(() => {
    if (loading) return [];

    return products
      .filter((p) => p.type === 'disc' || p.role === 'starter-set')
      .filter((p) => {
        // Arm Speed Logic
        const speed = p.flight?.speed || 0;
        if (criteria.armSpeed < 30 && speed > 5) return false;
        if (criteria.armSpeed < 45 && speed > 9) return false;
        
        // Stability Logic
        const turn = p.flight?.turn || 0;
        const fade = p.flight?.fade || 0;
        const netStability = turn + fade;

        if (criteria.stability === 'understable' && netStability > 0) return false;
        if (criteria.stability === 'overstable' && netStability < 2) return false;
        if (criteria.stability === 'stable' && (netStability < 0 || netStability > 2)) return false;

        return true;
      })
      .sort((a, b) => {
        // Sponsored products first
        if (a.sponsored && !b.sponsored) return -1;
        if (!a.sponsored && b.sponsored) return 1;
        return 0;
      });
  }, [products, loading, criteria]);

  return {
    criteria,
    setCriteria,
    recommendations,
    loading,
  };
}
