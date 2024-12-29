import { useInfiniteQuery } from '@tanstack/react-query';
import { journeyService } from '~/services/journeyService';

export const useFollowerJourneys = (limit = 20) => {
  return useInfiniteQuery<JourneyResponse>({
    queryKey: ['followerPosts'],
    queryFn: ({ pageParam = 0 }) => journeyService.getFeed(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });
};
