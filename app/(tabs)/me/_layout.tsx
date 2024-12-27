import { Stack, useRouter } from 'expo-router';
import { Bell, BookUser } from 'lucide-react-native';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import { useNotifications } from '~/hooks/useNotifications';

export default function ProfileLayout() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const isDark = useColorScheme() === 'dark';
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Profile',
          headerRight: () => {
            return (
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => router.push('/(tabs)/me/notifications')}
                  hitSlop={10}
                  className="relative">
                  <Bell size={24} color={isDark ? 'white' : 'black'} />
                  {unreadCount > 0 && (
                    <View className="bg-danger dark:bg-danger-400 absolute -right-2 -top-2 h-[18px] min-w-[18px] items-center justify-center rounded-full px-1">
                      <Text className="text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => router.push('/(tabs)/me/add-user')} hitSlop={10}>
                  <BookUser size={24} color={isDark ? 'white' : 'black'} />
                </Pressable>
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen name="edit/[field]" />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-user"
        options={{ headerShown: true, title: 'Add User', animation: 'slide_from_right' }}
      />
      <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Notifications' }} />
    </Stack>
  );
}
