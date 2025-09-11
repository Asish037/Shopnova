import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
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
  console.log('bbbb==' + JSON.stringify(items.items[0]));
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <ScrollView>
        <View style={styles.headerSection}>
          <View style={styles.productCard}>
            <View style={styles.imgCard}>
              <Image
                style={{
                  width: moderateScale(100),
                  height: moderateScale(100),
                  // borderColor: COLORS.theme,
                  // borderWidth: 10,
                  marginBottom: 5,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 14,
                }}
                source={{
                  uri: items.items[0].thumbnail_image,
                }}
              />
            </View>
            <Text
              style={{...styles.headTitle, color: COLORS.button, padding: 5}}>
              {/* {'Panjabi Kurta,\nFloral Design'} */}
              {items.items[0].brand}
            </Text>
            <Text style={{...styles.headSubTitle, color: COLORS.button}}>
              {/* {'Panjabi Kurta,\nFloral Design'} */}
              {items.items[0].product_name}
            </Text>
            <Text style={{...styles.headSubTitle, color: COLORS.button}}>
              {` ${
                items.items[0].size
                  ? `Size - ` + items.items[0].size
                  : `Weight - ` + items.items[0].weight
              }`}
            </Text>
            <View style={styles.deliverSec}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 2,
                }}>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={'20'}
                  style={{color: COLORS.white, fontSize: moderateScale(25)}}
                />
                <Text style={{...styles.headTitle, color: COLORS.black}}>
                  {`${
                    items.shipping_status === 'Shipped'
                      ? 'Delivered - ' + items.order_id
                      : 'Arriving...' + items.order_id
                  } `}
                </Text>
                <View style={{paddingLeft: 10}}>
                  <Text
                    style={{
                      ...styles.headSubTitle,
                      color: COLORS.green,
                      alignSelf: 'flex-start',
                    }}>
                    {items.payment.payment_status}
                  </Text>
                </View>
              </View>
              <Text style={{...styles.headSubTitle, color: COLORS.white}}>
                {'On ' + Moment(items.items[0].order_date).format('llll')}
                {/* {'On Thu, 3rd Oct 2024'} */}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodySection}>
            <View style={styles.rateSection}>
              <Image
                source={{
                  uri: items.items[0].thumbnail_image,
                }}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  resizeMode: 'center',
                  borderColor: COLORS.button,
                  borderWidth: 2,
                }}
              />
              <View style={styles.bodyPart}>
                <Text style={{...styles.headTitle, color: COLORS.button}}>
                  Rate this product
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={'20'}
                    style={{
                      color: COLORS.button,
                      fontSize: moderateScale(25),
                    }}
                  />
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={'20'}
                    style={{
                      color: COLORS.button,
                      fontSize: moderateScale(25),
                    }}
                  />
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={'20'}
                    style={{
                      color: COLORS.button,
                      fontSize: moderateScale(25),
                    }}
                  />
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={'20'}
                    style={{
                      color: COLORS.button,
                      fontSize: moderateScale(25),
                    }}
                  />
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={'20'}
                    style={{
                      color: COLORS.button,
                      fontSize: moderateScale(25),
                    }}
                  />
                </View>
                <Text style={styles.headSubTitle}>
                  Rate & Review to earn MJ Credit
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.deliverAddress}>
            <View>
              <Text style={styles.headTitle}>Delivery Address</Text>
              <View>
                <Text style={styles.headTitle}>
                  {items.customer.name} | {`${items.customer.phone}`}{' '}
                </Text>
              </View>
              <View>
                <Text style={styles.headSubTitle}>
                  {`${items.customer.shipping_address.street} - ${items.customer.shipping_address.city}, ${items.customer.shipping_address.state} - ${items.customer.shipping_address.zip_code}, ${items.customer.shipping_address.country}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.totalPriceSec}>
            <Text style={styles.headTitle}>Total Item Price</Text>
            {/* <Text style={styles.headTitle}> $ {`${items.payment.total_amount}`} </Text> */}
            <Text style={styles.headTitle}>
              {' '}
              {`${items.payment.total_amount}`}{' '}
            </Text>
          </View>
          <View>
            <Text style={styles.headSubTitle}>
              {' '}
              By using {`${items.payment.payment_method}`}{' '}
            </Text>
          </View>
          <View style={styles.updateSentSec}>
            <Text style={styles.headTitle}>Updates sent to</Text>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name="phone"
                size={'20'}
                style={{color: COLORS.button, fontSize: moderateScale(25)}}
              />
              <Text style={styles.headTitle}>
                {' '}
                | {`${items.customer.phone}`}{' '}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name="email"
                size={'20'}
                style={{color: COLORS.button, fontSize: moderateScale(25)}}
              />
              <Text style={styles.headTitle}>
                {' '}
                | {`${items.customer.email}`}{' '}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 10,
  },
  headerSection: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    paddingBottom: 20,
  },
  headTitle: {
    //fontFamily: FONTS.Bold,
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    fontFamily: FONTS.Regular,
    marginLeft: 2,
  },
  headSubTitle: {
    //fontFamily: FONTS.Medium,
    ontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(300),
    height: moderateScale(400),
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    //width: '100%',
    width: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  bodySection: {
    padding: 10,
    //width: '90%',
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    // padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  bodyPart: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '70%',
    justifyContent: 'space-evenly',
  },
  bodyPartSmall: {
    width: '30%',
    alignItems: 'flex-start',
  },
  imgCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    shadowColor: COLORS.theme,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(100),
    height: moderateScale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliverSec: {
    backgroundColor: COLORS.pink,
    borderRadius: 10,
    padding: 16,
    paddingBottom: 10,
    shadowColor: COLORS.theme,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(290),
    height: moderateScale(60),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 10,
    left: 5,
  },
  rateSection: {
    // width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    width: Dimensions.get('screen').width, //moderateScale(390),
    height: moderateScale(70),
    justifyContent: 'space-evenly',
    padding: 10,
    margin: 10,
  },
  deliverAddress: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    justifyContent: 'space-around',
    padding: 15,
    margin: 10,
  },
  totalPriceSec: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
  },
  updateSentSec: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    justifyContent: 'space-evenly',
    padding: 10,
    margin: 10,
  },
});
