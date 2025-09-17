import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {fonts} from '../utils/fonts';
import {useNavigation, useRoute} from '@react-navigation/native';
import {addToCart} from '../utils/helper';
import {CartContext} from '../Context/CartContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import { COLORS } from '../Constant/Colors';
import { PADDING } from '../Constant/Padding';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
// import {useTheme} from '../Context/ThemeContext';
// import ThemeSelectionModal from './Modal/ThemeSelectionModal';

const Header = ({isCart, onSearchChange}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {getTotalQuantity} = useContext(CartContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  // const {isDarkTheme} = useTheme();

  // Screens where search should appear inline in header
  const inlineSearchScreens = [
    'PRODUCT_DETAILS',
    'ProductDetailsScreen',
    'MyWishList',
    'CART',
  ];

  useEffect(() => {
    if (showSearchInput) {
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    } else {
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [showSearchInput, searchAnimation]);

  const handleSearchPress = () => {
    if (inlineSearchScreens.includes(route.name)) {
      // Show inline search in header
      setShowSearchInput(!showSearchInput);
      if (showSearchInput) {
        setSearchText('');
        onSearchChange && onSearchChange('');
      }
    } else {
      // Navigate to categories screen based on current context
      if (route.name === 'HOME' || route.name === 'HOME_STACK' || route.name === 'MainHome' || route.name === 'CART') {
        // If on home or cart screen, navigate to bottom tab categories
        navigation.navigate('categories', {focusSearch: true});
      } else {
        // Otherwise navigate to main stack Categories
        navigation.navigate('Categories', {focusSearch: true});
      }
    }
  };

  const handleSearchTextChange = text => {
    setSearchText(text);
    onSearchChange && onSearchChange(text);
  };

  const handleIconPress = iconName => {
    try {
      switch (iconName) {
        case 'search':
          handleSearchPress();
          break;
        case 'favorites':
          // Navigate to wishlist screen
          navigation.navigate('MyWishList');
          break;
        case 'cart':
          // Navigate to cart screen
          navigation.navigate('CART');
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  };

  const handleBack = () => {
    try {
      if (route.name === 'HOME' || route.name === 'MainHome') {
        // On home screen, show menu drawer
        //navigation.navigate('MenuDrawer');
        navigation.navigate('Settings');
      } else {
        // On other screens, go back
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('HOME');
        }
      }
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback to home screen
      navigation.navigate('HOME');
    }
  };

  // Cart Icon Component with Badge
  const CartIconWithBadge = ({style, onPress}) => {
    const totalQuantity = getTotalQuantity();
    console.log('Header - Cart total quantity:', totalQuantity);
    
    return (
      <TouchableOpacity 
      onPress={() => handleIconPress('cart')}
        style={[style, {padding: 4}]}
        activeOpacity={0.7}
      >
        <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../assets/shopping_cart.png')}
            style={styles.appCartIcon}
            resizeMode="contain"
          />
          {totalQuantity > 0 && (
            <View
              style={{
                position: 'absolute',
                right: -8,
                top: -8,
                height: 18,
                width: 18,
                backgroundColor: COLORS.button,
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#FFFFFF',
                minWidth: 18,
              }}>
              <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.appDrawerContainer}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.appDrawerContainer}>
              {route.name === 'HOME' || route.name === 'MainHome' ? (
                <Image
                  source={require('../assets/apps.png')}
                  style={styles.appDrawerIcon}
                />
                ) : (
                  <Image
                    source={require('../assets/arrowback.png')}
                    style={styles.appDrawerIcon}
                  />
                )}
            </TouchableOpacity>
          </View>

          {/* Dynamic Icon Container */}
          {inlineSearchScreens.includes(route.name) && showSearchInput ? (
            // Show search input inline when search is active
            <Animated.View
              style={[
                styles.inlineSearchContainer,
                {
                  width: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 250],
                  }),
                  opacity: searchAnimation,
                },
              ]}>
              <View style={styles.inlineInputContainer}>
                <Image
                  source={require('../assets/search.png')}
                  style={styles.inlineSearchIcon}
                />
                <TextInput
                  ref={searchInputRef}
                  placeholder="Search..."
                  style={styles.inlineTextInput}
                  value={searchText}
                  onChangeText={handleSearchTextChange}
                  onBlur={() => {
                    if (!searchText) {
                      setShowSearchInput(false);
                    }
                  }}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText('');
                      onSearchChange && onSearchChange('');
                    }}
                    style={styles.inlineClearButton}>
                    <Text style={styles.clearText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Compressed right icons */}
              <View style={styles.compressedIconContainer}>
                <TouchableOpacity onPress={() => handleIconPress('favorites')}>
                  <Image
                    source={require('../assets/favoriteFilled.png')}
                    style={styles.compressedIcon}
                  />
                </TouchableOpacity>
                <CartIconWithBadge 
                  onPress={() => handleIconPress('cart')}
                  style={styles.compressedIcon}
                />
              </View>
            </Animated.View>
          ) : (
            // Show normal icons when search is not active
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleIconPress('search')}>
                  <Image
                    source={require('../assets/focusedSearch.png')}
                    style={styles.appSearchIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleIconPress('favorites')}>
                  <Image
                    source={require('../assets/favoriteFilled.png')}
                    style={styles.appFavoriteIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleIconPress('cart')}>
                  <CartIconWithBadge />
                </TouchableOpacity>
              </View>
          )}
        </View>

        {/* Remove the old animated search container below */}
        
        {/* Theme Selection Modal - Disabled */}
      </View>
    </SafeAreaView>
  );
};
export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: PADDING.header.top,
    paddingBottom: PADDING.margin.small,
    elevation: 4,
    shadowColor: '#f54a00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appDrawerContainer: {
    backgroundColor: 'transparent',
    // height: 44,
    // width: 44,
    borderRadius: 22,
    // marginBottom: 1 ,
    // paddingLeft: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  appsIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: 36,
    height: 36,
  },
  whiteOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  appDrawerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.button,
  },
  backIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: 36,
    height: 36,
  },
  backWhiteOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  appSearchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.button,
  },
  appFavoriteIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.button,
  },
  appCartIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.button,
  },
  iconContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
    paddingRight: 5,
  },
  // New inline search styles
  inlineSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 8,
  },
  inlineInputContainer: {
    backgroundColor: 'transparent',
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    marginRight: 8,
  },
  inlineSearchIcon: {
    height: 18,
    width: 18,
    marginLeft: 12,
    marginRight: 8,
    tintColor: COLORS.button
  },
  inlineTextInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2c2c2c',
    paddingVertical: 0,
    paddingRight: 8,
  },
  inlineClearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compressedIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
  },
  compressedIcon: {
    height: 24,
    width: 24,
  },
  titleText: {
    fontSize: 28,
    fontFamily: fonts.regular,
    color: '#000000',
  },
  clearText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
});
