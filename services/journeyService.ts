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
    try {
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
      cache.set('journeys', journeyID, data);
      return data as JourneyWithProfile;
    } catch (error) {
      console.error('Error fetching journey:', error);
      return null;
    }
  },

  fetchMyJourneys: async () => {
    const cache = useCacheStore.getState();
    const cachedJourneys = cache.get('myJourneys', 'list');
    if (cachedJourneys) {
      return cachedJourneys;
    }

    return await journeyService.refreshMyJourneys();
  },

  refreshMyJourneys: async (): Promise<JourneyWithProfile[]> => {
    const cache = useCacheStore.getState();
    const profileID = useAuthStore.getState().profile?.id;
    if (!profileID) {
      return [];
    }

    try {
      const { data: journeys, error } = await supabase.rpc('get_user_journeys', {
        profile_id: profileID,
        page_limit: 10,
        page_offset: 0,
      });
      if (error) throw error;

      if (journeys) {
        cache.set('myJourneys', 'list', journeys);

        const journeyEntries = journeys.reduce((acc: any, journey: any) => {
          acc[journey.id] = journey;
          return acc;
        }, {});
        cache.setMany('myJourneys', journeyEntries);
      }
      return journeys;
    } catch (error) {
      console.error('Error fetching my journeys:', error);
      return [];
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
      console.log('Uploaded Journey:', journeyData);

      for (const location of journey.locations) {
        const { data: locationData, error: locationError } = await supabase
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
              images: [],
              created_at: location.created_at,
              updated_at: location.updated_at,
            },
          ])
          .select('*');

        if (locationError) throw new Error(`Error uploading location: ${locationError.message}`);
        console.log('Uploaded Location:', locationData);

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

          console.log('Uploaded Image:', imageData);
          photoUrls.push(imageData?.path);
        }

        const { error: updateError } = await supabase
          .from('locations')
          .update({ images: photoUrls })
          .eq('id', location.id);

        if (updateError)
          throw new Error(`Error updating location photo URLs: ${updateError.message}`);
      }
      console.log('Journey upload complete!');
      journeyService.invalidateMyJourneys();
    } catch (error) {
      console.error('Error uploading location photo:', error);
    }
  },
};
