import {Image, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import React from 'react';
import {fonts} from '../utils/fonts';
import {moderateScale, verticalScale} from '../PixelRatio';
import { COLORS } from '../Constant/Colors';
import { PADDING } from '../Constant/Padding';

const CouponCard = ({item, handleCouponClick}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleCouponClick(item);
      }}>
      <View style={styles.imgContent}>
        <Image source={{uri: item.image_url}} style={styles.coverImage} />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.title}>Code : {item.code}</Text>
          <Text style={styles.price}>Expiry: {item.valid_until}</Text>
          <Text style={styles.viewProducts}>View Products</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CouponCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: PADDING.margin.small,
    marginVertical: PADDING.margin.medium,
    alignSelf: 'center',
  },
  coverImage: {
    height: verticalScale(110),
    width: moderateScale(100),
    borderRadius: moderateScale(20),
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    padding: PADDING.content.vertical,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: PADDING.margin.medium,
    maxWidth: '75%',
    minWidth: '65%',
  },
  title: {
    fontSize: moderateScale(17),
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: PADDING.margin.small,
    flexWrap: 'wrap',
    flexShrink: 1,
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  price: {
    fontSize: moderateScale(15),
    fontFamily: fonts.regular,
    fontWeight: '500',
    color: '#666666',
    marginBottom: PADDING.margin.small,
    flexWrap: 'wrap',
    flexShrink: 1,
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  imgContent: {
    flexDirection: 'row',
    width: '100%',
    height: verticalScale(140),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: moderateScale(16),
    paddingHorizontal: PADDING.content.horizontal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.1)',
  },
  viewProducts:{
    textDecorationLine: 'underline',
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    fontWeight: '600',
    color: COLORS.button,
    marginTop: PADDING.margin.small,
  }
});
