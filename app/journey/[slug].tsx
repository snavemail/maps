import { View, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import JourneyMap from '~/components/Maps/JourneyMap';
import JourneyMapBottomSheet from '~/components/JourneyMapBottomSheet';
import { Camera } from '@rnmapbox/maps';
import LocationBottomSheet from '~/components/LocationBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { journeyService } from '~/services/journeyService';

export default function Journey() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState<JourneyWithProfile | null>(null);
  const cameraRef = useRef<Camera>(null);
  const journeySheetRef = useRef<BottomSheet>(null);
  const locationSheetRef = useRef<BottomSheet>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    async function fetchJourney() {
      const journey = await journeyService.getJourneyByID(slug as string);
      if (journey) {
        setJourney(journey);
      }
    }
    fetchJourney();
  }, [slug]);

  const setLocation = (location: any) => {
    setSelectedLocation(location);
    journeySheetRef.current?.close();
    setTimeout(() => {
      locationSheetRef.current?.expand();
    }, 100);
  };

  if (loading) {
    return <View>Loading...</View>;
  }

  if (!journey) {
    return <View>Not found</View>;
  }

  return (
    <>
      <View className={`z-0 flex min-h-full flex-1`}>
        <JourneyMap journey={journey} cameraRef={cameraRef} />
      </View>
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

      <Pressable onPress={() => router.dismiss()} className="absolute left-8 top-20 z-50">
        <FontAwesome name="close" size={30} color="white" />
      </Pressable>
    </>
  );
}
