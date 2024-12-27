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

  getProfileVisibility: async (userId: string): Promise<{ is_public: boolean }> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_public')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  isUserPublic: async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_public')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data.is_public;
  },

  // Request to follow a user
  requestFollow: async (
    currentUserId: string,
    userToFollowId: string
  ): Promise<{ status: 'accepted' | 'pending' }> => {
    const canFollowDirectly = await followService.isUserPublic(userToFollowId);

    if (canFollowDirectly) {
      const { error } = await supabase.from('followers').insert({
        follower_id: currentUserId,
        following_id: userToFollowId,
      });

      if (error) throw error;
      return { status: 'accepted' };
    } else {
      const { error } = await supabase.from('follow_requests').insert({
        follower_id: currentUserId,
        following_id: userToFollowId,
        status: 'pending',
      });

      if (error) throw error;
      return { status: 'pending' };
    }
  },

  cancelFollowRequest: async (currentUserId: string, userToFollowId: string) => {
    const { error } = await supabase
      .from('follow_requests')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', userToFollowId)
      .eq('status', 'pending');
    if (error) throw error;
  },

  // Accept/decline follow request
  respondToRequest: async (requestId: string, accept: boolean) => {
    console.log('responding to request', requestId);
    const { data: request, error: requestError } = await supabase
      .from('follow_requests')
      .update({
        status: accept ? 'accepted' : 'declined',
      })
      .eq('id', requestId)
      .select('*');

    console.log('request', request);

    console.log('err', requestError);

    if (requestError) throw requestError;

    if (accept) {
      console.log('accepting requestt', requestId);
      // Add to followers table if accepted
      const { data: requestData, error: requestError } = await supabase
        .from('follow_requests')
        .select('follower_id, following_id')
        .eq('id', requestId)
        .single();

      console.log('request', requestData);

      if (requestData) {
        const { error: followerError } = await supabase.from('followers').insert({
          follower_id: requestData.follower_id,
          following_id: requestData.following_id,
        });
        console.log('followerError', followerError);
      }
    }
  },

  // Get pending follow requests for a user
  getPendingRequests: async (currentUserId: string): Promise<FollowRequest[]> => {
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
      .eq('following_id', currentUserId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as FollowRequest[];
  },

  getUnreadCount: async (currentUserId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('follow_requests')
      .select('id', { count: 'exact' })
      .eq('following_id', currentUserId)
      .eq('status', 'pending');

    if (error) throw error;
    return data.length;
  },

  checkFollowRateLimit: async (currentUserId: string) => {
    // Check follow requests in the last hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('follow_requests')
      .select('id', { count: 'exact' })
      .eq('follower_id', currentUserId)
      .gte('created_at', hourAgo);

    return (count || 0) < 100; // Limit to 100 follows per hour
  },

  checkIfBlocked: async (currentUserId: string, userID: string) => {
    const { data } = await supabase
      .from('blocks')
      .select('id')
      .match({
        blocked_id: currentUserId,
        blocker_id: userID,
      })
      .single();

    return !!data;
  },

  getFollowStatus: async (currentUserId: string, userID: string) => {
    try {
      const [followData, requestData] = await Promise.all([
        supabase
          .from('followers')
          .select('id')
          .match({ follower_id: currentUserId, following_id: userID })
          .single(),
        supabase
          .from('follow_requests')
          .select('status')
          .match({ follower_id: currentUserId, following_id: userID })
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

  unfollow: async (currentUserId: string, userID: string) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', userID);

    if (error) throw error;
  },
};
