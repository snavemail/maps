import { View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignedImage from './Journey/SignedImage';

export default function ImageCarousel({
  images,
  containerWidth,
}: {
  images: string[];
  containerWidth: number;
}) {
  const translateX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      translateX.value = event.contentOffset.x;
    },
  });
  const imageHeight = containerWidth * 0.75; // 4:3

  return (
    <View className="mt-3">
      <GestureHandlerRootView>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}>
          {images.map((image, index) => (
            <View
              key={index}
              style={{
                width: containerWidth,
                height: imageHeight,
              }}
              className="overflow-hidden">
              <SignedImage imagePath={image} />
            </View>
          ))}
        </Animated.ScrollView>
      </GestureHandlerRootView>
    </View>
  );
}
