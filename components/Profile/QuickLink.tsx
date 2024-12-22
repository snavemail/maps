import { FontAwesome } from '@expo/vector-icons';
import { LucideIcon } from '~/components/LucideIcon';
import { Pressable, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';

const QuickLink = ({
  iconName,
  label,
  onPress,
}: {
  iconName: keyof typeof LucideIcons;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    className="flex-row items-center p-3"
    onPress={onPress}
    style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
    <LucideIcon iconName={iconName} size={20} color="#374151" />
    <Text className="ml-3 flex-1 font-medium">{label}</Text>
    <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
  </Pressable>
);

export default QuickLink;
