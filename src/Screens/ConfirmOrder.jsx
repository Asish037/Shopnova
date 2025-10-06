import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState, useMemo} from 'react';
import Header from '../Components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import axios from '../Components/axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmOrder = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    clearCart,
    user,
    token,
    cartItems: contextCartItems,
    totalPrice: contextTotalPrice,
    login,
    refreshCartData,
    setCartItems,
    calculateTotalPrice,
  } = useContext(CartContext);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Use useMemo to prevent cartItems from changing on every render
  const cartItems = useMemo(() => {
    return route.params?.cartItems?.length > 0
      ? route.params.cartItems
      : contextCartItems || [];
  }, [route.params?.cartItems, contextCartItems]);

  const selectedPaymentMethod =
    route.params?.selectedPaymentMethod || 'Not Selected';
  let total = route.params?.total || contextTotalPrice || 0;

  // Don't redirect immediately - let the component render and check cart after loading
  console.log('ConfirmOrder - Initial cart check:', {
    routeCartItems: route.params?.cartItems?.length || 0,
    contextCartItems: contextCartItems?.length || 0,
    finalCartItems: cartItems.length,
  });

  console.log('ConfirmOrder - Route params:', route.params);
  console.log(
    'ConfirmOrder - Route cartItems:',
    route.params?.cartItems?.length || 0,
  );
  console.log(
    'ConfirmOrder - Context cartItems:',
    contextCartItems?.length || 0,
  );
  console.log('ConfirmOrder - Final cartItems:', cartItems);
  console.log('ConfirmOrder - Items count:', cartItems.length);
  console.log('ConfirmOrder - Total:', total);
  console.log(
    'ConfirmOrder - Selected Address:',
    route.params?.selectedAddress,
  );
  console.log('ConfirmOrder - Payment Method:', selectedPaymentMethod);

  // Force restore authentication when screen loads
  useEffect(() => {
    const forceRestoreAuth = async () => {
      try {
        console.log('ConfirmOrder - Screen loaded, checking authentication...');
        const [storedToken, storedUserData] = await AsyncStorage.multiGet([
          'userToken',
          'userData',
        ]);

        if (storedToken[1] && storedUserData[1]) {
          console.log(
            'ConfirmOrder - Found stored auth data, checking if context needs update...',
          );
          const parsedUser = JSON.parse(storedUserData[1]);

          // Handle both single user object and array of users
          let userToCheck = parsedUser;
          if (Array.isArray(parsedUser)) {
            // If it's an array, get the first user
            userToCheck = parsedUser[0];
            console.log(
              'ConfirmOrder - Using first user from array:',
              userToCheck,
            );
          }

          // Only call login if user is not already logged in or if it's a different user
          if (!user || user.id !== userToCheck.id) {
            console.log(
              'ConfirmOrder - User not logged in or different user, calling login...',
            );
            await login(userToCheck, storedToken[1]);
            console.log('ConfirmOrder - Context updated with stored data');
          } else {
            console.log(
              'ConfirmOrder - User already logged in, skipping login call',
            );
          }

          // Only refresh cart data if cart is empty
          console.log('ConfirmOrder - Checking if cart refresh is needed...');
          if (contextCartItems.length === 0) {
            console.log(
              'ConfirmOrder - Cart is empty, refreshing from server...',
            );
            await refreshCartData();
          } else {
            console.log(
              'ConfirmOrder - Cart has items, skipping refresh to preserve cart',
            );
          }
          setCartLoaded(true);
        }
      } catch (error) {
        console.error(
          'ConfirmOrder - Error restoring auth on screen load:',
          error,
        );
      }
    };

    forceRestoreAuth();
  }, [user, login, refreshCartData, contextCartItems.length]);

  // Check cart after it's loaded and sync route items to context if needed
  useEffect(() => {
    if (cartLoaded) {
      // Use route cart items first, then fall back to context
      // Prioritize route parameters over context cart (route params are more reliable)
      const currentCartItems = cartItems || contextCartItems || [];
      console.log(
        'ConfirmOrder - Cart check after loading:',
        currentCartItems.length,
      );
      console.log('ConfirmOrder - Route cart items:', cartItems.length);
      console.log(
        'ConfirmOrder - Context cart items:',
        contextCartItems?.length || 0,
      );

      // If route has cart items but context is empty, sync route items to context
      if (cartItems.length > 0 && (contextCartItems?.length || 0) === 0) {
        console.log(
          'ConfirmOrder - Route has cart items but context is empty, syncing to context...',
        );
        // Update context with route cart items
        if (typeof setCartItems === 'function') {
          console.log(
            'ConfirmOrder - Updating context cart items with route data',
          );
          setCartItems(cartItems);
          if (typeof calculateTotalPrice === 'function') {
            calculateTotalPrice(cartItems);
          }
        }
      }

      // Only redirect if BOTH route params and context are empty
      if (cartItems.length === 0 && (contextCartItems?.length || 0) === 0) {
        console.log(
          'ConfirmOrder - Both route and context cart are empty, redirecting to cart',
        );
        Alert.alert(
          'Empty Cart',
          'Your cart is empty. Please add items to your cart before proceeding.',
        );
        navigation.goBack();
      } else if (cartItems.length > 0) {
        console.log(
          'ConfirmOrder - Using route cart items, proceeding with order',
        );
      } else {
        console.log(
          'ConfirmOrder - Using context cart items, proceeding with order',
        );
      }
    }
  }, [
    cartLoaded,
    cartItems,
    contextCartItems,
    setCartItems,
    calculateTotalPrice,
    navigation,
  ]);

  const handlePlaceOrder = async () => {
    try {
      // Force restore authentication data from AsyncStorage
      console.log('ConfirmOrder - Force restoring authentication data...');

      let authToken = null;
      let userId = null;
      let userData = null;

      try {
        // Get both token and user data from AsyncStorage
        const [storedToken, storedUserData] = await AsyncStorage.multiGet([
          'userToken',
          'userData',
        ]);

        if (storedToken[1]) {
          authToken = storedToken[1];
          console.log('Token restored from AsyncStorage');
        }

        if (storedUserData[1]) {
          userData = JSON.parse(storedUserData[1]);
          // Handle both single user object and array of users
          if (Array.isArray(userData)) {
            // Try to find user that matches token first
            const tokenUserId = authToken?.split('|')[1];
            if (tokenUserId) {
              const matchingUser = userData.find(
                u => u.id === tokenUserId || u.userId === tokenUserId,
              );
              if (matchingUser) {
                userId = matchingUser.id;
                userData = matchingUser;
                console.log('Found matching user for token:', matchingUser);
              } else {
                // Fallback to first user if no match
                const firstUser = userData[0];
                userId = firstUser?.id;
                userData = firstUser;
                console.log(
                  'No matching user found, using first user:',
                  userId,
                );
              }
            } else {
              // No token user ID, use first user
              const firstUser = userData[0];
              userId = firstUser?.id;
              userData = firstUser;
              console.log('No token user ID, using first user:', userId);
            }
          } else {
            userId = userData?.id;
          }
          console.log('User data restored from AsyncStorage:', userData);
          console.log('Extracted userId:', userId);
        }
      } catch (error) {
        console.error('Error restoring auth data from AsyncStorage:', error);
      }

      // Fallback to context if AsyncStorage fails
      if (!authToken) {
        authToken = token;
        console.log('Using token from context');
      }

      if (!userId) {
        userId = user?.id;
        userData = user;
        console.log('Using user data from context');
      }

      if (!authToken) {
        Alert.alert('Not Logged In', 'Please log in to place an order.');
        return;
      }

      console.log('ConfirmOrder - Authentication check:', {
        userId,
        userFromContextUserId: user?.id,
        userObject: user,
        hasToken: !!authToken,
        tokenFromContext: !!token,
        finalUserId: userId || user?.id,
      });

      if (!userId) {
        Alert.alert(
          'User ID Missing',
          'User ID not found. Please log in again.',
        );
        return;
      }
      if (cartItems.length === 0) {
        Alert.alert(
          'Empty Cart',
          'Your cart is empty. Please add items before placing an order.',
        );
        return;
      }

      // Validate address - but don't block if missing, add fallback
      if (!route.params?.selectedAddress) {
        console.warn(
          'ConfirmOrder - No selected address found, using fallback',
        );
        // Don't block the order, just log a warning
      }

      const payload = {
        userId: userId || user?.id,
        total: total,
        order_items: cartItems.map(item => ({
          productId: item.id || item.productId,
          product_name: item.name || item.product_name || 'Unknown Product',
          quantity: item.quantity || 1,
          product_image: item.image || item.product_image || '',
          product_price: item.price || item.product_price || 0,
          product_offer_price:
            item.offerPrice || item.offer_price || item.price || 0,
        })),
        payment_method: selectedPaymentMethod || 'cash',
        // Add address information if available, otherwise use fallback
        address: route.params?.selectedAddress || {
          id: 'fallback',
          name: 'Default Address',
          address: 'Default Address',
          city: 'Default City',
          state: 'Default State',
          pincode: '000000',
          phone: '0000000000',
        },
      };

      console.log('Place Order Payload:', JSON.stringify(payload, null, 2));
      console.log('Payload validation check:', {
        hasUserId: !!payload.userId,
        hasTotal: !!payload.total,
        hasOrderItems: payload.order_items?.length > 0,
        hasPaymentMethod: !!payload.payment_method,
        hasAddress: !!payload.address,
        orderItemsCount: payload.order_items?.length,
      });

      // CRITICAL FIX: Check server cart first before attempting sync
      console.log('🔍 Checking server cart before order placement...');
      try {
        const serverCartResponse = await axios.get('/cart', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log('🔍 Server cart check:', serverCartResponse.data);

        // If server has no cart data, clear local cart and show error
        if (
          serverCartResponse.data?.data?.cart_items?.length === 0 ||
          serverCartResponse.data?.status === 0
        ) {
          console.log('🧹 Server has no cart data, clearing local cart');
          await clearCart();
          Alert.alert(
            'Empty Cart',
            'Your cart is empty on the server. Please add items to your cart first.',
            [{text: 'OK'}],
          );
          return; // Exit the function
        }
      } catch (serverCartError) {
        console.log('⚠️ Could not check server cart:', serverCartError.message);
      }

      // CRITICAL FIX: Sync cart items to server before placing order
      console.log('🔄 Syncing cart items to server before order placement...');
      console.log('🔄 Cart items to sync:', cartItems.length);
      console.log('🔄 Cart items details:', cartItems);

      try {
        // Clear server cart first to ensure clean state
        console.log('🧹 Clearing server cart first...');
        try {
          await axios.delete('/clear-cart', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            data: {userId: userId},
          });
          console.log('🧹 Server cart cleared successfully');
        } catch (clearError) {
          console.log(
            '⚠️ Could not clear server cart (might not exist):',
            clearError.message,
          );
        }

        // Now sync all cart items to server
        for (const cartItem of cartItems) {
          const productId =
            cartItem.id || cartItem.productId || cartItem.product_id;
          const syncData = {
            userId: userId.toString(),
            orderId: 0,
            items: [
              {
                productId: productId.toString(),
                quantity: (cartItem.quantity || 1).toString(),
              },
            ],
          };

          console.log('🔄 Syncing cart item to server:', syncData);
          console.log('🔄 Cart item details:', cartItem);
          console.log('🔄 ProductId being sent:', productId);
          console.log('🔄 ProductId type:', typeof productId);

          const syncResponse = await axios.post('/add-cart', syncData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });
          console.log('🔄 Cart sync response:', syncResponse.data);
          console.log('🔄 Cart sync errors:', syncResponse.data?.errors);

          if (syncResponse.data?.status !== 1) {
            console.log(
              '⚠️ Cart sync failed for item:',
              productId,
              'Response:',
              syncResponse.data,
            );
          }
        }
        console.log('✅ All cart items synced to server successfully');

        // Verify server cart after sync
        try {
          console.log('🔍 Verifying server cart after sync...');
          const verifyResponse = await axios.get('/cart', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });
          console.log('🔍 Server cart after sync:', verifyResponse.data);

          // If server has no cart data, clear local cart to match server state
          if (
            verifyResponse.data?.data?.cart_items?.length === 0 ||
            verifyResponse.data?.status === 0
          ) {
            console.log(
              '🧹 Server has no cart data, clearing local cart to match server state',
            );
            await clearCart();
            Alert.alert(
              'Cart Cleared',
              'Your cart has been cleared because the server has no cart data. Please add items again.',
              [{text: 'OK'}],
            );
            return; // Exit the function since cart is now empty
          }
        } catch (verifyError) {
          console.log('⚠️ Could not verify server cart:', verifyError.message);
        }
      } catch (syncError) {
        console.log(
          '⚠️ Cart sync failed, proceeding with order anyway:',
          syncError.message,
        );
      }

      try {
        const response = await axios.post('/place-order', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('API Response:', response.data);

        if (response.data.status === 1) {
          console.log('Order Placed Successfully:', response.data);
          const orderId =
            response.data?.data?.order_id || response.data?.data?.id;
          if (orderId) {
            console.log('Navigating to OrderConfirm with orderId:', orderId);
            console.log('Cart items before navigation:', cartItems.length);
            // Navigate to OrderConfirm first with cart items
            navigation.replace('OrderConfirm', {
              orderId,
              selectedPaymentMethod: selectedPaymentMethod || 'Cash',
              total: total,
              cartItems,
            });

            console.log('Navigation called, delaying cart clearing...');
            // Clear cart after a delay to ensure navigation completes
            setTimeout(async () => {
              console.log('Clearing cart after delay...');
              await clearCart();
              console.log('Cart cleared after delay');
            }, 1000);
          } else {
            console.warn('No orderId in response:', response.data);
            // Show error when no orderId is returned
            Alert.alert(
              'Order Failed',
              'Order was not created successfully. Please try again.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log(
                      'Order failed - no orderId, staying on ConfirmOrder screen',
                    );
                  },
                },
              ],
            );
          }
        } else {
          console.error('Order Placement Failed:', response.data);

          // If server says no items found, clear local cart to match server state
          if (
            response.data.message &&
            response.data.message.includes('No items found in cart')
          ) {
            console.log(
              '🧹 Server has no cart data, clearing local cart to match server state',
            );
            await clearCart();
          }

          // Show error message instead of success page
          Alert.alert(
            'Order Failed',
            response.data.message || 'Failed to place order. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Stay on the same screen so user can try again
                  console.log('Order failed, staying on ConfirmOrder screen');
                },
              },
            ],
          );
        }
      } catch (apiError) {
        console.error('API Error:', apiError);

        // Handle specific validation errors
        if (apiError.response && apiError.response.data) {
          const errorData = apiError.response.data;
          console.error('API Error Response:', errorData);

          if (errorData.errors) {
            // Handle validation errors
            const errorMessages = [];
            Object.keys(errorData.errors).forEach(field => {
              if (
                errorData.errors[field] &&
                errorData.errors[field].length > 0
              ) {
                errorMessages.push(`${field}: ${errorData.errors[field][0]}`);
              }
            });
            const errorText = errorMessages.join('\n');
            Alert.alert(
              'Validation Error',
              errorText || errorData.message || 'Validation failed',
            );
            return;
          } else if (errorData.message) {
            Alert.alert('Order Error', errorData.message);
            return;
          }
        }

        // Show generic error for other cases
        Alert.alert('Order Failed', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // Show error alert instead of success page
      Alert.alert(
        'Order Failed',
        'An error occurred while placing the order. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log(
                'Order failed due to error, staying on ConfirmOrder screen',
              );
            },
          },
        ],
      );
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSubtotal}>
          ₹{item.offerPrice || item.offer_price * item.quantity}
        </Text>
      </View>
      <View style={styles.itemDetailsContainer}>
        <View style={styles.itemDetailRow}>
          <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
          <Text style={styles.itemDetails}>
            Price: ₹{item.offerPrice || item.offer_price}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={COLORS.gradient} style={{flex: 1}}>
      <View style={styles.container}>
        <Header title="Confirm Order" />

        {cartItems.length > 0 ? (
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.title}>Order Summary</Text>

              <View style={styles.itemsContainer}>
                <FlatList
                  data={cartItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              </View>

              <View style={styles.summarySection}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Payment Method:</Text>
                  <Text style={styles.paymentValue}>
                    {selectedPaymentMethod}
                  </Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>₹{total}</Text>
                </View>
              </View>

              <LinearGradient
                colors={COLORS.gradientButton}
                style={styles.button}>
                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={handlePlaceOrder}
                  activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Place Order</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No items in cart</Text>
            <Text style={styles.emptySubtext}>
              Add some items to your cart to place an order
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
    // alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: COLORS.lightgray,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: 'black',
    flex: 1,
    marginRight: 10,
  },
  itemSubtotal: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
    color: 'red',
  },
  itemDetailsContainer: {
    marginTop: 4,
  },
  itemDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetails: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: '#2c2c2c',
  },
  separator: {
    height: 8,
    // backgroundColor: "#000",
    borderWidth: 1,
    borderColor: '#000',
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgray,
    paddingTop: 20,
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: COLORS.black,
  },
  paymentValue: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: 'red',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightgray,
    padding: 16,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    color: 'red',
  },
  button: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonTouchable: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: COLORS.button,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.Bold,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  empty: {
    fontSize: 20,
    fontFamily: FONTS.SemiBold,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
});
