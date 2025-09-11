import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import CartCard from '../Components/CartCard';
import { fonts } from '../utils/fonts';
import { CartContext } from '../Context/CartContext';
// import {useTheme} from '../Context/ThemeContext';
import { FONTS } from '../Constant/Font';
import { COLORS } from '../Constant/Colors';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, deleteCartItem, totalPrice } = useContext(CartContext);
  const navigation = useNavigation();
  // const {getThemeColors} = useTheme();
  // const themeColors = getThemeColors();

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
      shadowOffset: {
        width: 0,
        height: -4,
      },
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
      shadowOffset: {
        width: 0,
        height: 4,
      },
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

  const handleDeleteItem = async id => {
    await deleteCartItem(id);
  };

  const shippingCost = 0.0;
  const grandTotal = (parseFloat(totalPrice) + shippingCost).toFixed(2);

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
          keyExtractor={item => item.id.toString()}
        />
      </LinearGradient>
      {/* separator */}
      {/* <View style={styles.separator} /> */}

      {/* Bottom Total Section with White Background */}
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
          onPress={() =>
            navigation.navigate('Payment', { grandTotal, cartItems })
          }>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
