import { useState, useEffect } from 'react';
import { Course } from '../types';
import { fetchCourseDirectory } from '../services/courses';
import { getAudit } from '../services/audit';

export function useCourseDirectory(state: string) {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!state) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchCourseDirectory(state)
      .then(courses => {
        setData(courses);
        setDataSource(getAudit('courses').dataSource);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [state]);

  return { data, loading, error, dataSource };
}
