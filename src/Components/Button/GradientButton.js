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
    height: Platform.OS === 'ios' ? verticalScale(65) : verticalScale(60),
    width: '100%',
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  linearGradient: {
    height: Platform.OS === 'ios' ? verticalScale(65) : verticalScale(60),
    width: '100%',
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(19) : moderateScale(17),
    fontFamily: Platform.OS === 'ios' ? 'System' : FONTS.title,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    textAlign: 'center',
    color: COLORS.white,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: Platform.OS === 'ios' ? moderateScale(24) : moderateScale(22),
    alignSelf: 'center',
    letterSpacing: 0.5,
  },
});
