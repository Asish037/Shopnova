import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import myorderData from '../data/myorderData.json';
import Header from '../Components/Header';
import Moment from 'moment';

const Orders = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [ordersData, setOrdersData] = useState([]);
  const [allOrders] = useState(myorderData.orders);

  // Get route parameters
  const {status, title, filter} = route.params || {};

  useEffect(() => {
    // Filter orders based on the parameters passed from AccountScreen
    let filteredOrders = allOrders;

    if (filter) {
      switch (filter) {
        case 'unpaid':
          filteredOrders = allOrders.filter(
            order => order.payment.payment_status !== 'Completed',
          );
          break;
        case 'paid':
          filteredOrders = allOrders.filter(
            order =>
              order.payment.payment_status === 'Completed' &&
              order.shipping_status === 'Processing',
          );
          break;
        case 'shipped':
          filteredOrders = allOrders.filter(
            order => order.shipping_status === 'Shipped',
          );
          break;
        case 'delivered':
          filteredOrders = allOrders.filter(
            order => order.shipping_status === 'Delivered',
          );
          break;
        default:
          filteredOrders = allOrders;
      }
    }

    setOrdersData(filteredOrders);
  }, [filter, allOrders]);

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

  const renderOrderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('OrderDetails', {items: item});
      }}
      style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdSection}>
          <Text style={styles.orderIdText}>Order #{item.order_id}</Text>
          <Text style={styles.orderDateText}>
            {Moment(item.order_date).format('MMM DD, YYYY')}
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
            ]}>
            {item.shipping_status}
          </Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.items[0].thumbnail_image,
            }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.items[0].product_name}
          </Text>
          <Text style={styles.brandText}>{item.items[0].brand}</Text>
          <View style={styles.quantityPriceRow}>
            <Text style={styles.quantityText}>
              Qty: {item.items[0].quantity}
            </Text>
            <Text style={styles.priceText}>${item.payment.total_amount}</Text>
          </View>
          {item.items.length > 1 && (
            <Text style={styles.moreItemsText}>
              +{item.items.length - 1} more item
              {item.items.length > 2 ? 's' : ''}
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

      <View style={styles.orderFooter}>
        <View style={styles.paymentInfo}>
          <MaterialCommunityIcons
            name="credit-card"
            size={16}
            color={COLORS.button}
          />
          <Text style={styles.paymentText}>
            {item.payment.payment_method} • {item.payment.payment_status}
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
        keyExtractor={(item, index) => `${item.order_id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{title || 'My Orders'}</Text>
            <Text style={styles.headerSubtitle}>
              {ordersData.length} order{ordersData.length !== 1 ? 's' : ''} •
              Total: $
              {ordersData
                .reduce(
                  (sum, order) => sum + parseFloat(order.payment.total_amount),
                  0,
                )
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
                  message: 'All your orders are paid!',
                };
              case 'paid':
                return {
                  title: 'No Orders to Ship',
                  message: 'No orders waiting to be shipped.',
                };
              case 'shipped':
                return {
                  title: 'No Shipped Orders',
                  message: 'No orders are currently in transit.',
                };
              case 'delivered':
                return {
                  title: 'No Orders to Review',
                  message: 'You have reviewed all delivered orders!',
                };
              default:
                return {
                  title: 'No Orders Found',
                  message: 'Start shopping to see your orders here.',
                };
            }
          };

          const emptyMsg = getEmptyMessage();

          return (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="package-variant"
                size={moderateScale(60)}
                color={COLORS.grey}
              />
              <Text style={styles.emptyTitle}>{emptyMsg.title}</Text>
              <Text style={styles.emptyMessage}>{emptyMsg.message}</Text>
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
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: moderateScale(10),
    // paddingTop: moderateScale(10),
  },
  headerSection: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(10),
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    borderRadius: moderateScale(15),
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
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
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(20),
  },
  orderCard: {
    backgroundColor: COLORS.card,
    marginVertical: moderateScale(8),
    marginHorizontal: moderateScale(5),
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
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(8),
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
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
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
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(5),
    paddingTop: moderateScale(5),
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
    paddingVertical: moderateScale(70),
  },
  emptyTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: moderateScale(20),
  },
  emptyMessage: {
    color: '#6c757dff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginTop: moderateScale(8),
    paddingHorizontal: moderateScale(40),
    lineHeight: moderateScale(20),
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
});
