import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

import {COLORS} from '../Constant/Colors';

const CustomButton = (props) => {
  const style = {};
  if (props.type === 'fill') {
    style.backgroundColor = COLORS.blue;
    style.borderWidth = 0;
  } else if (props.type === 'default') {
    style.borderColor = COLORS.blue;
  } else if (props.type === 'link') {
    style.borderWidth = 0;
  }
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          borderWidth: 1,
          borderRadius: 3,
          alignSelf: 'flex-start',
        },
        style,
        props.buttonStyle,
        props.disabled ? { opacity: 0.5 } : {},
      ]}>
      <Text style={[{ textTransform: 'uppercase', fontSize: 12, color: COLORS.blue }, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

CustomButton.defaultProps = {
  type: 'default',
  disabled: false,
};

CustomButton.propTypes = {
  type: ['default', 'fill', 'link'],
  buttonStyle: {},
  textStyle: {},
  disabled: false,
  onPress: () => {},
  text: '',
};

export default CustomButton;

