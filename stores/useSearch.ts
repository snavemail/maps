import { create } from 'zustand';

interface CategoryResult {
  id: string;
  name: string;
  results: LocationResult[];
  lastFetched: number;
}

interface CategoryState {
  categories: Record<string, CategoryResult>;
  currentCategory: string | null;
  setCurrentCategory: (category: string) => void;
  fetchCategoryResults: (category: string, latitude: number, longitude: number) => Promise<void>;
  selectedResult: LocationResult | null;
  setSelectedResult: (result: LocationResult | null) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: {},
  currentCategory: null,
  selectedResult: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSelectedResult: (result) => set({ selectedResult: result }),
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
      // console.log(JSON.stringify(data, null, 2));
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
