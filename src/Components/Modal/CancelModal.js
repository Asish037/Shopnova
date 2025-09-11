// import {Icon} from 'native-base';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Icon,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import Navigation from '../../Service/Navigation';

export default function CancelModal(props) {
  const [Split, setSplit] = useState(true);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.liteBlack,
      }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          margin: 30,
          borderRadius: 20,
          paddingBottom: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 25,
          }}>
          <Text
            style={{fontFamily: FONTS.Bold, color: COLORS.black, fontSize: 15}}>
            Cancel Reservation
          </Text>
          <TouchableOpacity onPress={() => props.close()}>
            <Icon name="cross" type="Entypo" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: COLORS.textInput,
            fontFamily: FONTS.Regular,
            fontSize: moderateScale(11),
            marginBottom: 15,
          }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          Aldus PageMaker including versions of Lorem Ipsum
        </Text>

        <TextInput
          placeholder="Phone Verification code"
          style={{
            borderWidth: 0.4,
            borderColor: COLORS.textInput,
            height: 40,
            borderRadius: 5,
            paddingLeft: 15,
          }}
        />

        <Text
          style={{
            color: COLORS.theme,
            textAlign: 'right',
            fontFamily: FONTS.SemiBold,
            fontSize: moderateScale(12),
            marginVertical: 5,
          }}>
          Resend Code
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View
            style={{
              width: '43%',
              height: 0.6,
              backgroundColor: COLORS.textInput,
            }}
          />
          <Text
            style={{
              color: COLORS.textInput,
              textAlign: 'center',
              fontFamily: FONTS.SemiBold,
              fontSize: moderateScale(12),
            }}>
            OR
          </Text>
          <View
            style={{
              width: '43%',
              height: 0.6,
              backgroundColor: COLORS.textInput,
            }}
          />
        </View>

        <TextInput
          placeholder="Account Password"
          style={{
            borderWidth: 0.4,
            borderColor: COLORS.textInput,
            height: 40,
            borderRadius: 5,
            paddingLeft: 15,
            marginBottom: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            props.close();
            Navigation.navigate('CheckoutReservation');
          }}
          style={{
            height: verticalScale(50),
            backgroundColor: COLORS.button,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontFamily: FONTS.title,
              color: COLORS.white,
              fontSize: 15,
            }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  SplitlistView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: COLORS.textInput,
    paddingVertical: 7,
  },
  title: {
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    fontSize: moderateScale(12),
    opacity: 0.4,
  },
  value: {
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    fontSize: moderateScale(12),
  },
});
