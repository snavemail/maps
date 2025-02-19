import { supabase } from '~/lib/supabase';

type FollowRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
};

type FollowStatus = 'following' | 'not_following' | 'pending';

export const followService = {
  getFollowers: async (
    profileID: string,
    currentUserID: string,
    page = 0,
    limit = 20
  ): Promise<FollowResponse> => {
    const { data, error } = await supabase.rpc('get_followers', {
      profile_id: profileID,
      current_user_id: currentUserID,
      page_limit: limit,
      page_offset: page * limit,
    });

    if (error) throw error;
    return data;
  },

  getFollowing: async (
    profileID: string,
    currentUserID: string,
    page = 0,
    limit = 20
  ): Promise<FollowResponse> => {
    const { data, error } = await supabase.rpc('get_following', {
      profile_id: profileID,
      current_user_id: currentUserID,
      page_limit: limit,
      page_offset: page * limit,
    });

    if (error) throw error;
    return data;
  },

  getProfileVisibility: async (userID: string): Promise<{ is_public: boolean }> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_public')
      .eq('id', userID)
      .single();
    if (error) throw error;
    return data;
  },

  isUserPublic: async (userID: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_public')
      .eq('id', userID)
      .single();

    if (error) throw error;
    return data.is_public;
  },

  requestFollow: async (
    currentUserID: string,
    userToFollowID: string
  ): Promise<{ status: 'accepted' | 'pending' }> => {
    const canFollowDirectly = await followService.isUserPublic(userToFollowID);

    if (canFollowDirectly) {
      const { error } = await supabase.from('followers').insert({
        follower_id: currentUserID,
        following_id: userToFollowID,
      });

      if (error) throw error;
      return { status: 'accepted' };
    } else {
      const { error } = await supabase.from('follow_requests').insert({
        follower_id: currentUserID,
        following_id: userToFollowID,
        status: 'pending',
      });

      if (error) throw error;
      return { status: 'pending' };
    }
  },

  cancelFollowRequest: async (currentUserID: string, userToFollowID: string) => {
    const { error } = await supabase
      .from('follow_requests')
      .delete()
      .eq('follower_id', currentUserID)
      .eq('following_id', userToFollowID)
      .eq('status', 'pending');
    if (error) throw error;
  },

  // Accept/decline follow request
  respondToRequest: async (requestID: string, accept: boolean) => {
    const { data: request, error: requestError } = await supabase
      .from('follow_requests')
      .update({
        status: accept ? 'accepted' : 'declined',
      })
      .eq('id', requestID)
      .select('*');

    if (requestError) throw requestError;

    if (accept) {
      // Add to followers table if accepted
      const { data: requestData, error: requestError } = await supabase
        .from('follow_requests')
        .select('follower_id, following_id')
        .eq('id', requestID)
        .single();

      if (requestData) {
        const { error: followerError } = await supabase.from('followers').insert({
          follower_id: requestData.follower_id,
          following_id: requestData.following_id,
        });
      }
    }
  },

  // Get pending follow requests for a user
  getPendingRequests: async (currentUserID: string): Promise<FollowRequest[]> => {
    const { data, error } = await supabase
      .from('follow_requests')
      .select(
        `
        id,
        status,
        created_at,
        profile:follower_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `
      )
      .eq('following_id', currentUserID)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as FollowRequest[];
  },

  getUnreadCount: async (currentUserID: string): Promise<number> => {
    const { data, error } = await supabase
      .from('follow_requests')
      .select('id', { count: 'exact' })
      .eq('following_id', currentUserID)
      .eq('status', 'pending');

    if (error) throw error;
    if (!data) {
      return 0;
    } else {
      return 0;
    }
  },

  checkFollowRateLimit: async (currentUserID: string) => {
    // Check follow requests in the last hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('follow_requests')
      .select('id', { count: 'exact' })
      .eq('follower_id', currentUserID)
      .gte('created_at', hourAgo);

    return (count || 0) < 100; // Limit to 100 follows per hour
  },

  checkIfBlocked: async (currentUserID: string, userID: string) => {
    const { data } = await supabase
      .from('blocks')
      .select('id')
      .match({
        blocked_id: currentUserID,
        blocker_id: userID,
      })
      .single();

    return !!data;
  },

  getFollowStatus: async (currentUserID: string, userID: string) => {
    try {
      const [followData, requestData] = await Promise.all([
        supabase
          .from('followers')
          .select('id')
          .match({ follower_id: currentUserID, following_id: userID })
          .single(),
        supabase
          .from('follow_requests')
          .select('status')
          .match({ follower_id: currentUserID, following_id: userID })
          .single(),
      ]);

      if (followData?.data?.id) {
        return 'following';
      }
      if (requestData?.data?.status) {
        return requestData.data.status;
      }
      return 'not_following';
    } catch (error) {
      return 'not_following';
    }
  },

  unfollow: async (currentUserID: string, userID: string) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', currentUserID)
      .eq('following_id', userID);

    if (error) throw error;
  },
};
