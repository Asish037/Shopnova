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

export default function SplitModal(props) {
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
            Split the bills
          </Text>
          <TouchableOpacity onPress={() => props.close(false)}>
            <Icon name="cross" type="Entypo" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: COLORS.textInput,
              fontFamily: FONTS.SemiBold,
              fontSize: moderateScale(12),
            }}>
            Attention
          </Text>
          <Text
            style={{
              color: COLORS.textInput,
              fontFamily: FONTS.SemiBold,
              fontSize: moderateScale(12),
            }}>
            Max: 5 ways
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.textInput,
            fontFamily: FONTS.Regular,
            fontSize: moderateScale(11),
            marginBottom: 15,
          }}>
          If you decide to split the bill with others, there will be no charge
          on your payment method at this time. Go to the Tickets Tab after
          completing this reservation to invite guests to split the bill with
          you. Once your guests have accepted the invitation, you must confirm
          the reservation, at which point your payment methods will be charged
          evenly between each guest.
        </Text>

        <TouchableOpacity
          //  onPress={()=>{props.close();Navigation.navigate('SplitBill')}}
          onPress={() => props.close(true)}
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
            Split the Bill
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
