import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import { CartContext } from '../Context/CartContext';
import WishlistCard from '../Components/WishlistCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import { verticalScale } from '../PixelRatio';
import { PADDING } from '../Constant/Padding';
import AppLoader from '../Components/AppLoader';

const MyWishList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigation = useNavigation();
  const { user, token, removeFromWishlist: removeFromWishlistContext } = useContext(CartContext);

  // Functions for WishlistCard
  const handleProductDetails = (item) => {
    console.log('Navigate to product details:', item.id);
    navigation.navigate('PRODUCT_DETAILS', { productId: item.productId || item.id });
  };

  const toggleFavorite = (item) => {
    console.log('Toggle favorite:', item.id);
    // This will be handled by the WishlistCard component
  };

  const removeFromWishlist = (item) => {
    console.log('Remove from wishlist:', item.id);

    if (removeFromWishlistContext) {
      removeFromWishlistContext(item.productId || item.id);
    }

    // Call API to remove from backend
    fetchRemoveLikeProducts(user.id, item.productId || item.id);

    // Update local state immediately for responsiveness
    setProducts(prev => prev.filter(prod => prod.id !== item.id));
    setFilteredProducts(prev => prev.filter(prod => prod.id !== item.id));
  };



  const normalizeWishlistItems = (wishlistItems = []) => {
    console.log('Normalizing items:', wishlistItems.length);
    return wishlistItems.map(prod => ({
      id: prod.wishlist_id,
      productId: prod.productId,
      title: prod.product_name,
      image: prod.product_image,
      offer_price: prod.product_offer_price || prod.product_price,
      price: prod.product_price || prod.product_price,
      description: prod.product_description,
      sku: prod.product_sku,
      isFavorite: true,
    }));
  };

  const fetchLikeProducts = async (userId) => {
    try {
      console.log(`Fetching wishlist for userId: ${userId}`);
      setIsLoading(true);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        setIsLoading(false);
        return;
      }

      const response = await axios({
        method: 'get',
        url: `/get-wishlist?userId=${userId}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log('API Response:', response.data);

      if (response.data?.data?.wishlist_items) {
        const items = normalizeWishlistItems(response.data.data.wishlist_items);
        console.log('Setting products:', items);
        setProducts(items);
        setFilteredProducts(items);
      } else {
        console.log('No wishlist items found');
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    console.log('MyWishList useEffect - User:', user?.id);
    if (user?.id) {
      fetchLikeProducts(user.id);
    }
  }, [user]);

  /** Remove product from wishlist */
  const fetchRemoveLikeProducts = async (userId, productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No auth token found. Please log in again.');
        return;
      }

      // const payload = {
      //   userId: String(userId),
      //   productId: String(productId),
      // };

      const response = await axios({
        method: 'delete',
        url: `/remove-wishlist?userId=${userId}&productId=${productId}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // data: payload,
      });

      console.log('Wishlist Remove Response:', response.data);
    } catch (error) {
      console.error('Error in fetchRemoveLikeProducts:', error.response?.data || error.message);
    }
  };

  if (isLoading) {
    return <AppLoader message="Loading your wishlist..." />;
  }

  if (filteredProducts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items in your wishlist</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Wishlist</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.itemCount}>
          Found {filteredProducts.length} wishlist items
        </Text>
        
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, index}) => {
            console.log(`Rendering item ${index}:`, item.title);
            return (
              <WishlistCard
                item={item}
                handleProductClick={handleProductDetails}
                toggleFavorite={toggleFavorite}
                removeFromWishlist={removeFromWishlist}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.content.horizontal,
    paddingVertical: PADDING.content.vertical,
    paddingTop: PADDING.margin.medium,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#E94560',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 50,
  },
  itemCount: {
    paddingHorizontal: PADDING.content.horizontal,
    paddingVertical: PADDING.margin.medium,
    fontSize: 16,
    color: '#666666',
    backgroundColor: '#F8F8F8',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: PADDING.flatList.horizontal,
  },
});

export default MyWishList;