import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from './useNotifications';
import { useJourneyStore } from './useJourney';
import { usePreferenceStore } from './usePreferences';
import { useQueryClient } from '@tanstack/react-query';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Auth methods
  initialize: () => Promise<() => void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (
    provider: string,
    token: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;

  // fetchProfile: () => Promise<Profile | null>;
  // updateProfile: (updates: Partial<EditableProfile> | LocationUpdate) => Promise<Profile | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      loading: true,
      initialized: false,

      initialize: async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          set({
            session,
            user: session?.user ?? null,
            initialized: true,
            loading: false,
          });

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (_event, session) => {
            set({
              session,
            });
          });

          return () => {
            subscription?.unsubscribe();
          };
        } catch (error) {
          await get().signOut();
          set({ loading: false, initialized: true });
          return () => {};
        }
      },

      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
              },
            },
          });
          if (error) throw error;
        } finally {
          set({ loading: false });
        }
      },

      signInWithOAuth: async (
        provider: string,
        token: string,
        firstName?: string,
        lastName?: string
      ) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider,
            token,
          });

          console.log('data', JSON.stringify(data, null, 2));
          console.log('data.session', JSON.stringify(data.session, null, 2));
          console.log('error', JSON.stringify(error, null, 2));

          const createdAt = data.user?.created_at;

          if (error) throw error;
          console.log('before set');
          if (data.session) {
            console.log('data.session', JSON.stringify(data.session, null, 2));
            set({
              session: data.session,
              user: data.session.user ?? null,
            });
          }
          if (new Date().getTime() - new Date(createdAt || '').getTime() < 5000) {
            const givenName =
              provider === 'apple' ? firstName : data.user?.user_metadata.full_name.split(' ')[0];
            const surname =
              provider === 'apple' ? lastName : data.user?.user_metadata.full_name.split(' ')[1];
            const avatarUrl = provider === 'apple' ? null : data.user?.user_metadata.avatar_url;

            console.log('givenName', givenName);
            console.log('surname', surname);
            console.log('avatarUrl', avatarUrl);

            await supabase
              .from('profiles')
              .update({
                first_name: givenName,
                last_name: surname,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.session.user.id);
          }
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          if (data.session) {
            set({
              session: data.session,
              user: data.session?.user ?? null,
            });
          }
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null });
        } finally {
          set({ loading: false });
        }
      },
      deleteAccount: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.rpc('deleteUser');
          if (error) throw error;

          useNotificationStore.getState().resetNotifications();
          usePreferenceStore.getState().reset();
          useJourneyStore.getState().reset();

          await supabase.auth.signOut();
          set({ user: null, session: null });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
