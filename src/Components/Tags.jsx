import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {COLORS} from '../Constant/Colors';
// import {useTheme} from '../Context/ThemeContext';

const Tags = () => {
  const [selected, setSelected] = useState("Best Selling");
  const tags = ["Best Selling", "Murti", "New Arrivals", "Mala", "Pendant"];
  // const {getThemeColors} = useTheme();
  // const themeColors = getThemeColors();

  const styles = StyleSheet.create({
    tagText: {
      fontSize: 16,
      fontFamily: "Poppins-Regular",
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginHorizontal: 10,
      color: COLORS.grey,
      backgroundColor: COLORS.white,
      fontWeight: "700",
    },
    isSelected: {
      backgroundColor: COLORS.button,
      color: "#FFFFFF",
    },
    container: {
      marginVertical: 10,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={tags}
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

export default Tags;
