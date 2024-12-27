import { Pressable } from 'react-native';
import React from 'react';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from '~/components/LucideIcon';

export default function JourneyMapButton({
  onPress,
  iconName,
  iconSize = 24,
}: {
  onPress: () => void;
  iconName: keyof typeof LucideIcons;
  iconSize?: number;
}) {
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const iconColorUsed = isDarkTheme ? '#fff' : '#000';
  return (
    <Pressable
      onPress={onPress}
      className="rounded-full border-2 border-white bg-white p-2 shadow-2xl shadow-black active:scale-95">
      <LucideIcon iconName={iconName} size={iconSize} color={iconColorUsed} strokeWidth={2} />
    </Pressable>
  );
}
