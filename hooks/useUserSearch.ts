import { useInfiniteQuery } from '@tanstack/react-query';
import { useProfile } from '~/hooks/useProfile';
import { userService } from '~/services/userService';

export function useUserSearch(query: string) {
  const { profile: currentUser } = useProfile();

  return useInfiniteQuery({
    queryKey: ['userSearch', query],
    queryFn: ({ pageParam = 0 }) => userService.searchUsers(query, currentUser!.id, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!currentUser?.id && query.length > 0,
    initialPageParam: 0,
  });
}
