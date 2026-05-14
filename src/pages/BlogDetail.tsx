import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { formatDate } from '../utils';
import { BlogPost } from './Blog';
import { useDiscs } from '../hooks/useDiscs';
import { useInternalLinks } from '../utils/internalLinks';
import { brandSlug } from '../utils/brandSlug';
import { DiscCard } from '../components/DiscCard';
import { trackOutboundClick } from '../utils/outboundAnalytics';

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const { data: discs = [] } = useDiscs();
  const { injectInternalLinks } = useInternalLinks();
  const articleRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOutboundClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor || !anchor.href) return;

      const url = anchor.href;
      const isInternal = url.includes(window.location.hostname) || url.startsWith('/');
      
      if (!isInternal) {
        trackOutboundClick({
          url,
          label: anchor.innerText || 'Blog Link',
          pageSource: `blog_${id}`,
          category: 'blog_outbound'
        });
      }
    };

    const article = articleRef.current;
    if (article) {
      article.addEventListener('click', handleOutboundClick);
      return () => article.removeEventListener('click', handleOutboundClick);
    }
  }, [id, post]);

  useEffect(() => {
    fetch('/data/blog.json')
      .then(res => res.json())
      .then(data => {
        setAllPosts(data);
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
      <div className="pt-32 pb-8 flex justify-center min-h-[60vh] items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-8 text-center px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4 font-display">Post not found</h1>
        <Link to="/blog" className="text-indigo-600 font-bold hover:underline">Return to Blog</Link>
      </div>
    );
  }

  const canonicalUrl = `https://thediscmill.com${pathname}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: post?.title,
    description: post?.excerpt,
    author: {
      '@type': 'Organization',
      name: post?.author || 'The Disc Mill'
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Disc Mill',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thediscmill.com/logo.png'
      }
    },
    datePublished: post?.date ? new Date(post.date).toISOString() : undefined,
    dateModified: post?.date ? new Date(post.date).toISOString() : undefined,
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <SEO
        title={`${post.title} | The Disc Mill Blog`}
        description={post.excerpt}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />

      <Link to="/blog" className="inline-flex items-center text-sm font-bold text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-10 transition-colors uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Briefs
      </Link>

      <article 
        ref={articleRef}
        className="bg-white dark:bg-gray-900/50 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl shadow-indigo-900/5 border border-gray-100 dark:border-gray-800 backdrop-blur-xl"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs font-black text-indigo-500 uppercase tracking-widest mb-6 bg-indigo-50 dark:bg-indigo-900/20 w-fit px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">
          <span>{post.category}</span>
          <span className="text-indigo-300 dark:text-indigo-700">•</span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {formatDate(post.date)}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-[1.1] font-display tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{post.author}</div>
            <div className="text-xs uppercase tracking-wider mt-0.5">Intelligence Division</div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert prose-indigo max-w-none text-gray-700 dark:text-gray-300
          prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-gray-800
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-indigo-900 dark:prose-strong:text-indigo-100 prose-strong:font-black
          prose-ul:my-6 prose-ul:list-none prose-ul:pl-0
          prose-li:relative prose-li:pl-6 prose-li:mb-3 before:prose-li:absolute before:prose-li:left-0 before:prose-li:top-2 before:prose-li:w-2 before:prose-li:h-2 before:prose-li:bg-indigo-500 before:prose-li:rounded-full
          prose-table:block prose-table:w-full prose-table:overflow-x-auto prose-table:whitespace-nowrap md:prose-table:whitespace-normal prose-table:mt-8 prose-table:mb-8 prose-table:rounded-xl prose-table:shadow-sm
          prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-gray-900 dark:prose-th:text-white prose-th:border-b-2 prose-th:border-indigo-500
          prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-100 dark:prose-td:border-gray-800 prose-td:text-sm
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {injectInternalLinks(post.content)}
          </ReactMarkdown>
        </div>
      </article>

      {/* --- Related Entities --- */}
      {(() => {
        if (!post.tags || post.tags.length === 0) return null;

        // Find related discs
        const relatedDiscs = discs.filter(d => post.tags.some(t => d.name.toLowerCase().includes(t.toLowerCase()) || d.brand.toLowerCase() === t.toLowerCase())).slice(0, 3);
        
        // Find related posts
        const relatedPosts = allPosts.filter(p => p.id !== post.id && p.tags?.some(t => post.tags.includes(t))).slice(0, 3);

        return (
          <div className="mt-16 space-y-16">
            {relatedDiscs.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Outfit', system-ui" }}>Related Gear</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedDiscs.map(d => <DiscCard key={d.id} disc={d} />)}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Outfit', system-ui" }}>Related Briefs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} to={`/blog/${rp.id}`} className="block p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500 transition-colors">
                      <div className="text-xs text-indigo-500 font-bold mb-2 uppercase tracking-wider">{rp.category}</div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">{rp.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{rp.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
