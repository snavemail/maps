import { View, Text } from 'react-native';
import React from 'react';
import { LucideIcon } from '~/components/LucideIcon';
import * as LucideIcons from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function StatItem({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: keyof typeof LucideIcons;
  label: string;
  value: number;
  subtitle?: string;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-col items-center gap-2 px-4 py-2">
      <View className="flex-row items-center gap-2">
        <LucideIcon iconName={icon} size={18} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
        <Text className="font-sans text-stats-value text-black dark:text-white">{value}</Text>
      </View>
      <View className="flex-col items-center gap-2">
        <Text className="-mt-1 font-sans text-caption text-text-secondary dark:text-text-dark-secondary">
          {label}
        </Text>
        {subtitle && (
          <Text className="-mt-2 font-sans text-caption text-text-tertiary dark:text-text-dark-tertiary">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
