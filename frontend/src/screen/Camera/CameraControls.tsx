/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {View, TouchableOpacity, Icon, Colors} from 'react-native-ui-lib';
import {Animated} from 'react-native';
import CaptureButton from './CaptureButton';

interface CameraControlsProps {
  // isRecording: boolean; // Removed
  flashEnabled: boolean;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  onFlashToggle: () => void;
  onSwitchCamera: () => void;
  onTakePicture: () => void;
  onStartRecord: () => void;
  // onStopRecord: () => void; // Removed
  onZoomChange: (newZoom: number) => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  // isRecording, // Removed
  flashEnabled,
  zoom,
  minZoom,
  maxZoom,
  onFlashToggle,
  onSwitchCamera,
  onTakePicture,
  // onStartRecord, // Removed
  // onStopRecord, // Removed
  onZoomChange,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleSwitchCameraPress = () => {
    startRotation();
    onSwitchCamera();
  };

  return (
    <View
      centerV
      width={'100%'}
      row
      paddingV-s4
      style={{justifyContent: 'space-around'}}
      backgroundColor={Colors.black}>
      {/* Nút Flash */}
      <TouchableOpacity
        onPress={onFlashToggle}
        // disabled={isRecording} // Removed disabled state
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        <Icon
          assetGroup="icons"
          assetName={flashEnabled ? 'ic_flash' : 'ic_flash_off'}
          size={28}
          tintColor={Colors.grey40} // No longer changes color based on isRecording
        />
      </TouchableOpacity>

      {/* Nút Chụp/Quay/Zoom */}
      <CaptureButton
        // isRecording={isRecording} // Removed
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onTakePicture={onTakePicture}
        // onStartRecord={onStartRecord} // Removed
        // onStopRecord={onStopRecord} // Removed
        onZoomChange={onZoomChange}
      />

      {/* Nút Xoay Camera */}
      <TouchableOpacity
        onPress={handleSwitchCameraPress}
        // disabled={isRecording} // Removed disabled state
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
        <Animated.View
          style={[
            {transform: [{rotate: rotateInterpolate}]},
            // isRecording && {opacity: 0.5}, // Removed opacity change
          ]}>
          <Icon
            assetGroup="icons"
            assetName="ic_camera_rotate"
            size={28}
            tintColor={Colors.grey40}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default CameraControls;
