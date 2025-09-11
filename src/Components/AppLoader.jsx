import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';

const { width, height } = Dimensions.get('window');

const AppLoader = ({ message = "Loading..." }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const fadeAnimation = Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    spinAnimation.start();
    scaleAnimation.start();
    fadeAnimation.start();

    return () => {
      spinAnimation.stop();
      scaleAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loaderContainer, { opacity: fadeValue }]}>
        {/* Outer rotating ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.outerRingInner} />
        </Animated.View>

        {/* Inner pulsing circle */}
        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        />

        {/* Loading text */}
        <Text style={styles.loadingText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradient[0] || '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: COLORS.button || '#FF6B6B',
    borderRightColor: COLORS.button || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  outerRingInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
    borderBottomColor: COLORS.button || '#FF6B6B',
    borderLeftColor: COLORS.button || '#FF6B6B',
  },
  innerCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.button || '#FF6B6B',
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.Medium || 'System',
    color: COLORS.black || '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AppLoader;
