import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {requestCameraPermission} from './permission';
import {requestMediaPermission} from './permission';

export const selectMedia = async (
  isMultiple?: boolean,
): Promise<Array<Asset> | undefined> => {
  try {
    await requestMediaPermission();
    const result = await launchImageLibrary({
      mediaType: 'photo', // Chọn chỉ ảnh
      quality: 1, // Chất lượng ảnh (0.0 - 1.0)
      selectionLimit: isMultiple ? 4 : 1, // 0 cho phép chọn nhiều ảnh
    });
    if (result.didCancel) {
      return undefined;
    }

    return result.assets;
  } catch (error) {
    console.error('error select image', error);
    return undefined;
  }
};

export const takePhoto = async (): Promise<Array<Asset> | undefined | null> => {
  try {
    await requestCameraPermission();
    const result = await launchCamera({
      // durationLimit: 7, // Removed: video-specific
      // videoQuality: 'medium', // Removed: video-specific
      mediaType: 'photo', // Changed to 'photo'
      maxWidth: 1020,
      maxHeight: 1020,
      // formatAsMp4: true, // Removed: video-specific
      quality: 1,
    });

    if (!result.didCancel) {
      return result.assets;
    }
  } catch (error) {
    console.error('Error taking photo', error);
  }
  return null;
};
