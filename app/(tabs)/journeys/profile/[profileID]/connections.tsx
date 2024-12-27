import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { ProfileContext } from './_layout';

export default function Follows() {
  const { profile } = useContext(ProfileContext);

  return (
    <View>
      <Text>follows</Text>
    </View>
  );
}
