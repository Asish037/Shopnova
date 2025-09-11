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

export default function SplitBillonfirmation(props) {
  const [Split, setSplit] = useState(true);

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
            Confirmation
          </Text>
          <TouchableOpacity onPress={() => props.close(false)}>
            <Icon name="cross" type="Entypo" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: COLORS.textInput,
            fontFamily: FONTS.Regular,
            fontSize: moderateScale(11),
            marginBottom: 15,
          }}>
          You are able to split the bill with {props.total} guest. Each guest
          will be charged ${Number(props.money).toFixed(2)}
        </Text>

        <TouchableOpacity
          //  onPress={()=>{props.close();Navigation.navigate('SplitBill')}}
          onPress={() => props.continue()}
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
            Continue
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
