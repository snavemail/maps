import { create } from 'zustand';
import { supabase } from '~/lib/supabase';

type ImageCache = {
  [path: string]: {
    expiresAt: number;
    url: string;
  };
};

export const useImageStore = create<{
  cache: ImageCache;
  getSignedUrl: (path: string) => Promise<string | null>;
}>((set, get) => ({
  cache: {},

  getSignedUrl: async (path: string) => {
    const cached = get().cache[path];
    if (cached && cached.expiresAt > Date.now()) {
      return cached.url;
    }

    const { data, error } = await supabase.storage
      .from('location_photos')
      .createSignedUrl(path, 3600);

    if (error || !data) return null;

    set((state) => ({
      cache: {
        ...state.cache,
        [path]: {
          url: data.signedUrl,
          expiresAt: Date.now() + 3600 * 1000, // 1 hour
        },
      },
    }));

    return data.signedUrl;
  },
}));
