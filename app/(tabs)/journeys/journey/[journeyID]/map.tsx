import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function JourneyMap() {
  const { journeyID } = useLocalSearchParams();
  console.log('journeyID', journeyID);
  return (
    <View>
      <Text>map</Text>
    </View>
  );
}
