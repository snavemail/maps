import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const [addressResult] = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    return {
      address: addressResult,
    };
  } catch (error) {
    console.error('Error:', error);
    alert('Error getting location');
  }
};

export const getTitle = ({
  isJourney,
  address,
}: {
  isJourney: boolean;
  address: Location.LocationGeocodedAddress;
}) => {
  if (isJourney) {
    if (address.city) {
      return `${address.city} Journey`;
    }
    if (address.district) {
      return `${address.district} Journey`;
    }
    if (address.name) {
      return `${address.name} Journey`;
    }
    return 'New Journey';
  } else {
    if (address.name) {
      return `${address.name}`;
    }
    if (address.district) {
      return `${address.district}`;
    }
    if (address.city) {
      return `${address.city} Stop`;
    }

    return 'New Stop';
  }
};
