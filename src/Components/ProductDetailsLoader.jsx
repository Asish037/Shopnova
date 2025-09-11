import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';

const { width, height } = Dimensions.get('window');

const SkeletonBox = ({ width, height, borderRadius = 8, style = {} }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.lightgray,
          opacity,
        },
        style,
      ]}
    />
  );
};

const ProductDetailsLoader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Prominent Loading Header */}
        <View style={styles.loadingHeader}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={COLORS.button} style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Loading Product Details</Text>
            <Text style={styles.loadingSubtext}>Please wait while we fetch the information...</Text>
          </View>
        </View>

        {/* Header skeleton */}
        <View style={styles.header}>
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <SkeletonBox width={40} height={40} borderRadius={20} />
        </View>

        {/* Product image skeleton */}
        <View style={styles.imageContainer}>
          <SkeletonBox width={width - 40} height={300} borderRadius={12} />
        </View>

        {/* Product info skeleton */}
        <View style={styles.productInfo}>
          <SkeletonBox width={width - 40} height={24} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width - 80} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          
          {/* Price skeleton */}
          <View style={styles.priceContainer}>
            <SkeletonBox width={80} height={28} borderRadius={4} />
            <SkeletonBox width={60} height={20} borderRadius={4} />
          </View>

          {/* Rating skeleton */}
          <View style={styles.ratingContainer}>
            <SkeletonBox width={100} height={20} borderRadius={4} />
            <SkeletonBox width={60} height={16} borderRadius={4} />
          </View>
        </View>

        {/* Description skeleton */}
        <View style={styles.descriptionContainer}>
          <SkeletonBox width={120} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          <SkeletonBox width={width - 40} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width - 60} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width - 80} height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width - 100} height={16} borderRadius={4} />
        </View>

        {/* Features skeleton */}
        <View style={styles.featuresContainer}>
          <SkeletonBox width={100} height={20} borderRadius={4} style={{ marginBottom: 12 }} />
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.featureItem}>
              <SkeletonBox width={16} height={16} borderRadius={8} />
              <SkeletonBox width={width - 80} height={16} borderRadius={4} />
            </View>
          ))}
        </View>

        {/* Action buttons skeleton */}
        <View style={styles.actionButtons}>
          <SkeletonBox width={width - 40} height={50} borderRadius={25} style={{ marginBottom: 12 }} />
          <SkeletonBox width={width - 40} height={50} borderRadius={25} />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingHeader: {
    backgroundColor: COLORS.cream,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.button,
    marginBottom: 10,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    opacity: 0.8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default ProductDetailsLoader;
