import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

export default function JourneyMapButton({
  onPress,
  iconName,
  iconSize = 30,
  iconColor = '#000',
}: {
  onPress: () => void;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  iconSize?: number;
  iconColor?: string;
}) {
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const iconColorUsed = isDarkTheme ? '#fff' : '#000';
  return (
    <Pressable onPress={onPress} className="active:scale-95">
      <FontAwesome name={iconName} size={iconSize} color={iconColorUsed} />
    </Pressable>
  );
}
