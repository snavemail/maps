import { View, Text, Linking, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSearchStore } from '~/stores/useSearch';
import { results } from '~/data/poi';
import { FontAwesome } from '@expo/vector-icons';
import { Camera, MapView, PointAnnotation } from '@rnmapbox/maps';
import { calculateDistance } from '~/utils/MapBox';
import LocationMap from '~/components/LocationMap';
import { getIconName } from '~/lib/utils';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useUserLocationStore } from '~/stores/useUserLocation';
import LinkItem from '~/components/SearchComponents/LinkItem';

export default function SearchResultPage() {
  const { slug } = useLocalSearchParams();
  const currentResults = useSearchStore((state) => state.currentResults);
  const currentResult = results.find((result) => result.properties.mapbox_id === slug);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  return (
    <ScrollView className="flex-1 bg-white">
      <View>
        <View className="h-64">
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
        <View className="rounded-t-3xl bg-white p-6" style={{ marginTop: -5 }}>
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {currentResult?.properties.name}
              </Text>
              <Text className="mt-1 text-base text-gray-600">
                {currentResult?.properties.place_formatted}
              </Text>
            </View>
            <View className="ml-2">
              <FontAwesome
                name={getIconName(currentResult?.properties.maki || 'map-marker')}
                size={24}
                color="black"
              />
            </View>
          </View>
          <View className="flex-row justify-between rounded-lg bg-gray-50 p-4">
            {currentResult?.properties.metadata?.open_hours && (
              <View>
                <Text className="text-xs text-gray-500">Hours Today</Text>
                {(() => {
                  const now = new Date();
                  const day = now.getDay();
                  const hours = currentResult.properties.metadata.open_hours.periods[day];
                  if (!hours) return null;
                  return (
                    <Text className="text-sm font-medium">
                      {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                      {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                    </Text>
                  );
                })()}
              </View>
            )}
            {(() => {
              if (currentResult?.geometry.coordinates) {
                const [longitude, latitude] = currentResult.geometry.coordinates;
                const userLat = userLocation?.lat;
                const userLon = userLocation?.lon;
                if (!userLat || !userLon) return null;
                const distance = calculateDistance(userLat, userLon, latitude, longitude);
                return (
                  <View>
                    <Text className="text-xs text-gray-500">Distance</Text>
                    <Text className="text-sm font-medium">{distance.toFixed(1)} miles</Text>
                  </View>
                );
              }
              return null;
            })()}
          </View>
        </View>
      </View>

      <View className="bg-white p-6">
        {currentResult?.properties.metadata?.open_hours && (
          <View className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-4">
            <Text className="mb-3 text-xl font-bold text-gray-900">Hours of Operation</Text>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
              (dayName, index) => {
                const hours = currentResult.properties.metadata?.open_hours?.periods[index];
                const isToday = index === new Date().getDay();
                return (
                  <View
                    key={dayName}
                    className={`mb-2 flex-row justify-between ${isToday ? 'rounded-lg bg-blue-50 px-1 py-2' : ''}`}>
                    <Text className={`${isToday && 'font-bold'} text-gray-700`}>{dayName}</Text>
                    {hours ? (
                      <Text className="text-gray-600">
                        {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                        {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                      </Text>
                    ) : (
                      <Text className="text-gray-500">Closed</Text>
                    )}
                  </View>
                );
              }
            )}
          </View>
        )}

        <View className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-4">
          <Text className="mb-3 text-xl font-bold text-gray-900">Location Details</Text>
          <View className="gap-y-3">
            <LinkItem
              url={`https://www.google.com/maps/dir/?api=1&destination=${currentResult?.geometry.coordinates[1]},${currentResult?.geometry.coordinates[0]}`}
              iconName="map-marker"
              displayText={currentResult?.properties?.place_formatted || ''}
            />
            {currentResult?.properties.metadata?.phone && (
              <LinkItem
                url={`tel:${currentResult.properties.metadata.phone}`}
                iconName="phone"
                displayText={currentResult?.properties.metadata?.phone}
              />
            )}
            {currentResult?.properties.metadata?.website && (
              <LinkItem
                url={currentResult?.properties?.metadata?.website!}
                iconName="laptop"
                displayText={currentResult.properties.metadata.website}
              />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
