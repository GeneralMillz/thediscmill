import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseDetail } from '../services/courses';
import { Course } from '../types';
import { MapPin, Info, ArrowLeft, Star, Share2, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Featured } from '../components/monetization/Featured';
import { amazonLink, buildAmazonLink } from '../utils/amazon';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id)
        .then(setCourse)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="pt-40 text-center">Loading course intelligence...</div>;
  if (!course) return <div className="pt-40 text-center">Course not found.</div>;

  return (
    <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <Helmet>
        <title>{course!.name} | Disc Golf Course — The Disc Mill</title>
        <meta name="description" content={`${course!.name} in ${course!.city}, ${course!.state}. ${course!.holes} holes. ${course!.description || 'Disc golf course details, ratings, and directions.'}`} />
      </Helmet>
      <Link to="/courses" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.name}</h1>
                <div className="flex items-center text-gray-500 text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                  {course.location || 'Location Intelligence Pending'}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Holes</div>
                <div className="text-2xl font-bold text-indigo-600">{course.holes || 18}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Rating</div>
                <div className="text-2xl font-bold text-amber-500 flex items-center justify-center">
                  <Star className="w-5 h-5 fill-current mr-1" />
                  4.8
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Difficulty</div>
                <div className="text-2xl font-bold text-gray-900">Pro</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Status</div>
                <div className="text-2xl font-bold text-green-600">Open</div>
              </div>
            </div>

            <div className="prose prose-indigo max-w-none">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Info className="mr-2 text-indigo-600" />
                Course Description
              </h2>
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-gray-600 leading-relaxed">
                {course.description || "No description available for this course. We are currently pulling live intelligence from the PDGA database."}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6">Course Layouts</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                <span>Gold Tees</span>
                <span className="font-bold">Par 64</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                <span>Blue Tees</span>
                <span className="font-bold">Par 58</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-xl mb-6">Course Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['Wooded', 'Hilly', 'Water in Play', 'Concrete Tees', 'Pro Shop'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
            <h3 className="font-bold text-xl mb-6 flex items-center text-indigo-900">
              <ShoppingBag className="mr-2 text-indigo-600" />
              Gear for this Course
            </h3>
            <div className="space-y-4">
              <Featured
                title="Buzzz (Z Line)"
                description="Perfect for the tight wooded fairways at this course."
                link={buildAmazonLink({ amazonQuery: 'Discraft Buzzz Z Line disc golf midrange' }) ?? '#'}
              />
              <Featured 
                title="Rangefinder"
                description="Essential for the elevation changes on the back 9."
                link={amazonLink("B07897Y67R")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
