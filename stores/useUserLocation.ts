import { create } from 'zustand';
import * as Location from 'expo-location';

type UserLocation = {
  lat: number;
  lon: number;
};

type UserLocationState = {
  userLocation: UserLocation | null;
  fetchUserLocation: () => Promise<void>;
  startTrackingUserLocation: () => void;
};

export const useUserLocationStore = create<UserLocationState>((set) => ({
  userLocation: null,
  fetchUserLocation: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    set({
      userLocation: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      },
    });
  },
  startTrackingUserLocation: () => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) =>
        set({
          userLocation: {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          },
        })
    );
  },
}));
