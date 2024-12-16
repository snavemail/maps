import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { TextInput } from 'react-native';
import debounce from 'lodash/debounce';
import * as Location from 'expo-location';

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

export default function LocationSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Debounced search function
  const searchPlaces = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim() || !currentLocation) return;

      try {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json`;

        const params = new URLSearchParams({
          access_token: 'YOUR_MAPBOX_ACCESS_TOKEN',
          proximity: `${currentLocation.longitude},${currentLocation.latitude}`, // Bias results to current location
          types: 'place,address,poi',
          limit: '5',
        });

        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();

        const formattedResults: SearchResult[] = data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        }));

        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    }, 300), // 300ms debounce delay
    [currentLocation]
  );

  // Handle text input changes
  const handleTextChange = (text: string) => {
    setQuery(text);
    searchPlaces(text);
  };

  // Handle location selection
  const handleSelectLocation = (item: SearchResult) => {
    console.log('Selected location:', {
      name: item.place_name,
      coordinates: {
        longitude: item.center[0],
        latitude: item.center[1],
      },
    });
    setQuery(item.place_name);
    setResults([]); // Clear results after selection
  };

  return (
    <View className="flex-1">
      <TextInput
        className="mx-4 rounded-lg bg-gray-100 px-4 py-3"
        placeholder="Search for a location"
        value={query}
        onChangeText={handleTextChange}
      />

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          className="mx-4 mt-2"
          renderItem={({ item }) => (
            <Pressable
              className="border-b border-gray-200 py-3"
              onPress={() => handleSelectLocation(item)}>
              <Text className="text-base">{item.place_name}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
