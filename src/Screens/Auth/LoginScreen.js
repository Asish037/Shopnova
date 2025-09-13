import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import CustomInput from '../../Components/CustomInput';
// import model1 from '../../assets/model1.jpg';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [hidepass, sethidepass] = useState(true);
  const [disabled, setdisabled] = useState(false);

  const emailInput = useRef();
  const passwordInput = useRef();

  const loginUser = async () => {
    // TODO: Implement login logic here, e.g., API call, validation, etc.
    // Example:
    // setdisabled(true);
    // try {
    //   await dispatch(loginAction({ email, pass }));
    //   navigation.navigate('Home');
    // } catch (error) {
    //   Toast.show('Login failed');
    // } finally {
    //   setdisabled(false);
    // }
  };

  return (
    <ImageBackground source={model1} style={styles.bgImage} resizeMode="cover">
      {/* Optional: Add a blur overlay for better readability, comment out if not needed */}
      <View style={styles.blurOverlay} />
      <View style={styles.absoluteFill}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.centeredContainer}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          behavior="padding"
          keyboardVerticalOffset={0}
          style={{padding: 0}}>
          <View style={styles.body}>
            <ImageWithTitle title="Login" style={styles.createTitle} />
            {/* Email */}
            <View style={styles.inputFieldContainer}>
              <CustomInput
                label="Your Email"
                placeholder="Enter your Email"
                keyboardType="email-address"
                type="text"
                isRequired={true}
                ref={emailInput}
                onChangeText={setemail}
                returnKeyType="next"
                onSubmitEditing={e => emailInput.current.focus(e)}
                blurOnSubmit={false}
                icon={
                  <MaterialCommunityIcons
                    name={'email-edit-outline'}
                    size={18}
                    color={COLORS.button}
                    style={styles.icon}
                  />
                }
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
              />
              {/* Error message aligned with input */}
    {email === '' && (
      <Text style={styles.inputError}>Please enter your email field</Text>
    )}
  </View>
  {/* Password */}
            <View style={styles.inputFieldContainer}>
              <CustomInput
                label="Your Password"
                placeholder="*******"
                type="password"
                isRequired={true}
                secureTextEntry={true}
                ref={passwordInput}
                onChangeText={setpass}
                icon={
                  <MaterialCommunityIcons
                    name={'lock'}
                    size={18}
                    color={COLORS.button}
                    style={styles.icon}
                  />
                }
                inputStyle={styles.inputStyle}
                labelStyle={styles.labelStyle}
              />
              {/* Error message aligned with input */}
              {pass === '' && (
                <Text style={styles.inputError}>Please enter your password field</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Email')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <GradientButton
                title="Login"
                onPress={loginUser}
                disabled={disabled}
                style={styles.gradientButton}
                textStyle={styles.buttonText}
              />
            </View>
            <Text style={styles.signInPrompt}>
              Don't have an account?{' '}
              <Text
                onPress={() => navigation.navigate('Register')}
                style={styles.signInText}>
                Sign Up
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 18,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start', // push content to top
    alignItems: 'flex-start', // align to left
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.32)', // Stronger blur effect
    zIndex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  body: {
    alignItems: 'flex-start', // left align
    width: '100%',
    margin: 0,
    padding: 0,
  },
  createTitle: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  inputFieldContainer: {
    width: '95%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginVertical: 14, // more gap between fields
    marginHorizontal: 0,
  },
  inputStyle: {
    fontSize: 14,
    backgroundColor: 'transparent', // fully transparent input background
    color: '#070707ff',
    paddingLeft: 8,
    borderRadius: 5,
    height: 36,
    width: '100%',
  },
  labelStyle: {
    fontSize: 11,
    color: '#333',
    marginBottom: 2,
    marginLeft: 2,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    width: '95%',
    marginTop: 20,
    marginBottom: 24, // more gap below button
    alignSelf: 'flex-start',
  },
  gradientButton: {
    height: Platform.OS === 'ios' ? moderateScale(50) : 36,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(16) : 14,
    fontWeight: 'bold',
    color: Platform.OS === 'ios' ? '#FFFFFF' : undefined,
    textAlign: 'center',
    includeFontPadding: Platform.OS === 'ios' ? false : undefined,
    textAlignVertical: Platform.OS === 'ios' ? 'center' : undefined,
  },
  signInPrompt: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontWeight: 600,
    fontSize: 15,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  signInText: {
    fontFamily: FONTS.title,
    textDecorationLine: 'underline',
    fontSize: 15,
    color: COLORS.red,
  },
  forgotPassword: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11.5),
    color: COLORS.button,
    textAlign: 'right',
    margin: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  inputError: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 32, // aligns with input text (icon + padding)
    alignSelf: 'flex-start',
  },
});
