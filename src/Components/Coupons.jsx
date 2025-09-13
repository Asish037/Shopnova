import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../Constant/Colors";
import { PADDING } from "../Constant/Padding";
import { moderateScale } from "../PixelRatio";

const Coupons = () => {
  const [selected, setSelected] = useState("Trending");
  const couponslist = ["Trending", "Discount", "Expiring Soon", "All"];
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={couponslist}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => setSelected(item)}>
              <Text
                style={[
                  styles.tagText,
                  item == selected ? styles.isSelected : null,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default Coupons;

const styles = StyleSheet.create({
  tagText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    borderRadius: moderateScale(12),
    paddingHorizontal: PADDING.button.horizontal,
    paddingVertical: PADDING.button.vertical,
    marginHorizontal: PADDING.margin.small,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: COLORS.grey,
    fontWeight: "700",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.2)',
  },
  isSelected: {
    backgroundColor: COLORS.button,
    color: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  container: {
    marginVertical: PADDING.margin.medium,
    paddingHorizontal: PADDING.header.horizontal,
  },
});
