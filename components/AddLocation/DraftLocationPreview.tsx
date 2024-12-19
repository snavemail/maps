import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { generateTime } from '~/lib/utils';
import { Camera } from '@rnmapbox/maps';

export default function DraftLocationPreview({
  draftLocation,
  cardWidth,
  index,
  cameraRef,
}: {
  draftLocation: DraftLocation;
  cardWidth: number;
  index: number;
  cameraRef: React.RefObject<Camera>;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/addLocation/[slug]',
          params: { slug: draftLocation.id },
        });
      }}
      style={{
        width: cardWidth,
        backgroundColor: '#FFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        padding: 20,
      }}>
      <View>
        <View className="flex flex-1 flex-col justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {index + 1}. {draftLocation.title}
            </Text>

            <View className="mt-1 flex-row items-center">
              <FontAwesome name="map-marker" size={12} color="#666" />
              <Text className="ml-1 text-sm text-gray-600" numberOfLines={1}>
                {draftLocation.address}
              </Text>
            </View>

            <View className="mt-1 flex-row items-center">
              <FontAwesome name="clock-o" size={12} color="#666" />
              <Text className="ml-1 text-sm text-gray-600">{generateTime(draftLocation.date)}</Text>
            </View>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-row">
              {[...Array(5)].map((_, index) => (
                <FontAwesome
                  key={index}
                  name={index < draftLocation.rating ? 'star' : 'star-o'}
                  size={12}
                  color={index < draftLocation.rating ? '#FFD700' : '#CCCCCC'}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>

            {draftLocation.images.length > 0 && (
              <View className="flex-row items-center">
                <FontAwesome name="camera" size={12} color="#666" />
                <Text className="ml-1 text-xs text-gray-600">{draftLocation.images.length}</Text>
              </View>
            )}
          </View>
        </View>
        <View>
          <Pressable
            onPress={() => {
              cameraRef?.current?.flyTo(
                [draftLocation.coordinates.longitude, draftLocation.coordinates.latitude],
                500
              );
            }}>
            <FontAwesome name="circle" size={12} color="#666" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
