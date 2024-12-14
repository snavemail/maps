import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import JourneyPreview from '~/components/JourneyPreview';

export default function Feed() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{ gap: 3 }}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
}
