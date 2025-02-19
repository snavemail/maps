import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { usePreferenceStore } from '~/stores/usePreferences';

export const useThemeSync = () => {
  const theme = usePreferenceStore((state) => state.theme);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);
};
