import { Pressable } from 'react-native';
import React from 'react';
import { useRouter, useSegments } from 'expo-router';

export default function ToJourneyMapButton({
  children,
  journeyID,
}: {
  children: React.ReactNode;
  journeyID: string;
}) {
  const segments = useSegments();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        segments[1] === 'journeys' &&
          router.push(`/(tabs)/${segments[1]}/journey/${journeyID}/map`);
      }}>
      {children}
    </Pressable>
  );
}
