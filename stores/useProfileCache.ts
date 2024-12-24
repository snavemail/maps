import { useCacheStore } from './useCache';

export const useProfileCache = () => {
  const cache = useCacheStore();

  return {
    getProfile: (slug: string): ProfileWithStats | null => {
      return cache.get('profiles', slug);
    },
    setProfile: (slug: string, profile: ProfileWithStats) => cache.set('profiles', slug, profile),
    invalidateProfile: (slug: string) => cache.invalidate('profiles', slug),
    isValidProfile: (slug: string) => cache.isValid('profiles', slug),
  };
};
