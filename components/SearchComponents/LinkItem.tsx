import React, { useState } from 'react';
import { View, Text, Pressable, Linking, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useColorScheme } from 'nativewind';

const LinkItem = ({
  url,
  iconName,
  displayText,
}: {
  url: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  displayText: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const { colorScheme } = useColorScheme();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      onLongPress={handleCopy}
      delayLongPress={500}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        backgroundColor: isPressed
          ? colorScheme === 'dark'
            ? '#4f4f4f'
            : '#F3F4F6'
          : 'transparent',
        borderRadius: 10,
        padding: 4,
      }}>
      <View className="flex-row items-center gap-3">
        <View className="size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <FontAwesome
            name={iconName}
            size={16}
            color={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
          />
        </View>
        <Text
          className="flex-1 text-lg text-gray-700 dark:text-gray-200"
          numberOfLines={1}
          ellipsizeMode="tail">
          {displayText}
        </Text>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}>
          {copied ? (
            <Text className="text-sm text-green-500">Copied!</Text>
          ) : (
            <FontAwesome
              name="copy"
              size={12}
              color={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

export default LinkItem;
