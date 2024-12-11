import { View, Text, TextInput, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type SearchBarProps = {
  placeholder: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
};

export default function SearchBar({ placeholder, iconName }: SearchBarProps) {
  return (
    <View className="flex flex-row items-center rounded-lg border-[1px] border-black">
      <FontAwesome className="p-3" name={iconName} size={20} color="black" />
      <TextInput
        className="flex-1 p-3"
        placeholder={placeholder}
        clearButtonMode="always"
        autoComplete="off"
        onFocus={() => console.log('Focused')}
      />
    </View>
  );
}
