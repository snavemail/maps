import { Pressable } from 'react-native';
import React from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function ToProfileButton({
  children,
  profileID,
}: {
  children: React.ReactNode;
  profileID: string;
}) {
  const segments = useSegments();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        (segments[1] === 'home' || segments[1] === 'journeys' || segments[1] === 'me') &&
          router.push(`/(tabs)/${segments[1]}/profile/${profileID}`);
      }}>
      {children}
    </Pressable>
  );
}
