// import {Icon} from 'native-base';
import React from 'react';
import {Text, TouchableOpacity, View, Icon} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import GlobalStyles from '../GlobalStyle';

export default function ThankYouModal(props) {
  const {title, subtitle} = props;

  return (
    <View style={GlobalStyles.modalMainView}>
      <View style={GlobalStyles.modalContainer}>
        <View style={[GlobalStyles.modalHeader, {marginBottom: 10}]}>
          <Text style={GlobalStyles.modalTitle}>Thank You</Text>
          <TouchableOpacity onPress={() => props.close()}>
            <Icon name="cross" type="Entypo" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONTS.Regular,
            fontSize: moderateScale(11.5),
            opacity: 0.7,
            marginBottom: 10,
          }}>
          Welcome to Tabyt! A verification email has been sent to your email
          address provided. Please follow the steps in the email to verify your
          email.
        </Text>
      </View>
    </View>
  );
}
