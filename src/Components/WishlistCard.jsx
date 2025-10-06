import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import React, {useContext, useRef, useEffect, useState} from 'react';
import {fonts} from '../utils/fonts';
import {CartContext} from '../Context/CartContext';
import {COLORS} from '../Constant/Colors';

const WishlistCard = ({
  item,
  handleProductClick,
  toggleFavorite,
  removeFromWishlist,
}) => {
  const {cartItems, addToCartItem} = useContext(CartContext);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isAdding, setIsAdding] = useState(false);

  // Check if item is actually in cart (persistent until purchasing is complete)
  const itemId = item.id || item.productId || item.product_id;
  const isInCart =
    cartItems?.some(cartItem => {
      const cartItemId =
        cartItem.id || cartItem.productId || cartItem.product_id;
      return cartItemId?.toString() === itemId?.toString();
    }) || false;

  // Debug logging for cart state
  console.log(
    `🛒 WishlistCard - Item ${item.id} (productId: ${item.productId}) - isInCart: ${isInCart}`,
  );
  console.log(`🛒 WishlistCard - Cart items count: ${cartItems?.length || 0}`);

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

  const handleAddToCart = async () => {
    console.log(
      '🛒 WishlistCard - handleAddToCart called, isAdding:',
      isAdding,
    );
    if (isAdding || isInCart) return; // Prevent multiple clicks if already adding or already in cart

    try {
      setIsAdding(true);
      console.log('🛒 WishlistCard - Calling addToCartItem...');

      // Add success animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Wait for the entire addToCartItem process to complete
      await addToCartItem(item);

      console.log('🛒 WishlistCard - addToCartItem completed successfully');

      // No need to manually reset state - the isInCart check will handle display
      // The button will show "Added" as long as the item remains in cart
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromWishlist = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      removeFromWishlist && removeFromWishlist(item);
    });
  };
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale: scaleAnim}],
          opacity: fadeAnim,
        },
      ]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => {
          handleProductClick(item);
        }}>
        <Image source={{uri: item.image}} style={styles.coverImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 6,
              gap: 10,
            }}>
            <Text style={styles.productPrice}>
              {'\u20B9'}
              {item.offer_price}
            </Text>
            <Text style={styles.productOriginalPrice}>
              {'\u20B9'}
              {item.price}
            </Text>
          </View>
          {/* <Text style={styles.description} numberOfLines={2}>
          {truncatedDescription}
        </Text> */}

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {renderStars(
                item.rating?.rate ||
                  item.rating ||
                  Math.floor(Math.random() * 5) + 1,
              )}
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
            disabled={isAdding}>
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
              {isAdding ? 'Adding...' : isInCart ? 'Added ✓' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Favorite Button */}
        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={() => {
              toggleFavorite(item);
            }}>
            <Image
              source={require('../assets/favoriteFilled.png')}
              style={styles.faviorate}
            />
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        <View style={styles.deleteContainer}>
          <TouchableOpacity onPress={handleRemoveFromWishlist}>
            <Image
              source={require('../assets/deleteIcon.png')}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WishlistCard;

const styles = StyleSheet.create({
  container: {
    width: '47%',
    marginHorizontal: 8,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardContent: {
    flex: 1,
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
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#2C2C2C',
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
    fontFamily: fonts.regular,
    color: '#666666',
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartButtonDefault: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.button,
  },
  cartButtonAdded: {
    backgroundColor: COLORS.button,
    borderWidth: 2,
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
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    right: 12,
    top: 12,
    elevation: 4,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteContainer: {
    position: 'absolute',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    right: 12,
    top: 65,
    elevation: 4,
    shadowColor: '#E94560',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  faviorate: {
    height: 20,
    width: 20,
  },
  deleteIcon: {
    height: 20,
    width: 20,
    tintColor: '#E94560', // Red color for delete icon
  },
});
