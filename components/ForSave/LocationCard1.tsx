import { View, Text, Linking, Pressable, Platform, Alert } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import LocationMap from '../LocationMap';
import { results } from '~/data/poi';
import { getIconName } from '~/lib/utils';
function LocationCard1() {
  const currentResult = results[0];
  return (
    <View className="p-4">
      <View className="overflow-hidden rounded-xl border border-gray-200">
        <View className="h-40">
          <LocationMap
            logoEnabled={true}
            animationDuration={0}
            location={{
              coordinates: {
                longitude: currentResult?.geometry.coordinates[0],
                latitude: currentResult?.geometry.coordinates[1],
              },
              hideLocation: false,
              id: currentResult?.properties.mapbox_id,
            }}
          />
        </View>
        <View className="bg-white p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                {currentResult?.properties.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {currentResult?.properties.place_formatted}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {currentResult?.properties.metadata?.phone && (
                <Pressable
                  onPress={() => Linking.openURL(`tel:${currentResult.properties.metadata.phone}`)}
                  className="rounded-full bg-blue-500 p-2">
                  <FontAwesome name="phone" size={16} color="white" />
                </Pressable>
              )}
              {currentResult?.geometry.coordinates && (
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&destination=${currentResult.geometry.coordinates[1]},${currentResult.geometry.coordinates[0]}`
                    )
                  }
                  className="rounded-full bg-blue-500 p-2">
                  <FontAwesome name="map" size={16} color="white" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function LocationCard2() {
  const currentResult = results[0];
  return (
    <View className="relative h-72">
      <LocationMap
        logoEnabled={true}
        animationDuration={0}
        location={{
          coordinates: {
            longitude: currentResult?.geometry.coordinates[0],
            latitude: currentResult?.geometry.coordinates[1],
          },
          hideLocation: false,
          id: currentResult?.properties.mapbox_id,
        }}
      />
      <View className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">{currentResult?.properties.name}</Text>
          <FontAwesome
            name={getIconName(currentResult?.properties.maki || 'map-marker')}
            size={28}
            color="#4B5563"
          />
        </View>
        <Text className="text-base text-gray-600">{currentResult?.properties.place_formatted}</Text>
      </View>
    </View>
  );
}

function LocationCard3() {
  const currentResult = results[0];
  return (
    <View className="p-4">
      <View className="rounded-2xl bg-white p-6 shadow-lg">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              {currentResult?.properties.name}
            </Text>
            <View className="mt-2 flex-row items-center">
              {currentResult?.properties.metadata?.open_hours && (
                <View className="mr-4">
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const hours = currentResult.properties.metadata.open_hours.periods[day];
                    const currentTime = now.getHours() * 100 + now.getMinutes();
                    if (!hours) return null;
                    const openTime = parseInt(hours.open.time);
                    const closeTime = parseInt(hours.close.time);
                    const isOpen = currentTime >= openTime && currentTime < closeTime;
                    return (
                      <View className="flex-row items-center">
                        <View
                          className={`mr-2 h-2 w-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <Text
                          className={`text-sm font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                          {isOpen ? 'Open Now' : 'Closed'}
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              )}
              <FontAwesome
                name={getIconName(currentResult?.properties.maki || 'map-marker')}
                size={20}
                color="#6B7280"
              />
            </View>
          </View>
        </View>
        <LocationMap
          logoEnabled={true}
          animationDuration={0}
          location={{
            coordinates: {
              longitude: currentResult?.geometry.coordinates[0],
              latitude: currentResult?.geometry.coordinates[1],
            },
            hideLocation: false,
            id: currentResult?.properties.mapbox_id,
          }}
        />
        <Text className="mb-4 text-gray-600">{currentResult?.properties.place_formatted}</Text>
        <View className="flex-row justify-between">
          {currentResult?.properties.metadata?.phone && (
            <Pressable
              onPress={() => Linking.openURL(`tel:${currentResult.properties.metadata.phone}`)}
              className="mr-2 flex-1 rounded-lg bg-blue-500 p-3">
              <Text className="text-center font-medium text-white">Call</Text>
            </Pressable>
          )}
          {currentResult?.geometry.coordinates && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${currentResult.geometry.coordinates[1]},${currentResult.geometry.coordinates[0]}`
                )
              }
              className="ml-2 flex-1 rounded-lg bg-blue-500 p-3">
              <Text className="text-center font-medium text-white">Directions</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function LocationCard4() {
  const currentResult = results[0];
  return (
    <View className="p-4">
      <View className="rounded-2xl bg-white p-6 shadow-lg">
        <LocationMap
          logoEnabled={true}
          animationDuration={0}
          location={{
            coordinates: {
              longitude: currentResult?.geometry.coordinates[0],
              latitude: currentResult?.geometry.coordinates[1],
            },
            hideLocation: false,
            id: currentResult?.properties.mapbox_id,
          }}
        />
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-gray-900">
              {currentResult?.properties.name}
            </Text>
            <FontAwesome
              name={getIconName(currentResult?.properties.maki || 'map-marker')}
              size={32}
              color="#4B5563"
            />
          </View>
          <Text className="text-lg text-gray-600">{currentResult?.properties.place_formatted}</Text>
        </View>
        <View className="mb-6 flex-row">
          <View className="flex-1 border-r border-gray-200 pr-4">
            <Text className="mb-2 text-sm font-medium text-gray-500">Hours Today</Text>
            {currentResult?.properties.metadata?.open_hours &&
              (() => {
                const now = new Date();
                const day = now.getDay();
                const hours = currentResult.properties.metadata.open_hours.periods[day];
                if (!hours) return <Text className="text-lg font-medium text-red-500">Closed</Text>;
                return (
                  <Text className="text-lg font-medium text-gray-900">
                    {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                    {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                  </Text>
                );
              })()}
          </View>
          <View className="flex-1 pl-4">
            <Text className="mb-2 text-sm font-medium text-gray-500">Categories</Text>
            <View className="flex-row flex-wrap gap-2">
              {currentResult?.properties.poi_category?.map((category, index) => (
                <Text key={index} className="text-lg font-medium capitalize text-gray-900">
                  {category}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View className="flex-row gap-4">
          {currentResult?.properties.metadata?.phone && (
            <Pressable
              onPress={() => Linking.openURL(`tel:${currentResult.properties.metadata.phone}`)}
              className="flex-1 rounded-xl bg-blue-500 p-4">
              <Text className="text-center text-lg font-medium text-white">Call Business</Text>
            </Pressable>
          )}
          {currentResult?.geometry.coordinates && (
            <Pressable
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Alert.alert(
                    'Choose Navigation App',
                    'Which app would you like to use for directions?',
                    [
                      {
                        text: 'Apple Maps',
                        onPress: () => {
                          Linking.openURL(
                            `maps://0,0?q=${currentResult.geometry.coordinates[1]},${currentResult.geometry.coordinates[0]}`
                          );
                        },
                      },
                      {
                        text: 'Google Maps',
                        onPress: () => {
                          Linking.openURL(
                            `https://www.google.com/maps/dir/?api=1&destination=${currentResult.geometry.coordinates[1]},${currentResult.geometry.coordinates[0]}`
                          );
                        },
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ]
                  );
                } else {
                  Linking.openURL(
                    `https://www.google.com/maps/dir/?api=1&destination=${currentResult.geometry.coordinates[1]},${currentResult.geometry.coordinates[0]}`
                  );
                }
              }}
              className="flex-1 rounded-xl bg-blue-500 p-4">
              <Text className="text-center text-lg font-medium text-white">Get Directions</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
