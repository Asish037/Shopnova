import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {fonts} from '../utils/fonts';
import {CartContext} from '../Context/CartContext';
import {COLORS} from '../Constant/Colors';
import { useRoute } from '@react-navigation/native';
// import {useTheme} from '../Context/ThemeContext';
// import { formatPrice } from '../Screens/ProductDetailsScreen';

const ProductCard = ({item, handleProductClick, toggleFavorite, isCompact = false}) => {
  const {cartItems, addToCartItem} = useContext(CartContext);

  const route = useRoute();
  const {img} = route?.params || {};

  // Compact styles for categories screen
  const compactStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginHorizontal: 6,
      marginVertical: 10,
      width: 100,
    },
    imageContainer: {
      width: 70,
      height: 70,
      borderRadius: 40,
      backgroundColor: COLORS.white,
      elevation: 3,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      marginBottom: 8,
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: '100%',
      borderRadius: 40,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 13,
      fontFamily: fonts.medium,
      fontWeight: '600',
      color: COLORS.black,
      textAlign: 'center',
      lineHeight: 16,
    },
    price: {
      fontSize: 12,
      fontFamily: fonts.medium,
      fontWeight: '700',
      color: '#f54a00',
      textAlign: 'center',
      marginTop: 4,
    },
    originalPrice: {
      fontSize: 10,
      fontFamily: fonts.regular,
      textDecorationLine: 'line-through',
      color: '#3a3838ff',
      textAlign: 'center',
    },
    likeContainer: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 4,
      elevation: 2,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    faviorate: {
      height: 16,
      width: 16,
    },
  });

  // Normal styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 10,
      backgroundColor: COLORS.white,
      borderRadius: 20,
      elevation: 3,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      overflow: 'hidden',
    },
    coverImage: {
      height: 200,
      width: '100%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      resizeMode: 'cover',
    },
    contentContainer: {
      padding: 12,
      paddingBottom: 16,
      flexGrow: 1,
    },
    title: {
      fontSize: 15,
      fontFamily: fonts.medium,
      fontWeight: '600',
      color: COLORS.black,
      marginBottom: 4,
      lineHeight: 20,
    },
    productOriginalPrice: {
      textDecorationLine: 'line-through',
      color: '#383636ff',
      fontWeight: '700',
      fontFamily: fonts.medium,
      fontSize: 15,
    },
    productPrice: {
      fontSize: 16,
      fontFamily: fonts.medium,
      fontWeight: '700',
      color: '#f54a00',
      // marginBottom: 6,
    },
    price: {
      fontSize: 18,
      fontFamily: fonts.medium,
      fontWeight: '700',
      color: COLORS.blue,
      marginBottom: 6,
    },
    description: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: '#000000ff',
      fontWeight: '500',
      marginBottom: 8,
      lineHeight: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    rating: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: COLORS.black,
      marginRight: 4,
      fontWeight: '500',
    },
    ratingCount: {
      fontSize: 10,
      fontFamily: fonts.regular,
      color: COLORS.grey,
    },
    cartButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginTop: 4,
    },
    cartButtonDefault: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.button,
    },
    cartButtonAdded: {
      backgroundColor: COLORS.button,
      borderWidth: 1,
      borderColor: COLORS.button,
    },
    cartIcon: {
      width: 16,
      height: 16,
      marginRight: 6,
    },
    cartIconDefault: {
      tintColor: COLORS.button,
    },
    cartIconAdded: {
      tintColor: '#FFFFFF',
    },
    cartButtonText: {
      fontSize: 12,
      fontFamily: fonts.medium,
      fontWeight: '600',
    },
    cartButtonTextDefault: {
      color: COLORS.button,
    },
    cartButtonTextAdded: {
      color: '#FFFFFF',
    },
    likeContainer: {
      position: 'absolute',
      padding: 8,
      backgroundColor: COLORS.white,
      borderRadius: 20,
      right: 12,
      top: 12,
      elevation: 2,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    faviorate: {
      height: 20,
      width: 20,
    },
  });

  // Check if item is already in cart
  const isInCart = cartItems.some(cartItem => cartItem.id === item.id);

  // Truncate description to 4 words
  const truncatedDescription =
    item.description?.split(' ').slice(0, 4).join(' ') + '...' ||
    'No description available...';

  // Format rating display
  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('') + ` (${rating})`;
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCartItem(item);
    }
  };

  // console.log('ProductCard image URL:', item.img || item.image);

  // Render compact version for categories screen
  if (isCompact) {
    return (
      <TouchableOpacity
        style={compactStyles.container}
        onPress={() => {
          handleProductClick(item);
        }}>
        
        <View style={compactStyles.imageContainer}>
          <Image 
            source={
              (item.img || item.image) 
                ? {uri: item.img || item.image}
                : require('../assets/model1.jpg') // fallback image
            } 
            style={compactStyles.coverImage}
          />
          
          {/* Favorite Button */}
          {/* <View style={compactStyles.likeContainer}>
            <TouchableOpacity
              onPress={() => {
                toggleFavorite(item);
              }}>
              {item.isFavorite ? (
                <Image
                  source={require('../assets/favoriteFilled.png')}
                  style={compactStyles.faviorate}
                />
              ) : (
                <Image
                  source={require('../assets/favorite.png')}
                  style={compactStyles.faviorate}
                />
              )}
            </TouchableOpacity>
          </View> */}
        </View>

        <Text style={compactStyles.title} numberOfLines={1}>
          {item.name || item.title}
        </Text>
        
        {/* {item.offer_price && (
          <Text style={compactStyles.price}>
            ₹{item.offer_price}
          </Text>
        )}
        
        {item.price && item.price !== item.offer_price && (
          <Text style={compactStyles.originalPrice}>
            ₹{item.price}
          </Text>
        )} */}
      </TouchableOpacity>
    );
  }

  // Original full card layout
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleProductClick(item);
      }}>
      <Image 
        source={
          (item.img || item.image) 
            ? {uri: item.img || item.image}
            : require('../assets/model1.jpg') // fallback image
        } 
        style={styles.coverImage}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name || item.title}
        </Text>
        
        {/* Debug: Show image URL */}
        {/* <Text style={{fontSize: 10, color: 'gray', marginBottom: 4}} numberOfLines={1}>
          IMG: {item.img || item.image || 'No image URL'}
        </Text> */}
        
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 6, gap: 10}} >
          <Text style={styles.productPrice}>{"\u20B9"}{item.offer_price}</Text>
          <Text style={styles.productOriginalPrice}>{"\u20B9"}{(item.price)}</Text>
        </View>
        {/* <Text style={styles.description} numberOfLines={2}>
          {truncatedDescription}
        </Text> */}

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {renderStars(item.rating?.rate || item.rating || Math.floor(Math.random() * 5) + 1)}
          </Text>
          {(item.rating?.count || item.ratingCount) && (
            <Text style={styles.ratingCount}>
              ({item.rating?.count || item.ratingCount})
            </Text>
          )}
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.cartButton,
            isInCart ? styles.cartButtonAdded : styles.cartButtonDefault,
          ]}
          onPress={handleAddToCart}
          disabled={isInCart}>
          <Image
            source={require('../assets/focused/shopping_cart.png')}
            style={[
              styles.cartIcon,
              isInCart ? styles.cartIconAdded : styles.cartIconDefault,
            ]}
          />
          <Text
            style={[
              styles.cartButtonText,
              isInCart
                ? styles.cartButtonTextAdded
                : styles.cartButtonTextDefault,
            ]}>
            {isInCart ? 'Added' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Favorite Button */}
      <View style={styles.likeContainer}>
        <TouchableOpacity
          onPress={() => {
            toggleFavorite(item);
          }}>
          {item.isFavorite ? (
            <Image
              source={require('../assets/favoriteFilled.png')}
              style={styles.faviorate}
            />
          ) : (
            <Image
              source={require('../assets/favorite.png')}
              style={styles.faviorate}
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
