import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ellipsis } from 'lucide-react-native';
import { Pressable, Alert } from 'react-native';
import { journeyService } from '~/services/journeyService';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '~/hooks/useProfile';

export default function ActionMenuJourney({ journeyID }: { journeyID: string }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useProfile();

  const deleteAlert = () =>
    Alert.alert('Are you sure you want to delete this journey?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          await journeyService.deleteJourney(journeyID);
          queryClient.invalidateQueries({ queryKey: ['journeys', profile?.id] });
          router.back();
        },
        style: 'destructive',
      },
    ]);

  const onPress = () => {
    const options = ['Delete', 'Save', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        if (selectedIndex === undefined) return;
        switch (selectedIndex) {
          case 1:
            console.log('save', journeyID);
            break;

          case destructiveButtonIndex:
            deleteAlert();
            break;

          case cancelButtonIndex:
            console.log('cancel');
        }
      }
    );
  };

  return (
    <Pressable onPress={onPress}>
      <Ellipsis size={24} color="black" />
    </Pressable>
  );
}
