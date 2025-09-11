import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Icon,
} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import Navigation from '../../Service/Navigation';
// import {Icon} from 'native-base';
import {moderateScale, verticalScale} from '../../PixelRatio';

export default function PromoModal(props) {
  const [Split, setSplit] = useState(true);
  const [promoCode, setpromoCode] = useState('');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.liteBlack,
      }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          margin: 30,
          borderRadius: 20,
          paddingBottom: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 25,
          }}>
          <Text
            style={{fontFamily: FONTS.Bold, color: COLORS.black, fontSize: 15}}>
            Promotion Code
          </Text>
          <TouchableOpacity onPress={() => props.close()}>
            <Icon name="cross" type="Entypo" />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Enter Promo Code"
          value={promoCode}
          onChangeText={val => setpromoCode(val)}
          style={{
            borderWidth: 0.4,
            borderColor: COLORS.textInput,
            height: 40,
            borderRadius: 5,
            paddingLeft: 15,
            marginBottom: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => props.applyPromoCode(promoCode)}
          style={{
            height: verticalScale(50),
            backgroundColor: COLORS.button,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontFamily: FONTS.title,
              color: COLORS.white,
              fontSize: 15,
            }}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  SplitlistView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: COLORS.textInput,
    paddingVertical: 7,
  },
  title: {
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    fontSize: moderateScale(12),
    opacity: 0.4,
  },
  value: {
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    fontSize: moderateScale(12),
  },
});
