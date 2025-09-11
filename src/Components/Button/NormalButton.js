import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import GlobalStyles from '../GlobalStyle';

export default function NormalButton({
  disabled,
  onPress,
  style,
  title,
  titleStyle,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[GlobalStyles.modalBut, {...style}]}>
      {disabled ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text style={{...GlobalStyles.modalButTxt, ...titleStyle}}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
