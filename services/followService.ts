import { supabase } from '~/lib/supabase';

export const followService = {
  getFollowers: async (
    profileId: string,
    currentUserId: string,
    page = 0,
    limit = 20
  ): Promise<FollowResponse> => {
    const { data, error } = await supabase.rpc('get_followers', {
      profile_id: profileId,
      current_user_id: currentUserId,
      page_limit: limit,
      page_offset: page * limit,
    });

    if (error) throw error;
    return data;
  },

  getFollowing: async (
    profileId: string,
    currentUserId: string,
    page = 0,
    limit = 20
  ): Promise<FollowResponse> => {
    const { data, error } = await supabase.rpc('get_following', {
      profile_id: profileId,
      current_user_id: currentUserId,
      page_limit: limit,
      page_offset: page * limit,
    });

    if (error) throw error;
    return data;
  },
};
