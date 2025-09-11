import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fonts} from '../utils/fonts';
import {moderateScale, verticalScale} from '../PixelRatio';
import { COLORS } from '../Constant/Colors';

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
    marginHorizontal: 15,
    marginVertical: 12,
    alignSelf: 'center',
  },
  coverImage: {
    height: 100,
    width: 90,
    borderRadius: 20,
    position: 'relative',
  },
  contentContainer: {
    padding: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    maxWidth: '75%',
    minWidth: '65%',
  },
  title: {
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 6,
    flexWrap: 'wrap',
    flexShrink: 1,
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  price: {
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 6,
    flexWrap: 'wrap',
    flexShrink: 1,
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  imgContent: {
    flexDirection: 'row',
    width: '100%',
    height: verticalScale(130),
    backgroundColor: COLORS.cream,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewProducts:{
    textDecorationLine: 'underline',
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    fontWeight: '600',
    color: COLORS.button,
    marginTop: 8,
  }
});
