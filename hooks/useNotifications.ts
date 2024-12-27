import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followService } from '~/services/followService';
import { useProfile } from '~/hooks/useProfile';
import { useEffect, useState } from 'react';
import { useNotificationStore } from '~/stores/useNotifications';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

// hooks/useNotifications.ts
export function useNotifications() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);
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
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      try {
        await followService.respondToRequest(requestId, accept);
        return { success: true };
      } catch (error) {
        console.error('Error responding to request:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followRequests'] });
      queryClient.invalidateQueries({ queryKey: ['followers', profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['following', profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', profile?.id] });
      useNotificationStore.getState().decrementUnread();
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to respond to follow request',
      });
    },
  });

  return {
    pendingRequests,
    isLoading,
    unreadCount,
    respondToRequest: respondToRequestMutation.mutate,
  };
}
