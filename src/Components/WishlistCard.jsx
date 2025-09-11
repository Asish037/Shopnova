import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {fonts} from '../utils/fonts';
import {CartContext} from '../Context/CartContext';

const ProductCard = ({
  item,
  handleProductClick,
  toggleFavorite,
  removeFromWishlist,
}) => {
  const {cartItems, addToCartItem} = useContext(CartContext);

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
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleProductClick(item);
      }}>
      <Image source={{uri: item.image}} style={styles.coverImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {truncatedDescription}
        </Text>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>
            {renderStars(item.rating?.rate || item.rating || 0)}
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
          <Image
            source={require('../assets/favoriteFilled.png')}
            style={styles.faviorate}
          />
        </TouchableOpacity>
      </View>

      {/* Delete Button */}
      <View style={styles.deleteContainer}>
        <TouchableOpacity
          onPress={() => {
            removeFromWishlist && removeFromWishlist(item);
          }}>
          <Image
            source={require('../assets/deleteIcon.png')}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '47%',
    marginHorizontal: 8,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
  price: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#E94560',
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
    color: '#FFA500',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: '#999999',
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
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#E94560',
  },
  cartButtonAdded: {
    backgroundColor: '#E94560',
    borderWidth: 1,
    borderColor: '#E94560',
  },
  cartIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  cartIconDefault: {
    tintColor: '#E94560',
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
    color: '#E94560',
  },
  cartButtonTextAdded: {
    color: '#FFFFFF',
  },
  likeContainer: {
    position: 'absolute',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    right: 12,
    top: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  deleteContainer: {
    position: 'absolute',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    right: 12,
    top: 60, // Position below the favorite icon
    elevation: 2,
    shadowColor: '#000',
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
  deleteIcon: {
    height: 20,
    width: 20,
    tintColor: '#E94560', // Red color for delete icon
  },
});
