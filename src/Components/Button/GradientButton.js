import React from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';

export default function GradientButton({style, onPress, title, disabled}) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={COLORS.gradientButton}
        style={styles.linearGradient}>
        {disabled ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(55),
    width: '100%',
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  linearGradient: {
    height: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(55),
    width: '100%',
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(18) : moderateScale(16),
    fontFamily: Platform.OS === 'ios' ? 'System' : FONTS.title,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    textAlign: 'center',
    color: COLORS.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: Platform.OS === 'ios' ? moderateScale(22) : moderateScale(20),
  },
});
