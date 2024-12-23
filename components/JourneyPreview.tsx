// import { View, Text, Pressable, Image } from 'react-native';
// import React, { useMemo } from 'react';
// import MapPreview from './MapPreview';
// import { useRouter } from 'expo-router';
// import { FontAwesome } from '@expo/vector-icons';
// import { UserRound } from 'lucide-react-native';

// function JourneyPreview({ journey }: { journey: JourneyWithProfile }) {
//   const router = useRouter();

//   // Calculate duration and format dates
//   const { duration, dateRange } = useMemo(() => {
//     const firstDate = new Date(journey.start_date);
//     const lastDate = new Date(journey.locations[journey.locations.length - 1].date);
//     const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     return {
//       duration: diffDays === 0 ? 'Single day' : `${diffDays} days`,
//       dateRange: `${firstDate.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       })} - ${lastDate.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       })}`,
//     };
//   }, [journey.start_date, journey.locations]);

//   return (
//     <View className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
//       <Pressable
//         className="overflow-hidden"
//         style={({ pressed }) => (pressed ? { opacity: 0.9 } : {})}>
//         <View className="flex-row items-center px-4 pb-2 pt-3">
//           {journey.profile.avatar_url ? (
//             <Image source={{ uri: journey.profile.avatar_url }} className="h-8 w-8 rounded-full" />
//           ) : (
//             <View className="h-8 w-8 rounded-full bg-gray-200">
//               <UserRound size={8} />
//             </View>
//           )}
//           <View className="ml-2 flex-1">
//             <Text className="font-medium text-gray-900">
//               {journey.profile.first_name} {journey.profile.last_name}
//             </Text>
//             <Text className="text-xs text-gray-500">{dateRange}</Text>
//           </View>
//         </View>

//         <View className="p-4">
//           <View className="flex-row items-center justify-between">
//             <Text className="text-lg font-bold text-gray-900">{journey.title}</Text>
//             <View className="flex-row items-center">
//               <FontAwesome name="map-marker" size={14} color="#666" />
//               <Text className="ml-1 text-sm text-gray-600">
//                 {journey.locations.length} locations
//               </Text>
//             </View>
//           </View>

//           <View className="mb-3 mt-1 flex-row items-center">
//             <FontAwesome name="clock-o" size={14} color="#666" />
//             <Text className="ml-1 text-sm text-gray-600">{duration}</Text>
//           </View>

//           {journey.description && (
//             <Text numberOfLines={2} className="text-sm text-gray-600">
//               {journey.description}
//             </Text>
//           )}
//         </View>

//         <Pressable onPress={() => router.push(`/journey/${journey.id}`)}>
//           <View className="h-48">
//             <MapPreview journey={journey} />
//           </View>
//         </Pressable>
//       </Pressable>
//     </View>
//   );
// }

// export default JourneyPreview;
import { View, Text, Pressable, Image } from 'react-native';
import React, { useMemo } from 'react';
import MapPreview from './MapPreview';
import { useRouter } from 'expo-router';
import { MapPin, Clock, Camera, UserRound, ChevronRight, Star } from 'lucide-react-native';

function JourneyPreview({ journey }: { journey: JourneyWithProfile }) {
  const router = useRouter();

  const { duration, dateRange, totalPhotos, averageRating } = useMemo(() => {
    const firstDate = new Date(journey.start_date);
    const lastDate = new Date(journey.locations[journey.locations.length - 1].date);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // total photos across all locations
    const photos = journey.locations.reduce((sum, loc) => sum + (loc.images?.length || 0), 0);

    // average rating
    const ratings = journey.locations
      .filter((loc) => loc.rating)
      .map((loc) => loc.rating as number);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b) / ratings.length : 0;

    return {
      duration: diffDays === 0 ? 'Single day' : `${diffDays} days`,
      dateRange: `${firstDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${lastDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
      totalPhotos: photos,
      averageRating: Math.round(avg * 10) / 10,
    };
  }, [journey]);

  return (
    <Pressable
      onPress={() => router.push(`/journey/${journey.id}`)}
      className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm"
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : {})}>
      <View className="h-40">
        <MapPreview journey={journey} />
        <View className="absolute left-4 right-4 top-4 flex-row items-center justify-between">
          <View className="flex-row items-center rounded-full bg-black/50 px-3 py-1.5">
            <MapPin size={14} color="white" />
            <Text className="ml-1 text-sm font-medium text-white">
              {journey.locations.length} stops
            </Text>
          </View>
          {averageRating > 0 && (
            <View className="flex-row items-center rounded-full bg-black/50 px-3 py-1.5">
              <Star size={14} color="white" fill="white" />
              <Text className="ml-1 text-sm font-medium text-white">{averageRating}</Text>
            </View>
          )}
        </View>
      </View>

      <View className="p-4">
        {/* User Info & Date */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {journey.profile.avatar_url ? (
              <Image
                source={{ uri: journey.profile.avatar_url }}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <UserRound size={16} color="#374151" />
              </View>
            )}
            <Text className="ml-2 font-medium text-gray-900">
              {journey.profile.first_name} {journey.profile.last_name}
            </Text>
          </View>
          <Text className="text-sm text-gray-500">{dateRange}</Text>
        </View>

        <View className="mb-3">
          <Text className="text-lg font-bold text-gray-900">{journey.title}</Text>
          {journey.description && (
            <Text numberOfLines={2} className="mt-1 text-sm text-gray-600">
              {journey.description}
            </Text>
          )}
        </View>
        <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
          <View className="flex-row items-center space-x-4">
            <View className="flex-row items-center">
              <Clock size={16} color="#666666" />
              <Text className="ml-1.5 text-sm text-gray-600">{duration}</Text>
            </View>
            {totalPhotos > 0 && (
              <View className="flex-row items-center">
                <Camera size={16} color="#666666" />
                <Text className="ml-1.5 text-sm text-gray-600">{totalPhotos} photos</Text>
              </View>
            )}
          </View>
          <ChevronRight size={20} color="#666666" />
        </View>
      </View>
    </Pressable>
  );
}

export default JourneyPreview;
