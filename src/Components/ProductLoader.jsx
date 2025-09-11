import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';

const { width, height } = Dimensions.get('window');

const ProductLoader = ({ message = 'Loading product details...' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Continuous rotation for the outer ring
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    // Pulse animation for the inner circle
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    pulseAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.loaderContainer}>
        {/* Outer rotating ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <View style={styles.ringSegment1} />
          <View style={styles.ringSegment2} />
          <View style={styles.ringSegment3} />
          <View style={styles.ringSegment4} />
        </Animated.View>

        {/* Inner pulsing circle */}
        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.button} />
        </Animated.View>

        {/* Loading text */}
        <Text style={styles.loadingText}>{message}</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitleText}>Please wait while we fetch the details</Text>
      </View>
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
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    marginBottom: 30,
  },
  ringSegment1: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 4,
    height: 20,
    backgroundColor: COLORS.button,
    borderRadius: 2,
    marginLeft: -2,
  },
  ringSegment2: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 20,
    height: 4,
    backgroundColor: COLORS.button,
    borderRadius: 2,
    marginTop: -2,
  },
  ringSegment3: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 4,
    height: 20,
    backgroundColor: COLORS.button,
    borderRadius: 2,
    marginLeft: -2,
  },
  ringSegment4: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: 20,
    height: 4,
    backgroundColor: COLORS.button,
    borderRadius: 2,
    marginTop: -2,
  },
  innerCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default ProductLoader;
