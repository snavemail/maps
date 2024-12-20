import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Image,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ImageManipulator } from 'expo-image-manipulator';
import { getTitle } from '~/lib/utils';
import { useJourneyStore } from '~/stores/useJourney';
import { useUserLocationStore } from '~/stores/useUserLocation';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface LocationData {
  isUpdate: boolean;
  title: string;
  description: string;
  date: Date;
  images: ImageItem[];
  rating: number;
  hideLocation: boolean;
  hideTime: boolean;
}

export default function Publish() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const draftJourney = useJourneyStore((state) => state.draftJourney);

  const [form, setForm] = useState<any>(null);
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  const handleDiscard = () => {
    endJourney();
    onClose();
  };

  const onDiscard = () => {
    Alert.alert('Remove Location', 'Are you sure you want to remove this location?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Yes', onPress: handleDiscard, style: 'destructive' },
    ]);
  };

  const handleSubmit = () => {
    if (!draftJourney) return;
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-end">
      <ScrollView bounces stickyHeaderIndices={[0]} className="bg-white pb-8">
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
          <Text className="text-xl font-semibold">Save Journey</Text>
          <Pressable onPress={onClose} hitSlop={8} className="active:scale-95">
            <FontAwesome name="times" size={24} color="black" />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// return (
//   <KeyboardAvoidingView
//     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     className="flex-1 justify-end">
//     <ScrollView bounces stickyHeaderIndices={[0]} className="bg-white pb-8">
//       <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
//         <Text className="text-xl font-semibold">Save Journey</Text>
//         <Pressable onPress={onClose} hitSlop={8} className="active:scale-95">
//           <FontAwesome name="times" size={24} color="black" />
//         </Pressable>
//       </View>

//       <View className="p-4">
//         <View className="gap-y-4">
//           <View>
//             <Text className="mb-1 text-sm text-gray-600">Journey Title</Text>
//             <TextInput
//               value={journey.title}
//               onChangeText={(text) => setJourney((prev) => ({ ...prev, title: text }))}
//               className="rounded-lg border border-gray-200 p-3"
//               placeholder="Enter journey title"
//             />
//           </View>

//           <View>
//             <Text className="mb-1 text-sm text-gray-600">Description</Text>
//             <TextInput
//               value={journey.description}
//               onChangeText={(text) => setJourney((prev) => ({ ...prev, description: text }))}
//               className="rounded-lg border border-gray-200 p-3"
//               placeholder="Enter journey description"
//               multiline
//               numberOfLines={4}
//             />
//           </View>

//           <View>
//             <Text className="mb-1 text-sm text-gray-600">Start Date</Text>
//             <Pressable
//               onPress={() => setShowDatePicker(true)}
//               className="rounded-lg border border-gray-200 p-3">
//               <Text>{new Date(journey.startDate).toLocaleString()}</Text>
//             </Pressable>

//             <DateTimePickerModal
//               isVisible={showDatePicker}
//               buttonTextColorIOS="#000"
//               mode="datetime"
//               onConfirm={handleConfirm}
//               onCancel={() => setShowDatePicker(false)}
//               date={new Date(journey.startDate)}
//             />
//           </View>

//           <View>
//             <Text className="mb-3 text-sm text-gray-600">
//               Locations ({journey.locations.length})
//             </Text>
//             {journey.locations.map((location) => (
//               <LocationCard key={location.id} location={location} />
//             ))}
//           </View>
//         </View>

//         <View className="flex flex-col gap-4 py-4">
//           <Pressable
//             onPress={handleSubmit}
//             className="flex-1 items-center justify-center rounded-lg bg-black px-3 py-3 active:bg-[#1f1f1f]"
//             disabled={!journey.title || journey.locations.length === 0}>
//             <Text className="text-center font-semibold text-white">
//               Publish Journey
//             </Text>
//           </Pressable>
//           <Pressable onPress={onClose} className="flex-1 items-center justify-center">
//             <Text className="text-center font-semibold text-black underline">
//               Cancel
//             </Text>
//           </Pressable>
//         </View>
//       </View>
//     </ScrollView>
//   </KeyboardAvoidingView>
// );
// const LocationCard = ({ location }: { location: DraftLocation }) => {
//   return (
//     <View className="mb-3 rounded-lg border border-gray-200 p-3">
//       <View className="flex-row justify-between">
//         <Text className="font-medium">{location.title}</Text>
//         <Text className="text-xs text-gray-500">
//           {new Date(location.date).toLocaleDateString()}
//         </Text>
//       </View>

//       {location.description && (
//         <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
//           {location.description}
//         </Text>
//       )}

//       {location.images.length > 0 && (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="mt-2"
//           contentContainerStyle={{ gap: 8 }}
//         >
//           {location.images.map((image, index) => (
//             <Image
//               key={index}
//               source={{ uri: image }}
//               className="h-16 w-16 rounded-md"
//             />
//           ))}
//         </ScrollView>
//       )}

//       <View className="mt-2 flex-row items-center justify-between">
//         <Text className="text-xs text-gray-500">
//           {!location.hideLocation && location.address}
//         </Text>
//         {location.rating > 0 && (
//           <View className="flex-row">
//             {[...Array(location.rating)].map((_, i) => (
//               <FontAwesome key={i} name="star" size={12} color="black" />
//             ))}
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };
