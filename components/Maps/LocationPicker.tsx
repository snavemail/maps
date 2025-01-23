import React, { useRef, useState } from 'react';
import { Camera, MarkerView, MapView, LocationPuck } from '@rnmapbox/maps';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { X } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferenceStore } from '~/stores/usePreferences';
import JourneyMapButton from '../Buttons/JourneyMapButton';
import { centerOnLocation } from '~/utils/MapBox';
import { useUserLocationStore } from '~/stores/useUserLocation';

interface LocationPickerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelected: (location: { latitude: number; longitude: number; address?: string }) => void;
  onClose: () => void;
}

export default function LocationPicker({
  initialLocation,
  onLocationSelected,
  onClose,
}: LocationPickerProps) {
  const [markerLocation, setMarkerLocation] = useState(
    initialLocation || {
      latitude: 0,
      longitude: 0,
    }
  );
  const [cameraPosition, setCameraPosition] = useState({
    centerCoordinate: [initialLocation?.longitude || 0, initialLocation?.latitude || 0],
    zoomLevel: 13,
  });
  const userLocation = useUserLocationStore((state) => state.userLocation);

  const cameraRef = useRef<Camera>(null);
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const insets = useSafeAreaInsets();

  const handleMapPress = async (event: any) => {
    const coordinates = event.geometry.coordinates;
    setMarkerLocation({
      latitude: coordinates[1],
      longitude: coordinates[0],
    });
    cameraRef.current?.flyTo([coordinates[0], coordinates[1]], 500);
  };

  const confirmLocation = async () => {
    try {
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      });

      if (addressResult) {
        const fullAddress = [
          addressResult.street,
          addressResult.city,
          addressResult.region,
          addressResult.country,
        ]
          .filter(Boolean)
          .join(', ');

        onLocationSelected({
          ...markerLocation,
          address: fullAddress,
        });
      } else {
        onLocationSelected(markerLocation);
      }
      onClose();
    } catch (error) {
      console.error('Error getting address:', error);
      onLocationSelected(markerLocation);
      onClose();
    }
  };

  function centerOnCoord(): void {
    cameraRef.current?.setCamera({
      centerCoordinate: [markerLocation.longitude, markerLocation.latitude],
      zoomLevel: 13,
    });
  }

  return (
    <>
      <View className="absolute right-8 top-16 z-50 items-center gap-4"></View>
      <View className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-background dark:bg-background-dark">
        <View className="relative h-full w-full">
          <MapView
            style={{ flex: 1 }}
            styleURL={mapTheme}
            onPress={handleMapPress}
            scaleBarEnabled={false}>
            <Camera
              ref={cameraRef}
              {...cameraPosition}
              animationMode="flyTo"
              animationDuration={0}
            />
            <LocationPuck
              puckBearingEnabled
              puckBearing="heading"
              pulsing={{ isEnabled: true, color: '#0fa00f' }}
            />

            <MarkerView coordinate={[markerLocation.longitude, markerLocation.latitude]}>
              <View className="items-center">
                <FontAwesome name="map-marker" size={40} color="#FF0000" />
              </View>
            </MarkerView>
          </MapView>
          <View className="absolute right-8 top-16 z-50 items-center gap-4">
            <JourneyMapButton iconName="X" onPress={onClose} />
            {userLocation && (
              <JourneyMapButton
                iconName="LocateFixed"
                onPress={() => {
                  centerOnLocation({
                    location: {
                      latitude: userLocation.lat,
                      longitude: userLocation.lon,
                    },
                    cameraRef,
                  });
                }}
              />
            )}
            <JourneyMapButton iconName="MapPin" onPress={centerOnCoord} />
          </View>

          {/* Confirm Button */}
          <View className="absolute bottom-8 left-0 right-0 items-center">
            <Pressable
              onPress={confirmLocation}
              className="rounded-full bg-primary px-6 py-3 dark:bg-primary-dark"
              style={{
                marginTop: insets.bottom,
              }}>
              <Text className="text-white">Set Location</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}
