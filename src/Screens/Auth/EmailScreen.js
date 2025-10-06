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
import CustomInput from '../../Components/CustomInput';

const RESEND_OTP_TIME_LIMIT = 30; // 30 secs
const AUTO_SUBMIT_OTP_TIME_LIMIT = 4; // 4 secs

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

export default function EmailScreen() {
  const [email, setemail] = useState('');
  const [otp, setOtp] = useState(0);
  const navigation = useNavigation();

  const [attemptsRemaining, setAttemptsRemaining] = useState(30);
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );

  // 0 < autoSubmitOtpTime < 4 to show auto submitting OTP text
  const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
    AUTO_SUBMIT_OTP_TIME_LIMIT,
  );

  // TextInput refs to focus programmatically while entering OTP
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);

  // a reference to autoSubmitOtpTimerIntervalCallback to always get updated value of autoSubmitOtpTime
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();

  useEffect(() => {
    // autoSubmitOtpTime value will be set after otp is detected,
    // in that case we have to start auto submit timer
    autoSubmitOtpTimerIntervalCallbackReference.current = autoSubmitOtpTimerIntervalCallback;
  });

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  useEffect(() => {
    RNOtpVerify.getOtp()
        .then((p) => {
          console.log("verifytyy===="+p)
          if(p === true){
            console.log(p);
            RNOtpVerify.addListener((message) => {
              console.log('heluuuulo=='+message)
                try {
                    // if (message && message !== 'Timeout Error') {
                    //     const otp = /(\d{4})/g.exec(message)[1];
                    //     if (otp.length === 4) {
                    //       setOtp(otp)
                    //         //setOtpArray(otp.split(''));
                    //         setOtpArray(otp.split(''));

                    //         // to auto submit otp in 4 secs
                    //         setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
                    //         startAutoSubmitOtpTimer();
                    //     }
                    // } 
                    if (message) {
                      console.log('hello-----')
                      // const messageArray = message.split('\n');
                      // console.log('msgarry8834=='+messageArray[2])
                      // if (messageArray[2]) {
                      //   const otp = messageArray[2].split(' ')[0];
                      const otp = /(\d{4})/g.exec(message)[1];
                        console.log('hello-----'+otp.length)
                        if (otp.length === 4) {
                          console.log('hello-----'+otp)
                          setOtpArray(otp.split(''));
                          // to auto submit otp in 4 secs
                          setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
                          startAutoSubmitOtpTimer();
                        }
                      
                    }
                    else {
                        console.log( 'OTPVerification: RNOtpVerify.getOtp - message=>', message );
                    }
                } catch (error) {
                    console.log('OTPVerification: RNOtpVerify.getOtp error=>', error );
                }
            });
          }
        })
        .catch((error) => {
            console.log('getOtp=='+error);
        });

    return () => {
      RNOtpVerify.removeListener();
  };
}, []);

 

  useEffect(()=>{
    const getHash = () => {
      RNOtpVerify.getHash()
          .then((hash) => {
              console.log('App.js: Application hash is=> ', hash);
   //message example
              console.log(`<#> Dear User,
              1091 is your OTP for verification. (Remaining Time: 10 minutes and 0 seconds)
               ${hash[0]}`);
          })
          .catch((error) => {
              console.log(error);
          });
  };

  getHash();
  })
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  // this callback is being invoked from startAutoSubmitOtpTimer which itself is being invoked from useEffect
  // since useEffect use closure to cache variables data, we will not be able to get updated autoSubmitOtpTime value
  // as a solution we are using useRef by keeping its value always updated inside useEffect(componentDidUpdate)

  const autoSubmitOtpTimerIntervalCallback = () => {
    if (autoSubmitOtpTime <= 0) {
      clearInterval(autoSubmitOtpTimerInterval);

      // submit OTP
      onSubmitButtonPress();
    }
    setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
  };

  const startAutoSubmitOtpTimer = () => {
    if (autoSubmitOtpTimerInterval) {
      clearInterval(autoSubmitOtpTimerInterval);
    }
    autoSubmitOtpTimerInterval = setInterval(() => {
      autoSubmitOtpTimerIntervalCallbackReference.current();
    }, 1000);
  };

  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };

  const onResendOtpButtonPress = () => {
    // clear last OTP
    if (firstTextInputRef) {
      setOtpArray(['', '', '', '']);
      firstTextInputRef.current.focus();
    }

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    // resend OTP Api call
    // todo
    console.log('todo: Resend OTP');
  };

  const onSubmitButtonPress = () => {
    // API call
    // todo
    console.log('todo: Submit OTP');
  };

  // this event won't be fired when text changes from '' to '' i.e. backspace is pressed
  // using onOtpKeyPress for this purpose
  const onOtpChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);

      // auto focus to next InputText if value is not blank
      if (value !== '') {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        }
      }
    };
  };

  // only backspace key press event is fired on Android
  // to have consistency, using this event just to detect backspace key press and
  // onOtpChange for other digits press
  const onOtpKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ''; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
        }
      }
    };
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
            style={{color: COLORS.button, fontSize: moderateScale(30)}}
          />
        </TouchableOpacity>
         <View style={styles.body}>
          
            <ImageWithTitle title="Forgot Password" />

            {/* <TextInput
              placeholder="Your Email Address"
              placeholderTextColor={COLORS.white}
              keyboardType="email-address"
              style={styles.textInput}
              value={email}
              onChangeText={val => setemail(val.toLowerCase())}
            /> */}
            {/* <TextInput
              placeholder="OTP here"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={styles.textInput}
              value={otp}
              textContentType="oneTimeCode"
              //autoComplete="one-time-code"
              autoComplete="sms-otp" // android
              onChangeText={val => setemail(val.toLowerCase())}
            /> */}
              <View style={styles.inputFieldContainer}>
            <CustomInput
              label="Your Email"
              placeholder="zerodegreecoder@gmail.com"
              keyboardType="email-address"
              icon={
                <MaterialCommunityIcons
                  name={'email-edit-outline'}
                  size={22}
                  color={COLORS.button}
                  style={styles.icon}
                />
              }
            />
          </View>
      
          {/* <View style={styles.container1}>
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
          </View> */}
          <View>
            <GradientButton
              title="Submit"
              onPress={checkEmail}
              // onPress={() => Navigation.navigate('ForgotPassword')}
            />

            {/* <SocialLogin /> */}
            {/* <Text
              style={{
                color: COLORS.theme,
                fontFamily: FONTS.Regular,
                fontSize: 13,
                marginVertical: moderateScale(15),
                textAlign: 'center',
              }}>
              hellloo{otp}
            </Text> */}
            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.Regular,
                fontSize: 13,
                marginVertical: moderateScale(15),
                textAlign: 'center',
              }}>
              Already have an account? {' '}
              <Text
                onPress={() => navigation.navigate('AuthStack')}
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
    backgroundColor: 'yellow'
  },
  body: {
    alignItems: 'center',
    margin: 10,
  },
  inputFieldContainer: {
    width: moderateScale(300),
    height: verticalScale(120),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  forgotPassword: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11.5),
    color: COLORS.button,
    textAlign: 'right',
    margin: 10,
  },
});
