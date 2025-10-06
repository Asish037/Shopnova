import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
 
export const requestNotificationPermission = async () => {
  try {
    console.log('🔔 Starting notification permission request...');
    console.log('Platform:', Platform.OS);
    console.log('Android Version:', Platform.Version);

    // Step 1: Request Android notification permission (Android 13+)
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      console.log('📱 Requesting POST_NOTIFICATIONS permission for Android 13+');
      const result = await request('android.permission.POST_NOTIFICATIONS');

      if (result === RESULTS.GRANTED) {
        console.log('✅ POST_NOTIFICATIONS permission granted');
      } else {
        console.log('❌ POST_NOTIFICATIONS permission denied:', result);
        Alert.alert('❌ Notification permission denied or blocked');
        return false;
      }
    } else {
      console.log('✅ No POST_NOTIFICATIONS permission needed (< Android 13)');
    }

    // Step 2: Request Firebase messaging permission
    console.log('🔥 Requesting Firebase messaging permission...');
    const authStatus = await messaging().requestPermission();
    console.log('Firebase auth status:', authStatus);
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('❌ Firebase messaging permission denied');
      Alert.alert('❌ Firebase messaging permission denied');
      return false;
    }

    console.log('✅ Firebase messaging permission granted');

    // Step 3: Register for remote messages (iOS only)
    if (Platform.OS === 'ios') {
      console.log('🍎 Registering device for remote messages (iOS)');
      await messaging().registerDeviceForRemoteMessages();
      // Wait a bit for APNS token to be available
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Step 4: Get FCM token with retry mechanism
    console.log('🎫 Attempting to get FCM token...');
    let fcmToken = null;
    let retries = 3;
    
    while (retries > 0 && !fcmToken) {
      try {
        console.log(`FCM token attempt ${4 - retries}...`);
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('📲 FCM Token obtained:', fcmToken.substring(0, 20) + '...');
          await AsyncStorage.setItem('fcmToken', fcmToken);
          console.log('✅ FCM Token saved to AsyncStorage');
          break;
        } else {
          console.log('❌ FCM token is null');
        }
      } catch (error) {
        console.log(`❌ FCM token attempt ${4 - retries} failed:`, error.message);
        retries--;
        if (retries > 0) {
          console.log(`⏳ Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!fcmToken) {
      console.log('❌ Failed to get FCM token after all retries');
      return false;
    }

    console.log('✅ Notification permission setup completed successfully');
    return true;

  } catch (error) {
    console.error('❌ Notification permission error:', error);
    console.error('Error details:', error);
    return false;
  }
};
