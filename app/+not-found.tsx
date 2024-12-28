import { Link, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Oops!',
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
        }}
      />
      <View className={styles.container}>
        <Text className={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" className={styles.link}>
          <Text className={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = {
  container: `items-center flex-1 justify-center p-5`,
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: `text-base text-[#2e78b7]`,
};
