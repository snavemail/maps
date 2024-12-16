// import { View, Text, Pressable } from 'react-native';
// import React from 'react';

// export default function MainMapBottomSheetEmpty({ onPress }: any) {
//   return (
//     <View className="flex h-full items-center justify-center bg-white p-4">
//       <Pressable onPress={onPress} className="rounded-full bg-gray-200 p-3">
//         <Text>Add Location</Text>
//       </Pressable>
//     </View>
//   );
// }
import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function MainMapBottomSheetEmpty({ onPress }: any) {
  return (
    <View className="justify-ceneter flex h-full items-center justify-center bg-white active:scale-90">
      <Pressable
        hitSlop={10}
        onPress={onPress}
        className="flex flex-row items-center justify-center gap-2 rounded-full bg-black p-4">
        <FontAwesome name="plus-circle" size={19} color="white" />
        <Text className="font-semibold text-white">Add Location</Text>
      </Pressable>
    </View>
  );
}
