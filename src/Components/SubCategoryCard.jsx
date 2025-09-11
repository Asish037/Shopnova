import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {COLORS} from '../Constant/Colors';

const {width} = Dimensions.get('window');

const SubCategoryCard = ({subCategory, onPress, isSelected = false}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(subCategory)}
      activeOpacity={0.7}>
      <View style={[styles.content, isSelected && styles.selectedContent]}>
        <Text
          style={[styles.subCategoryName, isSelected && styles.selectedText]}
          numberOfLines={2}>
          {subCategory.name}
        </Text>
        {subCategory.product_count && (
          <Text
            style={[
              styles.productCount,
              isSelected && styles.selectedCountText,
            ]}>
            {subCategory.product_count} items
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    marginVertical: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  selectedContainer: {
    elevation: 4,
    shadowOpacity: 0.15,
    borderWidth: 2,
    borderColor: COLORS.button,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  selectedContent: {
    backgroundColor: COLORS.lightbutton,
  },
  subCategoryName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
    marginBottom: 2,
  },
  selectedText: {
    color: COLORS.button,
    fontFamily: 'Poppins-Bold',
  },
  productCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey,
  },
  selectedCountText: {
    color: COLORS.button,
  },
});

export default SubCategoryCard;
