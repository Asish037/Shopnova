import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {fonts} from '../utils/fonts';
import {CartContext} from '../Context/CartContext';
import {COLORS} from '../Constant/Colors';
// import {useTheme} from '../Context/ThemeContext';

const CartCard = ({item, handleDelete}) => {
  console.log(JSON.stringify(item));
  const {updateCartItemQuantity} = useContext(CartContext);
  // const {getThemeColors} = useTheme();
  // const themeColors = getThemeColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      marginVertical: 8,
      marginHorizontal: 4,
      padding: 16,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageContainer: {
      marginRight: 16,
    },
    image: {
      height: 80,
      width: 80,
      resizeMode: 'contain',
      borderRadius: 12,
    },
    content: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: fonts.medium,
      color: COLORS.black,
      flex: 1,
      marginRight: 12,
      lineHeight: 20,
    },
    sizeRow: {
      marginBottom: 8,
    },
    sizeLabel: {
      fontSize: 14,
      fontFamily: fonts.regular,
      color: COLORS.grey,
    },
    offerPrice:{
      fontSize: 16,
      fontFamily: fonts.medium,
      color: COLORS.button,
      fontWeight: '700',
      marginBottom: 4,  
    },
    price: {
      fontSize: 14,
      fontFamily: fonts.medium,
      color: COLORS.black,
      fontWeight: '600',
      marginBottom: 12,
      textDecorationLine: 'line-through',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteIcon: {
      height: 16,
      width: 16,
      tintColor: COLORS.grey,
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      borderRadius: 16,
      paddingHorizontal: 2,
    },
    quantityButton: {
      backgroundColor: COLORS.grey,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonText: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: '600',
      fontFamily: fonts.medium,
    },
    quantityText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: fonts.medium,
      color: COLORS.black,
      marginHorizontal: 10,
    },
  });

  const currentQuantity = item.quantity || 1;

  const handleQuantityChange = action => {
    if (action === 'increment') {
      updateCartItemQuantity(item.id, currentQuantity + 1);
    } else if (action === 'decrement') {
      if (currentQuantity > 1) {
        updateCartItemQuantity(item.id, currentQuantity - 1);
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.image}} style={styles.image} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}>
            <Image
              source={require('../assets/deleteIcon.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.sizeRow}>
          <Text style={styles.sizeLabel}>Size {item.size || 'M'}</Text>
        </View>

        <Text style={styles.offerPrice}>
          {'\u20B9'}{(item.offer_price * currentQuantity).toFixed(2)}
        </Text>
        <Text style={styles.price}>
          {'\u20B9'}{(item.price * currentQuantity).toFixed(2)}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            {currentQuantity > 1 && (
              <TouchableOpacity
                onPress={() => handleQuantityChange('decrement')}
                style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.quantityText}>{currentQuantity}</Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange('increment')}
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartCard;
