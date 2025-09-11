import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Moment from 'moment';
import Header from '../Components/Header';

const OrderDetails = ({route}) => {
  const navigation = useNavigation();
  const {items} = route.params;
  const [rating, setRating] = useState(0);

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
      <Image
        source={{uri: item.thumbnail_image}}
        style={styles.orderItemImage}
      />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.orderItemBrand}>{item.brand}</Text>
        <View style={styles.orderItemSpecs}>
          <Text style={styles.orderItemSpec}>
            {item.size ? `Size: ${item.size}` : `Weight: ${item.weight}`}
          </Text>
          <Text style={styles.orderItemSpec}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.orderItemPrice}>${item.total}</Text>
      </View>
    </View>
  );

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
              name={getStatusIcon(items.shipping_status)}
              size={moderateScale(35)}
              color={getStatusColor(items.shipping_status)}
            />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>
              {items.shipping_status === 'Shipped'
                ? 'Order Delivered'
                : 'Order Status'}
            </Text>
            <Text style={styles.statusSubtitle}>Order #{items.order_id}</Text>
            <Text style={styles.statusDate}>
              {Moment(items.order_date).format('MMMM DD, YYYY')}
            </Text>
          </View>
          <View style={styles.paymentStatusContainer}>
            <Text
              style={[
                styles.paymentStatus,
                {color: getStatusColor(items.payment.payment_status)},
              ]}>
              {items.payment.payment_status}
            </Text>
          </View>
        </View>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={items.items}
            renderItem={renderOrderItem}
            keyExtractor={item => item.item_id}
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
              <Text style={styles.addressName}>{items.customer.name}</Text>
              <Text style={styles.addressPhone}>{items.customer.phone}</Text>
            </View>
            <Text style={styles.addressText}>
              {`${items.customer.shipping_address.street}, ${items.customer.shipping_address.city}, ${items.customer.shipping_address.state} - ${items.customer.shipping_address.zip_code}, ${items.customer.shipping_address.country}`}
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
                {items.payment.payment_method}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={styles.summaryValueTotal}>
                ${items.payment.total_amount}
              </Text>
            </View>
            {items.tracking_number && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tracking Number</Text>
                <Text style={styles.summaryValueTracking}>
                  {items.tracking_number}
                </Text>
              </View>
            )}
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
              <Text style={styles.contactText}>{items.customer.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <MaterialCommunityIcons
                name="email"
                size={moderateScale(20)}
                color={COLORS.button}
              />
              <Text style={styles.contactText}>{items.customer.email}</Text>
            </View>
          </View>
        </View>

        {/* Rate Product */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate this order</Text>
          <View style={styles.ratingCard}>
            <Image
              source={{uri: items.items[0].thumbnail_image}}
              style={styles.ratingProductImage}
            />
            <View style={styles.ratingContent}>
              <Text style={styles.ratingTitle}>How was your experience?</Text>
              <View style={styles.starsContainer}>{renderStars()}</View>
              <Text style={styles.ratingSubtitle}>
                Rate & Review to earn Shopnova Credits
              </Text>
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        {items.reviews && items.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            {items.reviews.map((review, index) => (
              <View
                key={`review-${index}-${
                  review.reviewerEmail || review.reviewerName
                }-${review.date}`}
                style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                  <View style={styles.reviewRating}>
                    {Array.from({length: 5}, (_, i) => (
                      <MaterialCommunityIcons
                        key={`review-${index}-star-${i}`}
                        name={i < review.rating ? 'star' : 'star-outline'}
                        size={moderateScale(14)}
                        color={i < review.rating ? '#e82929da' : COLORS.gray}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {Moment(review.date).format('MMM DD, YYYY')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: moderateScale(10),
  },
  statusHeader: {
    backgroundColor: COLORS.card,
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    borderRadius: moderateScale(15),
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 8,
  },
  statusIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: moderateScale(30),
    padding: moderateScale(2),
    marginRight: moderateScale(10),
  },
  statusTextContainer: {
    flex: 1,
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
    marginTop: moderateScale(2),
  },
  statusDate: {
    color: COLORS.gray || '#474545ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    marginTop: moderateScale(4),
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
    marginHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
  },
  sectionTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: moderateScale(5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderItemCard: {
    // backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(5),
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  orderItemImage: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.lightGray || '#F5F5F5',
    marginRight: moderateScale(20),
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderItemName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '600',
    lineHeight: moderateScale(18),
  },
  orderItemBrand: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    marginTop: moderateScale(2),
  },
  orderItemSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(5),
  },
  orderItemSpec: {
    color: COLORS.gray || '#181717ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11),
  },
  orderItemPrice: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  addressCard: {
    // backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(5),
  },
  addressName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '650',
    marginLeft: moderateScale(8),
    flex: 1,
  },
  addressPhone: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  addressText: {
    color: COLORS.gray || '#343232ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  summaryCard: {
    // backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  summaryLabel: {
    color: COLORS.gray || '#2b2929ff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(14),
  },
  summaryValue: {
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  summaryValueTotal: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  summaryValueTracking: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  contactCard: {
    // backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(5),
  },
  contactText: {
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(14),
    marginLeft: moderateScale(10),
  },
  ratingCard: {
    // backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  ratingProductImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: COLORS.white,
    marginRight: moderateScale(15),
  },
  ratingContent: {
    flex: 1,
  },
  ratingTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: moderateScale(8),
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(7),
  },
  ratingSubtitle: {
    color: COLORS.gray || '#3b3a3aff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
  },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  reviewerName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: COLORS.gray || '#2c2a2aff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(8),
  },
  reviewDate: {
    color: COLORS.gray || '#2c2a2aff',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11),
  },
});
