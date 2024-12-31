import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StyleURL {
  Light = 'mapbox://styles/spammail/cm547mmeb00jo01s878dr0a0j',
  Dark = 'mapbox://styles/spammail/cm58fojsn00o001qp10rldsj3',
}

interface PreferenceState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  mapTheme: StyleURL;
  reset: () => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      theme: 'dark',
      mapTheme: StyleURL.Dark,
      setTheme: (theme: 'light' | 'dark') =>
        set({
          theme,
          mapTheme: theme === 'dark' ? StyleURL.Dark : StyleURL.Light,
        }),
      reset: () => set({ theme: 'dark', mapTheme: StyleURL.Dark }),
    }),
    {
      name: 'preference-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
