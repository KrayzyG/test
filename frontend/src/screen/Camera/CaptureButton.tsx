/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {View} from 'react-native-ui-lib';
import {Colors} from 'react-native-ui-lib';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerGestureEvent,
  PanGestureHandler, // Sử dụng PanGesture để kéo mượt hơn
  PanGestureHandlerGestureEvent,
  State as GestureState,
} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {hapticFeedback} from '../../util/haptic'; // Điều chỉnh đường dẫn

interface CaptureButtonProps {
  // isRecording: boolean; // Removed
  zoom: number; // Retained for potential future use with pinch-to-zoom on preview
  minZoom: number; // Retained
  maxZoom: number; // Retained
  onTakePicture: () => void;
  // onStartRecord: () => void; // Removed
  // onStopRecord: () => void; // Removed
  onZoomChange: (newZoom: number) => void; // Retained for pinch-to-zoom on preview
  // longPressDurationMs?: number; // Removed
  // zoomSensitivity?: number; // Removed
}

const CaptureButton: React.FC<CaptureButtonProps> = ({
  // isRecording, // Removed
  zoom,
  minZoom,
  maxZoom,
  onTakePicture,
  // onStartRecord, // Removed
  // onStopRecord, // Removed
  onZoomChange,
  // longPressDurationMs = 250, // Removed
  // zoomSensitivity = 0.01, // Removed
}) => {
  // const pressTimer = useRef<NodeJS.Timeout | null>(null); // Removed: related to long press for video
  // const startYPan = useRef(0); // Removed: related to pan to zoom
  // const startZoomPan = useRef(zoom); // Removed
  // const isGestureActive = useRef(false); // Removed

  // // Cập nhật startZoomPan khi zoom prop thay đổi từ bên ngoài - No longer needed for pan zoom
  // useEffect(() => {
  //   startZoomPan.current = zoom;
  // }, [zoom]);

  const handlePress = () => {
    hapticFeedback();
    onTakePicture();
  };

  // PanGestureHandler and related logic for zoom is removed.
  // Zoom will be handled by CameraPreview's pinch gesture if available.

  return (
    // Simplified: No PanGestureHandler, LongPressGestureHandler becomes TouchableOpacity
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View // View nhận chạm cho LongPress và hiển thị nút
        style={{alignItems: 'center', justifyContent: 'center'}}>
        <View // Vòng tròn ngoài
          style={{
            width: 70, // Kích thước nút
            height: 70,
            borderRadius: 35,
            borderWidth: 2, // No longer changes with isRecording
            borderColor: Colors.grey40, // No longer changes with isRecording
            padding: 5,
            backgroundColor: Colors.rgba(Colors.grey40, 0.2), // Nền mờ nhẹ
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View // Chấm/Hình vuông bên trong
            style={{
              width: 50, // Fixed size (was conditional on isRecording)
              height: 50, // Fixed size
              borderRadius: 25, // Fixed shape (was conditional on isRecording)
              backgroundColor: Colors.white, // Fixed color (was conditional on isRecording)
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Need to import TouchableOpacity
import {TouchableOpacity} from 'react-native';

export default CaptureButton;
