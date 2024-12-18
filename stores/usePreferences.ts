import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export enum StyleURL {
  Street = 'mapbox://styles/mapbox/streets-v12',
  Dark = 'mapbox://styles/mapbox/dark-v11',
  Light = 'mapbox://styles/mapbox/light-v11',
  Outdoors = 'mapbox://styles/mapbox/outdoors-v12',
}

interface PreferenceState {
  mapTheme: StyleURL;
  setMapTheme: (theme: StyleURL) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  immer((set) => ({
    mapTheme: StyleURL.Outdoors,
    setMapTheme: (theme: StyleURL) => {
      set((state) => {
        state.mapTheme = theme;
      });
    },
  }))
);
