import React from 'react';
import MapMarker from '~/components/Maps/Markers/MapMarker';
import BaseMap from './BaseMap';

export default function LocationMap({
  location,
  logoEnabled = false,
  animationDuration = 800,
}: {
  location: any;
  animationDuration?: number;
  logoEnabled?: boolean;
}) {
  return (
    <BaseMap
      locations={[location]}
      interactive={false}
      showLine={false}
      logoEnabled={logoEnabled}
      showLocationPuck={false}
      animationDuration={animationDuration}>
      <MapMarker location={location} hidden={location.hideLocation} />
    </BaseMap>
  );
}
