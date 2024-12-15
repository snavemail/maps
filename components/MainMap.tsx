import React from 'react';
import Mapbox, { Camera, LocationPuck, MapView, StyleURL } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import MapMarker from './MapMarker';
import { View, Pressable, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getCurrentLocation, getTitle } from '~/lib/utils';

export default function MainMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const startJourney = useJourneyStore((state) => state.startJourney);
  const locations = draftJourney?.locations || [];

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      {!draftJourney && (
        <View className="absolute bottom-8 right-8 z-50 active:scale-90 ">
          <Pressable
            disabled={draftJourney}
            hitSlop={10}
            onPress={async () => {
              const address = await getCurrentLocation();
              if (!address) return;
              const title = getTitle({ isJourney: true, address: address.address });
              startJourney(title);
            }}
            className="flex flex-row items-center justify-center gap-2 rounded-full bg-white p-4">
            <FontAwesome name="plus-circle" size={19} color="black" />
            <Text className="text-black">Start Journey</Text>
          </Pressable>
        </View>
      )}

      <MapView
        style={{ flex: 1 }}
        tintColor={'red'}
        styleURL={StyleURL.Dark}
        logoEnabled={false}
        compassEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ top: 8, left: 8 }}
        scaleBarEnabled={false}>
        <Camera followUserLocation followZoomLevel={13} animationMode="none" />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: 'red' }}
        />
        {locations.map((location) => (
          <MapMarker key={location.id} location={location} />
        ))}
      </MapView>
    </>
  );
}
