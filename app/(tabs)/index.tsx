import MapBottomSheet from '~/components/MainMapBottomSheet/MainMapBottomSheet';
import MainMap from '~/components/MainMap';
import { useState } from 'react';
import AddLocationForm from '~/components/AddLocationForm/AddLocationForm';
import React from 'react';
import { Stack } from 'expo-router';

export default function Home() {
  const [locationFormData, setLocationFormData] = useState<{
    visible: boolean;
    locationID?: string;
  }>({
    visible: false,
    locationID: undefined,
  });

  const handleShowModal = (locationID?: string) => {
    if (locationFormData.visible) {
      setLocationFormData({ visible: false, locationID });
      return;
    }
    setTimeout(() => {
      setLocationFormData({ visible: true, locationID });
    }, 100);
  };

  const hideLocationForm = () => {
    setLocationFormData({ visible: false, locationID: undefined });
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <MainMap />
      <MapBottomSheet showModal={handleShowModal} />
      <AddLocationForm
        visible={locationFormData.visible}
        locationID={locationFormData.locationID}
        onClose={hideLocationForm}
      />
    </>
  );
}
