import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function Journey() {
  const { slug } = useLocalSearchParams();
  return (
    <View>
      <Text>Journey: {slug}</Text>
    </View>
  );
}
