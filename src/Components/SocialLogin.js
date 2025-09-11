import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';

export default function SocialLogin() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Social Login Component</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Google Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Facebook Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    marginBottom: 15,
  },
  button: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    fontFamily: FONTS.Medium,
  },
});
