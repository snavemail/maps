import { FontAwesome } from '@expo/vector-icons';
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

function isNumericString(str: string): boolean {
  const num = Number(str);
  return !isNaN(num) && typeof num === 'number';
}

export const getTitle = ({
  isJourney,
  address,
}: {
  isJourney: boolean;
  address: Location.LocationGeocodedAddress;
}) => {
  console.log(address);
  if (isJourney) {
    if (address.city) {
      return `${address.city} Journey`;
    }
    if (address.district) {
      return `${address.district} Journey`;
    }
    if (address.street) {
      return `${address.street} Journey`;
    }
    if (address.name && !isNumericString(address.name)) {
      return `${address.name} Journey`;
    }
    return 'New Journey';
  } else {
    if (address.name && !isNumericString(address.name)) {
      return `${address.name}`;
    }
    if (address.street) {
      return `${address.street}`;
    }
    if (address.city) {
      return `${address.city} Stop`;
    }

    return 'New Stop';
  }
};

export const getIconName = (maki: string) => {
  const iconMap: { [key: string]: React.ComponentProps<typeof FontAwesome>['name'] } = {
    restaurant: 'cutlery',
    bar: 'glass',
    park: 'tree',
    cafe: 'coffee',
    grocery: 'shopping-cart',
    pharmacy: 'medkit',
    bank: 'bank',
    school: 'graduation-cap',
    library: 'book',
    hospital: 'hospital-o',
    hotel: 'bed',
    gym: 'heartbeat',
    cinema: 'film',
    museum: 'institution',
    gas: 'car',
    default: 'map-marker',
  };
  return iconMap[maki] || iconMap.default;
};
