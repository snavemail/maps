import { View, Text } from 'react-native';
import React from 'react';
import { LucideIcon } from '~/components/LucideIcon';
import * as LucideIcons from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof LucideIcons;
  label: string;
  value: number;
  color: string;
}) {
  const { colorScheme } = useColorScheme();

  const getColor = () => {
    switch (color) {
      case 'red':
        return colorScheme === 'light' ? '#ef4444' : '#fb7185';
      case 'pink':
        return colorScheme === 'light' ? '#f87171' : '#ef4444';
      case 'green':
        return colorScheme === 'light' ? '#4ADE80' : '#22c55e';
      case 'orange':
        return colorScheme === 'light' ? '#fb923c' : '#f97316';
      case 'purple':
        return colorScheme === 'light' ? '#A78BFA' : '#8B5CF6';
      default:
        return colorScheme === 'light' ? '#000' : '#fff';
    }
  };

  return (
    <View
      className="flex-row items-center px-2 py-3"
      style={{ backgroundColor: colorScheme === 'dark' ? '#111' : '#f5f5f5' }}>
      <View className="flex-row items-center justify-center gap-2 px-2">
        <LucideIcon iconName={icon} size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
      </View>
      <Text className="flex-1 font-sans text-stats-label text-black dark:text-white">{label}</Text>
      <Text className="px-2 font-sans text-stats-value text-black dark:text-white">{value}</Text>
    </View>
  );
}
