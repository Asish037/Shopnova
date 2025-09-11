import React from 'react';
import {View, Text, TouchableOpacity,Icon, Platform} from 'react-native';
// import {Icon} from 'native-base';
import {moderateScale, verticalScale} from '../../PixelRatio';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';

export default function BackHeader(props) {
  return (
    <View
      style={{
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: verticalScale(50),
        alignSelf: 'center',
        marginTop: Platform.OS == 'ios' ? 30 : 10,
      }}>
      <TouchableOpacity onPress={() => props.back()}>
        <Icon
          name="keyboard-arrow-left"
          type="MaterialIcons"
          style={{color: COLORS.white, fontSize: moderateScale(35)}}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: COLORS.white,
          fontFamily: FONTS.Regular,
          fontSize: moderateScale(18),
        }}>
        {props.title}
      </Text>

      <View style={{width: '10%'}} />
    </View>
  );
}
