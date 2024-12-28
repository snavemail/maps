import { View, Text, TextInput, Pressable, ActivityIndicator, Switch } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import React from 'react';
import Toast from 'react-native-toast-message';
import { useProfile } from '~/hooks/useProfile';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

function isEditableField(field: string): field is EditableField {
  return ['first_name', 'last_name', 'bio', 'birthday', 'is_public', 'theme'].includes(field);
}

function EditFieldScreen() {
  const { field } = useLocalSearchParams<{ field: string }>();
  const { profile, updateProfile } = useProfile();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!profile) return null;
  if (!field || !isEditableField(field)) {
    return (
      <View className="flex-row p-4">
        <Text className="text-text dark:text-text-dark">Invalid field </Text>
        <Pressable onPress={() => router.back()}>
          <Text className="text-primary dark:text-primary-dark">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const [value, setValue] = useState(() => {
    switch (field) {
      case 'first_name':
        return profile.first_name;
      case 'last_name':
        return profile.last_name;
      case 'bio':
        return profile.bio ?? '';
      case 'birthday':
        return profile.birthday ? new Date(profile.birthday) : new Date();
      case 'is_public':
        return profile.is_public;
      default:
        return '';
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      let saveValue = value;
      if (field === 'birthday') {
        saveValue = (value as Date).toISOString();
      }
      await updateProfile({ [field]: saveValue });

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your changes have been saved',
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    switch (field) {
      case 'birthday':
        return (
          <Pressable onPress={() => setShowDatePicker(true)} className="py-2">
            <Text className="text-base text-text dark:text-text-dark">
              {format(value as Date, 'MMMM d, yyyy')}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={value as Date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setValue(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </Pressable>
        );

      case 'is_public':
        return (
          <Switch
            value={value as boolean}
            onValueChange={(newValue) => setValue(newValue)}
            trackColor={{ false: '#767577', true: '#60A5FA' }}
            thumbColor={value ? '#0f58a0' : '#f4f3f4'}
          />
        );

      default:
        return (
          <TextInput
            value={value as string}
            onChangeText={setValue}
            className="rounded-lg border-2 border-primary p-2 text-base text-text dark:border-primary-dark dark:text-text-dark"
            multiline={field === 'bio'}
            numberOfLines={field === 'bio' ? 4 : 1}
            autoCapitalize={field === 'first_name' || field === 'last_name' ? 'words' : 'none'}
            placeholder={getFieldPlaceholder(field)}
            placeholderTextColor="#9CA3AF"
          />
        );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getFieldTitle(field),
          headerShadowVisible: false,
        }}
      />
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View className="mt-4 bg-background p-4 dark:bg-background-dark">
          <Text className="mb-2 text-sm text-text-secondary dark:text-text-dark-secondary">
            {getFieldLabel(field)}
          </Text>
          {renderInput()}
        </View>

        <View className="mt-auto p-4">
          <Pressable
            className="w-full items-center rounded-full bg-primary py-3 dark:bg-primary-dark"
            onPress={handleSave}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-sans text-button-label text-white">Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

function getFieldTitle(field: EditableField): string {
  switch (field) {
    case 'first_name':
      return 'First Name';
    case 'last_name':
      return 'Last Name';
    case 'bio':
      return 'Bio';
    case 'birthday':
      return 'Birthday';
    case 'is_public':
      return 'Profile Privacy';
    default:
      return 'Edit Profile';
  }
}

function getFieldLabel(field: EditableField): string {
  switch (field) {
    case 'first_name':
      return 'Your first name';
    case 'last_name':
      return 'Your last name';
    case 'bio':
      return 'Write a short bio about yourself';
    case 'birthday':
      return 'Your birthday';
    case 'is_public':
      return 'Make your profile visible to everyone';
    default:
      return '';
  }
}

function getFieldPlaceholder(field: EditableField): string {
  switch (field) {
    case 'first_name':
      return 'Enter your first name';
    case 'last_name':
      return 'Enter your last name';
    case 'bio':
      return 'Tell us about yourself...';
    default:
      return '';
  }
}

export default EditFieldScreen;
