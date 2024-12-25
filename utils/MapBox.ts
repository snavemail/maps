import { Camera } from '@rnmapbox/maps';

export const centerOnLocation = ({
  location,
  cameraRef,
  animationDuration = 800,
}: {
  location: { latitude: number; longitude: number } | null;
  cameraRef: React.MutableRefObject<Camera | null>;
  animationDuration?: number;
}) => {
  if (location && cameraRef.current) {
    cameraRef.current.flyTo([location.longitude, location.latitude], animationDuration);
  }
};

export const centerOnCoordinates = ({
  minLon,
  minLat,
  maxLon,
  maxLat,
  cameraRef,
  paddingConfig,
  animationDuration = 800,
  defaultZoomLevel = 13,
}: {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
  cameraRef: React.MutableRefObject<Camera | null>;
  paddingConfig: number[];
  animationDuration?: number;
  defaultZoomLevel?: number;
}) => {
  const isSinglePoint = Math.abs(maxLon - minLon) < 0.0001 && Math.abs(maxLat - minLat) < 0.0001;

  if (isSinglePoint) {
    cameraRef.current?.setCamera({
      centerCoordinate: [minLon, minLat],
      zoomLevel: defaultZoomLevel,
      animationDuration,
    });
  } else {
    cameraRef.current?.setCamera({
      bounds: {
        ne: [maxLon, maxLat],
        sw: [minLon, minLat],
      },
      padding: {
        paddingLeft: paddingConfig[3],
        paddingRight: paddingConfig[1],
        paddingTop: paddingConfig[0],
        paddingBottom: paddingConfig[2],
      },
      animationDuration,
      zoomLevel: 13,
    });
  }
};

export const getBounds = ({
  coordinates,
}: {
  coordinates: number[][];
}): {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
} => {
  const [minLon, minLat, maxLon, maxLat] = coordinates.reduce(
    (bounds: number[], [lon, lat]: any) => [
      Math.min(bounds[0], lon),
      Math.min(bounds[1], lat),
      Math.max(bounds[2], lon),
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

  return { minLon, minLat, maxLon, maxLat };
};

export const resetCamera = ({
  cameraRef,
}: {
  cameraRef: React.MutableRefObject<Camera | null>;
}) => {
  cameraRef.current?.setCamera({
    heading: 0,
    animationDuration: 800,
    pitch: 0,
  });
};

export const centerOnUserReset = ({
  userLocation,
  cameraRef,
  paddingConfig,
  animationDuration = 800,
}: {
  userLocation: { latitude: number; longitude: number } | null;
  cameraRef: React.MutableRefObject<Camera | null>;
  paddingConfig: number[];
  animationDuration?: number;
}) => {
  if (userLocation && cameraRef.current) {
    cameraRef.current.setCamera({
      centerCoordinate: [userLocation.longitude, userLocation.latitude],
      zoomLevel: 1,
      padding: {
        paddingLeft: paddingConfig[3],
        paddingRight: paddingConfig[1],
        paddingTop: paddingConfig[0],
        paddingBottom: paddingConfig[2],
      },
      animationDuration: animationDuration,
    });
  }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
