import { View, Text, TextInput, TextInputProps } from 'react-native';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({ error, label, ...props }, ref) => {
  return (
    <View className="gap-2">
      {label && (
        <Text className="ml-2 text-sm font-medium text-text dark:text-text-dark">{label}</Text>
      )}
      <TextInput
        ref={ref}
        className={`rounded-xl bg-gray-200 p-3 text-text dark:bg-gray-700 dark:text-text-dark ${error ? 'border border-danger' : ''}`}
        {...props}
      />
      {error && <Text className="text-sm text-danger">{error}</Text>}
    </View>
  );
});
