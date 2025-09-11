import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import { fonts } from '../utils/fonts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CartContext } from '../Context/CartContext';
import { COLORS } from '../Constant/Colors';
import axios from '../Components/axios';
import qs from 'qs';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ProductLoader from '../Components/ProductLoader';
import ProductDetailsSkeleton from '../Components/ProductDetailsSkeleton';
import ProductDetailsLoader from '../Components/ProductDetailsLoader';


const { width } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const { addToCartItem, cartItems, wishlist, addToWishlist, removeFromWishlist, isFavorite, user } = useContext(CartContext);
  const route = useRoute();
  const navigation = useNavigation();

  // const product = route.params.item;
  const { productId } = route.params || {};

  // Handle case where productId is not provided
  if (!productId) {
    console.error('No productId provided in route params');
  }

  const numericProductId = parseInt(productId, 10);


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
      Golden: '#FFD700',
    };
    // If it's already a hex code, return it
    if (color && color.startsWith('#')) {
      return color;
    }
    return colorMap[color] || null;
    // if (!color) return '#cccccc';

    // if (color.startsWith('#')) {
    //   return color;
    // }
    // try {
    //   return `#${color}`;
    // } catch (error) {
    //   console.error('Error parsing color:', error);
    //   return '#cccccc';
    // }
  }
  const getColorName = color => {
    if (!color) return 'N/A';
    const colorNames = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#B11D1D': 'Red',
      '#1F44A3': 'Blue',
      '#9F632A': 'Brown',
      '#1D752B': 'Green',
      '#91A1B0': 'Gray',
      '#FFD700': 'Golden',
      '#FFA500': 'Orange',

    };
    return colorNames[color] || 'N/A';
    // if (color.startsWith('#')) {
    //   return color;
    // }
    // try {
    //   return color;
    // } catch (error) {
    //   console.error('Error parsing color:', error);
    //   return 'N/A';
    // }
  };

  // Dynamic state management
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = searchText => {
    console.log('Searching in product details:', searchText);
  };



  const parseColors = keyFeatures => {
    if (!keyFeatures) return [];
    return keyFeatures
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.toLowerCase().startsWith('color -'))
      .map(line => line.split('-')[1].trim());
  };

  const parseSizes = sizesString => {
    if (!sizesString) return [];
    return sizesString.split(',').map(s => s.trim());
  };

  console.log("Route params:", route.params);
  console.log("Product ID (raw):", productId, typeof productId);
  console.log("Numeric Product ID:", numericProductId, typeof numericProductId);


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching product details for ID:', numericProductId);
        console.log('Product ID from route:', productId);
        
        // Validate product ID
        if (!numericProductId || isNaN(numericProductId) || numericProductId <= 0) {
          throw new Error(`Invalid product ID: ${numericProductId}`);
        }
        
        const config = {
          method: 'GET',
          url: `/product-details?id=${numericProductId}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 15000, // Increase timeout to 15 seconds
        };
        
        console.log('Making request with config:', config);
        console.log('Full URL will be:', `https://ecom.kussoft.net/api/product-details?id=${numericProductId}`);
        
        // Try the request with retry logic
        let response;
        let lastError;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`Attempt ${attempt} to fetch product details`);
            response = await axios(config);
            break; // Success, exit retry loop
          } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed:`, error.message);
            if (attempt < 3) {
              console.log(`Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        if (!response) {
          throw lastError; // Throw the last error if all attempts failed
        }
        console.log('API response:', response.data);

        const productData = response.data.data;

        // Check if productData exists
        if (!productData) {
          console.error('No product data found in response');
          throw new Error('Product not found');
        }

        // Parse colors and sizes
        const colors = parseColors(productData.key_features || '');
        const sizes = parseSizes(productData.sizes || '');

        // Transform backend fields into frontend-friendly keys
        const formattedProduct = {
          id: productData.id,
          title: productData.name || 'Untitled Product',
          image: productData.img || '',  // backend gives "img"
          price: productData.price || 0,
          offerPrice: productData.offer_price || productData.price || 0,
          description: productData.description || 'No description available',
          slug: productData.slug || '',
          sku: productData.SKU || '',
          rulingDeity: productData.ruling_deity || '',
          benefits: productData.benefits || '',
          howToUse: productData.how_to_use || '',
          keyFeatures: productData.key_features || '',
          safetyInformation: productData.safty_information || '',
          categoryName: productData.category_name || '',
          vendorName: productData.vendor_name || '',
          colors,
          sizes,
          rating: 0,
          reviews: [],
        };
        setProductDetails(formattedProduct);
        console.log('Formatted product:', formattedProduct);
      } catch (error) {
        console.error('Error fetching product details:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
          }
        });
        
        // Show user-friendly error message
        if (error.code === 'ECONNABORTED') {
          console.error('Request timeout - server took too long to respond');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          console.error('Network error - check internet connection');
        } else if (error.response?.status === 404) {
          console.error('Product not found');
        } else {
          console.error('Server error:', error.response?.status);
        }
        
        // Set a fallback product to prevent infinite loading
        setProductDetails({
          id: numericProductId,
          title: 'Product Not Available',
          image: '',
          price: 0,
          offerPrice: 0,
          description: 'Unable to load product details. Please check your internet connection and try again.',
          benefits: 'N/A',
          howToUse: 'N/A',
          safetyInformation: 'N/A',
          categoryName: 'N/A',
          rulingDeity: 'N/A',
          sku: 'N/A',
          colors: [],
          sizes: [],
          rating: 0,
          reviews: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, numericProductId]);



  if (isLoading || !productDetails) {
    if (!productId) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
          <Text style={{ color: COLORS.black, fontSize: 18, fontFamily: fonts.medium }}>
            Product not found
          </Text>
        </View>
      );
    }

    // Show enhanced loader with text and skeleton for better UX
    return <ProductDetailsLoader />;
  }

  const handleAddToCart = () => {
    if (!isInCart && productDetails) {
      addToCartItem({
        id: productDetails.id,
        name: productDetails.title,  // backend: name
        image: productDetails.image, // backend: img
        price: productDetails.price,
        offerPrice: productDetails.offerPrice,
        color: selectedColor,
        size: selectedSize,
        selectedColorName: getColorName(selectedColor),
      });
      navigation.navigate('CART');
    }
  };

  /** Add product to wishlist */
  const fetchAddLikeProducts = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        Alert.alert('Error', 'No auth token found. Please log in again.');
        return;
      }

      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const payload = {
        userId: String(user.id),
        productIds: [String(productId)],
      };

      console.log('Wishlist Add Payload:', payload);

      const response = await axios({
        method: 'post',
        url: '/add-wishlist',
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });

      console.log('Wishlist Add Response:', response.data);
    } catch (error) {
      console.error('Error in fetchAddLikeProducts:', error.response?.data || error.message);
    }
  };

  /** Remove product from wishlist */
  const fetchRemoveLikeProducts = async (userId, productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No auth token found. Please log in again.');
        return;
      }

      const payload = {
        userId: String(userId),
        productId: String(productId),
      };

      const response = await axios({
        method: 'delete',
        url: `/remove-wishlist?userId=${userId}&productId=${productId}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });

      console.log('Wishlist Remove Response:', response.data);
    } catch (error) {
      console.error('Error in fetchRemoveLikeProducts:', error.response?.data || error.message);
    }
  };

  const handleWishlistToggle = async () => {
    console.log('Wishlist button clicked!');
    console.log('Product details:', productDetails);
    
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      if (productDetails) {
        const isCurrentlyFavorite = isFavorite(productDetails.id);
        console.log('Wishlist toggle - Product ID:', productDetails.id);
        console.log('Currently favorite:', isCurrentlyFavorite);
        console.log('Current wishlist:', wishlist);
        
        if (isCurrentlyFavorite) {
          console.log('Removing from wishlist');
          await fetchRemoveLikeProducts(user.id, productDetails.id);
          removeFromWishlist && removeFromWishlist(productDetails.id);
        } else {
          console.log('Adding to wishlist');
          await fetchAddLikeProducts(productDetails.id);
          addToWishlist && addToWishlist({ 
            id: productDetails.id,
            productId: productDetails.id,
            title: productDetails.title,
            image: productDetails.image,
            price: productDetails.price,
            offerPrice: productDetails.offerPrice
          });
        }
      } else {
        console.log('No product details available');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update wishlist. Please try again.');
    }
  };

  const formatPrice = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };


  // Check if product is already in cart
  // const isInCart = cartItems.some(cartItem => cartItem.id === product.id);
  // Check if product is already in cart
  const isInCart = cartItems.some(cartItem => cartItem.id === productDetails.id);


  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{productDetails.description || 'No description available'}</Text>

            <Text style={styles.sectionHeading}>Benefits</Text>
            <Text style={styles.descriptionText}>{productDetails.benefits || 'N/A'}</Text>

            <Text style={styles.sectionHeading}>How to Use</Text>
            <Text style={styles.descriptionText}>{productDetails.howToUse || 'N/A'}</Text>

            <Text style={styles.sectionHeading}>Safety Information</Text>
            <Text style={styles.descriptionText}>{productDetails.safetyInformation || 'N/A'}</Text>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {productDetails.reviews && productDetails.reviews.length > 0 ? (
              productDetails.reviews.map((review, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <Text style={styles.reviewRating}>{renderStars(review.rating)}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>No reviews available</Text>
            )}
          </View>
        );

      case 'specs':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionHeading}>Category</Text>
            <Text style={styles.descriptionText}>{productDetails.categoryName || 'N/A'}</Text>

            <Text style={styles.sectionHeading}>Ruling Deity</Text>
            <Text style={styles.descriptionText}>{productDetails.rulingDeity || 'N/A'}</Text>

            <Text style={styles.sectionHeading}>SKU</Text>
            <Text style={styles.descriptionText}>{productDetails.sku || 'N/A'}</Text>
          </View>
        );

      default:
        return null;
    }
  };

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
    return stars.join('');
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <Header onSearchChange={handleSearchChange} />
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: productDetails.image }} style={styles.coverImage} />
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titlePriceContainer}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {productDetails.title}
            </Text>
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>
                {renderStars(productDetails.rating?.rate || productDetails.rating || 4)}
              </Text>
              <Text style={styles.ratingText}>
                ({productDetails.rating?.count || productDetails.ratingCount || 0}) Rating
              </Text>
            </View>

          </View>

          {/* Prices */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 }}>
            <Text style={styles.productOriginalPrice}>{formatPrice(productDetails.price)}</Text>
            <Text style={styles.productPrice}>{formatPrice(productDetails.offerPrice)}</Text>
          </View>

          {/* Size Selection */}
          {productDetails.sizes && productDetails.sizes.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {productDetails.sizes.map((size, index) => (
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
          {productDetails.colors && productDetails.colors.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>Color</Text>
              <View style={styles.colorContainer}>
                {productDetails.colors.map((color, index) => {
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
                          { backgroundColor: colorHex },
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
                Reviews ({productDetails.reviews?.length || 0})
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
        </View>
      </ScrollView>
      
      {/* Fixed Bottom Action Buttons */}
      <View style={styles.fixedButtonContainer}>
        <View style={styles.buttonRow}>
          {/* Wishlist Button */}
          <TouchableOpacity
            style={[
              styles.wishlistButton,
              productDetails && isFavorite(productDetails.id) && styles.wishlistButtonActive
            ]}
            onPress={() => {
              console.log('Button pressed!');
              handleWishlistToggle();
            }}
            activeOpacity={0.7}>
            <Icon
              name={productDetails && isFavorite(productDetails.id) ? "heart" : "heart-outline"}
              size={24}
              color={productDetails && isFavorite(productDetails.id) ? COLORS.button : "#666"}
            />
          </TouchableOpacity>
          
          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isInCart && styles.addToCartButtonDisabled,
            ]}
            onPress={handleAddToCart}
            disabled={isInCart}>
            <Icon
              name="bag-outline"
              size={20}
              color={isInCart ? "#999" : COLORS.white}
              style={styles.cartIcon}
            />
            <Text
              style={[
                styles.addToCartButtonText,
                isInCart && styles.addToCartButtonTextDisabled,
              ]}>
              {isInCart ? 'Already in Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}


export default ProductDetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 6,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
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
    fontSize: 20,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 16,
    lineHeight: 30,
  },
  productOriginalPrice: {
    textDecorationLine: 'line-through',
    color: '#E94560',
    fontWeight: '700',
    fontFamily: fonts.medium,
    fontSize: 22,
  },
  productPrice: {
    fontSize: 22,
    fontFamily: fonts.medium,
    fontWeight: '700',
    color: '#E94560',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  ratingStars: {
    fontSize: 18,
    color: COLORS.red,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#141414ff',
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    fontWeight: '600',
    color: '#1d1c1cff',
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
    fontSize: 15,
    fontFamily: fonts.medium,
    color: '#000000ff',
    marginTop: 4,
    marginBottom: 5,
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
    color: '#3c3a3aff',
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
    fontSize: 15,
    fontFamily: fonts.regular,
    color: COLORS.black,
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
    color: '#353434ff',
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
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // Extra padding for iOS home indicator
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  wishlistButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  wishlistButtonActive: {
    backgroundColor: '#FFF5F5',
    borderColor: COLORS.button,
    borderWidth: 2,
  },
  cartIcon: {
    marginRight: 8,
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
})

