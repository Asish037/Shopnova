import React, { useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import Toast from 'react-native-simple-toast';

import Header from '../Components/Header';
import CartCard from '../Components/CartCard';
import { CartContext } from '../Context/CartContext';
import { fonts } from '../utils/fonts';
import { FONTS } from '../Constant/Font';
import { COLORS } from '../Constant/Colors';

const CartScreen = () => {
  const { cartItems, deleteCartItem, totalPrice } = useContext(CartContext);
  const navigation = useNavigation();

  // constants for totals
  const shippingCost = 0.0;
  const grandTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);

  const handleCheckout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Toast.show('No auth token found. Please log in again.');
        return;
      }

      if (cartItems.length === 0) {
        Toast.show('Please add items to your cart before proceeding.');
        return;
      }

      const payload = {
        items: cartItems.map(item => ({
          product_id: item.id || item.productId || 'unknown', // handle undefined id
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: totalPrice,
        shipping: shippingCost,
        total: grandTotal,
      };

      console.log('Checkout payload:', payload);

      const response = await axios.post('/add-cart', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Add to cart response:', response.data);

      if (response.status === 200) {
        navigation.navigate('Payment', { grandTotal, cartItems });
      } else {
        Toast.show(response.data.message || 'Something went wrong on the server.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Toast.show('Checkout failed. Please try again.');
    }
  };

  const handleDeleteItem = async itemId => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Toast.show('No authentication token found. Please log in.');
        return;
      }

      const response = await axios.delete(`/delete-cart?cartId=${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        deleteCartItem(itemId);
        Toast.show('Item removed from cart.');
      } else {
        Toast.show(response.data.message || 'Could not remove item.');
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      Toast.show('Failed to remove item. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradient} style={styles.gradientContainer}>
        <View style={styles.header}>
          <Header isCart={true} />
        </View>

        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <CartCard item={item} handleDelete={handleDeleteItem} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 16,
          }}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        />
      </LinearGradient>

      {/* Bottom Total Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>${totalPrice}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping:</Text>
            <Text style={styles.totalValue}>
              {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>${grandTotal}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    paddingTop: 5,
  },
  header: {
    paddingHorizontal: 15,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    height: 260,
    paddingHorizontal: 15,
    paddingTop: 24,
    paddingBottom: 34,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderColor: '#ddbbbbff',
  },
  totalSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#1f0303ff',
    fontWeight: '500',
    fontFamily: fonts.regular,
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: '#a54848ff',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    color: '#2C2C2C',
    fontWeight: '700',
    fontFamily: fonts.medium,
  },
  grandTotalValue: {
    fontSize: 20,
    color: '#E94560',
    fontWeight: '700',
    fontFamily: fonts.medium,
  },
  checkoutButton: {
    backgroundColor: COLORS.button,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: fonts.medium,
  },
});
