// app/(auth)/signup.tsx
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '~/stores/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { signUpSchema, SignUpValues } from '~/lib/validations/auth';
import { Input } from '~/components/Input';

export default function SignUpScreen() {
  const { signUp, loading } = useAuthStore();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    try {
      await signUp(data.email, data.password, data.firstName, data.lastName);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white p-3">
      <View className="mt-12 py-8">
        <Text className="text-3xl font-bold text-gray-900">Sign Up</Text>
      </View>

      <View className="flex flex-col gap-4">
        <View className="flex w-full flex-row gap-2">
          <View className="flex-1">
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="First Name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  keyboardType="default"
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Last Name"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  keyboardType="default"
                />
              )}
            />
          </View>
        </View>
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirm Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        {/* Sign Up Button */}
        <Pressable
          className="rounded-xl bg-black p-3"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Create Account</Text>
          )}
        </Pressable>
      </View>

      {/* Social Auth */}
      <View className="mt-8">
        <Text className="mb-4 text-center text-gray-500">Or continue with</Text>

        <View className="flex flex-row gap-2">
          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-300 p-3"
            onPress={() => alert('Google')}>
            <FontAwesome name="google" size={20} color="#DB4437" />
            <Text className="ml-2 font-medium">Google</Text>
          </Pressable>

          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-300 p-3"
            onPress={() => alert('Apple')}>
            <FontAwesome name="apple" size={20} color="black" />
            <Text className="ml-2 font-medium">Apple</Text>
          </Pressable>
        </View>
      </View>

      {/* Sign In Link */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Pressable onPress={() => router.replace('/(auth)/signin')}>
          <Text className="font-semibold text-blue-600">Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
