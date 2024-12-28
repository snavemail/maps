import { FontAwesome } from '@expo/vector-icons';
import { LucideIcon } from '~/components/LucideIcon';
import { Pressable, Text } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const QuickLink = ({
  iconName,
  label,
  onPress,
}: {
  iconName: keyof typeof LucideIcons;
  label: string;
  onPress: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  return (
    <Pressable
      className="flex-row items-center border-b border-border py-4 dark:border-border-dark"
      onPress={onPress}>
      <LucideIcon iconName={iconName} size={20} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
      <Text className="ml-4 flex-1 font-sans text-body-large text-text dark:text-text-dark">
        {label}
      </Text>
      <FontAwesome name="chevron-right" size={16} color={'#94A3B8'} />
    </Pressable>
  );
};

export default QuickLink;
