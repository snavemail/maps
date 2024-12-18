import React, { useState } from 'react';
import { View, Text, Pressable, Linking, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
// import * as Haptics from 'expo-haptics';
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
  const [isPressed, setIsPressed] = useState(false); // Tracks press state for background
  const scaleAnim = new Animated.Value(1); // Animation scale for the copy icon

  const handleCopy = async () => {
    // Copy to clipboard
    await Clipboard.setStringAsync(url);
    setCopied(true);

    // Trigger haptic feedback
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset copied state after 1.5 seconds
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handlePressIn = () => {
    setIsPressed(true);

    // Trigger haptic feedback for press
    // Haptics.selectionAsync();

    // Start scale animation when pressed
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);

    // Revert scale animation when released
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
      delayLongPress={500} // Duration to trigger long press
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        backgroundColor: isPressed ? '#F3F4F6' : 'transparent', // Light gray on press
        borderRadius: 10, // Match rounded corners of the container
        padding: 4, // Adjust padding for feedback visibility
      }}>
      <View className="flex-row items-center gap-3">
        <View className="size-8 items-center justify-center rounded-full bg-gray-100">
          <FontAwesome name={iconName} size={16} color="#4B5563" />
        </View>
        <Text className="flex-1 text-lg text-gray-700" numberOfLines={1} ellipsizeMode="tail">
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
              color="#6B7280"
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
