import { FontAwesome } from '@expo/vector-icons';
import { View, ScrollView, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const LocationCard = ({ location }: { location: DraftLocation }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/form/[slug]',
          params: { slug: location.id },
        })
      }>
      <View className="mb-3 rounded-lg border border-gray-200 p-3">
        <View className="flex-row justify-between">
          <Text className="font-medium">{location.title}</Text>
          <Text className="text-xs text-gray-500">
            {new Date(location.date).toLocaleDateString()}
          </Text>
        </View>

        {location.description && (
          <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
            {location.description}
          </Text>
        )}

        {location.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
            contentContainerStyle={{ gap: 8 }}>
            {location.images.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} className="h-16 w-16 rounded-md" />
            ))}
          </ScrollView>
        )}

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xs text-gray-500">
            {!location.hideLocation && location.address}
          </Text>
          {location.rating > 0 && (
            <View className="flex-row">
              {[...Array(location.rating)].map((_, i) => (
                <FontAwesome key={i} name="star" size={12} color="black" />
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default LocationCard;
