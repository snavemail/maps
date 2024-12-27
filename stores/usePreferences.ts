import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export enum StyleURL {
  Street = 'mapbox://styles/mapbox/streets-v12',
  Dark = 'mapbox://styles/mapbox/dark-v11',
  Light = 'mapbox://styles/mapbox/light-v11',
  Outdoors = 'mapbox://styles/spammail/cm4uv4tts001301s9848b3fig',
  Neutral = 'mapbox://styles/spammail/cm547mmeb00jo01s878dr0a0j',
}

interface PreferenceState {
  isDarkTheme: boolean | null;
  toggleDarkTheme: () => void;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
  mapTheme: StyleURL;
  setMapTheme: (theme: StyleURL) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    immer((set) => ({
      isDarkTheme: true,
      toggleDarkTheme: () => {
        set((state) => {
          state.isDarkTheme = !state.isDarkTheme;
        });
      },
      setIsDarkTheme: (isDarkTheme: boolean) => {
        set((state) => {
          state.isDarkTheme = isDarkTheme;
        });
      },
      mapTheme: StyleURL.Neutral,
      setMapTheme: (theme: StyleURL) => {
        set((state) => {
          state.mapTheme = theme;
        });
      },
    })),
    {
      name: 'preference-storage', // unique name
    }
  )
);
