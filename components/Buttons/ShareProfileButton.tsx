import { Text, Share, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function ShareProfileButton({ user }: { user: any }) {
  const handleShare = async () => {
    try {
      const result = await Share.share(
        {
          title: `${user.firstName} ${user.lastName}'s Profile`,
          message: `Check out ${user.firstName}'s adventures on Journey!\n\n${user.bio}\n\n${user.stats.journeysCount} Journeys • ${user.stats.totalPhotos} Photos\n\nDownload Journey to see more.`,
          url: `http://192.168.1.232:8081?profile=${user.id}`,
        },
        {
          subject: `${user.firstName} ${user.lastName}'s Journey Profile`,
          dialogTitle: 'Share Profile',
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result);
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      className="flex-1 flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2 active:bg-gray-200"
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}
      onPress={handleShare}>
      <FontAwesome name="share" size={16} color="black" className="mr-2" />
      <Text className="font-medium">Share</Text>
    </Pressable>
  );
}
