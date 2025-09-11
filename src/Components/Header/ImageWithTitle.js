import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import { COLORS } from '../../Constant/Colors';
import { FONTS } from '../../Constant/Font';
import { moderateScale } from '../../PixelRatio';

const {width} = Dimensions.get('window');

export default function ImageWithTitle(props) {
  return (
    <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
        {/* <Image 
        style={{width: width/2,resizeMode:'contain'}}
        source={require('../../assets/logo.png')}
        /> */}
        <Text style={{color:COLORS.button,fontFamily:FONTS.Bold,fontSize:moderateScale(25),
        marginBottom:moderateScale(25),textAlign:'center'}}>
            {props.title}
        </Text>
     </View>
  );
}
