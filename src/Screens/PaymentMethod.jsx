// screen after confirm order to payment
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {CartContext} from '../Context/CartContext';
import GradientButton from '../Components/Button/GradientButton';
import { moderateScale, verticalScale } from '../PixelRatio';

const PaymentMethod = ({route}) => {
  const navigation = useNavigation();
  const {cartItems: contextCartItems} = useContext(CartContext);

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle the  parameters from CartScreen
  // const grandTotal = route.params?.grandTotal || '0.00';
  // const cartItems = route.params?.cartItems || [];
  // const selectedPaymentMethod = route.params?.selectedPaymentMethod || 'Card';
  const { orderId, grandTotal, selectedPaymentMethod } = route.params || {};
  const cartItems = route.params?.cartItems || contextCartItems || [];
  
  // Calculate total from cart items if grandTotal is not provided
  const calculatedTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.offer_price || item.offerPrice || item.price || 0);
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0).toFixed(2);
  
  const finalGrandTotal = grandTotal || calculatedTotal;

  console.log('PaymentMethod - Received params:', route.params);
  console.log('PaymentMethod - Grand Total:', grandTotal);
  console.log('PaymentMethod - Grand Total type:', typeof grandTotal);
  console.log('PaymentMethod - Grand Total undefined?', grandTotal === undefined);
  console.log('PaymentMethod - Calculated Total:', calculatedTotal);
  console.log('PaymentMethod - Final Grand Total:', finalGrandTotal);
  console.log('PaymentMethod - Cart Items from params:', route.params?.cartItems?.length || 0);
  console.log('PaymentMethod - Cart Items from context:', contextCartItems?.length || 0);
  console.log('PaymentMethod - Final Cart Items:', cartItems.length);
  console.log('PaymentMethod - Final Cart Items details:', cartItems);
  console.log('PaymentMethod - Payment Method:', selectedPaymentMethod);

  const handlePayment = () => {
   
    console.log('PaymentMethod - Handle Payment clicked');
    console.log('PaymentMethod - Cart Items:', cartItems.length);
    console.log('PaymentMethod - Cart Items details:', cartItems);
    console.log('PaymentMethod - Grand Total:', grandTotal);
    console.log('PaymentMethod - Final Grand Total:', finalGrandTotal);
    console.log('PaymentMethod - Selected Payment Method:', selectedPaymentMethod);
    console.log('PaymentMethod - Selected Address:', route.params?.selectedAddress);
    
    // Navigate to ConfirmOrder to place the actual order
    navigation.navigate('ConfirmOrder', {
      selectedPaymentMethod,
      total: finalGrandTotal,
      cartItems,
      selectedAddress: route.params?.selectedAddress,
    });
  };

  const formatCardNumber = text => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const formatExpiryDate = text => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{2})(?=\d)/, '$1/');
    setExpiryDate(formatted);
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'Card':
      case 'Credit/Debit Card':
        return (
          <View style={styles.paymentFormContainer}>
            <Text style={styles.formTitle}>Card Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="numeric"
                maxLength={19}
                placeholderTextColor={COLORS.grey}
              />
            </View>

            <View style={styles.rowInputContainer}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={formatExpiryDate}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  placeholderTextColor={COLORS.grey}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                value={cardHolderName}
                onChangeText={setCardHolderName}
                placeholderTextColor={COLORS.grey}
              />
            </View>
          </View>
        );

      case 'UPI':
      case 'UPI Payment':
        return (
          <View style={styles.paymentFormContainer}>
            <Text style={styles.formTitle}>UPI Payment</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>UPI ID</Text>
              <TextInput
                style={styles.textInput}
                placeholder="yourname@upi"
                value={upiId}
                onChangeText={setUpiId}
                keyboardType="email-address"
                placeholderTextColor={COLORS.grey}
              />
            </View>

            <View style={styles.upiOptions}>
              <Text style={styles.optionsTitle}>Quick UPI Apps</Text>
              <View style={styles.upiAppsContainer}>
                <TouchableOpacity style={styles.upiAppButton}>
                  <Text style={styles.upiAppText}>📱 GPay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upiAppButton}>
                  <Text style={styles.upiAppText}>💜 PhonePe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.upiAppButton}>
                  <Text style={styles.upiAppText}>💙 Paytm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'NetBanking':
      case 'Net Banking':
        return (
          <View style={styles.paymentFormContainer}>
            <Text style={styles.formTitle}>Net Banking</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your account number"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
                placeholderTextColor={COLORS.grey}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>IFSC Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="ABCD0123456"
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
                placeholderTextColor={COLORS.grey}
              />
            </View>
          </View>
        );

      case 'Cash':
      case 'Cash on Delivery':
      default:
        return (
          <View style={styles.paymentFormContainer}>
            <Text style={styles.formTitle}>Cash on Delivery</Text>
            <View style={styles.codInfoContainer}>
              <Text style={styles.codInfoText}>💵</Text>
              <Text style={styles.codDescription}>
                You will pay ${finalGrandTotal} in cash when your order is delivered
                to your doorstep.
              </Text>
            </View>
            <View style={styles.codNotesContainer}>
              <Text style={styles.codNotesTitle}>Please Note:</Text>
              <Text style={styles.codNotesText}>• Have exact change ready</Text>
              <Text style={styles.codNotesText}>
                • Payment will be collected by delivery partner
              </Text>
              <Text style={styles.codNotesText}>
                • Additional charges may apply for COD
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}>

          {/* Page Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Complete Payment</Text>
            <Text style={styles.subtitle}>Secure payment for your order</Text>
          </View>

        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items:</Text>
            <Text style={styles.summaryValue}>{cartItems.length} items</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${finalGrandTotal}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${finalGrandTotal}</Text>
          </View>
        </View>

        {/* Payment Method Display */}
        <View style={styles.selectedMethodCard}>
          <Text style={styles.selectedMethodLabel}>Payment Method:</Text>
          <Text style={styles.selectedMethodText}>{selectedPaymentMethod}</Text>
        </View>

        {/* Dynamic Payment Form */}
        {renderPaymentForm()}
      </ScrollView>
      
      {/* Bottom Payment Button - Fixed Position */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
                  <GradientButton
                    title={isLoading ? 'Saving...' : `Pay ${finalGrandTotal || '0.00'}`}
                    onPress={handlePayment}
                    disabled={isLoading}
                    style={styles.saveButton}
                  />
                </View>
      </View>

    </LinearGradient>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10,
    width: '100%',
    height: '100%',
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 20 : 5,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    flexGrow: 1,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
  },
  orderSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.SemiBold,
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
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightgray,
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.SemiBold,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
  },
  selectedMethodCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.button,
  },
  selectedMethodLabel: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    marginBottom: 4,
  },
  selectedMethodText: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    fontWeight: '600',
  },
  paymentFormContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.SemiBold,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightgray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    backgroundColor: COLORS.white,
  },
  rowInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInputContainer: {
    flex: 0.48,
  },
  upiOptions: {
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    marginBottom: 12,
    fontWeight: '500',
  },
  upiAppsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upiAppButton: {
    backgroundColor: COLORS.lightgray,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.3,
    alignItems: 'center',
  },
  upiAppText: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
  },
  codInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  codInfoText: {
    fontSize: 48,
    marginBottom: 16,
  },
  codDescription: {
    fontSize: 16,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    textAlign: 'center',
    lineHeight: 24,
  },
  codNotesContainer: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 16,
  },
  codNotesTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    marginBottom: 8,
    fontWeight: '600',
  },
  codNotesText: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    marginBottom: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(16),
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  saveButton: {
    width: '100%',
    height: verticalScale(65),
    borderRadius: moderateScale(20),
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
