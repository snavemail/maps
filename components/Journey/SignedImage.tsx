import { Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useImageStore } from '~/stores/useImage';

export default function SignedImage({ imagePath }: { imagePath: string }) {
  const [signedURL, setSignedURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const getSignedUrl = useImageStore.getState().getSignedUrl;

  useEffect(() => {
    const loadImage = async () => {
      const url = await getSignedUrl(imagePath);
      setSignedURL(url);
    };
    loadImage();
  }, [imagePath]);

  return (
    <View className="h-full w-full">
      <View
        className={`absolute h-full w-full bg-gray-100 transition-opacity ${
          loading ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {signedURL && (
        <Image
          source={{ uri: signedURL }}
          className="h-full w-full"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      )}
    </View>
  );
}
