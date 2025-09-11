import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {verticalScale} from '../../PixelRatio';

export default function CloseButton(props) {
  return (
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#0e293547'}}>
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
          }}>
          <Text
            style={{fontFamily: FONTS.Bold, color: COLORS.black, fontSize: 15}}>
            {props.title}
          </Text>
          <TouchableOpacity onPress={() => props.close()}>
            <MaterialCommunityIcons name="cross" size={"30"} color="red" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: FONTS.Regular,
            color: COLORS.black,
            fontSize: 11.5,
            marginVertical: 25,
          }}>
          {props.subTitle}
        </Text>
        <TouchableOpacity
          onPress={() => props.buttonClick()}
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
            {props.button}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
