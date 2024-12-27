import { create } from 'zustand';
import { supabase } from '~/lib/supabase';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  subscription: any;
  subscribeToNotifications: (userId: string) => void;
  unsubscribeFromNotifications: () => void;
  resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
  subscription: null,
  subscribeToNotifications: (userId) => {
    const subscription = supabase
      .channel('follow-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'follow_requests',
          filter: `following_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.status === 'pending') {
            set((state) => ({ unreadCount: state.unreadCount + 1 }));
          }
        }
      )
      .subscribe();

    set({ subscription });

    return () => {
      subscription.unsubscribe();
    };
  },
  unsubscribeFromNotifications: () => {
    set((state) => {
      if (state.subscription) {
        state.subscription.unsubscribe();
        return { subscription: null };
      }
      return state;
    });
  },
  resetNotifications: () => {
    set({ unreadCount: 0, subscription: null });
  },
}));
