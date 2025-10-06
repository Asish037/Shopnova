import React, { useContext, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import Toast from 'react-native-simple-toast';

import Header from '../Components/Header';
import CartCard from '../Components/CartCard';
import { CartContext } from '../Context/CartContext';
import { fonts } from '../utils/fonts';
import { FONTS } from '../Constant/Font';
import { COLORS } from '../Constant/Colors';
import { PADDING } from '../Constant/Padding';
import { moderateScale, verticalScale } from '../PixelRatio';

const CartScreen = () => {
  const { cartItems, deleteCartItem, totalPrice, user, token, refreshCartData, debugCartState } = useContext(CartContext);
  const navigation = useNavigation();

  console.log('CartScreen - User:', user);
  console.log('CartScreen - Token:', token);

  // constants for totals
  const shippingCost = 0.0;
  const grandTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);

  // Refresh cart data when screen loads (only if cart is empty or we need to sync with server)
  useEffect(() => {
    console.log('CartScreen - Component mounted, checking if cart refresh is needed...');
    console.log('CartScreen - Current cartItems length:', cartItems.length);
    console.log('CartScreen - Current cartItems:', cartItems);
    
    // Only refresh if cart is empty or if we need to sync with server
    const shouldRefresh = cartItems.length === 0;
    
    if (shouldRefresh) {
      console.log('CartScreen - Cart is empty, refreshing from server...');
      const forceRefresh = async () => {
        try {
          await refreshCartData();
          console.log('CartScreen - Cart data refreshed successfully');
        } catch (error) {
          console.log('CartScreen - Error refreshing cart data:', error);
        }
      };
      
      forceRefresh();
    } else {
      console.log('CartScreen - Cart has items, skipping automatic refresh');
    }
  }, []);


  // Debug cart items changes
  useEffect(() => {
    console.log('CartScreen - cartItems changed:', {
      length: cartItems.length,
      items: cartItems,
      user: user?.id,
      token: !!token
    });
  }, [cartItems, user, token]);

    const handleCheckout = () => {
      // Check if cart has items
      if (cartItems.length === 0) {
        Toast.show('Please add items to your cart before proceeding.');
        return;
      }

      // Navigate directly to Payment screen with cart data
      console.log('Proceeding to checkout with cart items:', cartItems.length);
      navigation.navigate('Payment', { grandTotal, cartItems });
    };


  const handleDeleteItem = async itemId => {
    console.log('Deleting cart item:', itemId);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Toast.show('No authentication token found. Please log in.');
        return;
      }

      // Ensure cartId is an integer
      const cartId = parseInt(itemId);
      console.log('Deleting cart item with cartId:', cartId);

      const response = await axios.delete('/delete-cart', {
        data: {
          cartId: cartId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Delete cart item response:', response.data);

      if (response.data && response.data.status === 1) {
        // Item deleted from server, now refresh cart from server
        await refreshCartData();
        Toast.show('Item removed from cart.');
      } else {
        Toast.show(response.data.message || 'Could not remove item.');
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      console.error('Error details:', error.response?.data);
      Toast.show('Failed to remove item. Please try again.');
    }
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartContent}>
        <View style={styles.emptyCartIconContainer}>
          <View style={styles.emptyCartIcon}>
            <Text style={styles.emptyCartEmoji}>🛒</Text>
          </View>
          <View style={styles.emptyCartIconGlow} />
        </View>
        <Text style={styles.emptyCartTitle}>Your Spiritual Cart is Empty</Text>
        <Text style={styles.emptyCartSubtitle}>
          Discover divine products and sacred items to enhance your spiritual journey.{'\n'}
          Start exploring our collection of Rudraksh, Yantras, and spiritual artifacts!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('categories')}>
            <View style={styles.buttonContent}>
              <Icon name="explore" size={moderateScale(18)} color={COLORS.white} />
              <Text style={styles.shopNowButtonText}>Explore Spiritual Products</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => navigation.navigate('MyWishList')}>
            <View style={styles.buttonContent}>
              <Icon name="favorite" size={moderateScale(18)} color={COLORS.button} />
              <Text style={styles.wishlistButtonText}>View Wishlist</Text>
            </View>
          </TouchableOpacity>
          
          {/* <TouchableOpacity
            style={[styles.shopNowButton, {backgroundColor: COLORS.primary, marginTop: 10}]}
            onPress={() => {
              debugCartState();
              refreshCartData();
            }}>
            <View style={styles.buttonContent}>
              <Icon name="refresh" size={moderateScale(18)} color={COLORS.white} />
              <Text style={styles.shopNowButtonText}>Debug & Refresh Cart</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradient} style={styles.gradientContainer}>
        <View style={styles.header}>
          <Header isCart={true} />
        </View>

        {cartItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <CartCard item={item} handleDelete={handleDeleteItem} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          />
        )}
      </LinearGradient>

      {/* Bottom Total Section - Only show when cart has items */}
      {cartItems.length > 0 && (
        <View style={styles.bottomContainer}>
          <View style={styles.totalSection}>
            <View style={styles.totalHeader}>
              <Text style={styles.totalHeaderText}>Order Summary</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{'\u20B9'}{totalPrice}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping:</Text>
              <Text style={styles.shippingValue}>
                {shippingCost === 0 ? 'Free' : `{'\u20B9'}${shippingCost.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>{'\u20B9'}{grandTotal}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Fixed Bottom Checkout Button - Only show when cart has items */}
      {cartItems.length > 0 && (
        <View style={styles.fixedBottomButton}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}>
            <View style={styles.checkoutButtonContent}>
              <Icon name="shopping-cart-checkout" size={moderateScale(20)} color={COLORS.white} />
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </View>
            <View style={styles.checkoutButtonGlow} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
  },
  gradientContainer: {
    flex: 1,
    paddingTop: PADDING.margin.small,
  },
  header: {
    paddingHorizontal: PADDING.header.horizontal,
  },
  flatListContent: {
    marginTop: PADDING.margin.xlarge,
    paddingBottom: Platform.OS === 'ios' ? verticalScale(160) : verticalScale(150),
    paddingHorizontal: PADDING.flatList.horizontal,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    height: Platform.OS === 'ios' ? verticalScale(220) : verticalScale(210),
    paddingHorizontal: PADDING.header.horizontal,
    paddingTop: PADDING.margin.xlarge,
    paddingBottom: PADDING.margin.xlarge,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? -6 : -8 },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.15,
    shadowRadius: Platform.OS === 'ios' ? 16 : 20,
    elevation: Platform.OS === 'android' ? 12 : 0,
    borderTopWidth: 2,
    borderColor: 'rgba(245, 74, 0, 0.3)',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
  },
  totalSection: {
    marginBottom: PADDING.margin.medium,
    paddingHorizontal: PADDING.margin.medium,
    backgroundColor: 'rgba(245, 74, 0, 0.05)',
    borderRadius: moderateScale(16),
    paddingVertical: PADDING.margin.medium,
    minHeight: Platform.OS === 'ios' ? verticalScale(140) : verticalScale(135),
  },
  totalHeader: {
    marginBottom: PADDING.margin.medium,
    paddingBottom: PADDING.margin.small,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 74, 0, 0.2)',
  },
  totalHeaderText: {
    fontSize: moderateScale(18),
    color: COLORS.button,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: PADDING.margin.small,
  },
  totalLabel: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontWeight: '500',
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  shippingValue: {
    fontSize: moderateScale(16),
    color: COLORS.button,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  divider: {
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.3)',
    marginVertical: PADDING.margin.medium,
  },
  grandTotalLabel: {
    fontSize: moderateScale(18),
    color: COLORS.black,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  grandTotalValue: {
    fontSize: moderateScale(20),
    color: COLORS.button,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  fixedBottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.margin.medium,
    paddingBottom: Platform.OS === 'ios' ? PADDING.margin.xlarge + 15 : PADDING.margin.xlarge + 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.2)',
  },
  checkoutButton: {
    backgroundColor: COLORS.button,
    height: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(48),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(16),
    shadowColor: COLORS.button,
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 4 : 6 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.4,
    shadowRadius: Platform.OS === 'ios' ? 8 : 12,
    elevation: Platform.OS === 'android' ? 8 : 0,
    position: 'relative',
    overflow: 'hidden',
  },
  checkoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  checkoutButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(20),
  },
  checkoutButtonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(18) : moderateScale(17),
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Empty Cart Styles
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.header.horizontal,
  },
  emptyCartContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: moderateScale(24),
    padding: PADDING.margin.xlarge,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(245, 74, 0, 0.2)',
    width: '100%',
    maxWidth: moderateScale(350),
  },
  emptyCartIconContainer: {
    position: 'relative',
    marginBottom: PADDING.margin.xlarge,
  },
  emptyCartIconGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
    borderRadius: moderateScale(60),
    zIndex: -1,
  },
  emptyCartIcon: {
    marginBottom: PADDING.margin.xlarge,
  },
  emptyCartEmoji: {
    fontSize: moderateScale(80),
  },
  emptyCartTitle: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: fonts.bold,
    marginBottom: PADDING.margin.medium,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptyCartSubtitle: {
    fontSize: moderateScale(16),
    color: '#666666',
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: moderateScale(26),
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.margin.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: PADDING.margin.medium,
  },
  shopNowButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: PADDING.button.horizontal,
    paddingVertical: Platform.OS === 'ios' ? PADDING.button.vertical + 4 : PADDING.button.vertical + 2,
    borderRadius: moderateScale(16),
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 4 : 6,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.4,
    shadowRadius: Platform.OS === 'ios' ? 8 : 12,
    elevation: Platform.OS === 'android' ? 8 : 0,
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: Platform.OS === 'ios' ? verticalScale(52) : verticalScale(50),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  shopNowButtonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(14),
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  wishlistButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: PADDING.button.horizontal,
    paddingVertical: Platform.OS === 'ios' ? PADDING.button.vertical + 4 : PADDING.button.vertical + 2,
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: COLORS.button,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 4 : 0,
    flex: 1,
    minHeight: Platform.OS === 'ios' ? verticalScale(52) : verticalScale(50),
  },
  wishlistButtonText: {
    fontSize: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(14),
    color: COLORS.button,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
