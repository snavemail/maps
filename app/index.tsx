import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

export default function Page() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return <Redirect href="/(tabs)/map" />;
}
