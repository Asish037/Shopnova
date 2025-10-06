import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import React from 'react';
import Header from '../Components/Header';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const OrderConfirm = ({route}) => {
  const navigation = useNavigation();

  // Get dynamic data from route parameters
  // const selectedPaymentMethod =
  //   route.params?.selectedPaymentMethod || 'Not specified';
  // const total = route.params?.total || '0.00';
  // const cartItems = route.params?.cartItems || [];
  const { orderId, selectedPaymentMethod, total, cartItems = [] } = route.params || {};


  console.log('OrderConfirm - Received params:', route.params);
  console.log('OrderConfirm - Payment Method:', selectedPaymentMethod);
  console.log('OrderConfirm - Total Amount:', total);
  console.log('OrderConfirm - Cart Items:', cartItems?.length || 0);

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>
            Thank you for your purchase! Your order has been placed successfully
            and will be delivered soon.
          </Text>
          {/* {orderId && (
              <Text style={styles.orderId}>Order ID: {orderId}</Text>
            )} */}


          {/* Order Summary Card */}
          <View style={styles.orderSummaryCard}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method:</Text>
                <Text style={styles.detailValue}>{selectedPaymentMethod}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Amount:</Text>
                <Text style={styles.detailValuePrice}>{'\u20B9'}{total}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items Ordered:</Text>
                <Text style={styles.detailValue}>{cartItems?.length || 0} items</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDetails', { orderId: orderId, fromConfirm: true })}
              style={[styles.button, styles.primaryButton]}>
              <LinearGradient
                colors={COLORS.gradientButton}
                style={styles.gradientButton}>
                <Text style={styles.primaryButtonText}>View Order Details</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('MainHome')}
              style={[styles.button, styles.secondaryButton]}>
              <Text style={styles.secondaryButtonText}>Keep Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   width: '100%',
   height: '100%',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 5, // Add padding for iOS status bar
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 30 : 20, // Extra top margin for iOS
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    color: COLORS.white,
    fontFamily: FONTS.Bold,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.Bold,
    color: COLORS.black,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  orderSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
    width: '100%',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
    marginBottom: 15,
    textAlign: 'center',
  },
  orderDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 15,
    fontFamily: FONTS.Medium,
    color: COLORS.grey,
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
    flex: 1,
    textAlign: 'right',
  },
  detailValuePrice: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
    color: COLORS.green,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.lightbutton,
  },
  secondaryButtonText: {
    color: COLORS.lightbutton,
    fontSize: 16,
    fontFamily: FONTS.Medium,
  },
});
