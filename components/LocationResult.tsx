import { View, Text } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LocationResult({ location }: { location: any }) {
  return (
    <View className="flex flex-row">
      <View className="flex w-[10%] items-center justify-center">
        <FontAwesome name={'map-marker'} size={20} color="black" />
      </View>
      <View className="p-3">
        <Text>
          {location.name}, {location.context.region.name},{' '}
          {location.context.country.country_code_alpha_3}
        </Text>
      </View>
    </View>
  );
}
