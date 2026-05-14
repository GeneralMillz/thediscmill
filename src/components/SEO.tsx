import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../utils/seo';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  jsonLd?: any;
}

export function SEO({ title, description, canonicalUrl, image, jsonLd }: SEOProps) {
  const fullTitle = title.includes('The Disc Mill') ? title : `${title} | The Disc Mill`;
  const defaultImage = `${SITE_URL}/logo.png`; // Fallback share image
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="The Disc Mill" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
