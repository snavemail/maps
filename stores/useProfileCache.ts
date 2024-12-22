import { useCacheStore } from './useCache';

export const useProfileCache = () => {
  const cache = useCacheStore();

  return {
    getProfile: (slug: string): Profile | null => {
      return cache.get('profiles', slug);
    },
    setProfile: (slug: string, profile: Profile) => cache.set('profiles', slug, profile),
    invalidateProfile: (slug: string) => cache.invalidate('profiles', slug),
    isValidProfile: (slug: string) => cache.isValid('profiles', slug),
  };
};
