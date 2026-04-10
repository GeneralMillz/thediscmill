import { useState, useMemo } from 'react';
import { calculateFlightPath, FlightParams, FlightPoint } from '../utils/physics';

export function useFlightSimulator(initialParams: FlightParams) {
  const [params, setParams] = useState<FlightParams>(initialParams);

  const path = useMemo(() => {
    return calculateFlightPath(params);
  }, [params]);

  const stats = useMemo(() => {
    const lastPoint = path[path.length - 1];
    const maxDistance = lastPoint ? lastPoint.x * 3.28084 : 0; // meters to feet
    const maxDeviation = lastPoint ? lastPoint.y * 3.28084 : 0;
    
    return {
      distance: Math.round(maxDistance),
      deviation: Math.round(maxDeviation),
    };
  }, [path]);

  return {
    params,
    setParams,
    path,
    stats,
  };
}
