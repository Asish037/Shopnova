// import {Icon} from 'native-base';
import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Icon,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import GradientButton from '../../Components/Button/GradientButton';
import GlobalStyles from '../../Components/GlobalStyle';
import CustomImageBackground from '../../Components/ImageBackground/CustomImageBackground';
import CloseButton from '../../Components/Modal/CloseButton';
import Otp from '../../Components/Modal/OtpModal';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import {setGuestLogin, setLogin, setUser} from '../../Redux/reducer/user';
import Auth from '../../Service/Auth';
import Navigation from '../../Service/Navigation';

const {width, height} = Dimensions.get('window');

export default function PhoneNumber() {
  const dispatch = useDispatch();

  const [modal, setmodal] = React.useState(false);
  const [otpmodal, setotpmodal] = React.useState(false);
  const [phone, setphone] = React.useState('');
  const [otp, setotp] = React.useState('');

  const checkNumber = async status => {
    if (phone == '') {
      SimpleToast.show('Enter Phone Number!');
      return false;
    }
    let data = {
      phone: phone,
    };
    let result = await Auth.getOtp(data);
    if (result && result.status) {
      setotp(result.data.otp);
      setotpmodal(true);
      if (status == 1) {
        SimpleToast.show('Resend OTP Successfully!');
      }
      // SimpleToast.show('You OTP - ' + result.data.otp, SimpleToast.LONG);
    } else {
      setmodal(true);
    }
  };

  const loginNow = async data => {
    SimpleToast.show('Login Successfully!');
    await Auth.setAccount(data);
    await Auth.setToken(data.token);
    setotpmodal(false);
    dispatch(setUser(data));
  };

  const handleGuestLogin = async () => {
    const result = await Auth.guestLogin();
    console.log('guest login', result);
    if (result && result.status) {
      await Auth.setToken(result?.data.token);
      dispatch(setLogin(true));
      dispatch(setGuestLogin(true));
    }
  };

  return (
    <CustomImageBackground>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: moderateScale(35),
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: width / 2, resizeMode: 'contain'}}
              source={require('../../assets/logo.png')}
            />
            <View style={GlobalStyles.textInputView}>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor={COLORS.white}
                style={{
                  width: '88%',
                  paddingLeft: 10,
                  color: COLORS.white,
                  fontFamily: FONTS.Regular,
                  fontSize: moderateScale(11.5),
                }}
                keyboardType="number-pad"
                value={phone}
                onChangeText={val => setphone(val)}
              />
              <TouchableOpacity
                onPress={checkNumber}
                style={{
                  backgroundColor: COLORS.sbutton,
                  width: '12%',
                  height: verticalScale(42),
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="play-sharp"
                  type="Ionicons"
                  style={{color: COLORS.white, fontSize: moderateScale(15)}}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => Navigation.navigate('Login')}
              style={{
                flexDirection: 'row',
                marginVertical: moderateScale(6),
                alignSelf: 'flex-end',
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.Regular,
                  fontSize: 13,
                }}>
                Login with email?
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  fontFamily: FONTS.Regular,
                  fontSize: 13,
                  textDecorationLine: 'underline',
                  textAlign: 'right',
                }}>
                {' '}
                Click here
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <GradientButton title="Login as Guest" onPress={handleGuestLogin} />

            {/* <SocialLogin /> */}

            <Text
              style={{
                color: COLORS.white,
                fontFamily: FONTS.Regular,
                fontSize: 13,
                marginVertical: moderateScale(15),
              }}>
              Dont't have an account?{' '}
              <Text
                onPress={() => Navigation.navigate('Register')}
                style={{
                  fontFamily: FONTS.title,
                  textDecorationLine: 'underline',
                }}>
                Sign Up
              </Text>
            </Text>
          </View>

          <Modal
            visible={modal}
            transparent={true}
            onRequestClose={() => setmodal(false)}>
            <CloseButton
              title="Number not registered"
              subTitle="This number is not registered, would you like to sign up"
              button="Sign Up"
              buttonClick={() => {
                setmodal(false);
                Navigation.navigate('Register');
              }}
              close={() => setmodal(false)}
            />
          </Modal>

          <Modal
            visible={otpmodal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setotpmodal(false)}>
            <Otp
              Close={() => setotpmodal(false)}
              mobile={phone}
              otp={otp}
              Verify={data => loginNow(data)}
              ResendOtp={() => checkNumber(1)}
            />
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    </CustomImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // width:'100%',
    // height:height/2
  },
  slide: {
    //   width:'100%',
    //     height:height/2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    //   backgroundColor: '#9DD6EB'
  },
  text: {
    color: '#fff',
    fontSize: moderateScale(17),
    fontFamily: FONTS.title,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtext: {
    color: '#fff',
    fontSize: moderateScale(13),
    fontFamily: FONTS.Regular,
    textAlign: 'center',
  },
  linearGradient: {
    height: verticalScale(50),
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.title,
    textAlign: 'center',
    // margin: 10,
    color: '#ffffff',
  },
});
