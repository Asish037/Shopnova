import {View, Text,Icon, Pressable} from 'react-native';
import React from 'react';
// import {Icon} from 'native-base';
import GlobalStyle from '../GlobalStyle';
import {COLORS} from '../../Constant/Colors';

const PaymentCard = ({cardData, newPaymentCallbBack}) => {
  console.log('cardData=>>', cardData);
  return (
    <View style={GlobalStyle.list}>
      {cardData && Object.keys(cardData).length > 0 ? (
        <View style={GlobalStyle.subList}>
          <Text style={GlobalStyle.semiboldTxt}>Payment Method</Text>
          <Text
            style={{...GlobalStyle.regularTxt, marginLeft: 10}}
            adjustsFontSizeToFit>
            {/* xxx {cardData?.cardNumber.substr(cardData?.cardNumber.length - 4)} |{' '} */}
            {cardData?.cardType}{' '}
            {cardData?.cardNumber.substr(cardData?.cardNumber.length - 4)}
          </Text>
        </View>
      ) : null}
      <Pressable
        style={GlobalStyle.subList}
        onPress={() => newPaymentCallbBack()}>
        <Text style={GlobalStyle.semiboldTxt}>Select New Payment Method</Text>
        <Icon
          name="keyboard-arrow-right"
          type="MaterialIcons"
          style={{color: COLORS.white}}
        />
      </Pressable>
    </View>
  );
};

export default PaymentCard;
