import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';

const { width, height } = Dimensions.get('window');

const NetworkErrorScreen = ({ onTryAgain }) => {
  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <View style={styles.content}>
        {/* Network Error Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📡</Text>
        </View>

        {/* Error Title */}
        <Text style={styles.title}>No Internet Connection</Text>

        {/* Error Description */}
        <Text style={styles.description}>
          Please check your internet connection and try again. Make sure you're connected to WiFi or mobile data.
        </Text>

        {/* Try Again Button */}
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={handleTryAgain}
          activeOpacity={0.8}>
          <LinearGradient
            colors={COLORS.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Network Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Waiting for network connection...</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.9,
  },
  tryAgainButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.Bold,
    color: COLORS.white,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: COLORS.white,
  },
});

export default NetworkErrorScreen;
