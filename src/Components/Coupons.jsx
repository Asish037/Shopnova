import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../Constant/Colors";

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
    fontFamily: "Poppins-Regular",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: COLORS.cream,
    color: COLORS.grey,
    fontWeight: "700",
  },
  isSelected: {
    backgroundColor: COLORS.lightbutton,
    color: COLORS.orange,
  },
  container: {
    marginVertical: 10,
  },
});
