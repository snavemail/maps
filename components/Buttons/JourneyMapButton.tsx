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

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full bg-white/25 p-2.5 shadow-lg active:scale-95
        ${isDarkTheme ? 'shadow-black/25' : 'shadow-black/15'}`}
      style={{
        elevation: 6,
      }}>
      <LucideIcon
        iconName={iconName}
        size={iconSize}
        color={isDarkTheme ? '#1E293B' : '#0F172A'}
        strokeWidth={1.75}
      />
    </Pressable>
  );
}
