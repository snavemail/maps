import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CacheEntry<T> = {
  data: T;
  lastFetched: number;
};

interface CacheState {
  profiles: Record<string, CacheEntry<ProfileWithStats>>;
  myJourneys: Record<string, CacheEntry<JourneyResponse>>;
  journeys: Record<string, CacheEntry<JourneyWithProfile>>;
  followCounts: Record<string, CacheEntry<FollowCounts>>;
  userStats: Record<string, CacheEntry<JourneyStats>>;
}

type CategoryData<T extends keyof CacheState> = CacheState[T][string]['data'];

interface CacheActions {
  get: <T extends keyof CacheState>(category: T, key: string) => CategoryData<T> | null;
  set: <T extends keyof CacheState>(category: T, key: string, data: CategoryData<T>) => void;

  isValid: (category: keyof CacheState, key: string) => boolean;
  invalidate: (category: keyof CacheState, key?: string) => void;
  invalidateUserJourneys: (userID: string) => void;
  clearAll: () => void;
  setMany: <T extends keyof CacheState>(
    category: T,
    entries: Record<string, CategoryData<T>>
  ) => void;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const initialState: CacheState = {
  profiles: {},
  journeys: {},
  myJourneys: {},
  followCounts: {},
  userStats: {},
};

export const useCacheStore = create<CacheState & CacheActions>()(
  persist(
    immer<CacheState & CacheActions>((set, get) => ({
      ...initialState,

      get: (category, key) => {
        const cache = get()[category][key];
        if (!get().isValid(category, key)) {
          get().invalidate(category, key);
          return null;
        }
        if (!cache) return null;
        return cache.data;
      },

      set: (category, key, data) => {
        set((state) => {
          (state[category] as any)[key] = { data, lastFetched: Date.now() };
        });
      },

      isValid: (category, key) => {
        const cache = get()[category][key];
        if (!(!!cache && Date.now() - cache.lastFetched < CACHE_DURATION)) {
          get().invalidate(category, key);
          return false;
        }
        return true;
      },

      invalidate: (category, key) => {
        set((state) => {
          if (key) {
            delete state[category][key];
          } else {
            state[category] = {};
          }
        });
      },

      invalidateUserJourneys: (userID: string) => {
        set((state) => {
          const newState = { ...state };
          Object.entries(state.journeys).forEach(([key, journey]) => {
            if (journey.data.user_id === userID) {
              delete newState.journeys[key];
            }
          });
          return newState;
        });
      },

      clearAll: () => set(initialState),

      setMany: (category, entries) => {
        set((state) => {
          Object.entries(entries).forEach(([key, data]) => {
            (state[category] as any)[key] = { data, lastFetched: Date.now() };
          });
        });
      },
    })),

    {
      name: 'app-cache',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const now = Date.now();
        const filtered: Partial<CacheState> = {};
        (Object.keys(state) as Array<keyof CacheState>).forEach((category) => {
          if (category in initialState) {
            filtered[category] = Object.entries(state[category]).reduce(
              (acc, [key, entry]) => {
                if (now - entry.lastFetched < CACHE_DURATION) {
                  acc[key] = entry;
                }
                return acc;
              },
              {} as Record<string, CacheEntry<any>>
            );
          }
        });

        return filtered;
      },
      version: 1,
    }
  )
);
