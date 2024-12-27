import { useInfiniteQuery } from '@tanstack/react-query';
import { journeyService } from '~/services/journeyService';
import { useProfile } from '~/hooks/useProfile';

export const useJourney = (limit = 20) => {
  const { profile } = useProfile();
  return useInfiniteQuery<JourneyResponse>({
    queryKey: ['journeys', profile?.id],
    queryFn: ({ pageParam = 0 }) =>
      journeyService.fetchUserJourneys(profile!.id, pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!profile?.id,
    initialPageParam: 0,
  });
};
