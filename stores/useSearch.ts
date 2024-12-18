import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SearchState {
  selectedResult: LocationResult | null;
  currentResults: LocationResult[];
  currentBBox: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  } | null;
  isSearchButtonVisible: boolean;
  setSelectedResult: (result: LocationResult | null) => void;
  setCurrentResults: (results: LocationResult[]) => void;
  setCurrentBBox: (bbox: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  }) => void;
  setSearchButtonVisibility: (visible: boolean) => void;
  updateResultsFromBBox: (bbox: {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
  }) => Promise<void>;
}

export const useSearchStore = create<SearchState>()(
  immer((set) => ({
    selectedResult: null,
    currentResults: [],
    currentBBox: null,
    isSearchButtonVisible: false,

    setSelectedResult: (result: LocationResult | null) => {
      set((state) => {
        state.selectedResult = result;
      });
    },
    setCurrentResults: (results: LocationResult[]) => {
      set((state) => {
        state.currentResults = results;
      });
    },
    setCurrentBBox: (bbox: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => {
      set((state) => {
        state.currentBBox = bbox;
      });
    },
    setSearchButtonVisibility: (visible: boolean) => {
      set((state) => {
        state.isSearchButtonVisible = visible;
      });
    },
    updateResultsFromBBox: async (bbox) => {
      // Fetch results from API based on bbox
      // Update currentResults with new results
      const results: any[] = []; // call api
      set((state) => {
        state.currentResults = results;
        state.currentBBox = bbox;
        state.isSearchButtonVisible = false;
        state.selectedResult = null;
      });
    },
  }))
);
