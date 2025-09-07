'use client';

import Link from 'next/link';

export default function CustomHit({ hit }: { hit: any }) {
  const getSectionUrl = () => {
    return `${hit.url}${hit.url.includes('#') ? '' : '#'}${hit.sectionId}`;
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
