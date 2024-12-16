import MapBottomSheet from '~/components/MainMapBottomSheet/MainMapBottomSheet';
import MainMap from '~/components/MainMap';
import { useState } from 'react';
import AddLocationForm from '~/components/AddLocationForm/AddLocationForm';

export default function Home() {
  const [locationFormData, setLocationFormData] = useState<{
    visible: boolean;
    locationID?: string;
  }>({
    visible: false,
    locationID: undefined,
  });

  const handleShowModal = (locationID?: string) => {
    if (locationFormData.visible) {
      setLocationFormData({ visible: false, locationID });
      return;
    }
    setTimeout(() => {
      setLocationFormData({ visible: true, locationID });
    }, 100);
  };

  const hideLocationForm = () => {
    setLocationFormData({ visible: false, locationID: undefined });
  };
  return (
    <>
      <MainMap />
      <MapBottomSheet showModal={handleShowModal} />
      <AddLocationForm
        visible={locationFormData.visible}
        locationID={locationFormData.locationID}
        onClose={hideLocationForm}
      />
    </>
  );
}
