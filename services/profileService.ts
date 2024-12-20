import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/stores/useAuth';
import { decode } from 'base64-arraybuffer';

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

  removeAvatar: async (filename: string) => {
    await supabase.storage.from('avatars').remove([filename]);
  },

  uploadAvatar: async (base64: string, contentType: string, userID: string) => {
    // get current avatar list (should be only one) and remove it
    const { data: currentData } = await supabase.storage.from('avatars').list(userID);
    await profileService.removeAvatar(`${userID}/${currentData?.[0]?.name}`);
    // upload new avatar with unique filename
    // Need unique filename because I believe supabase caches the file by the filename
    // If I don't remove the old file, the new file will be cached and not updated
    const uniqueFilename = `${userID}/${Date.now()}.png`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(uniqueFilename, decode(base64), { contentType });
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(uniqueFilename);
    return publicUrl;
  },

  saveAvatarUrl: async (userID: string, avatarURL: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarURL })
      .eq('id', userID);

    if (error) throw error;
    return data;
  },

  deleteAvatarURL: async (userID: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userID);

    if (error) throw new Error(`Error deleting avatar URL: ${error.message}`);
    return data;
  },
};
