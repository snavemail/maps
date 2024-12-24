import React, { useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Results() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <SafeAreaView className="bg-white px-3">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="min-h-full py-2">
          <View className="flex flex-row items-center gap-2">
            <TextInput
              ref={inputRef}
              placeholder="Search"
              className="flex-1 rounded-lg border-2 border-black p-3"
            />
            <Pressable onPress={() => router.replace('/(tabs)/explore')}>
              <Text>Back</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
