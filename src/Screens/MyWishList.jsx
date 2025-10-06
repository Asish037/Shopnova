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
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';
import WishlistCard from '../Components/WishlistCard';
import WishlistSkeleton from '../Components/WishlistSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import {verticalScale} from '../PixelRatio';
import {PADDING} from '../Constant/Padding';
import AppLoader from '../Components/AppLoader';
import Toast from 'react-native-simple-toast';

const MyWishList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigation = useNavigation();
  const {
    user,
    token,
    removeFromWishlist: removeFromWishlistContext,
    login,
  } = useContext(CartContext);

  // Functions for WishlistCard
  const handleProductDetails = item => {
    console.log('Navigate to product details:', item.id);
    navigation.navigate('PRODUCT_DETAILS', {
      productId: item.productId || item.id,
    });
  };

  const toggleFavorite = item => {
    console.log('Toggle favorite:', item.id);
    // Remove from wishlist when heart is clicked
    removeFromWishlist(item);
  };

  const removeFromWishlist = item => {
    console.log('Remove from wishlist:', item.id);

    // Call API to remove from backend (context update is handled in fetchRemoveLikeProducts)
    fetchRemoveLikeProducts(user.id, item.productId || item.id);

    // Update local state immediately for responsiveness
    setProducts(prev => prev.filter(prod => prod.id !== item.id));
    setFilteredProducts(prev => prev.filter(prod => prod.id !== item.id));
  };

  const normalizeWishlistItems = (wishlistItems = []) => {
    console.log('Normalizing items:', wishlistItems.length);
    return wishlistItems.map(prod => ({
      id: prod.productId,
      wishlistId: prod.wishlist_id,
      title: prod.product_name,
      image: prod.product_image,
      offer_price: prod.product_offer_price || prod.product_price,
      price: prod.product_price || prod.product_price,
      description: prod.product_description,
      sku: prod.product_sku,
      isFavorite: true,
    }));
  };

  const fetchLikeProducts = async userId => {
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
    console.log('MyWishList useEffect - User:', user);
    console.log('MyWishList useEffect - User ID:', user?.id);
    console.log('MyWishList useEffect - Token:', token);

    if (user?.id) {
      fetchLikeProducts(user?.id);
    } else {
      // Force restore authentication if user is missing
      forceRestoreAuth();
    }
  }, [user, token]);

  // Force restore authentication when screen loads
  const forceRestoreAuth = async () => {
    try {
      console.log('MyWishList - Force restoring authentication...');
      const [userToken, userData] = await AsyncStorage.multiGet([
        'userToken',
        'userData',
      ]);

      console.log('MyWishList - Stored userToken:', userToken[1]);
      console.log('MyWishList - Stored userData:', userData[1]);

      if (userToken[1] && userData[1]) {
        const parsedUser = JSON.parse(userData[1]);
        console.log(
          'MyWishList - Restored user from AsyncStorage:',
          parsedUser,
        );

        // Handle both single user object and array of users
        let userId = null;
        if (Array.isArray(parsedUser)) {
          const firstUser = parsedUser[0];
          userId = firstUser?.id;
        } else {
          userId = parsedUser?.id;
        }

        console.log('MyWishList - Extracted userId:', userId);

        if (userId) {
          console.log('MyWishList - Using restored userId:', userId);
          fetchLikeProducts(userId);
        } else {
          console.log('MyWishList - No userId found in user data');
          Alert.alert(
            'Authentication Error',
            'User not found. Please log in again.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Login as Guest',
                onPress: () => {
                  // Create a temporary guest user for testing
                  const guestUser = {
                    userId: 'test_user_' + Date.now(),
                    id: 'test_user_' + Date.now(),
                    name: 'Test User',
                    phone: '1234567890',
                    isGuest: true,
                  };
                  const guestToken = 'test_token_' + Date.now();
                  login(guestUser, guestToken);
                },
              },
            ],
          );
        }
      } else {
        console.log('MyWishList - No stored authentication data found');
        Alert.alert(
          'Authentication Required',
          'Please log in to view your wishlist.',
        );
      }
    } catch (error) {
      console.error('MyWishList - Error restoring auth:', error);
      Alert.alert('Error', 'Failed to load user data. Please log in again.');
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

      // If userId is not provided, try to get it from context or AsyncStorage
      let finalUserId = userId;
      if (!finalUserId) {
        if (user?.id) {
          finalUserId = user.id;
        } else {
          // Try to restore from AsyncStorage
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            if (Array.isArray(parsedUser)) {
              finalUserId = parsedUser[0]?.id;
            } else {
              finalUserId = parsedUser?.id;
            }
          }
        }
      }

      if (!finalUserId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      console.log('Wishlist Remove - Using userId:', finalUserId);

      const response = await axios({
        method: 'delete',
        url: `/remove-wishlist?userId=${finalUserId}&productId=${productId}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Wishlist Remove Response:', response.data);

      if (response.data.status === 1) {
        // Update context wishlist state
        removeFromWishlistContext && removeFromWishlistContext(productId);
        Toast.show(
          response.data.message || 'Item removed from wishlist.',
          Toast.SHORT,
        );
      } else {
        Toast.show(
          response.data.message || 'Something went wrong on the server.',
          Toast.SHORT,
        );
      }
    } catch (error) {
      console.error(
        'Error in fetchRemoveLikeProducts:',
        error.response?.data || error.message,
      );
      Toast.show('Failed to remove item from wishlist.', Toast.SHORT);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#f54a00', '#F99266']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require('../assets/favoriteFilled.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>My Wishlist</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.skeletonContainer}>
          <FlatList
            data={[1, 2, 3, 4, 5, 6]} // Show 6 skeleton cards
            numColumns={2}
            keyExtractor={item => item.toString()}
            renderItem={() => <WishlistSkeleton />}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#f54a00', '#F99266']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require('../assets/favoriteFilled.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>My Wishlist</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>💝</Text>
          </View>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Start adding items you love to your wishlist and they'll appear here
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => {
              console.log('Button clicked!');
              // Try different navigation approaches
              try {
                // First try: direct navigation to Categories screen
                navigation.navigate('Categories');
              } catch (error) {
                console.log('Direct navigation failed:', error);
                try {
                  // Second try: parent navigation
                  navigation.getParent()?.navigate('Categories');
                } catch (error2) {
                  console.log('Parent navigation failed:', error2);
                  // Third try: go back and then navigate
                  navigation.goBack();
                }
              }
            }}>
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#f54a00', '#F99266']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require('../assets/favoriteFilled.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>My Wishlist</Text>
          </View>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.itemCountContainer}>
          <Text style={styles.itemCount}>
            💖 {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'item' : 'items'} in your wishlist
          </Text>
        </View>

        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.wishlistId?.toString()}
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
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.row}
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
    backgroundColor: '#F8F9FA',
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
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  exploreButton: {
    backgroundColor: '#f54a00',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.content.horizontal,
    paddingVertical: PADDING.content.vertical,
    paddingTop: PADDING.margin.large,
    paddingBottom: PADDING.margin.xlarge,
    minHeight: 80,
    elevation: 4,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  placeholder: {
    width: 50,
  },
  itemCountContainer: {
    backgroundColor: '#FFF5F0',
    marginHorizontal: PADDING.content.horizontal,
    marginVertical: PADDING.margin.medium,
    borderRadius: 12,
    paddingVertical: PADDING.margin.medium,
    paddingHorizontal: PADDING.content.horizontal,
    elevation: 2,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemCount: {
    fontSize: 16,
    color: '#f54a00',
    fontWeight: '600',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flatListContent: {
    paddingHorizontal: PADDING.flatList.horizontal,
    paddingTop: PADDING.margin.medium,
    paddingBottom: PADDING.margin.xlarge,
  },
  row: {
    justifyContent: 'space-between',
  },
  skeletonContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default MyWishList;
