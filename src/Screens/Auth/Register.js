import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import moment from 'moment';
//import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import ToastMessage from 'react-native-toast-message';
// import Picker from '../../Components/DropDownPicker/Picker';
import CountryCityModal from '../../Components/Modal/CountryCityModal';
import {ETHNCITY_TYPE, GENDER} from '../../Constant/DATA';
//import Auth from '../../Service/Auth';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {ImageBackground} from 'react-native';
import model4 from '../../assets/model9.jpg';
import CustomInput from '../../Components/CustomInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../../Components/axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermission } from '../../utils/requestNotificationPermission';

const datet = new Date();

const year = datet.getFullYear();
const month = datet.getMonth();
const day = datet.getDate();

export default function Register() {
  const navigation = useNavigation();

  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState('');
  const [fcmToken, setFcmToken] = React.useState('');
  const [select_code, setSelectCode] = useState('91');
  // const [email, setEmail] = React.useState('');
  // const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    // First request permission and generate FCM token, then get it from storage
    requestNotificationPermission().then(() => {
      // After permission is granted and token is generated, get it from storage
      getStoredFcmToken();
    }).catch((error) => {
      console.log('Notification permission error:', error);
      // Even if permission fails, try to get existing token
      getStoredFcmToken();
    });
  }, []);

  const getStoredFcmToken = async () => {
    try {
      const token = await AsyncStorage.getItem('fcmToken');
      if (token !== null) {
        console.log('Stored FCM Token:', token);
        setFcmToken(token)
        return token;
      } else {
        console.log('No FCM token found');
        return null;
      }
    } catch (error) {
      console.error('Error reading FCM token:', error);
      return null;
    }
  };

  // Define the registerUser function to handle registration logic
  const registerUser = async() => {
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    if (!phone || phone.length < 9) {
      setError('Please enter a valid mobile number (at least 9 digits).');
      return;
    }
    
    setError('');
    let data = {
      name: name,
      phone: phone
    };
    // ✅ Only include FCM token if it's available
    if (fcmToken) {
      data.fcm_token = fcmToken;
    } else {
      console.warn('FCM token not available');
    }
    console.log('Sending data:', data);
    let options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url: 'register-login',
    };

    try {
      const res = await axios(options);
      console.log('Full response:', res);
      console.log('Response data:', res.data);
      console.log('User ID from response:', res.data.data?.user_id);
      
      // Show success toast message
      if (res.data && res.data.message) {
        ToastMessage.show({
          type: 'success',
          text1: res.data.message,
          text2: 'Please check your phone for OTP',
          position: 'top',
          visibilityTime: 3000,
        });
        
        // Navigate to OTP screen after a short delay
        setTimeout(() => {
          const userId = res.data.data?.user_id;
          console.log('Navigating with user_id:', userId);
          navigation.navigate('Otp', {user_id: userId, phone: phone});
        }, 1500);
      } else {
        // Fallback if no message in response
        ToastMessage.show({
          type: 'success',
          text1: res.data.message,
          text2: 'Please check your phone for OTP',
          position: 'top',
          visibilityTime: 3000,
        });
        
        setTimeout(() => {
          const userId = res.data.data?.user_id;
          console.log('Navigating with user_id (fallback):', userId);
          navigation.navigate('Otp', {user_id: userId, phone: phone});
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error toast message
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      ToastMessage.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={model4}
        style={styles.bgImage}
        resizeMode="fit">
        {/* Logo at top left, over image */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text>Style</Text><Text style={styles.logoBold}>ON</Text>
          </Text>
        </View>
        {/* Login box at bottom, not full height */}
        <View style={styles.loginBoxOuter}>
          <ScrollView 
            style={styles.loginBox}
            contentContainerStyle={styles.loginBoxContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.loginTitle}>Login / Signup</Text>
            {/* <Text style={styles.loginSubtitle}>
              Join us now to be a part of StyleON family.
            </Text> */}
            {/* Name input */}
            <View style={styles.inputRowFull}>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter Name"
                placeholderTextColor="#B0B0B0"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            {/* Phone input */}
            <View style={styles.inputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>+{select_code}</Text>
              </View>
              <TextInput
                style={styles.mobileInput}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#B0B0B0"
                keyboardType="phone-pad"
                value={phone}
                maxLength={10}
                onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={styles.continueContainer}
              onPress={registerUser}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.continueBtn}>
                <Text style={styles.continueText}>CONTINUE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
      <ToastMessage />
    </View>
  );
}

// Styles should be defined outside the component and passed to StyleSheet.create
const styles = StyleSheet.create({
  // New styles for the new UI
  inputRowFull: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 48,
  },
  bgImage: {
    flex: 1, // Add this line to make the image fill the container
    width: '100%',
    height: '100%',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: 48,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 30,
    left: Platform.OS === 'ios' ? 18 : 10,
    zIndex: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'semibold',
    color: 'red',
    letterSpacing: 1,
  },
  logoBold: {
    color: 'red',
    fontWeight: '900',
  },
  loginBoxOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 180,
    marginBottom: 0,
  },
  loginBoxContent: {
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    marginTop: 0,
  },
  loginSubtitle: {
    fontSize: 13,
    color: '#ba6060ff',
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 48,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  flag: {
    fontSize: 20,
    marginRight: 2,
  },
  countryCode: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 4,
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 8,
    height: 48,
  },
  continueContainer: {
    width: '100%',
    height: verticalScale(40),
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  continueBtn: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 4,
    marginTop: 2,
  },
});
