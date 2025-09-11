import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import Tags from '../Components/Tags';
import WishlistCard from '../Components/WishlistCard';
import data from '../data/data.json';
import {useNavigation} from '@react-navigation/native';
import { COLORS } from '../Constant/Colors';

const MyWishList = () => {
  const [products, setProducts] = useState(data.products);
  const [filteredProducts, setFilteredProducts] = useState(data.products);
  const navigation = useNavigation();

  const handleProductDetails = item => {
    console.log('hello==' + JSON.stringify(item));
    navigation.navigate('PRODUCT_DETAILS', {item});
  };

  const handleSearchChange = searchText => {
    if (searchText.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const wishList = [
    {
      item_id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      brand: 'Sony',
      price: 150.0,
      currency: 'USD',
      link: 'https://example.com/product/wireless-headphones',
      priority: 'High',
      notes: 'Looking for noise-cancelling features.',
    },
    {
      item_id: 2,
      name: 'Coffee Maker',
      category: 'Home Appliances',
      brand: 'Keurig',
      price: 99.99,
      currency: 'USD',
      link: 'https://example.com/product/coffee-maker',
      priority: 'Medium',
      notes: 'Prefer single-serve pod machine.',
    },
    {
      item_id: 3,
      name: 'Laptop Bag',
      category: 'Accessories',
      brand: 'Targus',
      price: 45.0,
      currency: 'USD',
      link: 'https://example.com/product/laptop-bag',
      priority: 'Low',
      notes: 'Looking for something lightweight and durable.',
    },
  ];

  const toggleFavorite = item => {
    const updatedProducts = products.map(prod => {
      if (prod.id === item.id) {
        console.log('prod: ', prod);
        return {
          ...prod,
          isFavorite: !prod.isFavorite,
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const removeFromWishlist = item => {
    const updatedProducts = products.filter(prod => prod.id !== item.id);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      {/* header */}
      <Header onSearchChange={handleSearchChange} />

      {/* <Tags /> */}

      <FlatList
        data={filteredProducts}
        numColumns={2}
        renderItem={({item}) => (
          <WishlistCard
            item={item}
            handleProductClick={handleProductDetails}
            toggleFavorite={toggleFavorite}
            removeFromWishlist={removeFromWishlist}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <View>
        {/* <Text>HomeScreen</Text>
        <Text>HomeScreen</Text> */}
      </View>
    </LinearGradient>
  );
};
export default MyWishList;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 5,
  },

  headingText: {
    fontSize: 28,
    color: '#000000',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
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
});
