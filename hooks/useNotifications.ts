import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followService } from '~/services/followService';
import { useProfile } from '~/hooks/useProfile';
import { useEffect, useState } from 'react';
import { useNotificationStore } from '~/stores/useNotifications';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export function useNotifications() {
  const { profile } = useProfile();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const queryClient = useQueryClient();

  const {
    unreadCount,
    setUnreadCount,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    resetNotifications,
  } = useNotificationStore();

  if (!profile?.id)
    return { pendingRequests: [], isLoading: false, unreadCount: 0, respondToRequest: () => {} };

  const { data: pendingRequests, isLoading } = useQuery({
    queryKey: ['followRequests'],
    queryFn: async () => {
      const [requests, unreadCount] = await Promise.all([
        followService.getPendingRequests(profile?.id),
        followService.getUnreadCount(profile?.id),
      ]);

      setUnreadCount(unreadCount);
      return requests;
    },
    enabled: !!profile?.id,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    resetNotifications();
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id && !isSubscribed) {
      subscribeToNotifications(profile.id);
      setIsSubscribed(true);
      return () => {
        unsubscribeFromNotifications();
        setIsSubscribed(false);
      };
    }
  }, [profile?.id]);

  const respondToRequestMutation = useMutation({
    mutationFn: async ({ requestID, accept }: { requestID: string; accept: boolean }) => {
      try {
        await followService.respondToRequest(requestID, accept);
        return { success: true };
      } catch (error) {
        console.error('Error responding to request:', error);
        throw error;
      }
    },
    onMutate: async ({ requestID, accept }: { requestID: string; accept: boolean }) => {
      await queryClient.cancelQueries({ queryKey: ['followRequests'] });
      if (accept) {
        const requesterProfile = pendingRequests?.find((req) => req.id === requestID)?.profile;
        if (requesterProfile?.id) {
          await Promise.all([
            queryClient.cancelQueries({ queryKey: ['profileStats', profile?.id] }),
            queryClient.cancelQueries({ queryKey: ['profileStats', requesterProfile.id] }),
          ]);
        }
      }
      const previousRequests = queryClient.getQueryData(['followRequests']);
      const requesterProfile = pendingRequests?.find((req) => req.id === requestID)?.profile;
      const previousTargetStats = requesterProfile?.id
        ? queryClient.getQueryData(['profileStats', requesterProfile.id])
        : null;
      const previousUserStats = queryClient.getQueryData(['profileStats', profile?.id]);

      // Optimistically update requests
      queryClient.setQueryData(
        ['followRequests'],
        (old: any) => old?.filter((request: any) => request.id !== requestID) ?? []
      );

      // If accepting, update follower counts
      if (accept && requesterProfile?.id) {
        // Update requester's following count
        queryClient.setQueryData(['profileStats', requesterProfile.id], (old: any) => ({
          ...old,
          following: (old?.following ?? 0) + 1,
        }));

        // Update current user's followers count
        queryClient.setQueryData(['profileStats', profile?.id], (old: any) => ({
          ...old,
          followers: (old?.followers ?? 0) + 1,
        }));
      }

      // Optimistically decrease unread count
      useNotificationStore.getState().decrementUnread();

      return {
        previousRequests,
        previousTargetStats,
        previousUserStats,
        requesterProfile,
      };
    },
    onError: (error, _, context) => {
      // Revert optimistic updates
      if (context) {
        queryClient.setQueryData(['followRequests'], context.previousRequests);
        if (context.requesterProfile?.id) {
          queryClient.setQueryData(
            ['profileStats', context.requesterProfile.id],
            context.previousTargetStats
          );
          queryClient.setQueryData(['profileStats', profile?.id], context.previousUserStats);
        }
        // Revert unread count
        useNotificationStore.getState().incrementUnread();
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to respond to follow request',
      });
    },
    onSuccess: async (_, { requestID, accept }) => {
      const requesterProfile = pendingRequests?.find((req) => req.id === requestID)?.profile;

      if (accept && requesterProfile?.id) {
        const invalidateQueries = [
          ['followRequests'],
          ['profileStats', profile?.id],
          ['profileStats', requesterProfile.id],
          ['followers', profile?.id],
          ['following', requesterProfile.id],
          ['followStatus', requesterProfile.id],
        ];

        // Invalidate queries but don't need immediate refetch since we have optimistic updates
        await Promise.all(
          invalidateQueries.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['followRequests'] });
      }
    },
  });

  return {
    pendingRequests,
    isLoading,
    unreadCount,
    respondToRequest: respondToRequestMutation.mutate,
  };
}
