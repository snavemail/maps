import { View, Text, FlatList, Pressable, Image } from 'react-native';
import React from 'react';
import { useNotifications } from '~/hooks/useNotifications';
import { router } from 'expo-router';
import { Check, X } from 'lucide-react-native';

export default function Notifications() {
  const { pendingRequests, respondToRequest } = useNotifications();
  return (
    <View className="bg-surface dark:bg-surface-dark flex-1">
      <FlatList
        data={pendingRequests}
        renderItem={({ item }) => (
          <View className="border-border dark:border-border-dark flex-row items-center justify-between border-b p-4">
            <Pressable
              className="flex-1 flex-row items-center"
              onPress={() => router.push(`/(tabs)/me/profile/${item.profile.id}`)}>
              <Image
                source={{ uri: item.profile.avatar_url ?? '' }}
                className="h-12 w-12 rounded-full"
              />
              <View className="ml-3 flex-1">
                <Text className="text-card-title text-text dark:text-text-dark font-sans">
                  {item.profile.first_name} {item.profile.last_name}
                </Text>
                <Text className="text-caption text-text-secondary dark:text-text-dark-secondary font-sans">
                  Requested to follow you
                </Text>
              </View>
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  console.log('accepting request', item.id);
                  respondToRequest({ requestId: item.id, accept: true });
                }}
                className="bg-success rounded-full p-2">
                <Check size={20} color="white" />
              </Pressable>
              <Pressable
                onPress={() => respondToRequest({ requestId: item.id, accept: false })}
                className="bg-danger rounded-full p-2">
                <X size={20} color="white" />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="p-4">
            <Text className="text-text-secondary dark:text-text-dark-secondary text-center">
              No pending follow requests
            </Text>
          </View>
        )}
      />
    </View>
  );
}
