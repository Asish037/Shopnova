import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for margins and padding

const WishlistSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  const ShimmerEffect = ({ style }) => (
    <View style={[styles.shimmerContainer, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Image skeleton */}
        <ShimmerEffect style={styles.imageSkeleton} />
        
        {/* Content skeleton */}
        <View style={styles.contentContainer}>
          {/* Title skeleton */}
          <ShimmerEffect style={styles.titleSkeleton} />
          <ShimmerEffect style={styles.titleSkeleton2} />
          
          {/* Price skeleton */}
          <View style={styles.priceContainer}>
            <ShimmerEffect style={styles.priceSkeleton} />
            <ShimmerEffect style={styles.originalPriceSkeleton} />
          </View>
          
          {/* Rating skeleton */}
          <ShimmerEffect style={styles.ratingSkeleton} />
          
          {/* Button skeleton */}
          <ShimmerEffect style={styles.buttonSkeleton} />
        </View>
        
        {/* Floating buttons skeleton */}
        <View style={styles.favoriteSkeleton} />
        <View style={styles.deleteSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  shimmerContainer: {
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  imageSkeleton: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 16,
  },
  titleSkeleton: {
    height: 16,
    width: '90%',
    borderRadius: 8,
    marginBottom: 4,
  },
  titleSkeleton2: {
    height: 16,
    width: '60%',
    borderRadius: 8,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  priceSkeleton: {
    height: 18,
    width: 60,
    borderRadius: 9,
  },
  originalPriceSkeleton: {
    height: 16,
    width: 50,
    borderRadius: 8,
  },
  ratingSkeleton: {
    height: 14,
    width: 80,
    borderRadius: 7,
    marginBottom: 12,
  },
  buttonSkeleton: {
    height: 36,
    width: '100%',
    borderRadius: 15,
  },
  favoriteSkeleton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    right: 12,
    top: 12,
  },
  deleteSkeleton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    right: 12,
    top: 65,
  },
});

export default WishlistSkeleton;
