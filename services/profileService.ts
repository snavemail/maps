import { supabase } from '~/lib/supabase';
import { decode } from 'base64-arraybuffer';

export const profileService = {
  fetchProfile: async (userID: string): Promise<Profile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userID).single();

    if (error) {
      if (error.code === 'PGRST116') {
        await supabase.auth.signOut();
      }
      throw error;
    }

    return data;
  },

  fetchProfileStats: async (userID: string): Promise<FollowCounts> => {
    const [followersCount, followingCount] = await Promise.all([
      supabase.from('followers').select('*', { count: 'exact' }).eq('following_id', userID),
      supabase.from('followers').select('*', { count: 'exact' }).eq('follower_id', userID),
    ]);

    return {
      followers: followersCount.count || 0,
      following: followingCount.count || 0,
    };
  },

  fetchJourneyStats: async (userID: string): Promise<JourneyStats> => {
    const [totalJourneys, recentJourneys, totalLocations, recentDistance] = await Promise.all([
      supabase.from('journeys').select('id', { count: 'exact' }).eq('user_id', userID),

      supabase
        .from('journeys')
        .select('id', { count: 'exact' })
        .eq('user_id', userID)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

      supabase.rpc('count_locations_for_user', { input_user_id: userID }),

      supabase.rpc('calculate_journey_distances', {
        input_user_id: userID,
        days_limit: 7,
      }),
    ]);

    return {
      totalJourneys: totalJourneys.count || 0,
      recentJourneys: recentJourneys.count || 0,
      totalLocations: totalLocations.data || 0,
      recentDistance: recentDistance.data || 0,
    };
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  update: async (userID: string, updates: Partial<EditableProfile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userID)
      .select()
      .single();

    if (error) throw error;
    return data;
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
