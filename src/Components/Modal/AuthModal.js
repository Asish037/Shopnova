// import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Icon
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import {useSelector} from 'react-redux';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import Auth from '../../Service/Auth';
import NormalButton from '../Button/NormalButton';
import GlobalStyles from '../GlobalStyle';

export default function AuthModal(props) {
  const [disabled, setdisabled] = useState(false);
  const [pass, setpass] = useState('');
  const [hidePass, sethidePass] = useState(true);
  const [showPasswordInput, setshowPasswordInput] = useState(false);
  const [otp, setotp] = useState('');
  const [otpData, setotpData] = useState('');

  const {userData} = useSelector(state => state.User);

  useEffect(() => {
    generateOTP();
  }, []);

  const generateOTP = async () => {
    let data = {
      to: userData?.phone,
      type: '1',
    };
    console.log('payload=>>', data);
    let result = await Auth.getPhoneOTP(data);
    console.log('getPhoneOTP=>>>', result);
    if (result && result.status) {
      setotpData(result.otp);
      Toast.show('OTP shared with your registered phone number!', Toast.SHORT);
    }
  };

  const verifyUser = async () => {
    if (!showPasswordInput) {
      verifyOTP();
      return;
    }
    if (pass == '' && showPasswordInput) {
      Toast.show('Please enter password!');
      return;
    }
    setdisabled(true);
    let data = {
      email: props.userData.email,
      password: pass,
    };
    let result = await Auth.login(data);
    console.log('result', result);
    if (result && result.status) {
      props.verified();
    } else {
      Toast.show('Invalid credentials!', Toast.SHORT);
    }
    setdisabled(false);
  };

  const verifyOTP = () => {
    if (!otp) {
      Toast.show('Please enter OTP!');
      return;
    }
    if (otp != otpData) {
      Toast.show('Invalid OTP!');
      return;
    }
    if (otp == otpData) {
      props.verified();
      return;
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <View style={GlobalStyles.modalMainView}>
        <View style={GlobalStyles.modalContainer}>
          <View style={GlobalStyles.modalHeader}>
            <Text style={GlobalStyles.modalTitle}>Authentication</Text>
            <TouchableOpacity onPress={() => props.close()}>
              <Icon name="cross" type="Entypo" />
            </TouchableOpacity>
          </View>

          {showPasswordInput ? (
            <>
              <View
                style={{
                  ...GlobalStyles.textInput,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: 10,
                  height: 45,
                  backgroundColor: 'transparent',
                  borderWidth: 0.4,
                  borderColor: COLORS.textInput,
                }}>
                <TextInput
                  placeholderTextColor={COLORS.liteBlack}
                  style={{
                    ...GlobalStyles.textInput,
                    backgroundColor: null,
                    width: '80%',
                    paddingLeft: 0,
                    height: 45,
                    color: COLORS.textInput,
                    marginBottom: 0,
                  }}
                  placeholder="Account Password"
                  value={pass}
                  onChangeText={val => setpass(val)}
                  secureTextEntry={hidePass}
                />
                <Icon
                  onPress={() => sethidePass(!hidePass)}
                  name={hidePass ? 'eye-off' : 'eye'}
                  type="Ionicons"
                  style={{color: COLORS.theme, fontSize: 25}}
                />
              </View>
            </>
          ) : (
            <TextInput
              placeholder="Phone Verification code"
              value={otp}
              onChangeText={setotp}
              maxLength={6}
              style={{
                borderWidth: 0.4,
                borderColor: COLORS.textInput,
                height: 45,
                borderRadius: 5,
                paddingLeft: 15,
              }}
            />
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setshowPasswordInput(!showPasswordInput)}>
              <Text
                style={{
                  color: COLORS.theme,
                  textAlign: 'right',
                  fontFamily: FONTS.SemiBold,
                  fontSize: moderateScale(12),
                  marginVertical: 5,
                }}>
                {showPasswordInput ? 'Use Code' : 'Use Password'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={generateOTP}>
              <Text
                style={{
                  color: COLORS.theme,
                  textAlign: 'right',
                  fontFamily: FONTS.SemiBold,
                  fontSize: moderateScale(12),
                  marginVertical: 5,
                }}>
                {showPasswordInput ? '' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
          <NormalButton
            title={props.buttonTitle}
            onPress={verifyUser}
            disabled={disabled}
          />
          {props.showText ? (
            <Text
              style={{
                color: COLORS.black,
                fontFamily: FONTS.Regular,
                fontSize: 12,
                marginTop: 5,
              }}>
              {props.showText}
            </Text>
          ) : null}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({});
