import { FontAwesome } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Pressable, Text } from 'react-native';
import { useAuthStore } from '~/stores/useAuth';

export default function GoogleSigninButton() {
  const { signInWithOAuth } = useAuthStore();
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '727330355799-pan30c150krr1gbhjtck55jjne6jjbu1.apps.googleusercontent.com',
  });

  return (
    <Pressable
      className="flex-1 flex-row items-center justify-center rounded-xl border border-black p-3"
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.data?.idToken) {
            await signInWithOAuth('google', userInfo.data.idToken);
          } else {
            throw new Error('no ID token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}>
      <FontAwesome name="google" size={20} color="#DB4437" />
      <Text className="ml-2 text-lg font-medium">Google</Text>
    </Pressable>
  );
}
