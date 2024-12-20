import { supabase } from '~/lib/supabase';

export const locationService = {
  create: async (location: DraftLocation) => {
    const { data, error } = await supabase.from('locations').insert(location);
    if (error) throw error;
    return data;
  },

  uploadLocationPhoto: async (uri: string, locationID: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const uniqueFilename = `${locationID}/${Date.now()}-${uri.split('/').pop()}`;

    const { data, error } = await supabase.storage
      .from('location-photos')
      .upload(uniqueFilename, blob);

    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from('location_photos').getPublicUrl(uniqueFilename);
    return publicUrl;
  },

  saveLocationPhoto: async (locationID: string, photoURL: string) => {
    const { data: locationData, error: fetchError } = await supabase
      .from('locations')
      .select('images')
      .eq('id', locationID)
      .single();

    if (fetchError) throw new Error(`Error fetching location: ${fetchError.message}`);

    const updatedPhotoURLs = locationData.images ? [...locationData.images, photoURL] : [photoURL];

    const { data: updateData, error: updateError } = await supabase
      .from('locations')
      .update({ images: updatedPhotoURLs })
      .eq('id', locationID);

    if (updateError) throw new Error(`Error updating location: ${updateError.message}`);

    return updateData;
  },

  addLocationPhotos: async (locationID: string, photoURLs: string[]) => {
    const { data: locationData, error: fetchError } = await supabase
      .from('locations')
      .select('photo_urls')
      .eq('id', locationID)
      .single();

    if (fetchError) throw new Error(`Error fetching location: ${fetchError.message}`);

    const updatedPhotoURLs = locationData.photo_urls
      ? [...locationData.photo_urls, ...photoURLs]
      : photoURLs;

    const { data: updateData, error: updateError } = await supabase
      .from('locations')
      .update({ photo_urls: updatedPhotoURLs })
      .eq('id', locationID);

    if (updateError) throw new Error(`Error updating location: ${updateError.message}`);

    return updateData;
  },

  deleteLocationPhoto: async (locationID: string, photoURL: string) => {
    const { data: locationData, error: fetchError } = await supabase
      .from('locations')
      .select('photo_urls')
      .eq('id', locationID)
      .single();

    if (fetchError) throw new Error(`Error fetching location: ${fetchError.message}`);

    const updatedPhotoURLs =
      locationData.photo_urls?.filter((url: string) => url !== photoURL) || [];

    const { data: updateData, error: updateError } = await supabase
      .from('locations')
      .update({ photo_urls: updatedPhotoURLs })
      .eq('id', locationID);

    if (updateError) throw new Error(`Error updating location: ${updateError.message}`);

    return updateData;
  },

  replaceLocationPhotos: async (locationID: string, newPhotoURLs: string[]) => {
    const { data: updateData, error: updateError } = await supabase
      .from('locations')
      .update({ photo_urls: newPhotoURLs })
      .eq('id', locationID);

    if (updateError) throw new Error(`Error replacing photos: ${updateError.message}`);

    return updateData;
  },
};
