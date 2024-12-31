import { create } from 'zustand';

interface CategoryResult {
  id: string;
  name: string;
  results: LocationResult[];
  lastFetched: number;
}

interface CategoryState {
  highlightedResults: LocationResult[];
  categories: Record<string, CategoryResult>;
  currentCategory: string | null;
  setCurrentCategory: (category: string) => void;
  fetchCategoryResults: (category: string, latitude: number, longitude: number) => Promise<void>;
  selectedResult: LocationResult | null;
  setSelectedResult: (result: LocationResult | null) => void;
  fetchBBoxResults: (
    minLat: number,
    minLon: number,
    maxLat: number,
    maxLon: number
  ) => Promise<void>;
  currentBBox: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  } | null;
  setCurrentBBox: (bbox: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  }) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  highlightedResults: [],
  categories: {},
  currentCategory: null,
  selectedResult: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSelectedResult: (result) => set({ selectedResult: result }),
  currentBBox: null,
  setCurrentBBox: (bbox) => set({ currentBBox: bbox }),
  fetchBBoxResults: async (minLat, minLon, maxLat, maxLon) => {
    const currentCategory = get().currentCategory;
    if (!currentCategory) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${currentCategory}?` +
          new URLSearchParams({
            access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!,
            limit: '25',
            bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
            language: 'en',
          })
      );
      const data = await response.json();
      set((state) => ({
        categories: {
          ...state.categories,
          [currentCategory]: {
            ...state.categories[currentCategory],
            results: data.features,
            lastFetched: Date.now(),
          },
        },
      }));
    } catch (error) {
      console.error('Error fetching bbox results:', error);
    }
  },
  fetchCategoryResults: async (category, latitude, longitude) => {
    const existingCategory = get().categories[category];

    if (existingCategory) {
      console.log('existingCategory', existingCategory);
      set({ currentCategory: category });
      return;
    }
    console.log('fetching new category', category);

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${category}?` +
          new URLSearchParams({
            access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!,
            limit: '25',
            proximity: `${longitude},${latitude}`,
            //bbox: `${longitude},${latitude},${longitude},${latitude}`,
            language: 'en',
          })
      );
      const data = await response.json();
      set((state) => ({
        categories: {
          ...state.categories,
          [category]: {
            id: category,
            name: CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES],
            results: data.features,
            lastFetched: Date.now(),
          } as CategoryResult,
        },
        currentCategory: category,
      }));
    } catch (error) {
      console.error('Error fetching category results:', error);
    }
  },
}));

export const CATEGORIES = {
  restaurant: 'restaurant',
  cafe: 'cafe',
  bar: 'bar',
  park: 'park',
  hotel: 'hotel',
} as const;

export const CATEGORY_NAMES = {
  [CATEGORIES.restaurant]: 'Restaurants',
  [CATEGORIES.cafe]: 'Cafes',
  [CATEGORIES.bar]: 'Bars',
  [CATEGORIES.park]: 'Parks',
  [CATEGORIES.hotel]: 'Hotels',
} as const;
