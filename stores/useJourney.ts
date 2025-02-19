import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface JourneyState {
  draftJourney: DraftJourney | null;
  selectedLocation: DraftLocation | null;
  currentlyViewedJourney: DraftLocation | null;

  startJourney: (title: string) => void;
  endJourney: () => void;
  publishJourney: () => void;

  updateJourney: (updates: Partial<DraftJourney>) => void;

  getLocation: (locationID: string) => DraftLocation | undefined;
  addLocation: (location: Partial<DraftLocation>) => void;
  updateLocation: (id: string, updates: Partial<DraftLocation>) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: DraftLocation | null) => void;

  setCurrentViewedLocation: (location: DraftLocation | null) => void;

  reset: () => void;
}

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      draftJourney: null,
      selectedLocation: null,
      currentlyViewedJourney: null,

      startJourney: (title) => {
        set({
          draftJourney: {
            id: uuid.v4(),
            title: title,
            description: '',
            isPublic: true,
            isActive: true,
            locations: [],
            startDate: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
      },

      endJourney: () => {
        set({
          draftJourney: null,
          selectedLocation: null,
          currentlyViewedJourney: null,
        });
      },

      publishJourney: () => {
        // send to api
        set({
          draftJourney: null,
          selectedLocation: null,
          currentlyViewedJourney: null,
        });
      },
      updateJourney: (updates: Partial<DraftJourney>) => {
        set((state) => {
          if (!state.draftJourney) return state;
          return {
            draftJourney: {
              ...state.draftJourney,
              ...updates,
              updated_at: new Date().toISOString(),
            },
          };
        });
      },

      getLocation: (locationID: string) => {
        const { draftJourney } = get();
        return draftJourney?.locations.find((loc) => loc.id === locationID);
      },

      addLocation: (location) => {
        set((state) => {
          if (!state.draftJourney) return state;

          const newLocation: DraftLocation = {
            id: uuid.v4(),
            title: '',
            coordinates: location.coordinates!,
            rating: 0,
            images: [],
            date: new Date().toISOString(),
            hideLocation: false,
            hideTime: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...location,
          };

          return {
            draftJourney: {
              ...state.draftJourney,
              locations: [...state.draftJourney.locations, newLocation],
            },
          };
        });
      },

      updateLocation: (id, updates) => {
        set((state) => {
          if (!state.draftJourney) return state;

          const updatedLocations = state.draftJourney.locations.map((location) =>
            location.id === id ? { ...location, ...updates } : location
          );

          return {
            draftJourney: {
              ...state.draftJourney,
              updated_at: new Date().toISOString(),
              locations: updatedLocations,
            },
          };
        });
      },

      removeLocation: (id) => {
        set((state) => {
          if (!state.draftJourney) return state;

          const updatedLocations = state.draftJourney.locations
            .filter((location) => location.id !== id)
            .map((location, index) => ({
              ...location,
              position: index + 1,
            }));

          return {
            draftJourney: {
              ...state.draftJourney,
              locations: updatedLocations,
            },
            selectedLocation: state.selectedLocation?.id === id ? null : state.selectedLocation,
          };
        });
      },

      selectLocation: (location: DraftLocation | null) => {
        set({ selectedLocation: location });
      },

      setCurrentViewedLocation: (location: DraftLocation | null) => {
        set({ currentlyViewedJourney: location });
      },

      reset: () =>
        set({ draftJourney: null, selectedLocation: null, currentlyViewedJourney: null }),
    }),
    {
      name: 'journey-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
