import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';

export default function TransparentButton(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: verticalScale(50),
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1.5,
    borderColor:COLORS.white,
    marginVertical:verticalScale(15)
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    // margin: 10,
    color: '#ffffff',
  },
});
