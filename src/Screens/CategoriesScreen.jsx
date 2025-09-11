// modern UI for categories

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ProductCard from '../Components/ProductCard';
import {COLORS} from '../Constant/Colors';
import axios from '../Components/axios';
import AppLoader from '../Components/AppLoader';
import GeneralLoader from '../Components/GeneralLoader';
import qs from 'qs';

const {width} = Dimensions.get('window');

const CategoriesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const searchInputRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [currentView, setCurrentView] = useState('categories'); // 'categories', 'products'
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Track initial complete loading

  const {categoryId, categoryName} = route.params || {};

  // Initialize view based on route params
  useEffect(() => {
    if (categoryId && categoryName) {
      // If coming from another screen with specific category
      const category = {id: categoryId, name: categoryName};
      setSelectedCategory(category);
      fetchSubCategories(categoryId, true, true); // Show loading and mark as initial load
    }
  }, [categoryId, categoryName]);

  //  Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const config = {
          method: 'get',
          url: '/get-categories',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios(config);
        console.log(response.data);

        const categoriesData = response.data.data || [];
        setCategories(categoriesData);
        
        // If no categories, set initial loading to false
        if (categoriesData.length === 0) {
          setIsInitialLoading(false);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsInitialLoading(false); // Set to false even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto-select first category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
      fetchSubCategories(categories[0].id, false, true); // Don't show loading for auto-selection, but mark as initial load
    }
  }, [categories, selectedCategory]);

  // Fetch products by specific categoryId using the new endpoint
  const fetchProductsBySpecificCategory = async categoryId => {
    try {
      setIsLoading(true);
      console.log('Fetching products for categoryId:', categoryId);

      const config = {
        method: 'get',
        url: `/product-list?categoryId=${categoryId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios(config);
      console.log('Products by categoryId response:', response.data);

      const productsData = response.data.data || [];
      setFilteredProducts(productsData);

      return productsData;
    } catch (error) {
      console.error('Error fetching products by categoryId:', error);
      
      // Check if it's a network error or auth error
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        console.log('Network error detected, using fallback data');
        // You can set some fallback products here or show a message
        setFilteredProducts([]);
      } else if (error.response?.status === 401) {
        console.log('Authentication error, user may need to login again');
        setFilteredProducts([]);
      } else {
        console.log('Other error:', error.message);
        setFilteredProducts([]);
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async (catId, showLoading = true, isInitialLoad = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const config = {
        method: 'get',
        url: `/get-sub-categories?categoryId=${catId}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config);
      console.log('Subcategories response:', response.data);
      const subcategoriesData = response.data.data || [];
      setSubCategories(subcategoriesData);
      setSelectedSubCategory(null);
      setFilteredProducts([]);

      // If no subcategories, fetch products directly for this category
      if (subcategoriesData.length === 0) {
        console.log(
          'No subcategories found, fetching products directly for categoryId:',
          catId,
        );
        await fetchProductsBySpecificCategory(catId);
        // Keep currentView as 'categories' - UI will automatically show products
      } else {
        setCurrentView('categories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
      
      // Check if it's a network error
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        console.log('Network error in subcategories, skipping product fetch');
        setFilteredProducts([]);
      } else {
        // Try to fetch products directly if subcategories fail (but not for network errors)
        console.log(
          'Subcategories failed, trying to fetch products directly for categoryId:',
          catId,
        );
        try {
          await fetchProductsBySpecificCategory(catId);
        } catch (productError) {
          console.error('Error fetching products after subcategory failure:', productError);
          setFilteredProducts([]);
        }
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
      if (isInitialLoad) {
        setIsInitialLoading(false);
      }
    }
  };

  //  Fetch products for selected category/subcategory
  const fetchProductsByCategory = async (category, subCategory = null) => {
    try {
      setIsLoading(true);
      let response;
      try {
        response = await axios.get('/product-list');
        console.log('All products fetched:', response.data);

        // Filter products by category on client side
        const allProducts = response.data.data || [];
        setAllProducts(allProducts); // Store all products for suggestions

        let categoryProducts = allProducts.filter(
          product =>
            product.category_name &&
            product.category_name.toLowerCase() === category.name.toLowerCase(),
        );

        // Further filter by subcategory if provided
        if (subCategory) {
          categoryProducts = categoryProducts.filter(
            product =>
              product.sub_category_name &&
              product.sub_category_name.toLowerCase() ===
                subCategory.name.toLowerCase(),
          );
        }

        console.log(
          `Products filtered for ${subCategory ? 'subcategory' : 'category'} "${
            subCategory ? subCategory.name : category.name
          }":`,
          categoryProducts,
        );

        setFilteredProducts(categoryProducts);
      } catch (listError) {
        console.log(
          'product-list endpoint failed, trying products endpoint:',
          listError,
        );

        try {
          const params = subCategory
            ? {
                category_name: category.name,
                sub_category_name: subCategory.name,
              }
            : {category_name: category.name};

          response = await axios.get('/products', {params});
          console.log(
            'Products by category/subcategory (products endpoint):',
            response.data,
          );
          setFilteredProducts(response.data.data || []);
        } catch (productsError) {
          console.log(
            'products endpoint also failed, trying with category_id:',
            productsError,
          );

          // Second fallback: Try with category ID
          response = await axios.get('/products', {
            params: {category_id: category.id},
          });
          console.log('Products by category ID:', response.data);
          setFilteredProducts(response.data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      // Set empty array on complete failure
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryPress = category => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setCurrentView('categories');
    setFilteredProducts([]);
    fetchSubCategories(category.id);
  };

  // Handle subcategory selection
  const handleSubCategoryPress = subCategory => {
    setSelectedSubCategory(subCategory);
    setCurrentView('products');
    fetchProductsByCategory(selectedCategory, subCategory);
  };

  // Generate suggestions based on search text
  const generateSuggestions = text => {
    if (!text.trim() || text.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = text.toLowerCase();
    const uniqueSuggestions = new Set();

    // Add matching product names
    allProducts.forEach(product => {
      if (product.name && product.name.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(product.name);
      }
    });

    // Add matching categories
    categories.forEach(category => {
      if (category.name && category.name.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(category.name);
      }
    });

    // Add matching keywords from descriptions (first 3 words that match)
    const keywordCount = {};
    allProducts.forEach(product => {
      if (product.description) {
        const words = product.description.toLowerCase().split(/\s+/);
        words.forEach(word => {
          // Clean word from punctuation
          const cleanWord = word.replace(/[^\w]/g, '');
          if (
            cleanWord.length > 3 &&
            cleanWord.includes(searchTerm) &&
            !uniqueSuggestions.has(cleanWord)
          ) {
            keywordCount[cleanWord] = (keywordCount[cleanWord] || 0) + 1;
          }
        });
      }
    });

    // Add most frequent keywords (up to 3)
    const sortedKeywords = Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    sortedKeywords.forEach(keyword => uniqueSuggestions.add(keyword));

    const suggestionArray = Array.from(uniqueSuggestions).slice(0, 8); // Limit to 8 suggestions
    setSuggestions(suggestionArray);
    setShowSuggestions(suggestionArray.length > 0);
  };

  //  Search filter
  const handleSearchChange = text => {
    setSearchText(text);

    // Generate suggestions
    generateSuggestions(text);

    if (text.trim() === '') {
      setShowSuggestions(false);
      // Reset to current view's products
      if (currentView === 'products' && selectedCategory) {
        fetchProductsByCategory(selectedCategory, selectedSubCategory);
      } else {
        setFilteredProducts([]);
      }
      return;
    }

    // Filter products based on search text
    const sourceProducts =
      currentView === 'products' ? filteredProducts : allProducts;
    const filtered = sourceProducts.filter(
      product =>
        (product.name &&
          product.name.toLowerCase().includes(text.toLowerCase())) ||
        (product.description &&
          product.description.toLowerCase().includes(text.toLowerCase())) ||
        (product.category_name &&
          product.category_name.toLowerCase().includes(text.toLowerCase())),
    );
    setFilteredProducts(filtered);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = suggestion => {
    setSearchText(suggestion);
    setShowSuggestions(false);

    // Filter products based on selected suggestion
    const filtered = allProducts.filter(
      product =>
        (product.name &&
          product.name.toLowerCase().includes(suggestion.toLowerCase())) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(suggestion.toLowerCase())) ||
        (product.category_name &&
          product.category_name
            .toLowerCase()
            .includes(suggestion.toLowerCase())),
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = item => {
    console.log('Navigating to product details with item:', item);
    console.log('Product ID being passed:', item.id, typeof item.id);
    navigation.navigate('PRODUCT_DETAILS', {productId: item.id});
  };

  const renderProductCard = ({item}) => (
    <ProductCard
      item={item}
      handleProductClick={handleProductClick}
      toggleFavorite={() => {}}
      isCompact={true}
    />
  );

  // Render suggestion item
  const renderSuggestionItem = ({item, index}) => (
    <TouchableOpacity
      style={[
        styles.suggestionItem,
        index === suggestions.length - 1 && styles.lastSuggestionItem,
      ]}
      onPress={() => handleSuggestionSelect(item)}>
      <Image
        source={require('../assets/search.png')}
        style={styles.suggestionIcon}
      />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  if (isInitialLoading) {
    return <AppLoader message="Loading categories..." />;
  }

  // Render category item for left side
  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}>
      <View style={styles.categoryContent}>
        <Text
          style={[
            styles.categoryText,
            selectedCategory?.id === item.id && styles.selectedCategoryText,
          ]}
          numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render subcategory item for right side
  const renderSubCategoryItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.subCategoryItem,
        selectedSubCategory?.id === item.id && styles.selectedSubCategoryItem,
      ]}
      onPress={() => handleSubCategoryPress(item)}
      activeOpacity={0.7}>
      <View style={styles.subCategoryContent}>
        <Text
          style={[
            styles.subCategoryText,
            selectedSubCategory?.id === item.id &&
              styles.selectedSubCategoryText,
          ]}
          numberOfLines={2}>
          {item.name}
        </Text>
        {item.product_count && (
          <Text style={styles.productCount}>{item.product_count} items</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading && categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.button} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            placeholder="Search categories, products..."
            style={styles.textInput}
            value={searchText}
            onChangeText={handleSearchChange}
            onFocus={() => {
              if (searchText.length >= 2) {
                setShowSuggestions(suggestions.length > 0);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow for tap on suggestion
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                setShowSuggestions(false);
                // Reset to current view's products
                if (currentView === 'products' && selectedCategory) {
                  fetchProductsByCategory(
                    selectedCategory,
                    selectedSubCategory,
                  );
                } else {
                  setFilteredProducts([]);
                }
              }}
              style={styles.clearButton}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Auto-suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `suggestion-${index}`}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </View>
      )}

      {/* Main Content - Side by side layout */}
      <View style={styles.mainContent}>
        {/* Left Side - Categories */}
        <View style={styles.leftPanel}>
          <Text style={styles.panelTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Right Side - Subcategories or Products */}
        <View style={styles.rightPanel}>
          {currentView === 'categories' && subCategories.length > 0 ? (
            // Show subcategories when they exist
            <>
              <Text style={styles.panelTitle}>
                {selectedCategory ? selectedCategory.name : 'Subcategories'}
              </Text>
              {isLoading ? (
                <GeneralLoader 
                  message="Loading subcategories..." 
                  size="small"
                  containerStyle={styles.rightPanelLoading}
                  textStyle={styles.rightPanelLoadingText}
                />
              ) : (
                <FlatList
                  data={subCategories}
                  renderItem={renderSubCategoryItem}
                  keyExtractor={item => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.subCategoryList}
                />
              )}
            </>
          ) : (
            // Show products when no subcategories OR when in products view
            <>
              <Text style={styles.panelTitle}>
                {selectedSubCategory
                  ? selectedSubCategory.name
                  : selectedCategory
                  ? `${selectedCategory.name} Products`
                  : 'Products'}
              </Text>
              {isLoading ? (
                <View style={styles.rightPanelLoading}>
                  <ActivityIndicator size="small" color={COLORS.button} />
                  <Text style={styles.rightPanelLoadingText}>
                    Loading products...
                  </Text>
                </View>
              ) : filteredProducts.length > 0 ? (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProductCard}
                  numColumns={3}
                  keyExtractor={item => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.productsGrid}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No products found</Text>
                  {selectedSubCategory && (
                    <TouchableOpacity
                      style={styles.backToSubcategoriesButton}
                      onPress={() => {
                        setCurrentView('categories');
                        setSelectedSubCategory(null);
                        setFilteredProducts([]);
                      }}>
                      <Text style={styles.backToSubcategoriesText}>
                        ← Back to Subcategories
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 55 : 25,
    paddingBottom: 15,
    zIndex: 1000,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  suggestionsContainer: {
    marginHorizontal: 20,
    marginTop: -15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
    zIndex: 999,
  },
  suggestionsList: {
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  suggestionIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    tintColor: '#666',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    flex: 1,
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  searchIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#110e0eff',
    paddingVertical: 0,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
  },
  clearText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
    marginTop: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 25,
    gap: 15,
  },
  leftPanel: {
    width: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  panelTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    textAlign: 'center',
  },
  categoryList: {
    paddingBottom: 15,
    paddingTop: 5,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.lightbutton,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.button,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedCategoryText: {
    fontFamily: 'Poppins-Bold',
    color: COLORS.button,
  },
  subCategoryList: {
    paddingBottom: 15,
    paddingTop: 5,
  },
  subCategoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  selectedSubCategoryItem: {
    backgroundColor: COLORS.lightbutton,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.button,
  },
  subCategoryContent: {
    flex: 1,
  },
  subCategoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
    marginBottom: 4,
  },
  selectedSubCategoryText: {
    fontFamily: 'Poppins-Bold',
    color: COLORS.button,
  },
  productCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey,
  },
  rightPanelLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  rightPanelLoadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: COLORS.black,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 10,
  },
  backToSubcategoriesButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.lightbutton,
    borderRadius: 8,
    marginTop: 10,
  },
  backToSubcategoriesText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: COLORS.button,
  },
  productsGrid: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
  },
});
