// screen after the add to cart, to select the payment method
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../Components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import Toast from 'react-native-simple-toast';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');

  const total = route.params?.grandTotal || '0.00';
  const selectedAddress = route.params?.selectedAddress;
  const cartItems = route.params?.cartItems || [];

  console.log('PaymentScreen - Route params:', route.params);
  console.log('PaymentScreen - Selected address:', selectedAddress);
  console.log('PaymentScreen - Cart items:', cartItems.length);

  const paymentMethods = [
    {id: 'cash', name: 'Cash', icon: '💵'},
    {id: 'credit', name: 'Credit Card', icon: '💳'},
    {id: 'debit', name: 'Debit Card', icon: '💳'},
    {id: 'UPI', name: 'UPI', icon: '🏦'},
  ];

  const renderPaymentMethod = method => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method.id)}>
      <View style={styles.paymentMethodContent}>
        <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
        <Text style={selectedPaymentMethod === method.id ? styles.paymentMethodSelectedText : styles.paymentMethodText}>{method.name}</Text>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedPaymentMethod === method.id && styles.radioButtonSelected,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.gradientContainer}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Payment Method</Text>
          <Text style={styles.screenSubtitle}>
            Choose your preferred payment option
          </Text>
        </View>

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>
              {'\u20B9'}{parseFloat(total).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {'\u20B9'}{parseFloat(total).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressSectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddressScreen', {
                  fromPayment: true,
                  grandTotal: total,
                  selectedAddress,
                  cartItems,
                })
              }>
              <Text style={styles.changeAddressText}>Change</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.selectedAddressCard}>
              <View style={styles.addressHeader}>
                <MaterialIcons
                  name={selectedAddress.type === 'Home' ? 'home' : 'business'}
                  size={20}
                  color={COLORS.button}
                />
                <Text style={styles.addressType}>{selectedAddress.type}</Text>
                {selectedAddress.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressContactName}>
                {selectedAddress.contactName}
              </Text>
              <Text style={styles.addressLine}>
                {selectedAddress.addressLine1}
              </Text>
              <Text style={styles.addressLine}>
                {selectedAddress.addressLine2}
              </Text>
              <Text style={styles.addressPhone}>
                {selectedAddress.phoneNumber}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addressButton, styles.addressButtonRequired]}
              onPress={() =>
                navigation.navigate('AddressScreen', {
                  fromPayment: true,
                  grandTotal: total,
                  cartItems,
                })
              }>
              <View style={styles.addressButtonContent}>
                <Text style={styles.addressButtonIcon}>📍</Text>
                <Text style={styles.addressButtonText}>
                  Select Delivery Address
                </Text>
                <Text style={styles.addressButtonRequiredText}>
                  Required
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedAddress && styles.payButtonDisabled
          ]}
          onPress={() => {
            // Validate that address is selected
            if (!selectedAddress) {
              console.log('No address selected, cannot proceed to payment');
              Toast.show('📍 Please select a delivery address first', Toast.LONG);
              return;
            }
            
            // Handle payment processing
            console.log('Navigating to ConfirmOrder with params:', {
              selectedPaymentMethod,
              total,
              cartItems: cartItems.length,
              selectedAddress: selectedAddress ? 'selected' : 'none'
            });
            navigation.navigate('ConfirmOrder', {
              selectedPaymentMethod,
              total,
              cartItems,
              selectedAddress,
            });
            console.log('Processing payment with:', selectedPaymentMethod);
            console.log('Selected address:', selectedAddress);
            // You can add payment processing logic here
          }}>
          <Text style={[
            styles.payButtonText,
            !selectedAddress && styles.payButtonTextDisabled
          ]}>
            Pay {'\u20B9'}{parseFloat(total).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    padding: 10,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
  },
  headerSection: {
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  screenTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 14,
    // color: COLORS.grey,
    color: '#2c2c2c',
    fontFamily: FONTS.Regular,
  },

  // Order Summary Card
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    textDecorationLine: 'underline',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgray,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
  },

  // Payment Methods Section
  paymentSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: 15,
  },
  paymentMethodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPaymentMethod: {
    borderColor: 'transparent',
    backgroundColor: COLORS.button,
   shadowColor: "#000",
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  paymentMethodText: {
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    flex: 1,
  },
  paymentMethodSelectedText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: FONTS.Medium,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#232222ff',
    position: 'absolute',
    right: 15,
    top: 15,
  },
  radioButtonSelected: {
    borderColor: 'grey',
    backgroundColor: '#232222ff',
  },

  // Address Section
  addressSection: {
    marginBottom: 20,
  },
  addressSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeAddressText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.Medium,
  },
  selectedAddressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.theme,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.theme,
    marginLeft: 8,
    fontFamily: FONTS.Medium,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    fontFamily: FONTS.Medium,
  },
  addressContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    lineHeight: 20,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    marginTop: 4,
  },
  addressButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.theme,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressButtonRequired: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  addressButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addressButtonText: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    flex: 1,
    textAlign: 'center',
  },
  addressButtonRequiredText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: FONTS.Bold,
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },

  // Bottom Section
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 16,
  },
  payButton: {
    backgroundColor: COLORS.button,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E94560',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: FONTS.Bold,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  payButtonTextDisabled: {
    color: '#888888',
  },
});
