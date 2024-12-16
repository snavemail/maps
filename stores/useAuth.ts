import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<EditableProfile> | LocationUpdate) => Promise<void>;
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
            console.log('setting session', data);
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
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', get().user?.id)
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              console.error('Profile not found, signing out');
              await supabase.auth.signOut();
            }
            set({ profile: null });
          } else {
            set({
              profile: data,
            });
          }
        } catch (error) {
          console.error('fetchProfile error:', error);
        }
      },

      updateProfile: async (updates) => {
        const user = get().user;
        if (!user) throw new Error('No user logged in');
        try {
          const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

          if (error) throw error;
          set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
          }));
        } catch (error) {
          throw error;
        }
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
