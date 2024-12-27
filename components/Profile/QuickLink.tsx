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
    className="border-border dark:border-border-dark flex-row items-center border-b py-4"
    onPress={onPress}>
    <LucideIcon iconName={iconName} size={20} color={'#000'} />
    <Text className="text-body-large text-text dark:text-text-dark ml-4 flex-1 font-sans">
      {label}
    </Text>
    <FontAwesome name="chevron-right" size={16} color={'#94A3B8'} />
  </Pressable>
);

export default QuickLink;
