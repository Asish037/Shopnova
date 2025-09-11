import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

// import {
//   getHash,
//   startOtpListener,
//   useOtpVerify,
//   RNOtpVerify
// } from 'react-native-otp-verify';

import RNOtpVerify, {getHash} from 'react-native-otp-verify';

export default function EmailScreen() {
  const [email, setemail] = useState('');
  const [otp, setOtp] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    RNOtpVerify.getOtp()
      .then(p => {
        RNOtpVerify.addListener(message => {
          console.log('hello==' + message);
          try {
            if (message && message !== 'Timeout Error') {
              const otp = /(\d{4})/g.exec(message)[1];
              if (otp.length === 4) {
                setOtp(otp);
                //setOtpArray(otp.split(''));
              }
            } else {
              console.log(
                'OTPVerification: RNOtpVerify.getOtp - message=>',
                message,
              );
            }
          } catch (error) {
            console.log('OTPVerification: RNOtpVerify.getOtp error=>', error);
          }
        });
      })
      .catch(error => {
        console.log('getOtp==' + error);
      });

    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  useEffect(() => {
    const getHash = () => {
      RNOtpVerify.getHash()
        .then(hash => {
          console.log('App.js: Application hash is=> ', hash);
          //message example
          console.log(`<#> Dear User,
              1091 is your OTP for verification. (Remaining Time: 10 minutes and 0 seconds)
               ${hash[0]}`);
        })
        .catch(error => {
          console.log(error);
        });
    };

    getHash();
  });

  const otpHandler = message => {
    const otpnew = /(\d{6})/g.exec(message)[1];
    setOtp(otpnew);
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  useEffect(() => {
    RNOtpVerify.removeListener();
  });

  const checkEmail = async () => {
    const result = await Auth.forgotPasswordEmailCheck({email: email});
    console.log('email checck', result);
    if (result && result.status) {
      // SimpleToast.show('Otp - ' + result?.data?.otp, SimpleToast.LONG);
      navigation.navigate('ForgotPassword', {otp: result?.data?.otp, email});
    } else {
      SimpleToast.show('Please enter a register email id!');
    }
  };
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginTop: moderateScale(45), marginLeft: moderateScale(15)}}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={'30'}
            style={{color: COLORS.white, fontSize: moderateScale(30)}}
          />
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 30,
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <ImageWithTitle title="Forgot Password" />

            {/* <TextInput
              placeholder="Your Email Address"
              placeholderTextColor={COLORS.white}
              keyboardType="email-address"
              style={styles.textInput}
              value={email}
              onChangeText={val => setemail(val.toLowerCase())}
            /> */}
            <TextInput
              placeholder="OTP here"
              placeholderTextColor={COLORS.white}
              keyboardType="email-address"
              style={styles.textInput}
              value={otp}
              textContentType="oneTimeCode"
              //autoComplete="one-time-code"
              autoComplete="sms-otp" // android
              onChangeText={val => setemail(val.toLowerCase())}
            />
          </View>
          <View style={styles.container1}>
            {Array(otp)
              .fill()
              .map((_, index) => (
                <TextInput
                  key={index}
                  value={otp[index]}
                  // onChangeText={(text) => handleChange(text, index)}
                  // onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  // defaultValue={defaultValue}
                  // editable={!defaultValue}
                  // style={[
                  //   styles.input,
                  //   focusedInput === index && styles.focusedInput,
                  // ]}
                  // ref={(ref) => (inputs.current[index] = ref)}
                  // onFocus={() => handleFocus(index)}
                  // onBlur={handleBlur}
                />
              ))}
          </View>
          <View>
            <GradientButton
              title="Submit"
              onPress={checkEmail}
              // onPress={() => Navigation.navigate('ForgotPassword')}
            />

            {/* <SocialLogin /> */}
            <Text
              style={{
                color: COLORS.theme,
                fontFamily: FONTS.Regular,
                fontSize: 13,
                marginVertical: moderateScale(15),
                textAlign: 'center',
              }}>
              hellloo{otp}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.Regular,
                fontSize: 13,
                marginVertical: moderateScale(15),
                textAlign: 'center',
              }}>
              Already have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={{
                  fontFamily: FONTS.title,
                  textDecorationLine: 'underline',
                }}>
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
  },
  container1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  textInput: {
    width: '100%',
    height: verticalScale(50),
    // paddingLeft: 10,
    color: COLORS.white,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    backgroundColor: COLORS.textInput,
    paddingLeft: 20,
    borderRadius: 5,
    marginBottom: 7,
  },
  checkbox: {
    // backgroundColor:COLORS.textInput
    // borderColor:'#fff'
  },
  dob: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11.5),
    color: COLORS.white,
    textAlign: 'right',
    marginTop: 5,
  },
});
