import React, { useState, useMemo, useEffect } from 'react';
import Mapbox, { Camera, MapView, LocationPuck } from '@rnmapbox/maps';
import { View } from 'react-native';
import { usePreferenceStore } from '~/stores/usePreferences';
import LineSegment from './LineSegment';
import { getBounds, sameLocation } from '~/utils/MapBox';

interface BaseMapProps {
  locations?: Array<LocationInfo | DraftLocation>;
  initialLocation?: {
    longitude: number;
    latitude: number;
  };
  children?: React.ReactNode;
  cameraRef?: React.RefObject<Camera>;
  onCameraChanged?: (e: any) => void;
  showLocationPuck?: boolean;
  showLine?: boolean;
  interactive?: boolean;
  projection?: 'globe' | 'mercator';
  onMapLoaded?: () => void;
  className?: string;
  animationDuration?: number;
  logoEnabled?: boolean;
}

export default function BaseMap({
  locations = [],
  initialLocation,
  children,
  cameraRef,
  onCameraChanged,
  showLocationPuck = false,
  showLine = true,
  interactive = true,
  projection = 'mercator',
  onMapLoaded,
  className = 'flex-1',
  animationDuration = 800,
  logoEnabled = true,
}: BaseMapProps) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const [loaded, setLoaded] = useState(false);

  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Please provide a Mapbox access token');
  Mapbox.setAccessToken(accessToken);

  // Remove this early return - it was causing issues
  // if (locations.length === 0) {
  //   return;
  // }

  const sortedLocations = useMemo(() => {
    return locations.length > 0
      ? locations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : [];
  }, [locations]);

  const coordinates = useMemo(() => {
    return sortedLocations.map((location) => [
      location.coordinates.longitude,
      location.coordinates.latitude,
    ]);
  }, [sortedLocations]);

  const bounds = useMemo(
    () => (coordinates.length > 0 ? getBounds({ coordinates }) : null),
    [coordinates]
  );

  const isSameLocation = sameLocation(locations);

  const initialCameraPosition = useMemo(() => {
    // Handle case when there are no locations but there is an initial location
    if (locations.length === 0 && initialLocation) {
      return {
        centerCoordinate: [initialLocation.longitude, initialLocation.latitude],
        zoomLevel: 13,
      };
    }

    // Handle case when there are locations
    if (locations.length > 0) {
      if (isSameLocation) {
        return {
          centerCoordinate: [
            sortedLocations[0].coordinates.longitude,
            sortedLocations[0].coordinates.latitude,
          ],
          zoomLevel: 13,
        };
      } else if (bounds) {
        return {
          bounds: {
            ne: [bounds.maxLon, bounds.maxLat],
            sw: [bounds.minLon, bounds.minLat],
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 25,
            paddingBottom: 25,
          },
        };
      }
    }

    // Default camera position if nothing else applies
    return {
      centerCoordinate: [0, 0],
      zoomLevel: 1,
    };
  }, [locations, initialLocation, isSameLocation, bounds, sortedLocations]);

  useEffect(() => {
    if (loaded && cameraRef?.current && locations.length > 0) {
      if (isSameLocation) {
        cameraRef.current.setCamera({
          centerCoordinate: [
            sortedLocations[0].coordinates.longitude,
            sortedLocations[0].coordinates.latitude,
          ],
          zoomLevel: 13,
          animationDuration: 0,
        });
      } else if (bounds) {
        cameraRef.current.setCamera({
          bounds: {
            ne: [bounds.maxLon, bounds.maxLat],
            sw: [bounds.minLon, bounds.minLat],
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 25,
            paddingBottom: 25,
          },
          animationDuration: 0,
        });
      }
    }
  }, [loaded, isSameLocation, bounds, sortedLocations, locations]);

  return (
    <View className={className}>
      <MapView
        projection={projection}
        style={{ flex: 1 }}
        styleURL={mapTheme}
        logoEnabled={logoEnabled}
        compassEnabled={interactive}
        attributionEnabled={interactive}
        zoomEnabled={interactive}
        scrollEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        scaleBarEnabled={false}
        onCameraChanged={onCameraChanged}
        onDidFinishLoadingMap={() => {
          setLoaded(true);
          onMapLoaded?.();
        }}
        logoPosition={interactive ? { top: 64, left: 8 } : { bottom: 0, left: 0 }}
        attributionPosition={interactive ? { top: 80, left: 0 } : { bottom: 0, left: 100 }}>
        <Camera
          ref={cameraRef}
          animationMode="none"
          animationDuration={0}
          {...initialCameraPosition}
        />
        {showLocationPuck && (
          <LocationPuck
            puckBearingEnabled
            puckBearing="heading"
            pulsing={{ isEnabled: true, color: '#0fa00f' }}
          />
        )}
        {showLine && coordinates.length > 1 && <LineSegment coordinates={coordinates} />}
        {children}
      </MapView>
      {!interactive && (
        <View className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-transparent" />
      )}
    </View>
  );
}
