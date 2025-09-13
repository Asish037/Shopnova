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
      
      // Use local data for now (since API might not be available)
      let ordersToUse = myorderData.orders || [];
      
      // Try to get data from API if token is available
      const token = await asyncStorage.getItem('userToken');
      const userData = await asyncStorage.getItem('userData');
      const parsedUser = userData ? JSON.parse(userData) : null;
      const userId = parsedUser?.id;   

      console.log('parsedUser:', parsedUser);
      console.log('Fetched userId:', userId);
      console.log('Fetched token:', token);

      if (token && userId) {
        try {
          const response = await axios({
            method: 'get',
            url: `/order-list?userId=${userId}`,
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // 10 second timeout
          });

          if (response.status === 200) {
            // 👇 Safe extraction
            let fetchedOrders = response.data?.data ?? [];
            ordersToUse = fetchedOrders;
          }
        } catch (apiErr) {
          console.log('API call failed, using local data:', apiErr.message);
          // Continue with local data
        }
      }

      // Normalize each order
      const updatedOrders = ordersToUse.map(order => ({
        ...order,
        shipping_status: order.shipping_status || 'Processing', // default if missing
        payment: order.payment || { payment_status: 'Pending', payment_method: 'N/A' },
        order_items: order.order_items ?? [], // safe default
      }));

      // Apply filter
      let filteredOrders = updatedOrders;
      if (filter) {
        switch (filter) {
          case 'unpaid':
            filteredOrders = updatedOrders.filter(
              o => o.payment?.payment_status !== 'Completed'
            );
            break;
          case 'paid':
            filteredOrders = updatedOrders.filter(
              o =>
                o.payment?.payment_status === 'Completed' &&
                o.shipping_status === 'Processing'
            );
            break;
          case 'shipped':
            filteredOrders = updatedOrders.filter(
              o => o.shipping_status === 'Shipped'
            );
            break;
          case 'delivered':
            filteredOrders = updatedOrders.filter(
              o => o.shipping_status === 'Delivered'
            );
            break;
        }
      }

      setOrdersData(filteredOrders);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      setError('Failed to load orders. Please try again.');
      
      // Use fallback data
      if (myorderData.orders && myorderData.orders.length > 0) {
        setOrdersData(myorderData.orders);
      }
    } finally {
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
    const firstItem = item.order_items?.[0]; // safe check

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
              source={{
                uri: firstItem?.product_image || 'https://via.placeholder.com/150',
              }}
              style={styles.productImage}
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
                ${item.total?.toFixed(2) || '0.00'}
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
      <LinearGradient
        colors={COLORS.gradient || COLORS.gradient}
        style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.button} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show error screen if there's an error
  if (error) {
    return (
      <LinearGradient
        colors={COLORS.gradient || COLORS.gradient}
        style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={moderateScale(80)}
              color={COLORS.button}
            />
          </View>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          {retryCount > 0 && (
            <Text style={styles.retryCount}>Retry attempt: {retryCount}</Text>
          )}
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={COLORS.gradient || COLORS.gradient}
      style={styles.container}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      /> */}
      <Header />

      <FlatList
        data={ordersData}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{title || 'My Orders'}</Text>
            <Text style={styles.headerSubtitle}>
              {ordersData.length} order{ordersData.length !== 1 ? 's' : ''} •
              Total: $
              {ordersData
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
                  message: 'All your spiritual orders are paid!',
                  icon: 'check-circle',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'paid':
                return {
                  title: 'No Orders to Ship',
                  message: 'No orders waiting to be shipped.',
                  icon: 'truck-delivery',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'shipped':
                return {
                  title: 'No Shipped Orders',
                  message: 'No orders are currently in transit.',
                  icon: 'truck-delivery',
                  image: require('../assets/namahShivay.jpeg'),
                };
              case 'delivered':
                return {
                  title: 'No Orders to Review',
                  message: 'You have reviewed all delivered orders!',
                  icon: 'check-circle',
                  image: require('../assets/namahShivay.jpeg'),
                };
              default:
                return {
                  title: 'No Orders Found',
                  message: 'Start shopping to see your spiritual orders here.',
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
    </LinearGradient>
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
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.content.vertical,
    marginTop: PADDING.margin.medium,
    borderRadius: moderateScale(15),
  },
  headerTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(19),
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: moderateScale(5),
  },
  listContainer: {
    paddingHorizontal: PADDING.header.horizontal,
    paddingBottom: PADDING.flatList.bottom,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    marginVertical: PADDING.margin.small,
    marginHorizontal: 0,
    borderRadius: moderateScale(15),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.content.horizontal,
    paddingTop: PADDING.content.vertical,
    paddingBottom: PADDING.margin.small,
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
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  statusText: {
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(11),
    fontWeight: '650',
    marginLeft: moderateScale(6),
  },
  orderContent: {
    flexDirection: 'row',
    paddingHorizontal: PADDING.content.horizontal,
    paddingVertical: PADDING.margin.small,
    alignItems: 'center',
  },
  imageContainer: {
    // backgroundColor:  '#F5F5F5',
    borderRadius: moderateScale(12),
    padding: moderateScale(6),
    marginRight: moderateScale(10),
  },
  productImage: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '600',
    lineHeight: moderateScale(18),
  },
  brandText: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    marginTop: moderateScale(2),
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
    paddingHorizontal: PADDING.content.horizontal,
    paddingBottom: PADDING.margin.small,
    paddingTop: PADDING.margin.small,
    borderTopWidth: 2,
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
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.margin.medium,
    lineHeight: moderateScale(22),
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
