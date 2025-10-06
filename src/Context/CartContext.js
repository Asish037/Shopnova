import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState, useContext} from 'react';
import {Text, Platform, AppState} from 'react-native';
import AppLoader from '../Components/AppLoader';
import axios from '../Components/axios';
import Toast from 'react-native-simple-toast';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

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

  // Load wishlist after user and token are available
  useEffect(() => {
    if (user && token) {
      console.log('🔄 User and token available, loading wishlist...');
      loadWishlist();
    }
  }, [user, token]);

  // Handle app state changes to restore authentication when app comes back to foreground
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      console.log('AppState changed to:', nextAppState);

      if (nextAppState === 'active') {
        console.log('App became active, checking authentication state...');

        // Always check AsyncStorage to ensure we have the latest data
        try {
          const [userData, storedToken] = await AsyncStorage.multiGet([
            'userData',
            'userToken',
          ]);
          console.log('User data:', userData[1]);
          if (userData[1] && storedToken[1]) {
            console.log(
              "Found stored auth data, ensuring it's loaded in context...",
            );
            const parsedUser = JSON.parse(userData[1]);

            // Update context if data is different or missing
            if (
              !user ||
              !token ||
              user.id !== parsedUser.id ||
              token !== storedToken[1]
            ) {
              console.log('Updating context with stored auth data...');
              setUser(parsedUser);
              setToken(storedToken[1]);
              console.log(
                'Authentication state synchronized with AsyncStorage',
              );
            } else {
              console.log('Authentication state already synchronized');
            }
          } else {
            console.log('No stored auth data found, user may need to login');
            // Only clear context if we're sure there's no stored data
            if (user || token) {
              console.log(
                'Clearing context as no valid auth data found in storage',
              );
              setUser(null);
              setToken(null);
            }
          }
        } catch (error) {
          console.error('Error checking authentication state:', error);
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, [user, token]);

  const loadAuthData = async (newUserData = null, newToken = null) => {
    try {
      if (newUserData) {
        // If new data is provided, use it and save to AsyncStorage
        console.log('Setting new user data from API:', newUserData);
        console.log('User data:', newUserData);
        setUser(newUserData);
        await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        console.log('New user data saved to AsyncStorage');
      } else {
        // Otherwise, load from AsyncStorage (fallback)
        console.log('Loading auth data from AsyncStorage...');
        const [userData, storedToken] = await AsyncStorage.multiGet([
          'userData',
          'userToken',
        ]);

        console.log('Loaded userData:', userData[1]);
        console.log('Loaded token:', storedToken[1]);

        if (userData[1]) {
          const parsedUser = JSON.parse(userData[1]);
          setUser(parsedUser);
          console.log('User data set in state:', parsedUser);
        }
      }

      if (newToken) {
        setToken(newToken);
        await AsyncStorage.setItem('userToken', newToken);
        console.log('New token saved to AsyncStorage');
      } else {
        // Load token from AsyncStorage if no new token provided
        const [userData, storedToken] = await AsyncStorage.multiGet([
          'userData',
          'userToken',
        ]);

        if (storedToken[1]) {
          setToken(storedToken[1]);
          console.log('Token set in state:', storedToken[1]);
        }
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
      // Extract user ID from token to check for user mismatch
      let tokenUserId = null;
      if (authToken && authToken.includes('|')) {
        tokenUserId = authToken.split('|')[1];
        console.log(`[${Platform.OS}] Token user ID: ${tokenUserId}`);
      }

      // COMPLETELY DISABLED: No longer clearing cart for different users to preserve cart items
      if (user && tokenUserId && user.id !== tokenUserId) {
        console.log(
          `[${Platform.OS}] Different user detected! Previous user: ${user.id}, Token user: ${tokenUserId}`,
        );
        console.log(
          `[${Platform.OS}] PRESERVING CART - Cart items will be maintained for better user experience`,
        );
        // Cart clearing is completely disabled to fix wishlist cart clearing issue
      }

      // Also check if cart items belong to a different user than the current user
      if (tokenUserId) {
        try {
          const existingCart = await AsyncStorage.getItem('cart');
          if (existingCart) {
            const cartItems = JSON.parse(existingCart);
            if (
              cartItems.length > 0 &&
              cartItems[0].userId &&
              cartItems[0].userId.toString() !== tokenUserId
            ) {
              console.log(
                `[${Platform.OS}] Cart items belong to user ${cartItems[0].userId}, but current user is ${tokenUserId}. PRESERVING CART - no clearing`,
              );
              // COMPLETELY DISABLED: Cart clearing is disabled to fix wishlist cart clearing issue
            }
          }
        } catch (error) {
          console.log(
            `[${Platform.OS}] Error checking cart user mismatch:`,
            error.message,
          );
        }
      }

      // If userData is an array, find the user that matches the token
      let finalUserData = userData;
      if (Array.isArray(userData) && tokenUserId) {
        const matchingUser = userData.find(
          u => u.id === tokenUserId || u.userId === tokenUserId,
        );
        if (matchingUser) {
          console.log(
            `[${Platform.OS}] Found matching user for token:`,
            matchingUser,
          );
          finalUserData = matchingUser;
        } else {
          console.log(
            `[${Platform.OS}] No matching user found for token ${tokenUserId}, using first user`,
          );
          console.log(
            `[${Platform.OS}] Available users:`,
            userData.map(u => ({id: u.id, userId: u.userId})),
          );
          console.log(`[${Platform.OS}] Token user ID: ${tokenUserId}`);
        }
      } else if (
        !Array.isArray(userData) &&
        tokenUserId &&
        userData?.id !== tokenUserId
      ) {
        // Single user object but doesn't match token - this is a mismatch
        console.log(
          `[${Platform.OS}] User data mismatch! User ID: ${userData?.id}, Token ID: ${tokenUserId}`,
        );
        console.log(
          `[${Platform.OS}] This indicates the user data is outdated. The token is for user ${tokenUserId} but user data is for user ${userData?.id}`,
        );
        console.log(
          `[${Platform.OS}] Forcing user data update to match token...`,
        );

        // Create a new user object with the token user ID
        const updatedUserData = {
          ...userData,
          id: tokenUserId,
          userId: parseInt(tokenUserId),
        };
        finalUserData = updatedUserData;
        console.log(
          `[${Platform.OS}] Updated user data to match token:`,
          updatedUserData,
        );
      }

      // First save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(finalUserData));
      console.log('User data saved to AsyncStorage');

      if (authToken) {
        console.log('Saving token to AsyncStorage:', authToken);
        await AsyncStorage.setItem('userToken', authToken);
        console.log('Token saved to AsyncStorage');
      }

      // Then update React state
      setUser(finalUserData);
      if (authToken) {
        setToken(authToken);
        console.log('Token set in React state');
      }

      // Load wishlist after successful login
      console.log('Loading wishlist after login...');
      await loadWishlist();

      console.log('Login completed successfully');
    } catch (error) {
      console.error('Error in login function:', error);
    }
  };

  const clearUserData = async () => {
    try {
      console.log('Clearing all user data...');
      await AsyncStorage.multiRemove(['userData', 'userToken']);
      setUser(null);
      setToken(null);
      console.log('User data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const setAuthToken = async authToken => {
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
    console.log('Logging out user...');
    setUser(null);
    setToken(null);
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
      console.log('User data and token removed from AsyncStorage');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  // Function to check if token is valid and not expired
  const checkTokenValidity = async () => {
    try {
      if (!token) {
        console.log('No token available for validation');
        return false;
      }

      // You can add token expiration check here if your backend provides it
      // For now, we'll assume token is valid if it exists
      console.log('Token validation check passed');
      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  };
  const addToWishlist = item => {
    console.log('Adding to wishlist:', item);
    setWishlist(prev => {
      const newWishlist = [...(prev || []), item];
      console.log('Updated wishlist:', newWishlist);
      return newWishlist;
    });
  };
  const removeFromWishlist = productId => {
    console.log('Removing from wishlist, productId:', productId);
    setWishlist(prev => {
      const newWishlist = (prev || []).filter(prod => {
        // Check both id and productId fields
        const prodId = prod.id || prod.productId;
        return prodId !== productId;
      });
      console.log('Updated wishlist after removal:', newWishlist);
      return newWishlist;
    });
  };
  const isFavorite = productId => {
    const result =
      wishlist?.some(prod => {
        // Check both id and productId fields
        const prodId = prod.id || prod.productId;
        return prodId === productId;
      }) || false;
    console.log(
      'Checking if favorite, productId:',
      productId,
      'result:',
      result,
      'wishlist:',
      wishlist,
    );
    return result;
  };

  // Load wishlist from server
  const loadWishlist = async () => {
    try {
      console.log('🔄 Loading wishlist from server...');
      console.log('🔄 User:', user);
      console.log('🔄 Token:', token);

      if (!user || !token) {
        console.log('❌ No user or token, cannot load wishlist');
        return;
      }

      let userId = null;
      if (Array.isArray(user)) {
        const defaultUser = user.find(u => u.isDefault === true) || user[0];
        userId = defaultUser?.id;
      } else {
        userId = user.id;
      }

      // Extract user ID from token if available (token format: "token|userId")
      if (token && token.includes('|')) {
        const tokenUserId = token.split('|')[1];
        userId = tokenUserId; // Use token user ID as it's more reliable
      }

      if (!userId) {
        console.log('❌ No user ID available for wishlist');
        return;
      }

      console.log(`[${Platform.OS}] Loading wishlist for user:`, userId);

      const response = await axios.get('/get-wishlist', {
        params: {
          userId: userId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      console.log('Wishlist API response:', response.data);

      if (
        response.data &&
        response.data.status === 1 &&
        response.data.data &&
        response.data.data.wishlist_items
      ) {
        const wishlistItems = response.data.data.wishlist_items.map(item => ({
          id: item.productId || item.id,
          productId: item.productId || item.id,
          name: item.product_name || item.name,
          price: item.price,
          offer_price: item.offer_price,
          image: item.product_image || item.image,
        }));

        console.log(
          `[${Platform.OS}] Loaded ${wishlistItems.length} wishlist items from server`,
        );
        setWishlist(wishlistItems);

        // Save to AsyncStorage for offline access
        await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        console.log(`[${Platform.OS}] Wishlist saved to AsyncStorage`);
      } else {
        console.log(
          `[${Platform.OS}] No wishlist data from API, loading from local storage`,
        );
        // Fallback to local storage
        const localWishlist = await AsyncStorage.getItem('wishlist');
        if (localWishlist) {
          const parsedWishlist = JSON.parse(localWishlist);
          setWishlist(parsedWishlist);
          console.log(
            `[${Platform.OS}] Loaded ${parsedWishlist.length} items from local storage`,
          );
        } else {
          setWishlist([]);
          console.log(
            `[${Platform.OS}] No local wishlist found, using empty array`,
          );
        }
      }
    } catch (error) {
      console.log(
        `[${Platform.OS}] Error loading wishlist from server:`,
        error.message,
      );
      console.log(`[${Platform.OS}] Falling back to local storage...`);

      try {
        const localWishlist = await AsyncStorage.getItem('wishlist');
        if (localWishlist) {
          const parsedWishlist = JSON.parse(localWishlist);
          setWishlist(parsedWishlist);
          console.log(
            `[${Platform.OS}] Loaded ${parsedWishlist.length} items from local storage as fallback`,
          );
        } else {
          setWishlist([]);
          console.log(
            `[${Platform.OS}] No local wishlist found, using empty array`,
          );
        }
      } catch (fallbackError) {
        console.log(
          `[${Platform.OS}] Local storage fallback also failed:`,
          fallbackError.message,
        );
        setWishlist([]);
      }
    }
  };

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
    try {
      // Prevent multiple simultaneous loads
      if (isLoadingCart) {
        console.log(`[${Platform.OS}] Cart is already loading, skipping...`);
        return;
      }

      setIsLoadingCart(true);
      console.log(
        `[${Platform.OS}] loadCartItems - Starting cart data load...`,
      );

      // First, try to load from API if user is logged in
      if (user && token) {
        console.log(
          `[${Platform.OS}] User is logged in, fetching cart from API...`,
        );
        console.log(`[${Platform.OS}] User object:`, user);

        // Handle both single user object and array of users
        let userId = null;
        if (Array.isArray(user)) {
          // If it's an array, get the first user or find one with isDefault: true
          const defaultUser = user.find(u => u.isDefault === true) || user[0];
          userId = defaultUser?.id;
          console.log(`[${Platform.OS}] User ID from array:`, userId);
        } else {
          userId = user.id;
          console.log(`[${Platform.OS}] User ID from object:`, userId);
        }

        // Extract user ID from token if available (token format: "token|userId")
        if (token && token.includes('|')) {
          const tokenUserId = token.split('|')[1];
          console.log(`[${Platform.OS}] User ID from token:`, tokenUserId);
          userId = tokenUserId; // Use token user ID as it's more reliable
        }

        console.log(
          `[${Platform.OS}] Current cart items before API call:`,
          cartItems.length,
        );
        try {
          console.log(`[${Platform.OS}] Making API call with userId:`, userId);
          console.log(
            `[${Platform.OS}] API endpoint: /get-cart?userId=${userId}`,
          );
          const response = await axios.get('/get-cart', {
            params: {
              userId: userId,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(
            `[${Platform.OS}] Full API response CartData:`,
            JSON.stringify(response.data, null, 2),
          );
          if (
            response.data &&
            response.data.status === 1 &&
            response.data.data &&
            response.data.data.cart_items &&
            response.data.data.cart_items.length > 0
          ) {
            console.log(
              `[${Platform.OS}] API cart data received cart items:`,
              response.data.data.cart_items,
            );
            console.log(
              `[${Platform.OS}] API cart items length:`,
              response.data.data.cart_items.length,
            );

            // Use current user ID for cart operations
            const currentUserId = user.id;
            console.log(`[${Platform.OS}] Current user ID:`, currentUserId);
            console.log(
              `[${Platform.OS}] API total_amount:`,
              response.data.data.total_amount,
            );
            console.log(
              `[${Platform.OS}] API total_offer_amount:`,
              response.data.data.total_offer_amount,
            );
            console.log(
              `[${Platform.OS}] API savings:`,
              response.data.data.savings,
            );

            // Function to strip HTML tags and clean up text
            const stripHtmlTags = htmlString => {
              if (!htmlString) return '';

              // Remove HTML tags
              let cleanText = htmlString.replace(/<[^>]*>/g, '');

              // Decode HTML entities
              cleanText = cleanText
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&nbsp;/g, ' ');

              // Clean up extra whitespace
              cleanText = cleanText.replace(/\s+/g, ' ').trim();

              return cleanText;
            };

            const apiCartItems = response.data.data.cart_items.map(item => ({
              ...item,
              quantity: item.quantity || 1,
              product_description: stripHtmlTags(item.product_description),
            }));

            // Always update cart items from API response (even if empty)
            console.log(
              `[${Platform.OS}] Setting cart items from API:`,
              apiCartItems,
            );
            console.log(
              `[${Platform.OS}] API cart items length:`,
              apiCartItems.length,
            );
            console.log(
              `[${Platform.OS}] API cart items details:`,
              apiCartItems,
            );
            setCartItems(apiCartItems);

            // Use API total if available, otherwise calculate locally
            if (
              response.data.data.total_offer_amount &&
              response.data.data.total_offer_amount > 0
            ) {
              console.log(
                `[${Platform.OS}] Using API total_offer_amount:`,
                response.data.data.total_offer_amount,
              );
              setTotalPrice(response.data.data.total_offer_amount.toFixed(2));
            } else {
              console.log(
                `[${Platform.OS}] Calculating total locally from cart items`,
              );
              calculateTotalPrice(apiCartItems);
            }

            // Save API data to AsyncStorage
            await AsyncStorage.setItem('cart', JSON.stringify(apiCartItems));
            console.log(
              `[${Platform.OS}] API cart data saved to AsyncStorage:`,
              apiCartItems.length,
              'items',
            );
            console.log(
              `[${Platform.OS}] API cart data set in state:`,
              apiCartItems,
            );

            // API response processed successfully, return here
            console.log(
              `[${Platform.OS}] API cart processing completed with ${apiCartItems.length} items`,
            );
            return;
          } else {
            // Cart is empty from API - CLEAR local cart to match server
            console.log(
              `[${Platform.OS}] API cart is empty, clearing local cart to match server...`,
            );
            console.log(
              `[${Platform.OS}] API response status:`,
              response.data?.status,
            );
            console.log(
              `[${Platform.OS}] API response data:`,
              response.data?.data,
            );
            console.log(
              `[${Platform.OS}] API cart_items:`,
              response.data?.data?.cart_items,
            );
            console.log(
              `[${Platform.OS}] Current local cart items:`,
              cartItems.length,
            );

            // CLEAR local cart to match server state
            console.log(
              `[${Platform.OS}] Server has no cart data, clearing local cart...`,
            );
            setCartItems([]);
            calculateTotalPrice([]);
            await AsyncStorage.setItem('cart', JSON.stringify([]));
            console.log(
              `[${Platform.OS}] Local cart cleared to match server state`,
            );
            return;
          }
        } catch (apiError) {
          console.log(
            `[${Platform.OS}] API cart fetch failed, falling back to local storage:`,
            apiError.message,
          );
        }
      }

      // Only fallback to AsyncStorage if API failed AND we don't already have cart items
      if (cartItems.length === 0) {
        console.log(`[${Platform.OS}] Loading cart from local AsyncStorage...`);
        console.log(
          `[${Platform.OS}] Current cart items before AsyncStorage:`,
          cartItems.length,
        );

        let storedCartItems = await AsyncStorage.getItem('cart');
        console.log(
          `[${Platform.OS}] Raw cart data from AsyncStorage:`,
          storedCartItems,
        );

        // Handle null/undefined cartItems
        if (!storedCartItems) {
          console.log(`[${Platform.OS}] No cart data found in AsyncStorage`);
          storedCartItems = [];
        } else {
          try {
            storedCartItems = JSON.parse(storedCartItems);
            console.log(
              `[${Platform.OS}] Parsed cart items:`,
              storedCartItems.length,
              'items',
            );
          } catch (parseError) {
            console.log(
              `[${Platform.OS}] Cart data parse failed, using empty cart:`,
              parseError.message,
            );
            storedCartItems = [];
          }
        }

        // Ensure storedCartItems is an array
        if (!Array.isArray(storedCartItems)) {
          console.log(
            `[${Platform.OS}] Cart data is not an array, resetting to empty array`,
          );
          storedCartItems = [];
        }

        // Ensure all items have a quantity property
        storedCartItems = storedCartItems.map(item => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        setCartItems(storedCartItems);
        calculateTotalPrice(storedCartItems);

        // Save back to AsyncStorage with quantity property
        await AsyncStorage.setItem('cart', JSON.stringify(storedCartItems));
        console.log(
          `[${Platform.OS}] Cart data saved to AsyncStorage:`,
          storedCartItems.length,
          'items',
        );
        console.log(
          `[${Platform.OS}] Final cart items set in state:`,
          storedCartItems,
        );
      }
    } catch (error) {
      console.log(
        `[${Platform.OS}] Cart loading failed, using empty cart:`,
        error.message,
      );
      setCartItems([]);
      calculateTotalPrice([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const addToCartItem = async item => {
    try {
      console.log('🚀 CART ADD - Function started');
      console.log('💰 CART ADD - Adding item to cart:', item);
      console.log('💰 CART ADD - User:', user);
      console.log('💰 CART ADD - Token:', token);
      console.log(
        '💰 CART ADD - Current cart items before addition:',
        cartItems?.length || 0,
      );
      console.log('💰 CART ADD - DEBUG: About to check user and token...');
      console.log(
        '💰 CART ADD - DEBUG: This log should appear after user and token logs',
      );
      console.log('💰 CART ADD - User check:', !!user, 'Token check:', !!token);
      console.log(
        '💰 CART ADD - User type:',
        typeof user,
        'Token type:',
        typeof token,
      );
      console.log('💰 CART ADD - User is array:', Array.isArray(user));

      // Ensure cartItems is always an array
      const currentCartItems = cartItems || [];
      console.log(
        '💰 CART ADD - Current cart items (ensured array):',
        currentCartItems.length,
      );
      // If user is logged in, add to server first
      if (user && token) {
        try {
          console.log(`[${Platform.OS}] Adding item to server cart...`);

          // Handle both single user object and array of users
          let userId = null;
          if (Array.isArray(user)) {
            // If it's an array, get the first user or find one with isDefault: true
            const defaultUser = user.find(u => u.isDefault === true) || user[0];
            userId = defaultUser?.id;
            console.log(
              `[${Platform.OS}] addToCartItem - User ID from array:`,
              userId,
            );
          } else {
            userId = user.id || user.userId;
            console.log(
              `[${Platform.OS}] addToCartItem - User ID from object:`,
              userId,
            );
          }

          // Extract user ID from token if available (token format: "token|userId")
          if (token && token.includes('|')) {
            const tokenUserId = token.split('|')[1];
            console.log(
              `[${Platform.OS}] addToCartItem - User ID from token:`,
              tokenUserId,
            );
            userId = tokenUserId; // Use token user ID as it's more reliable
          }

          console.log(
            `[${Platform.OS}] addToCartItem - Final user ID:`,
            userId,
          );
          console.log(`[${Platform.OS}] addToCartItem - User object:`, user);
          console.log(`[${Platform.OS}] addToCartItem - Token:`, token);
          const productId = item.id || item.productId || item.product_id;
          const data = {
            userId: userId.toString(),
            orderId: 0, // Add orderId field as integer (0 for new cart items)
            items: [
              {
                productId: productId.toString(),
                quantity: '1',
              },
            ],
          };

          console.log(`[${Platform.OS}] addToCartItem - Request data:`, data);
          console.log(
            `[${Platform.OS}] addToCartItem - Making API call to /add-cart...`,
          );

          const response = await axios.post('/add-cart', data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(
            `[${Platform.OS}] addToCartItem - API call completed successfully`,
          );
          console.log('Adding item to cart API response:', response.data);
          console.log('Response status:', response.data?.status);
          console.log('Response data:', response.data?.data);
          console.log('Validation errors:', response.data?.errors);
          console.log(
            'Full API response for debugging:',
            JSON.stringify(response.data, null, 2),
          );
          if (response.data && response.data.status === 1) {
            console.log(
              `[${Platform.OS}] Item successfully added to server cart`,
            );
            // Show success toast
            Toast.show('Item added to cart successfully!', Toast.SHORT);
            // Refresh cart from server after successful addition
            await loadCartItems();
            return;
          } else {
            console.log(
              `[${Platform.OS}] Server cart addition failed, falling back to local storage`,
            );
            console.log(`[${Platform.OS}] Server response:`, response.data);
            Toast.show('Added to cart Successfully', Toast.SHORT);
            // Don't call loadCartItems() here as it might clear the cart
            // Let the fallback to local storage handle it
          }
        } catch (error) {
          console.log(
            `[${Platform.OS}] Server cart addition failed, falling back to local storage:`,
            error.message,
          );
          console.log(
            `[${Platform.OS}] Full error object:`,
            JSON.stringify(error, null, 2),
          );
          console.log(
            `[${Platform.OS}] Error response status:`,
            error.response?.status,
          );
          console.log(
            `[${Platform.OS}] Error response data:`,
            error.response?.data,
          );
          Toast.show('Added to cart Successfully ', Toast.SHORT);
        }
      } else {
        console.log(
          '💰 CART ADD - User or token not available, skipping server call',
        );
        console.log('💰 CART ADD - User available:', !!user);
        console.log('💰 CART ADD - Token available:', !!token);
      }

      // Fallback to local storage if not logged in or server call failed
      console.log(
        `[${Platform.OS}] addToCartItem - Falling back to local storage...`,
      );
      let cartItems = await AsyncStorage.getItem('cart');
      cartItems = cartItems ? JSON.parse(cartItems) : [];
      console.log(
        `[${Platform.OS}] addToCartItem - Current local cart items:`,
        cartItems.length,
      );

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
          quantity: 1,
        };
        cartItems.push(itemToAdd);
        console.log(
          `[${Platform.OS}] Item added to local cart, new cart items:`,
          cartItems.length,
        );
      } else {
        // Item already exists, increase quantity
        cartItems[isExist].quantity += 1;
        console.log(
          `[${Platform.OS}] Item quantity increased, new quantity:`,
          cartItems[isExist].quantity,
        );
      }

      // Always update state and storage
      setCartItems([...cartItems]); // Create new array to trigger re-render
      calculateTotalPrice(cartItems);
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      console.log(
        `[${Platform.OS}] Cart updated in state and storage:`,
        cartItems.length,
        'items',
      );
    } catch (error) {
      console.log('💰 CART ADD - Error in addToCartItem:', error);
      console.log('💰 CART ADD - Error message:', error.message);
      console.log('💰 CART ADD - Error stack:', error.stack);
    }
  };

  const deleteCartItem = async id => {
    console.log(`[${Platform.OS}] Deleting cart item with id:`, id);

    // If user is logged in, delete from server first
    if (user && token) {
      try {
        console.log(`[${Platform.OS}] Deleting item from server cart...`);

        // Find the cart item to get the cart_id
        let cartItems = await AsyncStorage.getItem('cart');
        cartItems = cartItems ? JSON.parse(cartItems) : [];
        const itemToDelete = cartItems.find(
          item => item.id === id || item.productId === id,
        );

        if (itemToDelete && itemToDelete.cart_id) {
          const cartId = parseInt(itemToDelete.cart_id);
          console.log(
            `[${Platform.OS}] Deleting cart item with cart_id:`,
            cartId,
          );

          const response = await axios.delete('/delete-cart', {
            data: {
              cartId: cartId,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(
            `[${Platform.OS}] Delete cart item response:`,
            response.data,
          );
          if (response.data && response.data.status === 1) {
            console.log(
              `[${Platform.OS}] Item successfully deleted from server cart`,
            );
            // Refresh cart from server after successful deletion
            await loadCartItems();
            return;
          } else {
            console.log(
              `[${Platform.OS}] Server cart deletion failed:`,
              response.data,
            );
            // Even if server deletion failed, try to refresh from server to get latest state
            await loadCartItems();
            return;
          }
        } else {
          console.log(
            `[${Platform.OS}] No cart_id found for item, falling back to local deletion`,
          );
        }
      } catch (error) {
        console.log(
          `[${Platform.OS}] Server cart deletion failed, falling back to local storage:`,
          error.message,
        );
        console.log(`[${Platform.OS}] Error details:`, error.response?.data);
      }
    }

    // Fallback to local storage if not logged in or server call failed
    let cartItems = await AsyncStorage.getItem('cart');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    cartItems = cartItems.filter(item => item.id !== id);
    setCartItems(cartItems);
    calculateTotalPrice(cartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    console.log(`[${Platform.OS}] Item deleted from local storage`);
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

  const clearCart = async () => {
    console.log('Clearing cart...');
    console.log('Cart items before clearing:', cartItems.length);

    try {
      // Clear AsyncStorage first
      await AsyncStorage.removeItem('cart');
      console.log('Cart cleared successfully from AsyncStorage');

      // Then update React state
      setCartItems([]);
      setTotalPrice('0.00');

      console.log('Cart state updated - items should now be 0');
    } catch (error) {
      console.log('Cart clearing failed:', error.message);
    }
  };

  const calculateTotalPrice = cartItems => {
    console.log(
      `[${Platform.OS}] calculateTotalPrice - Cart items:`,
      cartItems,
    );
    let totalSum = cartItems.reduce((total, item) => {
      // Check multiple possible price field names
      const offerPrice = parseFloat(
        item.offer_price ||
          item.offerPrice ||
          item.price ||
          item.product_offer_price,
      );
      const regularPrice = parseFloat(item.price || item.product_price);
      const quantity = item.quantity || 1;

      console.log(`[${Platform.OS}] Item price calculation:`, {
        id: item.id,
        offer_price: item.offer_price,
        offerPrice: item.offerPrice,
        price: item.price,
        product_offer_price: item.product_offer_price,
        product_price: item.product_price,
        quantity: quantity,
        finalOfferPrice: offerPrice,
        finalRegularPrice: regularPrice,
      });

      // Use offer price if available, otherwise use regular price
      const finalPrice =
        !isNaN(offerPrice) && offerPrice > 0 ? offerPrice : regularPrice;

      // Check if finalPrice is a valid number before multiplying
      if (!isNaN(finalPrice) && finalPrice > 0) {
        const itemTotal = finalPrice * quantity;
        console.log(`[${Platform.OS}] Item total:`, itemTotal);
        return total + itemTotal;
      }

      // Return the current total if the price is invalid
      console.log(`[${Platform.OS}] Invalid price for item:`, item.id);
      return total;
    }, 0);

    console.log(`[${Platform.OS}] Final total sum:`, totalSum);

    // After the loop, check if the final total is a valid number
    if (!isNaN(totalSum)) {
      totalSum = totalSum.toFixed(2);
      setTotalPrice(totalSum);
      console.log(`[${Platform.OS}] Total price set to:`, totalSum);
    } else {
      setTotalPrice('0.00'); // Set to a default value if the total is NaN
      console.log(`[${Platform.OS}] Total price set to default: 0.00`);
    }
  };

  if (isLoading) {
    return <AppLoader message="Loading your data..." />;
  }

  const getTotalQuantity = () => {
    const total = cartItems.reduce(
      (total, item) => total + (item.quantity || 1),
      0,
    );
    console.log(
      `[${Platform.OS}] getTotalQuantity - Cart items:`,
      cartItems.length,
      'Total quantity:',
      total,
    );
    console.log(
      `[${Platform.OS}] getTotalQuantity - Cart items details:`,
      cartItems.map(item => ({id: item.id, quantity: item.quantity})),
    );
    return total;
  };

  const refreshCartData = async () => {
    console.log(
      `[${Platform.OS}] refreshCartData - Refreshing cart data from AsyncStorage...`,
    );
    console.log(
      `[${Platform.OS}] refreshCartData - Current cartItems before refresh:`,
      cartItems.length,
    );

    // NEVER refresh if cart has items - always preserve them
    if (cartItems.length > 0) {
      console.log(
        `[${Platform.OS}] refreshCartData - Cart has items, skipping API refresh to preserve cart`,
      );
      return;
    }

    // Only refresh if cart is empty AND user is logged in
    if (cartItems.length === 0 && user && token) {
      console.log(
        `[${Platform.OS}] refreshCartData - Cart is empty and user is logged in, refreshing from API...`,
      );
      await loadCartItems();
    } else {
      console.log(
        `[${Platform.OS}] refreshCartData - No user logged in or cart has items, skipping refresh`,
      );
    }

    console.log(
      `[${Platform.OS}] refreshCartData - Cart items after refresh:`,
      cartItems.length,
    );
  };

  const syncCartData = async () => {
    try {
      console.log(
        `[${Platform.OS}] syncCartData - Starting cross-platform cart sync...`,
      );

      // Get all AsyncStorage keys to debug
      const allKeys = await AsyncStorage.getAllKeys();
      console.log(`[${Platform.OS}] All AsyncStorage keys:`, allKeys);

      // Check if cart key exists
      const hasCartKey = allKeys.includes('cart');
      console.log(`[${Platform.OS}] Cart key exists:`, hasCartKey);

      if (!hasCartKey) {
        console.log(
          `[${Platform.OS}] No cart key found, initializing empty cart...`,
        );
        await AsyncStorage.setItem('cart', JSON.stringify([]));
        setCartItems([]);
        calculateTotalPrice([]);
        return;
      }

      // Force reload cart data
      await loadCartItems();
    } catch (error) {
      console.log(
        `[${Platform.OS}] Cart sync failed, using empty cart:`,
        error.message,
      );
      // Fallback: initialize empty cart
      setCartItems([]);
      calculateTotalPrice([]);
    }
  };

  const forceRefreshCartFromAPI = async () => {
    try {
      console.log(
        `[${Platform.OS}] forceRefreshCartFromAPI - Forcing cart refresh from API...`,
      );

      if (!user || !token) {
        console.log(`[${Platform.OS}] No user/token, cannot fetch from API`);
        // Fallback to local storage if no user/token
        await loadCartItems();
        return;
      }

      // Handle both single user object and array of users
      let userId = null;
      if (Array.isArray(user)) {
        // If it's an array, get the first user or find one with isDefault: true
        const defaultUser = user.find(u => u.isDefault === true) || user[0];
        userId = defaultUser?.id;
        console.log(
          `[${Platform.OS}] forceRefreshCartFromAPI - User ID from array:`,
          userId,
        );
      } else {
        userId = user.id || user.userId;
        console.log(
          `[${Platform.OS}] forceRefreshCartFromAPI - User ID from object:`,
          userId,
        );
      }

      // Extract user ID from token if available (token format: "token|userId")
      if (token && token.includes('|')) {
        const tokenUserId = token.split('|')[1];
        console.log(
          `[${Platform.OS}] forceRefreshCartFromAPI - User ID from token:`,
          tokenUserId,
        );
        userId = tokenUserId; // Use token user ID as it's more reliable
      }

      console.log(
        `[${Platform.OS}] forceRefreshCartFromAPI - API endpoint: /get-cart?userId=${userId}`,
      );
      const response = await axios.get('/get-cart', {
        params: {
          userId: userId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      });

      if (
        response.data &&
        response.data.status === 1 &&
        response.data.data &&
        response.data.data.cart_items &&
        response.data.data.cart_items.length > 0
      ) {
        console.log(
          `[${Platform.OS}] API cart data received:`,
          response.data.data.cart_items,
        );

        const apiCartItems = response.data.data.cart_items.map(item => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        setCartItems(apiCartItems);
        calculateTotalPrice(apiCartItems);

        // Save API data to AsyncStorage
        await AsyncStorage.setItem('cart', JSON.stringify(apiCartItems));
        console.log(
          `[${Platform.OS}] API cart data saved to AsyncStorage:`,
          apiCartItems.length,
          'items',
        );
      } else {
        console.log(
          `[${Platform.OS}] No cart data from API, clearing local cart to match server...`,
        );
        console.log(
          `[${Platform.OS}] Current local cart items:`,
          cartItems.length,
        );

        // CLEAR local cart to match server state
        console.log(
          `[${Platform.OS}] Server has no cart data, clearing local cart...`,
        );
        setCartItems([]);
        calculateTotalPrice([]);
        await AsyncStorage.setItem('cart', JSON.stringify([]));
        console.log(
          `[${Platform.OS}] Local cart cleared to match server state`,
        );
      }
    } catch (error) {
      console.log(
        `[${Platform.OS}] API cart refresh failed, preserving local cart:`,
        error.message,
      );

      // Fallback to local storage on API error - but don't clear
      try {
        await loadCartItems();
        console.log(
          `[${Platform.OS}] Successfully loaded cart from local storage as fallback`,
        );
      } catch (fallbackError) {
        console.log(
          `[${Platform.OS}] Local storage fallback also failed, but preserving existing cart:`,
          fallbackError.message,
        );
        // Don't clear - preserve existing cart
      }
    }
  };

  // Debug function to check cart state
  const debugCartState = () => {
    console.log('=== CART DEBUG STATE ===');
    console.log('Cart items length:', cartItems.length);
    console.log('Cart items:', cartItems);
    console.log('Total price:', totalPrice);
    console.log('User:', user?.id);
    console.log('Token exists:', !!token);
    console.log('========================');
  };

  const value = {
    cartItems,
    setCartItems,
    calculateTotalPrice,
    addToCartItem,
    deleteCartItem,
    updateCartItemQuantity,
    clearCart,
    totalPrice,
    getTotalQuantity,
    refreshCartData,
    syncCartData,
    forceRefreshCartFromAPI,
    debugCartState,
    user,
    token,
    login,
    logout,
    setAuthToken,
    loadAuthData,
    clearUserData,
    saveMessage,
    messages,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isFavorite,
    loadWishlist,
    checkTokenValidity,
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
