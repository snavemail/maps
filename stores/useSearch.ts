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
  lastSearchedBbox: [number, number, number, number] | null;
  fetchCategoryResultsByBbox: (
    category: string,
    bbox: [number, number, number, number]
  ) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  highlightedResults: [],
  categories: {},
  currentCategory: null,
  selectedResult: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSelectedResult: (result) => set({ selectedResult: result }),
  lastSearchedBbox: null,
  fetchCategoryResultsByBbox: async (category, bbox) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${category}?` +
          new URLSearchParams({
            access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!,
            limit: '25',
            bbox: bbox.join(','),
            language: 'en',
          })
      );
      const data = await response.json();

      set((state) => {
        const existingResults = state.categories[category]?.results ?? [];
        const resultsMap = new Map(
          existingResults.map((result) => [result.properties.mapbox_id, result])
        );

        data.features.forEach((newResult: any) => {
          resultsMap.set(newResult.properties.mapbox_id, newResult);
        });
        const uniqueResults = Array.from(resultsMap.values());

        return {
          categories: {
            ...state.categories,
            [category]: {
              id: category,
              name: CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES],
              results: uniqueResults,
              lastFetched: Date.now(),
            } as CategoryResult,
          },
          currentCategory: category,
          lastSearchedBbox: bbox,
        };
      });
    } catch (error) {
      console.error('Error fetching category results:', error);
    }
  },
  fetchCategoryResults: async (category, latitude, longitude) => {
    const existingCategory = get().categories[category];

    if (existingCategory) {
      set({ currentCategory: category });
      return;
    }

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
      const padding = 0.01; // Roughly 1km padding
      const initialBbox: [number, number, number, number] = [
        longitude - padding,
        latitude - padding,
        longitude + padding,
        latitude + padding,
      ];
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
        lastSearchedBbox: initialBbox,
      }));
    } catch (error) {
      console.error('Error fetching category results:', error);
    }
  },
}));

export const CATEGORIES = {
  restaurant: 'restaurant',
  museum: 'museum',
  cafe: 'cafe',
  shoppingMall: 'shopping',
  bar: 'bar',
  park: 'park',
  nightlife: 'nightlife',
  touristAttraction: 'tourist_attraction',
} as const;

export const CATEGORY_NAMES = {
  [CATEGORIES.restaurant]: 'Restaurants',
  [CATEGORIES.museum]: 'Museums',
  [CATEGORIES.cafe]: 'Cafes',
  [CATEGORIES.shoppingMall]: 'Shopping',
  [CATEGORIES.bar]: 'Bars',
  [CATEGORIES.park]: 'Parks',
  [CATEGORIES.nightlife]: 'Night Life',
  [CATEGORIES.touristAttraction]: 'Tourist Attractions',
} as const;
