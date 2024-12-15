import { View, Text, TextInput, TextInputProps } from 'react-native';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({ error, label, ...props }, ref) => {
  return (
    <View className="gap-2">
      {label && <Text className="ml-2 text-sm font-medium text-gray-700">{label}</Text>}
      <TextInput
        ref={ref}
        className={`rounded-xl bg-gray-100 p-3 ${error ? 'border border-red-500' : ''}`}
        {...props}
      />
      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
});
