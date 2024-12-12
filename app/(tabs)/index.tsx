import { Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import BottomSheetScrollable from '~/components/BottomSheet';
import Map from '~/components/Map';

export default function Home() {
  return (
    <>
      <Map />
      <BottomSheetScrollable />
    </>
  );
}
