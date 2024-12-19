import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Map Mapbox maki icons to our icon set
const categoryIcons: Record<string, { icon: string; color: string; label: string }> = {
  restaurant: {
    icon: 'restaurant',
    color: '#ef4444', // red
    label: 'Restaurant',
  },
  cafe: {
    icon: 'cafe',
    color: '#84583e', // coffee brown
    label: 'Café',
  },
  bar: {
    icon: 'wine-bar',
    color: '#8b5cf6', // purple
    label: 'Bar',
  },
  shop: {
    icon: 'shopping-bag',
    color: '#f59e0b', // amber
    label: 'Shop',
  },
  hotel: {
    icon: 'hotel',
    color: '#10b981', // emerald
    label: 'Hotel',
  },
  marker: {
    icon: 'place',
    color: '#3b82f6', // blue
    label: 'Place',
  },
  museum: {
    icon: 'museum',
    color: '#059669',
    label: 'Museum',
  },
  park: {
    icon: 'park',
    color: '#34d399',
    label: 'Park',
  },
  nature_reserve: {
    icon: 'tree',
    color: '#22c55e',
    label: 'Nature Reserve',
  },
};

// Function to determine category display info
const getCategoryInfo = (maki?: string, featureType?: string) => {
  if (maki && categoryIcons[maki]) {
    return categoryIcons[maki];
  }

  // Fallback based on feature type
  if (featureType === 'address') {
    return {
      icon: 'home',
      color: '#6366f1', // indigo
      label: 'Address',
    };
  }

  return categoryIcons.marker; // Default
};

export default function SearchResult({ location }: { location: LocationResult }) {
  const router = useRouter();
  const categoryInfo = getCategoryInfo(location.properties.maki, location.properties.feature_type);

  const handlePress = () => {
    console.log('Pressed', location.geometry.coordinates, location.properties.mapbox_id);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mx-4 my-2 overflow-hidden rounded-xl bg-white shadow-md">
      <View
        className="absolute right-4 top-4 rounded-full px-2 py-1"
        style={{ backgroundColor: `${categoryInfo.color}20` }}>
        <Text style={{ color: categoryInfo.color }} className="text-xs font-medium">
          {categoryInfo.label}
        </Text>
      </View>

      <View className="flex-row items-start gap-4 p-4">
        <View
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${categoryInfo.color}15` }}>
          <MaterialIcons name={categoryInfo.icon as any} size={24} color={categoryInfo.color} />
        </View>

        {/* Right side - Location Information */}
        <View className="flex-1 pr-20">
          <Text className="text-lg font-semibold text-gray-900">{location.properties.name}</Text>
          {location.properties.context.neighborhood && (
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={12} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600">
                {location.properties.context.neighborhood.name}
              </Text>
            </View>
          )}
          {/* City, State */}
          <View className="mt-1 flex-row items-center">
            <Ionicons name="navigate-outline" size={12} color="#6b7280" />
            <Text className="ml-1 text-sm text-gray-600">
              {location.properties.context.place.name},{' '}
              {location.properties.context.region?.name || ''}
            </Text>
          </View>
          {/* Distance or Additional Info Banner */}
          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={14} color={categoryInfo.color} />
              <Text className="ml-1 text-sm" style={{ color: categoryInfo.color }}>
                View Details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={categoryInfo.color} />
          </View>
        </View>
      </View>

      {/* Bottom Accent Bar */}
      <View
        className="h-1 bg-gradient-to-r"
        style={{
          backgroundImage: `linear-gradient(to right, ${categoryInfo.color}, ${categoryInfo.color}dd)`,
        }}
      />
    </Pressable>
  );
}
