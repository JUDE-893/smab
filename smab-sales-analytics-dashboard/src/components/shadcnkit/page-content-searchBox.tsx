'use client';

import { useState, useEffect, useRef } from 'react';
import { InstantSearch, connectSearchBox, Hits } from 'react-instantsearch-dom';
import algoliaClient from '@/services/algoliaClient';
import CustomHit from './CustomHit';

// Custom search input with complete control over styling
function CustomSearchInput({ currentRefinement, refine, onFocus }: any) {
  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Search Input - No borders or outlines */}
      <input
        type="text"
        value={currentRefinement}
        onChange={(e) => refine(e.currentTarget.value)}
        onFocus={onFocus}
        placeholder="Search sections..."
        className="w-full pl-10 pr-10 py-3 bg-background text-foreground
                 placeholder:text-muted-foreground outline-none border-none focus:ring-0"
        autoFocus
      />

      {/* Clear Button */}
      {currentRefinement && (
        <button
          onClick={() => refine('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

const ConnectedSearchBox = connectSearchBox(CustomSearchInput);

export default function DashboardSearch() {
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setShowResults(true);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <InstantSearch
        searchClient={algoliaClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      >
        <ConnectedSearchBox onFocus={handleFocus} />

        {showResults && (
          <div className="w-full shadow-lg z-50 max-h-80 overflow-y-auto">
            <Hits hitComponent={CustomHit} />
          </div>
        )}
      </InstantSearch>
    </div>
  );
}
