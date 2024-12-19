import { supabase } from '~/lib/supabase';

export const journeyService = {
  getJourneyByID: async (journeyID: string) => {
    const { data, error } = await supabase
      .from('journeys')
      .select(
        `
      *,
      locations (*),
      profiles!user_id (
        first_name,
        last_name,
        avatar_url
      )
    `
      )
      .eq('id', journeyID)
      .single();

    if (error) throw error;
    return data as JourneyWithProfile;
  },

  getJourneysByProfileID: async ({
    profileID,
    page = 0,
    limit = 10,
    cursor,
  }: {
    profileID: string;
    page?: number;
    limit?: number;
    cursor?: string;
  }): Promise<{
    journeys: JourneyWithProfile[];
    nextCursor: string | null;
    hasMore: boolean;
  }> => {
    let query = supabase
      .from('journeys')
      .select(
        `
        *,
        locations (*),
        profiles!user_id (
          first_name,
          last_name,
          avatar_url
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', profileID)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const hasMore = (count || 0) > (page + 1) * limit;
    const nextCursor = data?.[data.length - 1]?.created_at || null;

    return {
      journeys: data as JourneyWithProfile[],
      nextCursor,
      hasMore,
    };
  },
};
