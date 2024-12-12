import { Stack } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import JourneyPreview from '~/components/JourneyPreview';
import { journeys } from '~/data/journeys';

export default function Profile() {
  return (
    <ScrollView>
      <Text className="text-xl font-bold">Profile</Text>
      <View className="gap-2">
        {journeys.map((journey: any) => (
          <JourneyPreview journey={journey} key={journey.journeyID} />
        ))}
      </View>
    </ScrollView>
  );
}
