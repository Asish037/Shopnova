import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import {fonts} from '../utils/fonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';
import {COLORS} from '../Constant/Colors';
import axios from '../Components/axios';
import qs from 'qs';
import ProductLoader from '../Components/ProductLoader';
import ProductDetailsSkeleton from '../Components/ProductDetailsSkeleton';
import ProductDetailsLoader from '../Components/ProductDetailsLoader';


const {width} = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const {addToCartItem, cartItems} = useContext(CartContext);
  const route = useRoute();
  const navigation = useNavigation();

  // const product = route.params.item;
  const { productId } = route.params || {};
  
  // Handle case where productId is not provided
  if (!productId) {
    console.error('No productId provided in route params');
  }
  
  const numericProductId = parseInt(productId, 10);


  const getColorValue = color =>{
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
    if(color && color.startsWith('#')){
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
        const config = {
          method: 'GET',
          url: `/product-details?id=${numericProductId}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          data: qs.stringify({}),
        };
        const response = await axios(config);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, numericProductId]);



  if (isLoading || !productDetails) {
    if (!productId) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white}}>
          <Text style={{color: COLORS.black, fontSize: 18, fontFamily: fonts.medium}}>
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
          contentContainerStyle={{paddingBottom: 20}}>
          {/* Header */}
          <View style={styles.header}>
            <Header onSearchChange={handleSearchChange} />
          </View>

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={{uri: productDetails.image}} style={styles.coverImage} />
          </View>

          {/* Product Info */}
          <View style={styles.contentContainer}>
            {/* Title and Price */}
            <View style={styles.titlePriceContainer}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {productDetails.title}
              </Text>
              {/* rating */}
              <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>
                {renderStars(productDetails.rating)}
              </Text>
              <Text style={styles.ratingText}>({productDetails.rating}) Rating</Text>
            </View>
              
            </View>

            {/* Prices */}
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10}}>
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
    color: '#e82929da',
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
})

