import { View, Text } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import JourneyMap from '~/components/Maps/JourneyMap';
import { JourneyContext } from './_layout';
import { Camera } from '@rnmapbox/maps';
import LocationBottomSheet from '~/components/LocationBottomSheet';
import JourneyMapBottomSheet from '~/components/JourneyMapBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

export default function JourneyMapPage() {
  const { journey } = useContext(JourneyContext);
  const cameraRef = useRef<Camera>(null);
  const journeySheetRef = useRef<BottomSheet>(null);
  const locationSheetRef = useRef<BottomSheet>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const setLocation = (location: LocationInfo) => {
    setSelectedLocation(location);
    journeySheetRef.current?.close();
    locationSheetRef.current?.expand();
  };
  if (!journey) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <JourneyMap journey={journey} cameraRef={cameraRef} />
      <JourneyMapBottomSheet
        journey={journey}
        cameraRef={cameraRef}
        journeyRef={journeySheetRef}
        setLocation={setLocation}
      />
      <LocationBottomSheet
        location={selectedLocation}
        ref={locationSheetRef}
        journeyRef={journeySheetRef}
      />
    </>
  );
}
