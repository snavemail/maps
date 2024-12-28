import React from 'react';
import { View } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from './LucideIcon';
import { useColorScheme } from 'nativewind';

type IconProps = {
  iconName: keyof typeof LucideIcons;
  focused: boolean;
  size?: number;
};

export const TabBarIcon: React.FC<IconProps> = ({ iconName, focused, size = 24 }: IconProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-1">
      <LucideIcon
        iconName={iconName}
        width={size}
        height={size}
        color={
          focused
            ? colorScheme === 'dark'
              ? '#38BDF8'
              : '#0f58a0'
            : colorScheme === 'dark'
              ? '#ccc'
              : '#444'
        }
        strokeWidth={focused ? 2.25 : 2}
      />
    </View>
  );
};
