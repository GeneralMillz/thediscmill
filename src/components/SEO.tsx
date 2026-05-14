import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from '../utils/seo';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  /** Pass a generated data-URL or a static image URL */
  image?: string;
  /** Primary JSON-LD block (Product, BlogPosting, etc.) */
  jsonLd?: object | object[];
  /** Page type for og:type — defaults to 'website' */
  ogType?: string;
  /** If true, inject root-level entity schemas (org + website). Default: false */
  isRootEntity?: boolean;
  /** robots meta override */
  robots?: string;
  /** noindex convenience flag */
  noIndex?: boolean;
}

/**
 * Elite SEO component:
 * – Full OG + Twitter tags, canonical, robots
 * – Injects org/website entity schema when isRootEntity=true
 * – Supports multiple JSON-LD graphs
 * – Deduplicates OG image
 */
export function SEO({
  title,
  description,
  canonicalUrl,
  image,
  jsonLd,
  ogType = 'website',
  isRootEntity = false,
  robots,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const robotsContent = noIndex ? 'noindex, nofollow' : robots ?? 'index, follow';

  // Build JSON-LD scripts array
  const schemas: object[] = [];
  if (isRootEntity) {
    schemas.push(ORGANIZATION_SCHEMA, WEBSITE_SCHEMA);
  }
  if (Array.isArray(jsonLd)) {
    schemas.push(...jsonLd);
  } else if (jsonLd) {
    schemas.push(jsonLd);
  }

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Search Console verifications */}
      <meta name="google-site-verification" content="LDAWgV_s--XLUkKbVqxy1SLV0M46-hEt_Q453oZ0X9o" />
      <meta name="bingbot" content="index, follow" />
      <meta name="msvalidate.01" content="REPLACE_WITH_BING_VERIFICATION_TOKEN" />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* JSON-LD schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
