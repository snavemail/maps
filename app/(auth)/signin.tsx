// app/(auth)/signin.tsx
import {
  KeyboardAvoidingView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '~/stores/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { signInSchema, SignInValues } from '~/lib/validations/auth';
import { Input } from '~/components/Input';
import GoogleSignin from '~/components/GoogleSignin';
import AppleSignin from '~/components/AppleSignin';

export default function SignInScreen() {
  const { signIn, loading } = useAuthStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center bg-background p-4 dark:bg-background-dark">
        <View className="mt-12 py-8">
          <Text className="text-3xl font-bold text-text dark:text-text-dark">Sign In</Text>
        </View>

        <View className="flex flex-col gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            className="mt-2 rounded-xl border border-black bg-background p-3 dark:bg-black"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className="text-center text-lg font-semibold text-text dark:text-text-dark">
                Sign In
              </Text>
            )}
          </Pressable>
        </View>

        {/* Social Auth */}
        <View className="mt-4">
          <Text className=" mb-4 text-center text-gray dark:text-gray-dark">Or continue with</Text>

          <View className="flex flex-row gap-2">
            <GoogleSignin />
            <AppleSignin />
          </View>
        </View>

        {/* Sign Up Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray dark:text-gray-dark">Don't have an account? </Text>
          <Pressable onPress={() => router.replace('/(auth)/signup')}>
            <Text className="font-semibold text-primary dark:text-primary-dark">Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
