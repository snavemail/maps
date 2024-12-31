import { View, Text, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCategoryStore } from '~/stores/useSearch';
import { calculateDistance } from '~/utils/MapBox';
import LocationMap from '~/components/Maps/LocationMap';
import { getLucideIconName } from '~/lib/utils';
import { useUserLocationStore } from '~/stores/useUserLocation';
import LinkItem from '~/components/SearchComponents/LinkItem';
import { useColorScheme } from 'nativewind';
import { LucideIcon } from '~/components/LucideIcon';

export default function SearchResultPage() {
  const { slug } = useLocalSearchParams();
  const { categories, currentCategory } = useCategoryStore();
  const currentResult = categories[currentCategory as string].results.find(
    (result) => result.properties.mapbox_id === slug
  );

  const userLocation = useUserLocationStore((state) => state.userLocation);
  const { colorScheme } = useColorScheme();
  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <Stack.Screen options={{ title: currentResult?.properties.name }} />
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
        <View
          className="rounded-t-3xl bg-background p-6 dark:bg-background-dark"
          style={{ marginTop: -5 }}>
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-text dark:text-text-dark">
                {currentResult?.properties.name}
              </Text>
              <Text className="mt-1 text-base text-gray dark:text-gray-dark">
                {currentResult?.properties.place_formatted}
              </Text>
            </View>
            <View className="ml-2">
              <LucideIcon
                iconName={
                  currentResult?.properties.poi_category[0] === 'outdoors'
                    ? getLucideIconName('park')
                    : getLucideIconName(currentResult?.properties.maki || 'map-marker')
                }
                size={24}
                color={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
              />
            </View>
          </View>
          <View className="flex-row justify-between rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
            {currentResult?.properties.metadata?.open_hours && (
              <View>
                <Text className="text-xs text-gray dark:text-gray-dark">Hours Today</Text>
                {(() => {
                  const now = new Date();
                  const day = now.getDay();
                  const hours = currentResult.properties.metadata.open_hours.periods[day];
                  if (!hours) return null;
                  return (
                    <Text className="text-sm font-medium text-text dark:text-text-dark">
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
                    <Text className="text-xs text-gray dark:text-gray-dark">Distance</Text>
                    <Text className="text-sm font-medium text-text dark:text-text-dark">
                      {distance.toFixed(1)} miles
                    </Text>
                  </View>
                );
              }
              return null;
            })()}
          </View>
        </View>
      </View>

      <View className="bg-background p-6 dark:bg-background-dark">
        {currentResult?.properties.metadata?.open_hours && (
          <View className="mb-6 rounded-xl border-2 border-gray-200 bg-background p-4 dark:bg-background-dark">
            <Text className="mb-3 text-xl font-bold text-text dark:text-text-dark">
              Hours of Operation
            </Text>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
              (dayName, index) => {
                const hours = currentResult.properties.metadata?.open_hours?.periods[index];
                const isToday = index === new Date().getDay();
                return (
                  <View
                    key={dayName}
                    className={`mb-2 flex-row justify-between ${isToday ? 'rounded-lg bg-gray-200 px-1 py-2 dark:bg-gray-700' : ''}`}>
                    <Text className={`${isToday && 'font-bold'} text-gray-700 dark:text-gray-dark`}>
                      {dayName}
                    </Text>
                    {hours ? (
                      <Text className="text-gray-700 dark:text-gray-dark">
                        {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                        {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                      </Text>
                    ) : (
                      <Text className="text-gray dark:text-gray-dark">Closed</Text>
                    )}
                  </View>
                );
              }
            )}
          </View>
        )}

        <View className="mb-6 rounded-xl border-2 border-gray-200 bg-background p-4 dark:bg-background-dark">
          <Text className="mb-3 text-xl font-bold text-text dark:text-text-dark">
            Location Details
          </Text>
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
