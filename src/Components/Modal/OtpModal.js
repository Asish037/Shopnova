import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  Icon
} from 'react-native';
// import {Text, Icon} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FONTS} from '../../Constant/Font';
import {COLORS} from '../../Constant/Colors';
import CustomImageBackground from '../ImageBackground/CustomImageBackground';
import ImageWithTitle from '../Header/ImageWithTitle';
import BackHeader from '../Header/BackHeader';
import GradientButton from '../Button/GradientButton';
import {moderateScale} from '../../PixelRatio';
import Auth from '../../Service/Auth.js';
import SimpleToast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('window');

class OtpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      mobile: '',
      otp: '',
      otp_input: '',
      otp_box: [
        {id: 1, value: '', autoFocus: false},
        {id: 2, value: '', autoFocus: false},
        {id: 3, value: '', autoFocus: false},
        {id: 4, value: '', autoFocus: false},
        {id: 5, value: '', autoFocus: false},
        {id: 6, value: '', autoFocus: false},
      ],
      resend_otp_loading: false,
      device_token: '',
    };
    this.inputRefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
  }

  _goNextAfterEdit(index) {
    if (index < 5) {
      this.inputRefs[index + 1].focus();
    } else {
      setTimeout(() => {
        // this.handleLogin();
      }, 300);
    }
  }

  verifyYourOtp = async () => {
    let enterOtp = null;
    this.state.otp_box.forEach(element => {
      if (enterOtp == null) {
        enterOtp = element.value;
      } else {
        enterOtp = enterOtp + element.value;
      }
    });
    let data = {
      phone: this.props.mobile,
      otp: enterOtp,
    };
    let result = await Auth.verifyOtp(data);
    console.log('verify', data, result);
    if (result && result.status) {
      this.props.Verify(result.data);
    } else {
      SimpleToast.show('Invalid OTP!');
    }
  };

  render() {
    const {mobile, otp} = this.props;
    return (
      <CustomImageBackground>
        <View>
          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                // marginTop: 55,
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <BackHeader back={() => this.props.Close()} />
              <View style={{marginVertical: 10}}>
                <ImageWithTitle title="Verify Phone Number" />
              </View>
              {/* <Text style={styles.Login}>Verify Mobile Number</Text> */}
              <Text style={styles.smallTxt}>
                Please enter the OTP sent to your message to proceed further
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                {this.state.otp_box.map((item, indexx) => {
                  return (
                    <View
                      style={[
                        styles.inputContainer,
                        {elevation: item.value != '' ? 3 : 0},
                      ]}
                      key={indexx}>
                      <TextInput
                        style={[styles.inputs]}
                        keyboardType="number-pad"
                        underlineColorAndroid="transparent"
                        maxLength={1}
                        onChangeText={value => {
                          this.state.otp_box[indexx].value = value;
                          if (item.value.length == 1) {
                          }
                          this.setState({});
                        }}
                        ref={r => (this.inputRefs[indexx] = r)}
                        value={item.autoFocus ? '' : item.value}
                        onChange={() => this._goNextAfterEdit(indexx)}
                        placeholderTextColor={'#ccc'}
                        placeholder="0"
                        textAlign={'center'}
                      />
                    </View>
                  );
                })}
              </View>
              <GradientButton
                onPress={this.verifyYourOtp}
                title="VERIFY OTP"
                style={{width: '85%', marginTop: 15}}
              />
              <View style={styles.botomView}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.props.Close()}>
                  <Icon
                    name="edit"
                    type="FontAwesome"
                    style={{fontSize: 16, color: '#33cda1'}}
                  />
                  <Text style={styles.changeBtn}> CHANGE</Text>
                </TouchableOpacity>
                <Text style={styles.mobile}>{mobile}</Text>
              </View>
              <View style={styles.contactView}>
                <Text style={styles.smallTxt}>Didn't receive OTP yet ?</Text>
                <TouchableOpacity
                  onPress={() => this.props.ResendOtp()}
                  style={{marginLeft: 4}}>
                  <Text style={styles.contactUs}>Resend Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </CustomImageBackground>
    );
  }
}

export default OtpModal;

const styles = StyleSheet.create({
  smallTxt: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: FONTS.Regular,
    marginTop: 10,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  contactUs: {
    fontSize: 13,
    color: COLORS.theme,
    fontFamily: FONTS.SemiBold,
    marginTop: 10,
    textAlign: 'center',
  },
  contactView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    marginTop: 2,
  },
  sendOtp: {
    backgroundColor: COLORS.theme,
    width: width - 50,
    height: 50,
    borderRadius: 30,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Login: {
    alignSelf: 'center',
    fontFamily: FONTS.Regular,
    color: FONTS.width,
    fontSize: 20,
    marginTop: 10,
    color: 'red',
  },
  inputContainer: {
    borderRadius: 5,
    marginBottom: 10,
    borderColor: COLORS.theme,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
    // marginTop: 10,
    width: moderateScale(45),
    height: moderateScale(45),
  },
  inputs: {
    // borderBottomColor: '#FFFFFF',
    color: COLORS.theme,
    // paddingLeft: 13,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
    // alignItems: 'center',s
    // alignSelf: 'center',
  },
  botomView: {
    marginTop: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobile: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    // lineHeight: 20,
    marginLeft: 15,
  },
  changeBtn: {
    color: '#33cda1',
    fontSize: 14,
    fontFamily: FONTS.Regular,
    // lineHeight: 20,
  },
});
