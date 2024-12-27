import { supabase } from '~/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { useCacheStore } from '~/stores/useCache';

export const profileService = {
  fetchProfile: async (userID: string): Promise<ProfileWithStats | null> => {
    const cache = useCacheStore.getState();
    const cachedProfile = cache.get('profiles', userID);

    if (cachedProfile) {
      const cacheAge = Date.now() - cache.profiles[userID].lastFetched;
      if (cacheAge < 1000 * 60 * 60 * 24) {
        profileService.refreshProfile(userID);
      }
      return cachedProfile;
    }

    return await profileService.refreshProfile(userID);
  },

  refreshProfile: async (userID: string): Promise<ProfileWithStats | null> => {
    try {
      const [profileResponse, followersCount, followingCount, journeysCount, recentJourneysCount] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', userID).single(),
          supabase.from('followers').select('*', { count: 'exact' }).eq('following_id', userID),
          supabase.from('followers').select('*', { count: 'exact' }).eq('follower_id', userID),
          supabase.from('journeys').select('id', { count: 'exact' }).eq('user_id', userID),
          supabase
            .from('journeys')
            .select('id', { count: 'exact' })
            .eq('user_id', userID)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        ]);
      if (profileResponse.error) {
        if (profileResponse.error.code === 'PGRST116') {
          await supabase.auth.signOut();
        }
        throw profileResponse.error;
      }

      const profileWithStats: ProfileWithStats = {
        ...profileResponse.data,
        followers: followersCount.count || 0,
        following: followingCount.count || 0,
        totalJourneys: journeysCount.count || 0,
        recentJourneys: recentJourneysCount.count || 0,
      };

      // Update cache
      const cache = useCacheStore.getState();
      cache.set('profiles', userID, profileWithStats);
      return profileWithStats;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  update: async (userID: string, updates: Partial<Profile>) => {
    const cache = useCacheStore.getState();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userID)
        .select('*')
        .single();

      if (error) throw new Error(`Error updating profile: ${error.message}`);
      cache.set('profiles', userID, data);
      cache.invalidate('journeys');
      return data;
    } catch (error) {
      return null;
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
    const uniqueFilename = `${userID}/${Date.now()}.jpg`;

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
