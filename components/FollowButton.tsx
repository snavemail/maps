import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, View, ActivityIndicator, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { followService } from '~/services/followService';
import { useAuthStore } from '~/stores/useAuth';

function getTextStyle(status: string) {
  switch (status) {
    case 'following':
      return 'text-primary dark:text-primary-dark';
    case 'pending':
      return 'text-text dark:text-text-dark';
    default:
      return 'text-primary dark:text-primary-dark';
  }
}

function getButtonStyle(status: string) {
  switch (status) {
    case 'following':
      return 'border-2 border-primary dark:border-primary-dark';
    case 'pending':
      return 'border-2 border-secondary dark:border-secondary-dark';
    default:
      return 'border-2 border-primary dark:border-primary-dark';
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

export default function FollowButton({ userID }: { userID: string }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  if (!user?.id) throw new Error('Not authenticated');

  if (userID === user.id) return null;

  const { data: statusData, isLoading } = useQuery({
    queryKey: ['followStatus', userID],
    queryFn: async () => {
      const [followStatus, profileData] = await Promise.all([
        followService.getFollowStatus(user.id, userID),
        followService.getProfileVisibility(userID),
      ]);
      return {
        status: followStatus,
        isPublic: profileData.is_public,
      };
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      // checking blocked ( not implemented ) and rate limit
      const [isBlocked, canFollow] = await Promise.all([
        followService.checkIfBlocked(user.id, userID),
        followService.checkFollowRateLimit(user.id),
      ]);

      if (isBlocked) throw new Error('Unable to follow this user');
      if (!canFollow) throw new Error('Please try again later');

      return followService.requestFollow(user.id, userID);
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['followStatus', userID] }),
        queryClient.cancelQueries({ queryKey: ['profileStats', userID] }),
        queryClient.cancelQueries({ queryKey: ['profileStats', user.id] }),
      ]);

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['followStatus', userID]);
      const previousTargetStats = queryClient.getQueryData(['profileStats', userID]);
      const previousUserStats = queryClient.getQueryData(['profileStats', user.id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['followStatus', userID], {
        status: statusData?.isPublic ? 'following' : 'pending',
        isPublic: statusData?.isPublic,
      });

      if (statusData?.isPublic) {
        queryClient.setQueryData(['profileStats', userID], (old: any) => ({
          ...old,
          followers: (old?.followers ?? 0) + 1,
        }));
        queryClient.setQueryData(['profileStats', user.id], (old: any) => ({
          ...old,
          following: (old?.following ?? 0) + 1,
        }));
      }

      return {
        previousStatus,
        previousTargetStats,
        previousUserStats,
      };
    },
    onError: (error: Error, _, context) => {
      // Revert all optimistic updates
      queryClient.setQueryData(['followStatus', userID], context?.previousStatus);
      queryClient.setQueryData(['profileStats', userID], context?.previousTargetStats);
      queryClient.setQueryData(['profileStats', user.id], context?.previousUserStats);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    },
    onSettled: () => {
      const queries = [
        ['followStatus', userID],
        ['profileStats', userID],
        ['profileStats', user.id],
        ['followers', userID],
        ['following', user.id],
      ];
      Promise.all(queries.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => followService.unfollow(user.id, userID),
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['followStatus', userID] }),
        queryClient.cancelQueries({ queryKey: ['profileStats', userID] }),
        queryClient.cancelQueries({ queryKey: ['profileStats', user.id] }),
      ]);
      const previousStatus = queryClient.getQueryData(['followStatus', userID]);
      const previousTargetStats = queryClient.getQueryData(['profileStats', userID]);
      const previousUserStats = queryClient.getQueryData(['profileStats', user.id]);

      queryClient.setQueryData(['followStatus', userID], {
        status: 'not_following',
        isPublic: statusData?.isPublic,
      });
      queryClient.setQueryData(['profileStats', userID], (old: any) => ({
        ...old,
        followers: Math.max(0, (old?.followers ?? 1) - 1),
      }));

      queryClient.setQueryData(['profileStats', user.id], (old: any) => ({
        ...old,
        following: Math.max(0, (old?.following ?? 1) - 1),
      }));

      return {
        previousStatus,
        previousTargetStats,
        previousUserStats,
      };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['followStatus', userID], context?.previousStatus);
      queryClient.setQueryData(['profileStats', userID], context?.previousTargetStats);
      queryClient.setQueryData(['profileStats', user.id], context?.previousUserStats);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to unfollow user',
      });
    },
    onSettled: () => {
      const queries = [
        ['followStatus', userID],
        ['profileStats', userID],
        ['profileStats', user.id],
        ['followers', userID],
        ['following', user.id],
      ];

      Promise.all(queries.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: () => followService.cancelFollowRequest(user.id, userID),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['followStatus', userID] });
      const previousStatus = queryClient.getQueryData(['followStatus', userID]);

      queryClient.setQueryData(['followStatus', userID], {
        status: 'not_following',
        isPublic: statusData?.isPublic,
      });

      return { previousStatus };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['followStatus', userID], context?.previousStatus);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to cancel request',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', userID] });
    },
  });

  const handlePress = () => {
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
      onPress={handlePress}
      onLongPress={handleLongPress}
      className={`rounded-lg px-2.5 py-1 ${getButtonStyle(statusData.status)}`}>
      <Text className={getTextStyle(statusData.status)}>
        {getButtonText(statusData.status, statusData.isPublic)}
      </Text>
    </Pressable>
  );
}
