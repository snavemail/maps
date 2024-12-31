import { Platform, Pressable, Text } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '~/stores/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function AppleSignin() {
  const { signInWithOAuth } = useAuthStore();
  const { colorScheme } = useColorScheme();

  if (Platform.OS === 'ios')
    return (
      <Pressable
        className="flex-1 flex-row items-center justify-center rounded-xl border border-black p-3 dark:bg-black"
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            console.log('credential', JSON.stringify(credential, null, 2));
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              await signInWithOAuth(
                'apple',
                credential.identityToken,
                credential.fullName?.givenName ?? `User${Math.floor(Math.random() * 1000000)}`,
                credential.fullName?.familyName ?? ''
              );
            } else {
              throw new Error('No identityToken.');
            }
          } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}>
        <FontAwesome name="apple" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        <Text className="ml-2 text-lg font-medium text-text dark:text-text-dark">Apple</Text>
      </Pressable>
    );
  return <>{/* Implement Android Auth options. */}</>;
}
