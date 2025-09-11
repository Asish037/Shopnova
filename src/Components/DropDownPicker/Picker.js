import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Picker = ({
  data,
  label,
  value,
  placeholder,
  onSelect,
  selectedValue,
  style,
}) => {
  const [showPicker, setshowPicker] = useState(false);
  const [currentShowValue, setcurrentShowValue] = useState(placeholder);
  const [currentVal, setcurrentVal] = useState(selectedValue);

  useEffect(() => {
    const findVal = data.find(i => i[value] === selectedValue);
    if (findVal && Object.keys(findVal).length > 0) {
      console.log('findVal=>>', findVal);
      setcurrentVal(selectedValue);
      setcurrentShowValue(findVal[label]);
    }
  }, [data]);

  const selectVal = item => {
    setcurrentShowValue(item[label]);
    setcurrentVal(item[value]);
    onSelect(item[value], item);
    setshowPicker(false);
  };
  const setToDefault = () => {
    setcurrentShowValue('');
    setcurrentVal('');
    onSelect('', '');
    setshowPicker(false);
  };
  return (
    <View style={styles.inputFieldContainer}>
      <Pressable
        onPress={() => setshowPicker(true)}
        style={{
          ...styles.textInputView,
          paddingHorizontal: 20,
          ...style,
        }}>
        <Text style={styles.dob}>
          {!currentShowValue ? placeholder : currentShowValue}
        </Text>
        <MaterialCommunityIcons
                          name={'arrow-down-bold-circle-outline'}
                          size={22}
                          color={COLORS.button}
                          style={styles.icon}
                        />
      </Pressable>
      <Modal
        transparent
        visible={showPicker}
        onRequestClose={() => setshowPicker(false)}>
        <Pressable
          onPress={() => setshowPicker(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white,
          }}>
          <View
            style={{
              backgroundColor: COLORS.button,
              width: '85%',
              padding: 20,
              borderRadius: 3,
              maxHeight: '75%',
            }}>
            <ScrollView>
              <TouchableOpacity
                onPress={setToDefault}
                style={{paddingVertical: 12}}>
                <Text style={styles.pickerItem}>{placeholder}</Text>
              </TouchableOpacity>
              {data.map((i, key) => (
                <TouchableOpacity
                  onPress={() => selectVal(i)}
                  style={{paddingVertical: 12}}
                  key={key}>
                  <Text
                    style={{
                      ...styles.pickerItem,
                      fontFamily:
                        i[value] === currentVal ? FONTS.Bold : FONTS.Medium,
                    }}>
                    {i[label]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Picker;

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    color: COLORS.black,
    width: '100%',
  },
  pickerItem: {
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(13),
    opacity: 0.8,
  },
  dob: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(15),
    color: COLORS.black,
    flexDirection: 'row'
  },
  textInputView: {
    // width: '100%',
    // height: verticalScale(50),
    // justifyContent: 'space-between',
    // paddingHorizontal: 5,
    // backgroundColor: COLORS.theme,
    // borderRadius: 5,
    // flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: 7,
    //flex: 1,
    fontSize: 10,
    width: moderateScale(250),
    height: verticalScale(50),
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(15),
    backgroundColor: COLORS.lightgray,
    paddingLeft: 20,
    borderRadius: 5,
    marginBottom: 7,
    justifyContent: 'space-between',
     paddingHorizontal: 5,
     alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  inputFieldContainer: {
    borderWidth: 1,
    borderColor: COLORS.button,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
});
