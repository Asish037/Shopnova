import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState, useContext} from 'react';
import {Text} from 'react-native';
import AppLoader from '../Components/AppLoader';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await loadAuthData();
      await loadMessages();
      await loadCartItems();
      setIsLoading(false);
    };

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const loadAuthData = async () => {
    try {
      console.log('Loading auth data from AsyncStorage...');
      const [userData, storedToken] = await AsyncStorage.multiGet(['userData', 'userToken']);
      
      console.log('Loaded userData:', userData[1]);
      console.log('Loaded token:', storedToken[1]);
      
      if (userData[1]) {
        const parsedUser = JSON.parse(userData[1]);
        setUser(parsedUser);
        console.log('User data set in state:', parsedUser);
      }
      
      if (storedToken[1]) {
        setToken(storedToken[1]);
        console.log('Token set in state:', storedToken[1]);
      }
      
      console.log('Auth data loading completed');
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const login = async (userData, authToken = null) => {
    console.log('login called with userData:', userData);
    console.log('login called with authToken:', authToken);
    
    try {
      // First save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved to AsyncStorage');
      
      if (authToken) {
        console.log('Saving token to AsyncStorage:', authToken);
        await AsyncStorage.setItem('userToken', authToken);
        console.log('Token saved to AsyncStorage');
      }
      
      // Then update React state
      setUser(userData);
      if (authToken) {
        setToken(authToken);
        console.log('Token set in React state');
      }
      
      console.log('Login completed successfully');
    } catch (error) {
      console.error('Error in login function:', error);
    }
  };

  const setAuthToken = async (authToken) => {
    console.log('setAuthToken called with:', authToken);
    try {
      // First save to AsyncStorage
      await AsyncStorage.setItem('userToken', authToken);
      console.log('Token saved to AsyncStorage successfully');
      
      // Then update React state
      setToken(authToken);
      console.log('Token set in React state');
      
      // Verify it was saved
      const savedToken = await AsyncStorage.getItem('userToken');
      console.log('Verification - saved token:', savedToken);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };
  const addToWishlist = (item) => {
    console.log('Adding to wishlist:', item);
    setWishlist((prev) => {
      const newWishlist = [...(prev || []), item];
      console.log('Updated wishlist:', newWishlist);
      return newWishlist;
    });
  }
  const removeFromWishlist = (productId) => {
    console.log('Removing from wishlist, productId:', productId);
    setWishlist((prev) => {
      const newWishlist = (prev || []).filter((prod) => {
        // Check both id and productId fields
        const prodId = prod.id || prod.productId;
        return prodId !== productId;
      });
      console.log('Updated wishlist after removal:', newWishlist);
      return newWishlist;
    });
  }
  const isFavorite = (productId) => {
    const result = wishlist?.some((prod) => {
      // Check both id and productId fields
      const prodId = prod.id || prod.productId;
      return prodId === productId;
    }) || false;
    console.log('Checking if favorite, productId:', productId, 'result:', result, 'wishlist:', wishlist);
    return result;
  }

  const saveMessage = async (roomName, messageData) => {
    const updatedMessages = {
      ...messages,
      [roomName]: [...(messages[roomName] || []), messageData],
    };
    setMessages(updatedMessages);
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const loadCartItems = async () => {
    let cartItems = await AsyncStorage.getItem('cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Ensure all items have a quantity property
    cartItems = cartItems.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    setCartItems(cartItems);
    calculateTotalPrice(cartItems);

    // Save back to AsyncStorage with quantity property
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCartItem = async item => {
    console.log('Adding item to cart:', item);
    let cartItems = await AsyncStorage.getItem('cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    
    // Handle different possible id fields
    const itemId = item.id || item.productId || item.product_id;
    let isExist = cartItems.findIndex(cart => {
      const cartId = cart.id || cart.productId || cart.product_id;
      return cartId === itemId;
    });
    
    if (isExist === -1) {
      // Ensure the item has an id field
      const itemToAdd = {
        ...item,
        id: itemId || Date.now().toString(), // fallback id if none exists
        quantity: 1
      };
      cartItems.push(itemToAdd);
      calculateTotalPrice(cartItems);
      setCartItems(cartItems);
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    }
  };
 
  const deleteCartItem = async id => {
    let cartItems = await AsyncStorage.getItem('cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems = cartItems.filter(item => item.id !== id);
    setCartItems(cartItems);
    calculateTotalPrice(cartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const updateCartItemQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    let cartItems = await AsyncStorage.getItem('cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const updatedCartItems = cartItems.map(item =>
      item.id === id ? {...item, quantity: newQuantity} : item,
    );

    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const calculateTotalPrice = cartItems => {
    let totalSum = cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.price * quantity;
    }, 0);
    totalSum = totalSum.toFixed(2);
    setTotalPrice(totalSum);
  };

  if (isLoading) {
    return <AppLoader message="Loading your data..." />;
  }

  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const value = {
    cartItems,
    addToCartItem,
    deleteCartItem,
    updateCartItemQuantity,
    totalPrice,
    getTotalQuantity,
    user,
    token,
    login,
    logout,
    setAuthToken,
    loadAuthData,
    saveMessage,
    messages,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isFavorite,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const HotelContext = createContext();

export const HotelProvider = ({children}) => {
  const [hotelData, setHotelData] = useState({});

  const updateHotelData = newData => {
    setHotelData(prevData => ({...prevData, ...newData}));
  };

  return (
    <HotelContext.Provider value={{hotelData, updateHotelData}}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
