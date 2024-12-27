import { View, Text } from 'react-native';
import React from 'react';
import { LucideIcon } from '~/components/LucideIcon';
import * as LucideIcons from 'lucide-react-native';

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
  return (
    <View className="flex-col items-center gap-2 px-4 py-2">
      <View className="flex-row items-center gap-2">
        <LucideIcon iconName={icon} size={18} color={'#000'} />
        <Text className="text-stats-value font-sans text-black dark:text-white">{value}</Text>
      </View>
      <View className="flex-col items-center gap-2">
        <Text className="text-caption text-text-secondary dark:text-text-dark-secondary -mt-1 font-sans">
          {label}
        </Text>
        {subtitle && (
          <Text className="text-caption text-text-tertiary dark:text-text-dark-tertiary -mt-2 font-sans">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
