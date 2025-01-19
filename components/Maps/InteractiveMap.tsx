import React from 'react';
import { View } from 'react-native';
import BaseMap from './BaseMap';
import JourneyMapButton from '../Buttons/JourneyMapButton';
import { centerOnLocation, centerOnCoordinates, getBounds } from '~/utils/MapBox';
import { PADDINGCONFIG } from '~/constants/mapbox';
import { Camera } from '@rnmapbox/maps';

interface InteractiveMapProps {
  locations?: Array<DraftLocation | LocationInfo>;
  userLocation?: {
    lat: number;
    lon: number;
  };
  cameraRef: React.RefObject<Camera>;
  onCameraChanged?: (e: any) => void;
  showLocationButton?: boolean;
  showCenterButton?: boolean;
  children?: React.ReactNode;
  onBackPress?: () => void;
  className?: string;
  showLocationPuck?: boolean;
}

export default function InteractiveMap({
  locations = [],
  userLocation,
  cameraRef,
  onCameraChanged,
  showLocationButton = true,
  showCenterButton = true,
  children,
  onBackPress,
  className,
  showLocationPuck = true,
}: InteractiveMapProps) {
  const bounds = getBounds({
    coordinates: locations.map((loc) => [loc.coordinates.longitude, loc.coordinates.latitude]),
  });

  const centerOnCoords = (animationDuration = 0) => {
    if (locations.length === 0) return;

    centerOnCoordinates({
      minLon: bounds.minLon,
      minLat: bounds.minLat,
      maxLon: bounds.maxLon,
      maxLat: bounds.maxLat,
      cameraRef,
      paddingConfig: PADDINGCONFIG,
      animationDuration,
    });
  };

  return (
    <>
      <View className="absolute right-8 top-16 z-50 items-center gap-4">
        {onBackPress && <JourneyMapButton iconName="X" onPress={onBackPress} />}
        {showLocationButton && userLocation && (
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
        {showCenterButton && (
          <JourneyMapButton iconName="MapPin" onPress={() => centerOnCoords(800)} />
        )}
      </View>

      <BaseMap
        locations={locations}
        initialLocation={
          userLocation ? { longitude: userLocation.lon, latitude: userLocation.lat } : undefined
        }
        cameraRef={cameraRef}
        onCameraChanged={onCameraChanged}
        showLocationPuck={showLocationPuck}
        className={className}>
        {children}
      </BaseMap>
    </>
  );
}
