import { View, ActivityIndicator, Text, FlatList } from 'react-native';
import { useUserJourneys } from '~/hooks/useJourney';
import JourneyCard from './JourneyCard';
import { ReactNode } from 'react';
import { useCanViewProfile } from '~/hooks/useCanViewProfile';
import PrivateProfileMessage from '~/components/Profile/PrivateProfileMessage';

export function UserJourneys({ userId, header }: { userId: string; header: ReactNode }) {
  const canView = useCanViewProfile(userId);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserJourneys(userId);

  const journeys = data?.pages.flatMap((page) => page.journeys) ?? [];

  if (!canView) {
    return (
      <FlatList
        ListHeaderComponent={() => header}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={PrivateProfileMessage}
      />
    );
  }

  if (isLoading) {
    return (
      <View className="p-4">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={journeys}
      renderItem={({ item }) => <JourneyCard journey={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => header}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
      ListEmptyComponent={() => (
        <View className="py-4">
          <Text className="text-center text-text-secondary dark:text-text-dark-secondary">
            No journeys yet
          </Text>
        </View>
      )}
    />
  );
}
