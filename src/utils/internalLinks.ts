import { useDiscs } from '../hooks/useDiscs';
import { brandSlug } from './brandSlug';

/**
 * Utility to auto-detect disc names, brands, and categories in text
 * and inject internal markdown links.
 */
export function useInternalLinks() {
  const { data: discs = [] } = useDiscs();

  const injectInternalLinks = (markdownContent: string) => {
    let content = markdownContent;
    
    // Sort discs by name length descending so we match "Teebird3" before "Teebird"
    const sortedDiscs = [...discs].sort((a, b) => b.name.length - a.name.length);

    sortedDiscs.forEach((disc) => {
      // Create a regex that matches the disc name whole word, ignoring case
      // We use a placeholder to avoid replacing text inside other links
      const regex = new RegExp(`(?<!\\[[^\\]]*)\\b(${disc.name})\\b(?![^\\[]*\\])`, 'gi');
      
      content = content.replace(regex, (match) => {
        const url = `/disc/${brandSlug(disc.brand)}/${disc.id}`;
        return `[${match}](${url})`;
      });
    });

    // We can also add manufacturers
    const manufacturers: string[] = Array.from(new Set(discs.map(d => d.brand))).sort((a, b) => b.length - a.length);
    manufacturers.forEach((brand) => {
      const regex = new RegExp(`(?<!\\[[^\\]]*)\\b(${brand})\\b(?![^\\[]*\\])`, 'gi');
      content = content.replace(regex, (match) => {
        const url = `/manufacturer/${brandSlug(brand)}`;
        return `[${match}](${url})`;
      });
    });

    return content;
  };

  return { injectInternalLinks };
}
