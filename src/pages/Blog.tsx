import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: number;
  category: string;
  content: string;
  tags?: string[];
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/blog.json')
      .then(res => res.json())
      .then(data => {
        setPosts(data.sort((a: BlogPost, b: BlogPost) => b.date - a.date));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-20 pb-8 px-4 max-w-5xl mx-auto">
      <SEO
        title="Intelligence Briefs & Gear Guides"
        description="Daily disc golf news, tournament analysis, and comprehensive gear guides."
        canonicalUrl="https://thediscmill.com/blog"
      />
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen className="mr-3 text-indigo-600" />
          The Disc Mill Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Insights, news, and stories from the world of disc golf.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No blog posts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.99] transition-all flex flex-col">
              <div className="h-48 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-indigo-200" />
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  <span>{post.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(post.date)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                  </div>
                  <Link to={`/blog/${post.id}`} className="text-indigo-600 font-bold flex items-center hover:underline">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
