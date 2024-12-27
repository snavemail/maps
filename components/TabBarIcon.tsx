import React from 'react';
import { View } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from './LucideIcon';

type IconProps = {
  iconName: keyof typeof LucideIcons;
  focused: boolean;
  size?: number;
};

export const TabBarIcon: React.FC<IconProps> = ({ iconName, focused, size = 24 }: IconProps) => {
  return (
    <View>
      <LucideIcon
        iconName={iconName}
        width={size}
        height={size}
        color={focused ? '#0f58a0' : 'gray'}
        strokeWidth={focused ? 2.25 : 2}
      />
    </View>
  );
};
