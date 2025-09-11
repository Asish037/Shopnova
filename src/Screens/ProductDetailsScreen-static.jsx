import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useContext, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import {fonts} from '../utils/fonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';
import {COLORS} from '../Constant/Colors';

const {width} = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const {addToCartItem, cartItems} = useContext(CartContext);
  const route = useRoute();
  const navigation = useNavigation();
  const product = route.params.item;

  // Helper function to convert color names to hex codes for React Native
  const getColorValue = color => {
    const colorMap = {
      Black: '#000000',
      White: '#FFFFFF',
      Red: '#B11D1D',
      Blue: '#1F44A3',
      Brown: '#9F632A',
      Green: '#1D752B',
      Gray: '#91A1B0',
      Yellow: '#FFD700',
      Orange: '#FFA500',
      Purple: '#800080',
      Pink: '#FFC0CB',
      Navy: '#000080',
      Maroon: '#800000',
      Olive: '#808000',
      Cream: '#FFFDD0',
    };

    // If it's already a hex code, return it
    if (color && color.startsWith('#')) {
      return color;
    }

    // Otherwise, convert from name to hex
    return colorMap[color] || '#CCCCCC'; // Default to light gray if color not found
  };

  // Helper function to get display name for colors
  const getColorName = color => {
    const colorNames = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#B11D1D': 'Red',
      '#1F44A3': 'Blue',
      '#9F632A': 'Brown',
      '#1D752B': 'Green',
      '#91A1B0': 'Gray',
      '#FFD700': 'Yellow',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#000080': 'Navy',
      '#800000': 'Maroon',
      '#808000': 'Olive',
      '#FFFDD0': 'Cream',
      Black: 'Black',
      White: 'White',
      Red: 'Red',
      Blue: 'Blue',
      Brown: 'Brown',
      Green: 'Green',
      Gray: 'Gray',
    };
    return colorNames[color] || color;
  };

  // Dynamic state management
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    getColorValue(product.colors?.[0]) || '#B11D1D',
  );
  const [activeTab, setActiveTab] = useState('description');

  // Check if product is already in cart
  const isInCart = cartItems.some(cartItem => cartItem.id === product.id);

  const handleSearchChange = searchText => {
    console.log('Searching in product details:', searchText);
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCartItem({
        ...product,
        color: selectedColor,
        size: selectedSize,
        selectedColorName: getColorName(selectedColor),
      });
      navigation.navigate('CART');
    }
  };

  // Render star rating
  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('☆');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.descriptionText}>{product.description}</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Category:</Text>
              <Text style={styles.specValue}>{product.category || 'N/A'}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Gender:</Text>
              <Text style={styles.specValue}>{product.gender || 'N/A'}</Text>
            </View>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>
                      {review.reviewerName}
                    </Text>
                    <Text style={styles.reviewRating}>
                      {renderStars(review.rating)} ({review.rating})
                    </Text>
                  </View>
                  <Text style={styles.reviewText}>{review.reviewText}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet</Text>
            )}
          </View>
        );
      case 'specs':
        return (
          <View style={styles.tabContent}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Available Sizes:</Text>
              <Text style={styles.specValue}>
                {product.sizes ? product.sizes.join(', ') : 'One Size'}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Available Colors:</Text>
              <Text style={styles.specValue}>
                {product.colors ? product.colors.length : 0} options
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Rating:</Text>
              <Text style={styles.specValue}>
                {renderStars(product.rating)} ({product.rating}/5)
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        {/* Header */}
        <View style={styles.header}>
          <Header onSearchChange={handleSearchChange} />
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{uri: product.image}} style={styles.coverImage} />
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titlePriceContainer}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStars}>
              {renderStars(product.rating)}
            </Text>
            <Text style={styles.ratingText}>({product.rating}) Rating</Text>
          </View>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {product.sizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.selectedSizeButton,
                    ]}
                    onPress={() => setSelectedSize(size)}>
                    <Text
                      style={[
                        styles.sizeButtonText,
                        selectedSize === size && styles.selectedSizeText,
                      ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Color</Text>
              <View style={styles.colorContainer}>
                {product.colors.map((color, index) => {
                  const colorHex = getColorValue(color);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorBorder,
                        selectedColor === colorHex &&
                          styles.selectedColorBorder,
                      ]}
                      onPress={() => setSelectedColor(colorHex)}>
                      <View
                        style={[
                          styles.colorCircle,
                          {backgroundColor: colorHex},
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.selectedColorText}>
                Selected: {getColorName(selectedColor)}
              </Text>
            </View>
          )}

          {/* Tabs for Description, Reviews, Specs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'description' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('description')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'description' && styles.activeTabText,
                ]}>
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reviews' && styles.activeTabText,
                ]}>
                Reviews ({product.reviews?.length || 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'specs' && styles.activeTab]}
              onPress={() => setActiveTab('specs')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'specs' && styles.activeTabText,
                ]}>
                Specs
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isInCart && styles.addToCartButtonDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={isInCart}>
            <Text
              style={[
                styles.addToCartButtonText,
                isInCart && styles.addToCartButtonTextDisabled,
              ]}>
              {isInCart ? 'Already in Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  imageContainer: {
    height: 350,
    width: '100%',
    marginBottom: 20,
  },
  coverImage: {
    resizeMode: 'contain',
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 16,
    lineHeight: 30,
  },
  productPrice: {
    fontSize: 26,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#E94560',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingStars: {
    fontSize: 18,
    color: '#e82929da',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#666666',
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: '#E94560',
    borderColor: '#E94560',
  },
  sizeButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  colorBorder: {
    height: 44,
    width: 44,
    borderRadius: 22,
    padding: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorBorder: {
    borderColor: '#E94560',
  },
  colorCircle: {
    flex: 1,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedColorText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#666666',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    // backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#d72a2aff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#fff9faff',
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 120,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#444444',
    lineHeight: 24,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  specLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#666666',
  },
  specValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#2C2C2C',
  },
  reviewItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  reviewRating: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#e82929da',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#444444',
    lineHeight: 20,
  },
  noReviewsText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: COLORS.button,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: 'transparent',
  },
  addToCartButtonText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addToCartButtonTextDisabled: {
    color: '#999999',
  },
});