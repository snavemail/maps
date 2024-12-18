import MapBottomSheet from '~/components/MainMapBottomSheet/MainMapBottomSheet';
import MainMap from '~/components/MainMap';
import React from 'react';

export default function Home() {
  return (
    <>
      <MainMap />
      <MapBottomSheet />
    </>
  );
}
