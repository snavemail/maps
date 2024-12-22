import { View, Text } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function StatItem({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <View className="items-center px-2 py-1">
      <FontAwesome name={icon} size={20} color="#374151" />
      <Text className="mt-1 text-2xl font-bold">{value}</Text>
      <Text className="text-sm text-gray-600">{label}</Text>
      {subtitle && <Text className="text-xs text-gray-400">{subtitle}</Text>}
    </View>
  );
}
