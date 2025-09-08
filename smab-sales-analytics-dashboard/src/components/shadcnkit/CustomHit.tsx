'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CustomHit({ hit }: { hit: any }) {
  const searchParams = useSearchParams();
  
  // Get all current query parameters
  const currentParams = new URLSearchParams(searchParams.toString());
  
  // Get the current timeRange if it exists
  const timeRange = currentParams.get('timeRange');
  
  // Create URL with preserved query parameters
  const getSectionUrl = () => {
    // Extract the base path without any hash or query parameters
    const basePath = hit.url.split('#')[0].split('?')[0];
    
    // Create the URL with section hash
    let url = `${basePath}#${hit.sectionId}`;
    
    // Preserve all existing query parameters including timeRange
    if (timeRange) {
      url += `?timeRange=${encodeURIComponent(timeRange)}`;
    }
    
    // Add other existing query parameters (if any)
    currentParams.forEach((value, key) => {
      if (key !== 'timeRange') {
        url += url.includes('?') ? '&' : '?';
        url += `${key}=${encodeURIComponent(value)}`;
      }
    });
    
    return url;
  };

  return (
    <Link href={getSectionUrl()} className="block">
      <div className="p-4 hover:bg-accent/50 transition-colors border-b border-border last:border-b-0 cursor-pointer group">
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {hit.section}
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          {hit.hierarchy.lvl0} › {hit.hierarchy.lvl1}
        </p>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
          {hit.content}
        </p>
        <div className="flex flex-wrap gap-1">
          {hit.keywords.slice(0, 3).map((keyword: string) => (
            <span
              key={keyword}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}