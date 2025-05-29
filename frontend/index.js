/**
 * @format
 */
// import {AppRegistry} from 'react-native'; // Commented out for Expo
import App from './App';
// import {name as appName} from './app.json'; // Commented out for Expo
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import {LogBox} from 'react-native';
import { registerRootComponent } from 'expo'; // Added for Expo

const messaging = getMessaging(getApp());

setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

LogBox.ignoreLogs([
  'ReactImageView: Image source "null" doesn\'t exist',
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

// AppRegistry.registerComponent(appName, () => App); // Commented out for Expo
registerRootComponent(App); // Added for Expo
