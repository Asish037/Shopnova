import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../Constant/Colors';

const {width} = Dimensions.get('window');

const CategoryCard = ({category, onPress, isSelected = false}) => {
  const getIconForCategory = categoryName => {
    // You can add category-specific icons here
    // For now, using a default icon
    return require('../assets/apps.png');
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(category)}
      activeOpacity={0.8}>
      {isSelected ? (
        <LinearGradient
          colors={COLORS.gradientButton}
          style={styles.gradientContainer}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Image
                source={getIconForCategory(category.name)}
                style={[styles.icon, styles.selectedIcon]}
              />
            </View>
            <Text
              style={[styles.categoryName, styles.selectedText]}
              numberOfLines={2}>
              {category.name}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={getIconForCategory(category.name)}
              style={styles.icon}
            />
          </View>
          <Text style={styles.categoryName} numberOfLines={2}>
            {category.name}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (width - 60) / 3,
    height: 100,
    marginHorizontal: 6,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  selectedContainer: {
    elevation: 6,
    shadowOpacity: 0.2,
    transform: [{scale: 1.05}],
  },
  gradientContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightgray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.grey,
  },
  selectedIcon: {
    tintColor: COLORS.red,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedText: {
    color: COLORS.white,
    fontFamily: 'Poppins-Bold',
  },
});

export default CategoryCard;
