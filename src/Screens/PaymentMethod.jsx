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
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';

const PaymentMethod = ({route}) => {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // Handle the  parameters from CartScreen
  const grandTotal = route.params?.grandTotal || '0.00';
  const cartItems = route.params?.cartItems || [];
  const selectedPaymentMethod = route.params?.selectedPaymentMethod || 'Card';

  console.log('PaymentMethod - Received params:', route.params);
  console.log('PaymentMethod - Grand Total:', grandTotal);
  console.log('PaymentMethod - Cart Items:', cartItems.length);
  console.log('PaymentMethod - Payment Method:', selectedPaymentMethod);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        `Your payment of $${grandTotal} has been processed successfully.`,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OrderConfirm', {
                selectedPaymentMethod,
                total: grandTotal,
                cartItems,
              }),
          },
        ],
      );
    }, 2000);
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
                You will pay ${grandTotal} in cash when your order is delivered
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
        contentContainerStyle={styles.contentContainer}>

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
            <Text style={styles.summaryValue}>${grandTotal}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${grandTotal}</Text>
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
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}>
          <LinearGradient
            colors={
              isProcessing ? [COLORS.grey, COLORS.grey] : COLORS.gradientButton
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.payButtonGradient}>
            <Text style={
              Platform.OS === 'ios' 
                ? {
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontFamily: 'System',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                    letterSpacing: 0.5,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{translateX: -45}, {translateY: -10}],
                    zIndex: 1002,
                  }
                : styles.payButtonText
            }>
              {isProcessing ? 'Processing...' : `Pay $${grandTotal}`}
            </Text>
            {isProcessing && (
              <Text style={styles.payButtonSubtext}>Please wait</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  payButton: {
    width: '100%',
    backgroundColor: COLORS.button,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 60,
    zIndex: 1001,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonGradient: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 60,
  },
  payButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    letterSpacing: 0.5,
  },
  payButtonSubtext: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: FONTS.Regular,
    opacity: 0.9,
  },
});
