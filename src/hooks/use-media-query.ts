// src/hooks/use-media-query.ts
"use client";

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Initial check
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      
      // Listener for changes
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      
      return () => media.removeEventListener('change', listener);
    }
  }, [matches, query]);

  return matches;
}