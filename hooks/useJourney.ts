import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { journeyService } from '~/services/journeyService';
import { useProfile } from '~/hooks/useProfile';

export const useJourneys = (limit = 20) => {
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

export function useUserJourneys(userID: string) {
  return useInfiniteQuery({
    queryKey: ['userJourneys', userID],
    queryFn: ({ pageParam = 1 }) => journeyService.fetchUserJourneys(userID, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!userID,
    initialPageParam: 0,
    staleTime: 0,
  });
}

export function useJourney(journeyID: string) {
  const journeyQuery = useQuery({
    queryKey: ['journey', journeyID],
    queryFn: () => journeyService.fetchJourney(journeyID),
    enabled: !!journeyID,
    staleTime: 0,
  });

  return {
    journey: journeyQuery.data,
    isLoading: journeyQuery.isLoading,
    error: journeyQuery.error,
  };
}
