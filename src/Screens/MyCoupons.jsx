import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/Header';
import Tags from '../Components/Tags';
import ProductCard from '../Components/ProductCard';
import coupon from '../data/coupon.json';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../Constant/Colors';
import {moderateScale} from '../PixelRatio';
import {PADDING} from '../Constant/Padding';
import Coupons from '../Components/Coupons';
import CouponCard from '../Components/CouponCard';
// import Header from "../Components/Header";

const MyCoupons = () => {
  const [couponLists, setCopnonLists] = useState(coupon.coupons);
  const navigation = useNavigation();
  const handleCouponDetails = item => {
    //navigation.navigate("PRODUCT_DETAILS", { item });
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <FlatList
        ListHeaderComponent={
          <>
            <>
              <View style={styles.headerSection}>
                <Text style={styles.headingText}>My Coupons</Text>
                <MaterialCommunityIcons
                  name="wallet-giftcard"
                  style={{color: COLORS.lightbutton, fontSize: moderateScale(30)}}
                />
              </View>
            </>
            <Coupons />
          </>
        }
        data={couponLists}
        numColumns={1}
        renderItem={({item}) => (
          <CouponCard item={item} handleCouponClick={handleCouponDetails} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />
      <View></View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingTop: PADDING.container.vertical,
      paddingBottom: PADDING.container.bottom,
      width: '100%',
      height: '100%',
  },

  headingText: {
    fontSize: moderateScale(28),
    color: COLORS.black,
    marginVertical: PADDING.margin.xlarge,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
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
  headerSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.content.vertical,
    borderBottomWidth: 2,
    borderColor: 'rgba(245, 74, 0, 0.2)',
    paddingBottom: PADDING.margin.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(12),
    marginHorizontal: PADDING.margin.small,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  flatList: {
    paddingHorizontal: PADDING.flatList.horizontal,
  },
  flatListContent: {
    paddingBottom: PADDING.flatList.bottom,
    paddingTop: PADDING.flatList.top,
  },
});
export default MyCoupons;
