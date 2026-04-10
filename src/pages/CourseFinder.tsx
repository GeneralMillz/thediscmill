import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCourseDirectory } from '../hooks/useCourseDirectory';
import { Search, MapPin, Navigation, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function CourseFinder() {
  const { data: courses, loading } = useCourseDirectory('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>('');

  const findMe = () => {
    setStatus('Locating...');
    if (!navigator.geolocation) {
      setStatus('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('Located');
      },
      () => setStatus('Permission denied')
    );
  };

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>Course Finder | The Disc Mill</title>
        <meta name="description" content="Find disc golf courses near you using geolocation. Sorted by distance with hole counts and ratings." />
      </Helmet>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Compass className="mr-3 text-indigo-600 w-10 h-10" />
          Course Finder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the best disc golf courses near your current location.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={findMe}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center"
        >
          <Navigation className="mr-2 w-5 h-5" />
          Find Courses Near Me
        </button>
      </div>

      {status && <p className="text-center text-indigo-600 font-bold mb-8">{status}</p>}

      {userLocation ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h3 className="font-bold text-xl mb-2">{course.name}</h3>
              <p className="text-gray-500 text-sm mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {course.location}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-600 font-bold">~2.4 miles away</span>
                <Link to={`/course/${course.id}`} className="text-gray-400 hover:text-indigo-600 font-bold">
                  View →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-indigo-50 rounded-3xl border-2 border-dashed border-indigo-200">
          <MapPin className="mx-auto w-16 h-16 text-indigo-200 mb-4" />
          <p className="text-indigo-400 font-medium">Allow location access to see nearby courses.</p>
        </div>
      )}
    </div>
  );
}
