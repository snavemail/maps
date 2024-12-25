import { decode } from 'base64-arraybuffer';
import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/stores/useAuth';
import { useCacheStore } from '~/stores/useCache';

export const journeyService = {
  fetchJourney: async (journeyID: string) => {
    const cache = useCacheStore.getState();
    const cachedJourney = cache.get('journeys', journeyID);
    if (cachedJourney) {
      return cachedJourney;
    }
    return await journeyService.refreshJourney(journeyID);
  },

  refreshJourney: async (journeyID: string) => {
    const cache = useCacheStore.getState();

    try {
      const { data, error } = await supabase.rpc('fetch_journey', {
        journey_id: journeyID,
      });
      if (error) throw error;
      cache.set('journeys', journeyID, data);
      return data as JourneyWithProfile;
    } catch (error) {
      console.error('Error fetching journey:', error);
      return null;
    }
  },

  fetchMyJourneys: async (page: number, limit: number) => {
    const cache = useCacheStore.getState();
    const cacheKey = `list-${page}-${limit}`;
    const cachedJourneys = cache.get('myJourneys', cacheKey);
    if (cachedJourneys) {
      const cacheAge = Date.now() - cache.myJourneys[cacheKey].lastFetched;
      if (cacheAge > 1000 * 60 * 60) {
        journeyService.refreshMyJourneys(page, limit);
      }

      return cachedJourneys;
    }

    return await journeyService.refreshMyJourneys(page, limit);
  },

  refreshMyJourneys: async (page: number, limit: number): Promise<JourneyResponse> => {
    const cache = useCacheStore.getState();
    const profileID = useAuthStore.getState().profile?.id;
    if (!profileID) {
      return { has_more: false, journeys: [], total_count: 0 };
    }

    try {
      const { data: journeyData, error } = await supabase.rpc('get_user_journeys', {
        profile_id: profileID,
        page_limit: limit,
        page_offset: page * limit,
      });
      if (error) throw error;

      const returnData = {
        has_more: journeyData.has_more,
        journeys: journeyData.journeys || [],
        total_count: journeyData.total_count,
      };
      const cacheKey = `list-${page}-${limit}`;
      cache.set('myJourneys', cacheKey, returnData);
      return returnData;
    } catch (error) {
      console.error('Error fetching my journeys:', error);
      return { has_more: false, journeys: [], total_count: 0 };
    }
  },

  invalidateMyJourneys: () => {
    const cache = useCacheStore.getState();
    cache.invalidate('myJourneys', 'list');
  },

  fetchJourneysByProfileID: async ({
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

  uploadJourney: async (journey: DraftJourney) => {
    const user = useAuthStore.getState().user;
    try {
      const { data: journeyData, error: journeyError } = await supabase
        .from('journeys')
        .insert([
          {
            id: journey.id,
            user_id: user?.id,
            title: journey.title,
            description: journey.description,
            is_public: journey.isPublic,
            start_date: journey.startDate,
            created_at: journey.created_at,
            updated_at: journey.updated_at,
          },
        ])
        .select('*');

      if (journeyError) throw new Error(`Error uploading journey: ${journeyError.message}`);

      for (const location of journey.locations) {
        const photoUrls: string[] = [];
        for (const image of location.images) {
          const uniqueFilename = `${user?.id}/${journey.id}/${location.id}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 15)}.jpg`;

          const { data: imageData, error: imageError } = await supabase.storage
            .from('location_photos')
            .upload(uniqueFilename, decode(image.base64 || ''), {
              contentType: 'image/jpeg',
              metadata: { location_id: location.id },
            });

          if (imageError) throw new Error(`Error uploading image: ${imageError.message}`);

          photoUrls.push(imageData?.path);
        }
        const { error: locationError } = await supabase
          .from('locations')
          .insert([
            {
              id: location.id,
              journey_id: journey.id,
              title: location.title,
              description: location.description,
              coordinates: `POINT(${location.coordinates.longitude} ${location.coordinates.latitude})`,
              address: location.address,
              date: location.date,
              rating: location.rating,
              hide_location: location.hideLocation,
              hide_time: location.hideTime,
              images: photoUrls,
              created_at: location.created_at,
              updated_at: location.updated_at,
            },
          ])
          .select('*');

        if (locationError) throw new Error(`Error uploading location: ${locationError.message}`);
      }
      console.log('Journey upload complete!');
      journeyService.invalidateMyJourneys();
    } catch (error) {
      console.error('Error uploading location photo:', error);
    }
  },

  getSignedUrl: async (path: string) => {
    const { data, error } = await supabase.storage
      .from('location_photos')
      .createSignedUrl(path, 3600);
    if (error) throw error;
    return data?.signedUrl;
  },
};
