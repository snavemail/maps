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

  fetchUserJourneys: async (userID: string, page: number, limit = 20): Promise<JourneyResponse> => {
    try {
      const { data: journeyData, error } = await supabase.rpc('get_user_journeys', {
        profile_id: userID,
        page_limit: limit,
        page_offset: page * limit,
      });
      if (error) throw error;

      const returnData = {
        has_more: journeyData.has_more,
        journeys: journeyData.journeys || [],
        total_count: journeyData.total_count,
      };
      return returnData;
    } catch (error) {
      console.error('Error fetching my journeys:', error);
      return { has_more: false, journeys: [], total_count: 0 };
    }
  },

  invalidateMyJourneys: () => {
    const cache = useCacheStore.getState();
    cache.invalidate('myJourneys');
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
    } catch (error) {
      console.error('Error uploading journey:', error);
      throw error;
    }
  },

  getSignedUrl: async (path: string) => {
    const { data, error } = await supabase.storage
      .from('location_photos')
      .createSignedUrl(path, 3600);
    if (error) throw error;
    return data?.signedUrl;
  },

  listAllFiles: async (folderPath: string, bucketName: string) => {
    const allFiles: string[] = [];
    const listFolderContents = async (path: string) => {
      try {
        const { data: items, error: filesError } = await supabase.storage
          .from(bucketName)
          .list(path, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });
        if (filesError) throw filesError;
        if (!items) return;

        const files = items.filter((item) => item.metadata);
        const folders = items.filter((item) => !item.metadata);

        files.forEach((file) => allFiles.push(`${path}/${file.name}`));
        for (const folder of folders) {
          await listFolderContents(`${path}/${folder.name}`);
        }
      } catch (error) {
        console.error('error');
        throw error;
      }
    };
    await listFolderContents(folderPath);
    return allFiles;
  },

  deleteJourneyImages: async (profileID: string, journeyID: string) => {
    try {
      const bucketName = 'location_photos';
      const folderPath = `${profileID}/${journeyID}`;
      const allFiles = await journeyService.listAllFiles(folderPath, bucketName);

      for (const file of allFiles) {
        await supabase.storage.from('location_photos').remove([file]);
      }
    } catch (error) {
      console.error('Error deleting journey images:', error);
      throw error;
    }
  },

  deleteJourney: async (journeyID: string) => {
    try {
      const userID = useAuthStore.getState().user?.id;
      if (!userID) throw new Error('User not found');

      const { error } = await supabase.from('journeys').delete().eq('id', journeyID);
      if (error) throw error;

      await journeyService.deleteJourneyImages(userID, journeyID);
    } catch (error) {
      console.error('Error');
      throw error;
    }
  },
};
