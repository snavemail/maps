import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, View, ActivityIndicator, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { followService } from '~/services/followService';
import { useAuthStore } from '~/stores/useAuth';

function getTextStyle(status: string) {
  switch (status) {
    case 'following':
      return 'text-primary';
    case 'pending':
      return 'text-primary';
    default:
      return 'text-white';
  }
}

function getButtonStyle(status: string) {
  switch (status) {
    case 'following':
      return 'bg-secondary-50 dark:bg-secondary-dark-100 border border-primary dark:border-primary-dark';
    case 'pending':
      return 'bg-secondary-100 dark:bg-secondary-dark-200';
    default:
      return 'bg-primary dark:bg-primary-dark';
  }
}

function getButtonText(status: string, isPublic: boolean) {
  switch (status) {
    case 'following':
      return 'Following';
    case 'pending':
      return 'Requested';
    default:
      return isPublic ? 'Follow' : 'Request';
  }
}

export default function FollowButton({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAuthStore((state) => state.user);
  if (!user?.id) throw new Error('Not authenticated');

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['followStatus', userId],
    queryFn: async () => {
      const [followStatus, profileData] = await Promise.all([
        followService.getFollowStatus(user.id, userId),
        followService.getProfileVisibility(userId),
      ]);
      return {
        status: followStatus,
        isPublic: profileData.is_public,
      };
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      try {
        const isBlocked = await followService.checkIfBlocked(user.id, userId);
        if (isBlocked) {
          throw new Error('Unable to follow this user');
        }
        const canFollow = await followService.checkFollowRateLimit(user.id);
        if (!canFollow) {
          throw new Error('Please try again later');
        }

        return await followService.requestFollow(user.id, userId);
      } finally {
        setIsProcessing(false);
        console.log('invalidating queries');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', user.id] });
      queryClient.invalidateQueries({ queryKey: ['followers', user.id] });
      queryClient.invalidateQueries({ queryKey: ['following', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => followService.unfollow(user.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', user.id] });
      queryClient.invalidateQueries({ queryKey: ['followers', user.id] });
      queryClient.invalidateQueries({ queryKey: ['following', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: () => followService.cancelFollowRequest(user.id, userId),
    onSuccess: () => {
      console.log('invalidating queries 3');
      queryClient.invalidateQueries({ queryKey: ['followStatus', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
    },
  });

  const handlePress = () => {
    if (isProcessing) return;
    if (statusData?.status === 'pending') {
      cancelRequestMutation.mutate();
    } else if (statusData?.status === 'following') {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const handleLongPress = () => {
    if (statusData?.status === 'following') {
      Alert.alert('Unfollow', 'Are you sure you want to unfollow this user?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow',
          style: 'destructive',
          onPress: () => unfollowMutation.mutate(),
        },
      ]);
    } else if (statusData?.status === 'pending') {
      Alert.alert('Cancel Request', 'Do you want to cancel your follow request?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => cancelRequestMutation.mutate(),
        },
      ]);
    }
  };

  if (isLoading || !statusData) return null;

  return (
    <Pressable
      onPress={() => {
        handlePress();
      }}
      onLongPress={handleLongPress}
      disabled={isProcessing}
      className={`rounded-full px-4 py-2 ${getButtonStyle(statusData.status)}`}>
      <Text className={getTextStyle(statusData.status)}>
        {isProcessing ? 'Processing...' : getButtonText(statusData.status, statusData.isPublic)}
      </Text>
    </Pressable>
  );
}
