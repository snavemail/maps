import { FontAwesome } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

const QuickLink = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    className="flex-row items-center rounded-lg bg-gray-50 p-3"
    onPress={onPress}
    style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
    <FontAwesome name={icon} size={20} color="#374151" />
    <Text className="ml-3 flex-1 font-medium">{label}</Text>
    <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
  </Pressable>
);

export default QuickLink;
