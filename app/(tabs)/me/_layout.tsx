import { Stack, useRouter } from 'expo-router';
import { Bell, BookUser } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, Text, View } from 'react-native';
import { useNotifications } from '~/hooks/useNotifications';

export default function ProfileLayout() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#2f2f2f' : '#fff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#f1f1f1' : '#000',
        },
        headerTintColor: colorScheme === 'dark' ? '#f1f1f1' : '#000',
      }}>
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
                  <Bell size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
                  {unreadCount > 0 && (
                    <View className="absolute -right-2 -top-2 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 dark:bg-danger-400">
                      <Text className="text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => router.push('/(tabs)/me/add-user')} hitSlop={10}>
                  <BookUser size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
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
