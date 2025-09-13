import React, {useEffect, useContext,  useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {PADDING} from '../Constant/Padding';
import {moderateScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import Header from '../Components/Header';
import axios from '../Components/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {CartContext} from '../Context/CartContext';

const OrderDetails = ({route}) => {
  const navigation = useNavigation();
  const {orderId, fromConfirm} = route.params; // comes from order-list
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [order, setOrder] = useState(null);

  const {user, token} = useContext(CartContext);

  
  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No auth token found. Please log in again.');
        return;
      }
      console.log("Fetching details for orderId:", orderId);

      const response = await axios.get(`/order-details?orderId=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Order Details Response:", response.data);

      console.log("API raw response:", JSON.stringify(response.data, null, 2));
      
      if (response.data.status === 1) {
        const apiData = response.data.data;

        const normalizedData = {
          order_id: apiData.id,
          order_date: apiData.created_at,
          shipping_status: apiData.shipping_status || 'Processing',
          tracking_number: apiData.tracking_number || null,
          payment: {
            payment_status: apiData.payment_status || 'Pending',
            payment_method: apiData.payment_method || 'N/A',
            total_amount: apiData.total,
          },
          items: apiData.order_items?.map(item => ({
            item_id: item.id,
            product_name: item.product_name,
            product_image: item.product_image,
            product_price: item.product_price,
            product_offer_price: item.product_offer_price,
            product_sku: item.product_sku,
            quantity: item.quantity,
          })) ?? [],
          customer: {
            name: `${apiData.fname || ''} ${apiData.lname || ''}`.trim(),
            email: apiData.email,
            phone: apiData.phone || 'N/A',
            shipping_address: {
              street: apiData.street || 'N/A',
              city: apiData.city || 'N/A',
              state: apiData.state || 'N/A',
              zip_code: apiData.zip_code || 'N/A',
              country: apiData.country || 'N/A',
            },
          },
          reviews: [],
        };

        setOrderDetails(normalizedData);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch order details.');
      }
    } catch (error) {
      console.error('Error fetching order details:', error.message);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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
  useFocusEffect(
      React.useCallback(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          if (fromConfirm) {
            e.preventDefault(); // stop default back
            navigation.navigate('MainHome');
          }
        });
  
        return unsubscribe;
      }, [fromConfirm, navigation])
    );


  const getStatusColor = status => {
    switch (status) {
      case 'Shipped':
        return COLORS.orange || '#FF6B35';
      case 'Delivered':
        return COLORS.green || '#4CAF50';
      case 'Processing':
        return COLORS.yellow || '#FFC107';
      default:
        return COLORS.gray || '#757575';
    }
  };

  const renderStars = () => {
    return Array.from({length: 5}, (_, index) => (
      <TouchableOpacity
        key={`rating-star-${index}`}
        onPress={() => setRating(index + 1)}>
        <MaterialCommunityIcons
          name={index < rating ? 'star' : 'star-outline'}
          size={moderateScale(25)}
          color={index < rating ? '#FFD700' : COLORS.button}
        />
      </TouchableOpacity>
    ));
  };

  const renderOrderItem = ({item}) => (
    <View style={styles.orderItemCard}>
      <Image source={{uri: item.product_image}} style={styles.orderItemImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.orderItemBrand}>{item.product_sku}</Text>
        <Text style={styles.orderItemSpec}>Qty: {item.quantity}</Text>
        <Text style={styles.orderItemPrice}>
          ₹{item.product_offer_price || item.product_price}
        </Text>
      </View>
    </View>
  );

  
  

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={COLORS.button} />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No order details found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Order Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusIconContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon(orderDetails.shipping_status)}
              size={moderateScale(35)}
              color={getStatusColor(orderDetails.shipping_status)}
            />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>Order Status</Text>
            <Text style={styles.statusSubtitle}>
              Order ID: {orderId}
            </Text>
            <Text style={styles.statusDate}>
              {Moment(orderDetails.order_date).format('MMMM DD, YYYY')}
            </Text>
          </View>
          <View style={styles.paymentStatusContainer}>
            <Text
              style={[
                styles.paymentStatus,
                {color: getStatusColor(orderDetails.payment.payment_status)},
              ]}>
              {orderDetails.payment.payment_status}
            </Text>
          </View>
        </View>

        {/* Basic Order Info
        <View>
          <Text>Order #{order.order_id}</Text>
          <Text>Total: ${order.total_amount}</Text>

          {order.order_items?.map((item, index) => (
            <View key={index}>
              <Text>{item.product_name} x {item.quantity}</Text>
              <Text>${item.product_price}</Text>
            </View>
          ))}
        </View> */}

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={orderDetails.items}
            renderItem={renderOrderItem}
            keyExtractor={item => item.item_id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <MaterialCommunityIcons
                name="map-marker"
                size={moderateScale(20)}
                color={COLORS.button}
              />
              <Text style={styles.addressName}>
                {orderDetails.customer.name}
              </Text>
              <Text style={styles.addressPhone}>
                {orderDetails.customer.phone}
              </Text>
            </View>
            <Text style={styles.addressText}>
              {`${orderDetails.customer.shipping_address.street}, ${orderDetails.customer.shipping_address.city}, ${orderDetails.customer.shipping_address.state} - ${orderDetails.customer.shipping_address.zip_code}, ${orderDetails.customer.shipping_address.country}`}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method</Text>
              <Text style={styles.summaryValue}>
                {orderDetails.payment.payment_method}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryValueTotal}>
                ₹{orderDetails.payment.total_amount}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updates sent to</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="phone"
                size={moderateScale(20)}
                color={COLORS.button}
              />
              <Text style={styles.contactText}>
                {orderDetails.customer.phone}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="email"
                size={moderateScale(20)}
                color={COLORS.button}
              />
              <Text style={styles.contactText}>
                {orderDetails.customer.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Rate Product */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this order</Text>
          <View style={styles.ratingCard}>
            <Image
              source={{uri: orderDetails.items[0].product_image}}
              style={styles.ratingProductImage}
            />
            <View style={styles.ratingContent}>
              <Text style={styles.ratingTitle}>How was your experience?</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingSubtitle}>
                Rate & Review to earn credits
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  
  container: {
    flex: 1, 
    paddingHorizontal: PADDING.container.horizontal,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%', 
    height: '100%'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: PADDING.flatList.bottom,
    paddingTop: PADDING.flatList.top,
  },
  statusHeader: {
    backgroundColor: COLORS.card,
    marginHorizontal: PADDING.margin.medium,
    marginTop: PADDING.margin.medium,
    borderRadius: moderateScale(15),
    padding: PADDING.content.vertical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  statusIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: moderateScale(30),
    padding: moderateScale(2),
    marginRight: moderateScale(10),
  },
  statusTextContainer: {
    flex: 1
  },
  statusTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(17),
    fontWeight: '700',
  },
  statusSubtitle: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(13),
  },
  statusDate: {
    color: COLORS.gray,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
  },
  paymentStatusContainer: {
    backgroundColor: 'rgba(10, 85, 13, 0.26)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(15),
  },
  paymentStatus: {
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  section: {
    marginHorizontal: PADDING.margin.medium,
    marginTop: PADDING.margin.medium
  },
  sectionTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: PADDING.margin.small,
    paddingHorizontal: PADDING.section.horizontal,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderItemCard: {
    flexDirection: 'row',
    borderRadius: moderateScale(12),
    padding: PADDING.card.vertical,
    marginBottom: PADDING.margin.small,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: PADDING.section.horizontal,
  },
  orderItemImage: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(20),
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  orderItemName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
  },
  orderItemBrand: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
  },
  orderItemSpec: {
    color: COLORS.gray,
    fontSize: moderateScale(11),
  },
  orderItemPrice: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
  },
  addressCard: {
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: PADDING.section.horizontal,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(8),
    flex: 1,
  },
  addressPhone: {
    color: COLORS.button,
    fontSize: moderateScale(12)
  },
  addressText: {
    color: COLORS.gray,
    fontSize: moderateScale(12)
  },
  summaryCard: {
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: PADDING.section.horizontal,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(8),
  },
  summaryLabel: {
    color: COLORS.gray,
    fontSize: moderateScale(14)
  },
  summaryValue: {
    color: COLORS.black,
    fontSize: moderateScale(14)
  },
  summaryValueTotal: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
  },
  contactCard: {
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: PADDING.section.horizontal,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactText: {
    color: COLORS.black,
    marginLeft: moderateScale(10)
  },
  ratingCard: {
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: PADDING.section.horizontal,
  },
  ratingProductImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(15),
  },
  ratingContent: {
    flex: 1
  },
  ratingTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    marginBottom: moderateScale(8),
  },
  starsContainer: {
    flexDirection: 'row'
  },
  ratingSubtitle: {
    color: COLORS.gray,
    fontSize: moderateScale(12)
  },
});
