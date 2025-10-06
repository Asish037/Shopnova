import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {PADDING} from '../Constant/Padding';
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import myorderData from '../data/myorderData.json';
import Header from '../Components/Header';
import Moment from 'moment';
import axios from '../Components/axios';
import qs from 'qs';
import asyncStorage from '@react-native-async-storage/async-storage';
import {CartContext} from '../Context/CartContext';
import {useFocusEffect} from '@react-navigation/native';
// import {useTheme} from '../Context/ThemeContext';

const Orders = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const {orderId, fromConfirm} = route.params;
  const [ordersData, setOrdersData] = useState([]);
  const [allOrders] = useState(myorderData.orders);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const{ user, token} = useContext(CartContext);

  // Get route parameters
  const {status, title, filter} = route.params || {};

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Handle back button behavior - if coming from filtered view, go back to previous screen
  useFocusEffect(
    useCallback(() => {
      // Add back button listener
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (filter) {
          // Prevent default behavior of leaving the screen
          e.preventDefault();
          // Navigate back to MainHome (which contains the BottomTab with ACCOUNT)
          navigation.navigate('MainHome', { screen: 'ACCOUNT' });
        }
      });

      return unsubscribe;
    }, [navigation, filter])
  );

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Orders - fetchOrders started');
      console.log('Orders - myorderData.orders:', myorderData.orders?.length || 0);
      
      // Initialize with empty array - only show data if API succeeds
      let ordersToUse = [];
      let apiSuccess = false;
      
      // Try to get data from API if token is available
      const token = await asyncStorage.getItem('userToken');
      const userData = await asyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const userId = parsedUser?.id;   

      console.log('Orders - parsedUser:', parsedUser);
      console.log('Orders - Fetched userId:', userId);
      console.log('Orders - Fetched token:', token);

      if (token && userId) {
        try {
          console.log('Orders - Attempting API call...');
          const response = await axios({
            method: 'get',
            url: `/order-list?userId=${userId}`,
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // 10 second timeout
          });

          console.log('Orders - API response status:', response.status);
          console.log('Orders - API response data:', response.data);

          if (response.status === 200 && response.data) {
            // Only use API data if response is successful and has data
            let fetchedOrders = response.data?.data ?? [];
            console.log('Orders - API response data structure:', response.data);
            console.log('Orders - Fetched orders from API:', fetchedOrders);
            console.log('Orders - Fetched orders length:', fetchedOrders.length);
            
            if (Array.isArray(fetchedOrders)) {
              ordersToUse = fetchedOrders;
              apiSuccess = true;
              console.log('Orders - API response successful, using API data:', fetchedOrders.length);
            } else {
              console.log('Orders - API response data is not an array:', typeof fetchedOrders);
              ordersToUse = [];
              apiSuccess = true; // Still consider it successful, just no data
            }
          } else {
            console.log('Orders - API response not successful, status:', response.status);
            throw new Error(`API returned status ${response.status}`);
          }
        } catch (apiErr) {
          console.log('Orders - API call failed:', apiErr.message);
          console.log('Orders - API error details:', apiErr.response?.data || apiErr.message);
          
          // Set error state for API failure
          setError(`Failed to load orders from server: ${apiErr.message}`);
          ordersToUse = [];
          apiSuccess = false;
        }
      } else {
        console.log('Orders - No token or userId, cannot fetch from API');
        setError('Please log in to view your orders');
        ordersToUse = [];
        apiSuccess = false;
      }

      console.log('Orders - API success:', apiSuccess);
      console.log('Orders - ordersToUse after API:', ordersToUse.length);

      // Only proceed if API was successful
      if (apiSuccess) {
        // Normalize each order
        const updatedOrders = ordersToUse.map(order => ({
          ...order,
          shipping_status: order.shipping_status || 'Processing', // default if missing
          payment: order.payment || { payment_status: 'Pending', payment_method: 'N/A' },
          order_items: order.order_items ?? [], // safe default
        }));

        console.log('Orders - updatedOrders:', updatedOrders.length);

        // Apply filter - show empty states for demo purposes
        let filteredOrders = updatedOrders;
        if (filter) {
          // Always return empty array to show "No orders found" state with static images
          filteredOrders = [];
          console.log('Orders - Showing empty state for filter:', filter);
        }

        console.log('Orders - Final ordersData to set:', filteredOrders.length);
        setOrdersData(filteredOrders);
        setRetryCount(0); // Reset retry count on success
      } else {
        // API failed, show error state
        console.log('Orders - API failed, showing error state');
        setOrdersData([]);
      }
    } catch (err) {
      console.error('Orders - Error in fetchOrders:', err);
      setError('Failed to load orders. Please try again.');
      setOrdersData([]);
    } finally {
      console.log('Orders - Setting isLoading to false');
      setIsLoading(false);
    }
  };

  // Retry function
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchOrders();
  };

 

  // Filter orders based on the parameters passed from AccountScreen
  // let filteredOrders = allOrders;
  // setOrdersData(filteredOrders);

  const getStatusIcon = status => {
    switch (status) {
      case 'Shipped':
        return 'truck-delivery';
      case 'Delivered':
        return 'check-circle';
      case 'Processing':
        return 'clock-outline';
      default:
        return 'package-variant-closed';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Shipped':
        return COLORS.orange || '#ff6b35ff';
      case 'Delivered':
        return COLORS.green || '#4CAF50';
      case 'Processing':
        return COLORS.cyan || '#046147';
      default:
        return COLORS.gray || '#757575';
    }
  };

  const renderOrderItem = ({item}) => {
    console.log('Orders - renderOrderItem called for item:', item.id);
    const firstItem = item.order_items?.[0]; // safe check

    // Safe image source handling
    const getImageSource = () => {
      if (firstItem?.product_image) {
        // Check if it's a valid HTTP URL
        if (firstItem.product_image.startsWith('http')) {
          return { uri: firstItem.product_image };
        }
        // If it's a local file path, use placeholder
        console.log('Orders - Invalid image path for item:', item.id, firstItem.product_image);
      }
      // Return a simple placeholder that works on both platforms
      return { uri: 'https://via.placeholder.com/150x150/cccccc/666666?text=No+Image' };
    };

    // Ensure we have valid data
    if (!item || !item.id) {
      console.log('Orders - Invalid item data:', item);
      return null;
    }

    console.log('Orders - About to render order card for item:', item.id);
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', {orderId: Number(item.id), fromConfirm: false})}
        style={styles.orderCard}
      >
        {/* Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdSection}>
            <Text style={styles.orderIdText}>Order #{item.id}</Text>
            <Text style={styles.orderDateText}>
              {Moment(item.created_at).format('YYYY-MM-DD')}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon(item.shipping_status)}
              size={20}
              color={getStatusColor(item.shipping_status)}
            />
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(item.shipping_status)},
              ]}
            >
              {item.shipping_status || 'Processing'}
            </Text>
          </View>
        </View>

        {/* Order Content */}
        <View style={styles.orderContent}>
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource()}
              style={styles.productImage}
              onError={(error) => {
                console.log('Orders - Image load error for item:', item.id, error.nativeEvent.error);
              }}
              onLoad={() => {
                console.log('Orders - Image loaded successfully for item:', item.id);
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {firstItem?.product_name || 'Unknown product'}
            </Text>
            <Text style={styles.brandText}>N/A</Text>

            <View style={styles.quantityPriceRow}>
              <Text style={styles.quantityText}>
                Qty: {firstItem?.quantity ?? 0}
              </Text>
              <Text style={styles.priceText}>
              {'\u20B9'}{item.offer_price_total?.toFixed(2) || '0.00'}
              </Text>
            </View>

            {item.order_items?.length > 1 && (
              <Text style={styles.moreItemsText}>
                +{item.order_items.length - 1} more item
                {item.order_items.length > 2 ? 's' : ''}
              </Text>
            )}
          </View>

          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={COLORS.gray || '#757575'}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <View style={styles.paymentInfo}>
            <MaterialCommunityIcons
              name="credit-card"
              size={16}
              color={COLORS.button}
            />
            <Text style={styles.paymentText}>
              {item.payment?.payment_method || 'N/A'} •{' '}
              {item.payment?.payment_status || 'Pending'}
            </Text>
          </View>
          {item.tracking_number && (
            <Text style={styles.trackingText}>
              Tracking: {item.tracking_number}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Show loading screen while fetching orders
  if (isLoading) {
    return (
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.button} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </View>
    );
  }

  // Show error screen if there's an error
  if (error) {
    return (
      <View style={[styles.container, {backgroundColor: COLORS.white}]}>
        <Header />
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={moderateScale(80)}
              color={COLORS.button}
            />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Orders</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorSubMessage}>
            Please check your internet connection and try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          {retryCount > 0 && (
            <Text style={styles.retryCount}>Retry attempt: {retryCount}</Text>
          )}
        </View>
      </View>
    );
  }

  console.log('Orders - Render - ordersData length:', ordersData.length);
  console.log('Orders - Render - isLoading:', isLoading);
  console.log('Orders - Render - error:', error);
  console.log('Orders - Render - filter:', filter);
  console.log('Orders - Render - title:', title);

  // Only show data from API - no fallback to local data
  const displayData = ordersData;
  console.log('Orders - Render - displayData length:', displayData.length);
  console.log('Orders - Render - filter applied:', filter);

  return (
    <View style={[styles.container, {backgroundColor: COLORS.white}]}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      /> */}
      <Header />
      

      <FlatList
        data={displayData}
        renderItem={({item, index}) => {
          console.log('Orders - renderItem called for item:', item.id, 'index:', index);
          return renderOrderItem({item, index});
        }}
        keyExtractor={(item, index) => {
          console.log('Orders - keyExtractor called for item:', item.id, 'index:', index);
          return `${item.id}-${index}`;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={{backgroundColor: 'transparent'}} // Ensure FlatList background is transparent
        removeClippedSubviews={false} // Disable clipping for iOS debugging
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{title || 'My Orders'}</Text>
            <Text style={styles.headerSubtitle}>
              {displayData.length} order{displayData.length !== 1 ? 's' : ''} •
              Total: {'\u20B9'}
              {displayData
                .reduce((sum, order) => {
                  const orderTotal = (order.order_items ?? []).reduce(
                    (itemSum, item) => {
                      const price =
                        item.product_offer_price || item.product_price || 0;
                      return itemSum + price * (item.quantity || 0);
                    },
                    0,
                  );
                  return sum + orderTotal;
                }, 0)
                .toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => {
          const getEmptyMessage = () => {
            switch (filter) {
              case 'unpaid':
                return {
                  title: 'No Pending Payments',
                  message: 'All your spiritual orders are paid! Your devotion is complete.',
                  icon: 'check-circle',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'paid':
                return {
                  title: 'No Orders to Ship',
                  message: 'No orders waiting to be shipped. Your spiritual items are ready!',
                  icon: 'truck-delivery',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'shipped':
                return {
                  title: 'No Orders in Transit',
                  message: 'No orders are currently being delivered. Check back soon!',
                  icon: 'truck-delivery',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'delivered':
                return {
                  title: 'No Orders to Review',
                  message: 'You have reviewed all your delivered spiritual orders!',
                  icon: 'check-circle',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'received':
                return {
                  title: 'No Orders Received',
                  message: 'No orders have been delivered yet. Your spiritual journey awaits!',
                  icon: 'package-variant',
                  image: require('../assets/namahShivay.jpeg'),
                };
              default:
                return {
                  title: 'No Orders Found',
                  message: 'Start your spiritual shopping journey to see orders here.',
                  icon: 'package-variant',
                  image: require('../assets/namahShivay.jpeg'),
                };
            }
          };

          const emptyMsg = getEmptyMessage();

          return (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyImageContainer}>
                <Image
                  source={emptyMsg.image}
                  style={styles.emptyImage}
                  resizeMode="cover"
                />
                <View style={styles.emptyIconOverlay}>
                  <MaterialCommunityIcons
                    name={emptyMsg.icon}
                    size={moderateScale(40)}
                    color={COLORS.white}
                  />
                </View>
              </View>
              <Text style={styles.emptyTitle}>{emptyMsg.title}</Text>
              <Text style={styles.emptyMessage}>{emptyMsg.message}</Text>
              {!filter && (
                <TouchableOpacity
                  style={styles.shopNowButton}
                  onPress={() => navigation.navigate('categories')}>
                  <Text style={styles.shopNowButtonText}>Explore Spiritual Products</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: moderateScale(10),
    // paddingTop: moderateScale(10),
  },
  headerSection: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    marginTop: moderateScale(16),
    marginBottom: moderateScale(8),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: moderateScale(4),
  },
  headerSubtitle: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: moderateScale(2),
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(30),
    paddingTop: moderateScale(8),
  },
  orderCard: {
    backgroundColor: COLORS.card || '#FFFFFF',
    marginVertical: moderateScale(8),
    marginHorizontal: 0,
    borderRadius: moderateScale(16),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'visible', // Changed from 'hidden' to 'visible' for iOS
    marginBottom: moderateScale(12),
    minHeight: moderateScale(120), // Ensure minimum height
    // iOS-specific fixes
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(12),
  },
  orderIdSection: {
    flex: 1,
  },
  orderIdText: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  orderDateText: {
    color: COLORS.gray || '#343434ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    marginTop: moderateScale(2),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
  },
  statusText: {
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    fontWeight: '650',
    marginLeft: moderateScale(4),
  },
  orderContent: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(12),
    padding: moderateScale(8),
    marginRight: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    height: moderateScale(70),
    width: moderateScale(70),
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: moderateScale(4),
  },
  productName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '600',
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(4),
  },
  brandText: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    marginTop: 0,
    height: 0,
    opacity: 0,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(6),
  },
  quantityText: {
    color: COLORS.gray || '#1b1b1bff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
  },
  priceText: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  moreItemsText: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(11),
    marginTop: moderateScale(4),
    fontStyle: 'italic',
  },
  arrowContainer: {
    paddingLeft: moderateScale(10),
  },
  orderFooter: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(3, 2, 2, 0.05)',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  paymentText: {
    color: COLORS.gray || '#111111ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  trackingText: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(11),
    fontWeight: '600',
    lineHeight: moderateScale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.content.horizontal,
    minHeight: verticalScale(400),
  },
  emptyIconContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.margin.medium,
  },
  emptyImageContainer: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    overflow: 'hidden',
    marginBottom: PADDING.margin.medium,
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyImage: {
    width: '100%',
    height: '100%',
  },
  emptyIconOverlay: {
    position: 'absolute',
    bottom: moderateScale(10),
    right: moderateScale(10),
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(245, 74, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: PADDING.margin.small,
    textAlign: 'center',
  },
  emptyMessage: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.margin.medium,
    lineHeight: moderateScale(22),
  },
  shopNowButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: PADDING.button.horizontal,
    paddingVertical: PADDING.button.vertical,
    borderRadius: moderateScale(12),
    shadowColor: COLORS.button,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  shopNowButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#6c757dff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginTop: moderateScale(8),
    paddingHorizontal: moderateScale(40),
    lineHeight: moderateScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: PADDING.margin.xlarge,
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Medium,
    color: COLORS.black,
    marginTop: PADDING.margin.medium,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.content.horizontal,
    minHeight: verticalScale(400),
  },
  errorIconContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING.margin.medium,
  },
  errorTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: PADDING.margin.small,
    textAlign: 'center',
  },
  errorMessage: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginBottom: PADDING.margin.medium,
    paddingHorizontal: PADDING.margin.medium,
    lineHeight: moderateScale(22),
  },
  errorSubMessage: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.margin.medium,
    lineHeight: moderateScale(20),
  },
  retryButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: PADDING.button.horizontal,
    paddingVertical: PADDING.button.vertical,
    borderRadius: moderateScale(12),
    shadowColor: COLORS.button,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: PADDING.margin.medium,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  retryCount: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});
