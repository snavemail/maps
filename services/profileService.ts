import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/stores/useAuth';

export const profileService = {
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, bio, created_at, updated_at, birthday')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  update: async (updates: Partial<Profile>) => {
    const updateProfile = useAuthStore.getState().updateProfile;

    try {
      await updateProfile(updates);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};
