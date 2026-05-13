import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils';
import { BlogPost } from './Blog';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/blog.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: BlogPost) => p.id === id);
        setPost(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load blog post:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 pb-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 pb-8 text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-indigo-600 hover:underline">Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 px-4 max-w-3xl mx-auto">
      <Helmet>
        <title>{post.title} | The Disc Mill</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blog
      </Link>

      <article>
        <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">
          <span>{post.category}</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(post.date)}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
          <User className="w-5 h-5 mr-2" />
          <span className="font-medium">{post.author}</span>
        </div>

        {/* Since content might be simple text or markdown, we render it simply for now. */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </article>
    </div>
  );
}
