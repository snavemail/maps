import { useCacheStore } from './useCache';

export const useJourneyCache = () => {
  const cache = useCacheStore();

  return {
    getJourney: (slug: string) => cache.get('journeys', slug),
    setJourney: (slug: string, journey: Journey) => cache.set('journeys', slug, journey),
    invalidateJourney: (slug: string) => cache.invalidate('journeys', slug),
    isValidJourney: (slug: string) => cache.isValid('journeys', slug),
  };
};
