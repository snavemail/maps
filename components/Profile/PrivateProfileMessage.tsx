import { View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';

export default function PrivateProfileMessage() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="rounded-xl bg-background p-6 dark:bg-background-dark">
        <Lock size={24} className="text-gray dark:text-gray-dark mb-4 self-center" />
        <Text className="mb-2 text-center text-lg font-semibold text-text dark:text-text-dark">
          Private Profile
        </Text>
        <Text className="text-center text-text-secondary dark:text-text-dark-secondary">
          Follow this account to see their journeys
        </Text>
      </View>
    </View>
  );
}
