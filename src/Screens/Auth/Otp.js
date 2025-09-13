import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import model5 from '../../assets/model5.jpg';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import { verticalScale } from '../../PixelRatio';
import axios from '../../Components/axios';
import qs from 'qs';
import ToastMessage from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../../Context/CartContext';
import download from '../../assets/download2.jpeg';

const Otp = ({navigation, route}) => {
    const {user_id, phone} = route.params;
    const { login, setAuthToken } = React.useContext(CartContext);
    console.log('OTP Screen - Received params:', route.params);
    console.log('OTP Screen - user_id:', user_id);
    console.log('OTP Screen - phone:', phone);
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [timer, setTimer] = React.useState(30);
    const [isResendDisabled, setIsResendDisabled] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const refs = [];

    React.useEffect(() => {
        if (timer === 0) {
            setIsResendDisabled(false);
            return;
        }
        const interval = setInterval(() => {
            setTimer(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value, idx) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[idx] = value;
            setOtp(newOtp);
        // Auto focus next
        if (value && idx < 5) {
            refs[idx + 1]?.focus();
        }
        }
    };

    const handleContinue = async() => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
            return;
        }
        
        setIsLoading(true);
        // Mock verification: accept 123456 as valid
        // if (enteredOtp === '123456') {
        //     navigation.reset({
        //         index: 0,
        //         routes: [{name: 'MainHome'}],
        //     });
        // } else {
        //     Alert.alert('Error', 'Invalid OTP!');
        // }
        let data = {
          user_id: user_id || phone, // Use phone as user identifier
          otp: enteredOtp
        };
        console.log('OTP Verification - Final data being sent:', data);
        console.log('Using phone number as user_id:', user_id || phone);
        console.log('Sending data:', data);
        let options = {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(data),
          url: 'verify-otp',
        };
    
        try {
          const res = await axios(options);
          console.log('OTP Verification Response:', res);
          
          // Check if verification was successful
          if (res.data && res.status === 200) {
            // Extract token and user data from response
            const token = res.data?.data.token;
            const user = res.data?.data.user;
            
            console.log('Raw response data:', JSON.stringify(res.data));
            console.log('Extracted token:', token);
            console.log('Extracted user:', user);
            console.log('Token exists:', !!token);
            console.log('Token type:', typeof token);
            console.log('Token value:', token);
            
            // Prepare user data for global state
            const userInfo = {
              id: user_id || phone,
              phone: phone,
              ...user
            };
            
            // Set user data and token globally using login function
            console.log('About to call login function');
            console.log('userInfo:', userInfo);
            console.log('token being passed:', token);
            console.log('token type:', typeof token);
            console.log('token length:', token ? token.length : 'null');
            
            await login(userInfo, token);
            console.log('User data and token set globally successfully');
            
            // Verify the data was stored
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedUser = await AsyncStorage.getItem('userData');
            console.log('Verification - Stored token:', storedToken);
            console.log('Verification - Stored user:', storedUser);
            
            // Show success toast message
            ToastMessage.show({
              type: 'success',
              text1: res.data.message || 'OTP Verified Successfully',
              text2: 'Login Successful',
              position: 'top',
              visibilityTime: 3000,
            });
            
            // Navigate to MainHome after a short delay
            setTimeout(() => {
              setIsLoading(false);
              navigation.reset({
                index: 0,
                routes: [{name: 'MainHome'}],
              });
            }, 1500);
          } else {
            // Handle unsuccessful verification
            ToastMessage.show({
              type: 'error',
              text1: 'Verification Failed',
              text2: res.data?.message || 'Invalid OTP. Please try again.',
              position: 'top',
              visibilityTime: 4000,
            });
            setIsLoading(false);
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
          setIsLoading(false);
        }
    };

    const handleResend = () => {
        setOtp(['', '', '', '', '', '']);
        setTimer(30);
        setIsResendDisabled(true);
        // Add resend logic here
    };

    return (
        <ImageBackground source={download} style={styles.bgImage} resizeMode="cover">
            <View style={styles.overlay} />
            <View style={styles.container}>
                <View style={{position: 'absolute', top: -5, left: 20}}>
                    <Text style={styles.logoText}>
                        <Text>Shop</Text>
                        <Text style={styles.logoBold}>Nova</Text>
                    </Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.subtitle}>
                        We have sent Verification code to{'\n'}
                        <Text style={styles.phone}>{phone}</Text>{' '}
                        <Text onPress={() => navigation.goBack()} style={styles.edit}>
                        Edit
                        </Text>
                    </Text>
                    <View style={styles.otpRow}>
                        {otp.map((digit, idx) => (
                        <TextInput
                            key={idx}
                            ref={ref => (refs[idx] = ref)}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={val => handleOtpChange(val, idx)}
                            returnKeyType="next"
                            autoFocus={idx === 0}
                        />
                        ))}
                    </View>
                    <View style={styles.resendRow}>
                        <Text style={styles.resendText}>
                            Resend in {timer > 0 ? `${timer} sec` : ''}
                        </Text>
                        <TouchableOpacity
                            disabled={isResendDisabled}
                            onPress={handleResend}>
                            <Text
                                style={[styles.resendBtn, isResendDisabled && {color: '#aaa'}]}>
                                Resend
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.continueContainer}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                        disabled={otp.join('').length !== 6 || isLoading}>
                        <LinearGradient
                            colors={
                                otp.join('').length !== 6 || isLoading
                                ? ['#ccc', '#ccc']
                                : ['#FFD700', '#FFA500', '#FF8C00']
                            }
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[styles.continueBtn, isLoading && styles.continueBtnDisabled]}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.continueText}>CONTINUE</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#FF8C00',
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
  },
  logoBold: {
    color: '#FF8C00',
    fontWeight: '900',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 18,
  },
  phone: {
    color: '#222',
    fontWeight: 'bold',
  },
  edit: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  otpInput: {
    width: 40,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 6,
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  resendText: {
    fontSize: 13,
    color: '#888',
    marginRight: 8,
  },
  resendBtn: {
    fontSize: 13,
    color: '#007bff',
    textDecorationLine: 'underline',
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
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
});

export default Otp;
