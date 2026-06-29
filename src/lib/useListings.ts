import { useEffect, useState } from 'react';
import type { FeaturedListing } from '../content/site';
import { loadListings } from './listings';

const preloadedListings = loadListings();

export function useListings() {
  const [listings, setListings] = useState<FeaturedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    preloadedListings.then((nextListings) => {
      if (!active) return;
      setListings(nextListings);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return {
    listings,
    isLoading,
  };
}
