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

export const sameLocation = (
  locations: { coordinates: { latitude: number; longitude: number } }[]
) => {
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  if (locations.length <= 1) return true;

  const referenceLocation = locations[0].coordinates;

  return locations.every(({ coordinates }) => {
    const distance = haversineDistance(
      referenceLocation.latitude,
      referenceLocation.longitude,
      coordinates.latitude,
      coordinates.longitude
    );
    return distance <= 200;
  });
};

export const diffBBox = (
  bbox1: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  } | null,
  bbox2: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  }
) => {
  if (!bbox1) return true;

  const width1 = bbox1.maxLon - bbox1.minLon;
  const height1 = bbox1.maxLat - bbox1.minLat;
  const width2 = bbox2.maxLon - bbox2.minLon;
  const height2 = bbox2.maxLat - bbox2.minLat;

  const widthDiff = Math.abs(width1 - width2) / width1;
  const heightDiff = Math.abs(height1 - height2) / height1;

  const sizeChanged = widthDiff >= 0.5 || heightDiff >= 0.5;

  const halfWidth2 = width2 / 2;
  const halfHeight2 = height2 / 2;

  const locationChanged =
    bbox2.minLon + halfWidth2 < bbox1.minLon ||
    bbox2.maxLon - halfWidth2 > bbox1.maxLon ||
    bbox2.minLat + halfHeight2 < bbox1.minLat ||
    bbox2.maxLat - halfHeight2 > bbox1.maxLat;

  return sizeChanged || locationChanged;
};
