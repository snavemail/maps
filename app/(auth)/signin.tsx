// app/(auth)/signin.tsx
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '~/stores/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { signInSchema, SignInValues } from '~/lib/validations/auth';
import { Input } from '~/components/Input';

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
    <View className="flex-1 justify-center border-2 bg-white p-4">
      <View className="mt-12 py-8">
        <Text className="text-3xl font-bold text-gray-900">Sign In</Text>
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

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable>
            <Text className="text-right text-blue-600">Forgot password?</Text>
          </Pressable>
        </Link>

        <Pressable
          className="rounded-xl bg-black p-3"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Sign In</Text>
          )}
        </Pressable>
      </View>

      {/* Social Auth */}
      <View className="mt-8">
        <Text className="mb-4 text-center text-gray-500">Or continue with</Text>

        <View className="flex flex-row gap-2">
          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-300 p-3"
            onPress={() => console.log('Google')}>
            <FontAwesome name="google" size={20} color="#DB4437" />
            <Text className="ml-2 font-medium">Google</Text>
          </Pressable>

          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-300 p-3"
            onPress={() => console.log('Apple')}>
            <FontAwesome name="apple" size={20} color="black" />
            <Text className="ml-2 font-medium">Apple</Text>
          </Pressable>
        </View>
      </View>

      {/* Sign Up Link */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Pressable onPress={() => router.replace('/(auth)/signup')}>
          <Text className="font-semibold text-blue-600">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
