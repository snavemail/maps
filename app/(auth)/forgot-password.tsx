import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { router, useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { ForgotPasswordValues, forgotPasswordSchema } from '~/lib/validations/auth';
import { Input } from '~/components/Input';
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { loading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    alert('Check your email for reset instructions');
    // try {
    //   await resetPassword(data.email);
    //   alert('Check your email for reset instructions');
    //   router.back();
    // } catch (error: any) {
    //   alert(error.message);
    // }
  };

  return (
    <View className="flex-1 bg-white p-3">
      {/* Header */}
      <View className="mb-8 mt-12">
        <Text className="text-3xl font-bold text-gray-900">Reset Password</Text>
        <Text className="mt-2 text-gray-600">Enter your email to receive reset instructions</Text>
      </View>

      <View className="gap-4">
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

        <Pressable
          className="rounded-xl bg-black p-3"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Send Instructions</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text className="text-center text-blue-600">Back to Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
