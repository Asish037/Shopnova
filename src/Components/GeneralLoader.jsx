import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';

const GeneralLoader = ({ 
  message = 'Loading...', 
  showSpinner = true,
  size = 'large',
  color = COLORS.button,
  textColor = COLORS.black,
  containerStyle = {},
  textStyle = {}
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        containerStyle,
      ]}
    >
      {showSpinner && (
        <ActivityIndicator 
          size={size} 
          color={color} 
          style={styles.spinner}
        />
      )}
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
});

export default GeneralLoader;
