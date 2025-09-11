import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import Tags from '../Components/Tags';
import ProductCard from '../Components/ProductCard';
import data from '../data/data.json';
import { useNavigation } from '@react-navigation/native';
import sale from '../assets/sale2.jpeg';
import backgroundSlider from '../assets/backgroundSlider.png';
import { COLORS } from '../Constant/Colors';
// import { useTheme } from '../Context/ThemeContext';
import { CartContext } from '../Context/CartContext';
import axios from '../Components/axios';
import qs from 'qs';
import AppLoader from '../Components/AppLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  // const [products, setProducts] = useState(data.products);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  // const {getThemeColors} = useTheme();
  // const themeColors = getThemeColors();
  // const { userData } = useContext(CartContext);
  const { user, token, wishlist, isFavorite, addToWishlist, removeFromWishlist } = useContext(CartContext);
  let productList = {
    method: 'GET',
    url: 'product-list',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios(productList);
      const product = response.data.data.map((item) => {
        return {
          id: item.id,
          title: item.name,
          price: item.price,
          offer_price: item.offer_price,
          description: item.description,
          image: item.img,

          // rating: {rate: 0 , count: 0},
          // isFavorite: false,
          isFavorite: isFavorite(item.id),
        };
      });
      setProducts(product);

      console.log('Products fetched:', response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [wishlist?.length]);

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

      const response = await axios({
        method: 'post',
        url: '/add-wishlist',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      console.log('Wishlist Remove Response:', response.data);
    } catch (error) {
      console.error('Error in fetchRemoveLikeProducts:', error.response?.data || error.message);
    }
  };


  /** Navigate to product details */
  const handleProductDetails = (item) => {
    navigation.navigate('PRODUCT_DETAILS', { productId: item.id });
  };

  /** Toggle favorite (with API call) */
  const toggleFavorite = async (item) => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      if (item.isFavorite) {
        await fetchRemoveLikeProducts(user.id, item.id);
        removeFromWishlist && removeFromWishlist(item.productId);
      } else {
        await fetchAddLikeProducts(item.id);
        addToWishlist && addToWishlist({ productId: item.id });
      }

      // update local state
      setProducts((prev) =>
        prev.map((prod) =>
          prod.id === item.id ? { ...prod, isFavorite: !prod.isFavorite } : prod
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (isLoading) {
    return <AppLoader message="Loading products..." />;
  }

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <>
            <ImageBackground
              source={backgroundSlider}
              style={styles.ImageBackground}
              resizeMode="contain"
            >
              {/* <View style={styles.textContainer}>
                <Text style={styles.headerTitleMain}>Limited Time</Text>
                <Text style={styles.headerTitleSub}>OFFER</Text>
              </View> */}
            </ImageBackground>

            <View style={styles.tagsContainer}>
              <Tags />
            </View>
          </>
        }
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            handleProductClick={handleProductDetails}
            toggleFavorite={toggleFavorite}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 15 : 5,
    width: '100%',
    height: '100%',
  },
  ImageBackground: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headingText: {
    fontSize: 28,
    color: '#000000',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
  },
  textContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: 0,
    alignItems: 'center',
  },
  headerTitleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitleSub: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#972525ff',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 12,
  },
  textInput: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  tagsContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
export default HomeScreen;
