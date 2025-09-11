import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import CustomImageBackground from '../../Component/ImageBackground/CustomImageBackground';

const { width, height } = Dimensions.get('window');


export default function Loading() {


  return (
   <CustomImageBackground>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Image 
            style={{width: width/1.5,resizeMode:'contain'}}
            source={require('../../assets/logo.png')}
            />
        </View>
     </CustomImageBackground> 
  );
}

