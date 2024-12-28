import { Pressable } from 'react-native';
import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from '~/components/LucideIcon';
import { useColorScheme } from 'nativewind';

export default function JourneyMapButton({
  onPress,
  iconName,
  iconSize = 24,
}: {
  onPress: () => void;
  iconName: keyof typeof LucideIcons;
  iconSize?: number;
}) {
  const { colorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full bg-background p-2.5 shadow-lg active:scale-95 dark:bg-background-dark`}
      style={{
        elevation: 6,
      }}>
      <LucideIcon
        iconName={iconName}
        size={iconSize}
        color={colorScheme === 'dark' ? '#fff' : '#000'}
        strokeWidth={2.25}
      />
    </Pressable>
  );
}
