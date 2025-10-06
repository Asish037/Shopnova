import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';
import { useNavigation } from '@react-navigation/native';

/**
 * Authentication Guard Component
 * Shows login prompt if user is not authenticated
 */
const AuthGuard = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Authentication Required</Text>
          <Text style={styles.subtitle}>
            Please log in to access this feature
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('AuthStack')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: COLORS.white,
  },
});

export default AuthGuard;
