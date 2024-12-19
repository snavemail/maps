import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchBar from '~/components/SearchBar';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import uuid from 'react-native-uuid';
import { useDebounce } from '~/hooks/hooks';
import axios from 'axios';
import LocationResult from '~/components/LocationResult';

export default function Search() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string | 'Current Location'>(
    'Current Location'
  );
  const debouncedLocation = useDebounce(searchLocation, 500);
  const [searchCoords, setSearchCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    setSessionToken(uuid.v4());
  }, []);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setSearchCoords({ lat: location.coords.latitude, lon: location.coords.longitude });
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const testPrint = setTimeout(() => {
      if (focusedInput === 'poi') {
        console.log(`Searching for POI: ${searchQuery}`);
      }
    }, 1000);
    return () => clearTimeout(testPrint);
  }, [searchQuery]);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      const response = await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest`, {
        params: {
          q: debouncedLocation,
          access_token: accessToken,
          session_token: sessionToken,
          limit: 10,
          types: 'place',
        },
      });
      console.log(JSON.stringify(response.data, null, 2));
      setLocationResults(response.data.suggestions);
      setLoading(false);
    };

    if (debouncedLocation && debouncedLocation !== 'Current Location') {
      fetchLocations();
    }
  }, [debouncedLocation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="min-h-full border-2 p-3">
        <View className="flex flex-col gap-1">
          <View className="flex flex-row items-center rounded-lg border-[1px] border-black">
            <View className="flex w-[10%] items-center justify-center">
              <FontAwesome className="p-3" name={'search'} size={18} color="black" />
            </View>
            <TextInput
              className="flex-1 p-3"
              placeholder={'POI'}
              clearButtonMode="always"
              autoComplete="off"
              onFocus={() => setFocusedInput('poi')}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          <View className="flex flex-row items-center rounded-lg border-[1px] border-black">
            <View className="flex w-[10%] items-center justify-center">
              <FontAwesome className="p-3" name={'map-marker'} size={20} color="black" />
            </View>
            <TextInput
              className="flex-1 p-3"
              placeholder={'City'}
              clearButtonMode="always"
              autoComplete="off"
              onFocus={() => {
                setFocusedInput('location');
                setSearchLocation('');
              }}
              onChangeText={(text) => setSearchLocation(text)}
              value={searchLocation}
              onBlur={() => {
                if (!searchLocation.trim()) {
                  setSearchLocation('Current Location');
                }
              }}
            />
          </View>
        </View>
        {focusedInput === 'location' && (
          <FlatList
            data={locationResults}
            ListHeaderComponent={() => (
              <>
                <View>
                  <Text className="mt-3 text-lg font-bold">Locations</Text>
                </View>
                <View className="flex flex-row">
                  <View className="flex w-[10%] items-center justify-center">
                    <FontAwesome name={'map-marker'} size={20} color="black" />
                  </View>
                  <View className="p-3">
                    <Text>Current Location</Text>
                  </View>
                </View>
                {locationResults && <View className="border-t-[1px] border-black" />}
              </>
            )}
            keyExtractor={(item) => item.mapbox_id}
            renderItem={({ item }) => <LocationResult location={item} />}
            ItemSeparatorComponent={() => <View className="border-t-[1px] border-black" />}
          />
        )}
        {focusedInput === 'poi' && searchResults.length > 0 && (
          <View>
            <Text className="mt-3 text-lg font-bold">Recent Searches</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
