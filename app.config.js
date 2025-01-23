const getBundleID = () => {
  if (process.env.EXPO_ENV === 'production') {
    return 'com.liamevans.journy';
  }
  if (process.env.EXPO_ENV === 'preview') {
    return 'com.liamevans.journy.preview';
  }

  return 'com.liamevans.journy.dev';
};

const getAppName = () => {
  if (process.env.EXPO_ENV === 'production') {
    return 'Journy';
  }
  if (process.env.EXPO_ENV === 'preview') {
    return 'Journy (Preview)';
  }

  return 'Journy (Dev)';
};

const bundleID = getBundleID();
const appName = getAppName();

export default {
  expo: {
    newArchEnabled: true,
    name: appName,
    slug: 'maps',
    version: '1.0.0',
    scheme: 'lifeinatlas',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      userInterfaceStyle: 'dark',
      supportsTablet: true,
      bundleIdentifier: bundleID,
      useAppleSignIn: true,
    },
    android: {
      userInterfaceStyle: 'dark',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: bundleID,
    },
    plugins: [
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: 'com.googleusercontent.apps.727330355799-mv3e0qmac34sa08ul6qcladlfripgq6g',
        },
      ],
      'expo-apple-authentication',
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],

      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsDownloadToken:
            'sk.eyJ1Ijoic3BhbW1haWwiLCJhIjoiY200aGpoYmR0MDdtaDJpcGttendtbTZ3aCJ9.95THhu5LKQcO2uCeEkGTUg',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Show current location on map.',
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'ca95722f-fab3-43b5-b371-70722a6d816c',
      },
    },
  },
};
