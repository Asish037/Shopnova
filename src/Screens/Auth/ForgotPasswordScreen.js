import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import CloseButton from '../../Components/Modal/CloseButton';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

export default function ForgotPassword(props) {
  const navigation = useNavigation();
  const {otp, email} = props.route.params;

  const [modal, setmodal] = React.useState(false);
  const [pass, setpass] = React.useState('');
  const [cPass, setcPass] = React.useState('');
  const [otpData, setotpData] = React.useState('');
  const [hidepass, sethidepass] = React.useState(true);

  const updatePassword = async () => {
    if (pass != cPass) {
      SimpleToast.show('Password does not match!');
      return;
    }
    let data = {
      email,
      otp: otpData,
      password: pass,
    };
    const result = await Auth.resetPassword(data);
    console.log('reset pasword', result);
    if (result && result.status) {
      setmodal(true);
    } else {
      SimpleToast.show('Invalid OTP!');
    }
  };
  return (
     <LinearGradient colors={['#114041', '#151721']} style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <TouchableOpacity
          onPress={() => navigation.back()}
          style={{marginTop: moderateScale(45), marginLeft: moderateScale(15)}}>
          <Icon
            name="keyboard-arrow-left"
            type="MaterialIcons"
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
            <ImageWithTitle title="New Password" />

            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor={COLORS.white}
              keyboardType="number-pad"
              style={styles.textInput}
              value={otpData}
              onChangeText={setotpData}
            />

            <TextInput
              placeholder="New Password"
              placeholderTextColor={COLORS.white}
              // keyboardType="email-address"
              style={styles.textInput}
              value={pass}
              onChangeText={setpass}
            />
            <View
              style={{
                //...GlobalStyles.textInput,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 10,
              }}>
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor={COLORS.white}
                style={{
                  //...GlobalStyles.textInput,
                  backgroundColor: null,
                  width: '80%',
                  paddingLeft: 0,
                }}
                value={cPass}
                onChangeText={setcPass}
                secureTextEntry={hidepass}
              />
              <MaterialCommunityIcons
                onPress={() => sethidepass(!hidepass)}
                name={hidepass ? 'eye-off' : 'eye'}
                size={'30'}
                style={{color: COLORS.theme, fontSize: 25}}
              />
            </View>
          </View>

          <View>
            <GradientButton title="Submit" onPress={updatePassword} />

            {/* <SocialLogin /> */}

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
                onPress={() => Navigation.navigate('AuthStack')}
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
      <Modal
        visible={modal}
        transparent={true}
        onRequestClose={() => {
          setmodal(false);
          navigation.replace('Login');
        }}>
        <CloseButton
          title="New Password"
          subTitle="Successfully changed with New Password"
          button="Login"
          buttonClick={() => {
            setmodal(false);
            navigation.replace('Login');
          }}
          close={() => {
            setmodal(false);
            navigation.replace('Login');
          }}
        />
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: '100%',
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
