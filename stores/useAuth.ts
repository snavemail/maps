import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profileService } from '~/services/profileService';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;

  // Auth methods
  initialize: () => Promise<() => void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  fetchProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<EditableProfile> | LocationUpdate) => Promise<Profile | null>;
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

          if (session?.user) {
            await get().fetchProfile();
          }

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange(async (_event, session) => {
            set({
              session,
              user: session?.user ?? null,
            });

            if (session?.user) {
              await get().fetchProfile();
            }
          });

          return () => {
            console.log('unsubscribing');
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
          set({ user: null, session: null, profile: null });
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        if (!get().user?.id) return null;
        const user = await profileService.fetchProfile(get().user?.id!);
        set({ profile: user });
        return user;
      },

      updateProfile: async (updates) => {
        if (!get().user?.id) return null;
        const updatedProfile = await profileService.update(get().user!.id, updates);
        if (updatedProfile) {
          set({ profile: updatedProfile });
        }
        return updatedProfile;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
);
