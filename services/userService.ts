import { supabase } from '~/lib/supabase';

export const userService = {
  searchUsers: async (
    query: string,
    currentUserID: string,
    page = 20,
    limit = 20
  ): Promise<SearchResponse> => {
    const { data, error } = await supabase.rpc('search_users', {
      search_query: query,
      current_user_id: currentUserID,
      page_limit: limit,
      page_offset: page * limit,
    });
    console.log('s', data, error);
    if (error) throw error;
    return data;
  },
};
