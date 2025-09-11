import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Icon, StyleSheet, TextInput, ScrollView } from 'react-native';
import { COLORS } from '../../Constant/Colors';
import { FONTS } from '../../Constant/Font';
import Navigation from '../../Service/Navigation';
// import { Icon } from 'native-base';
import { moderateScale, verticalScale } from '../../PixelRatio';
import NormalButton from '../Button/NormalButton';
import GlobalStyles from '../GlobalStyle';

export default function InviteModal(props) {


  return (
   
    <View style={GlobalStyles.modalMainView}>
    <View style={GlobalStyles.modalContainer}>
      <View style={GlobalStyles.modalHeader}>
         <Text style={GlobalStyles.modalTitle}>
           Invite
         </Text>
         <TouchableOpacity onPress={()=>props.close()}>
         <Icon
         name="cross"
         type="Entypo"
         />
         </TouchableOpacity>
      </View>

       <TextInput 
        placeholder="Search name, email, phone number"
        style={{borderWidth:.4,borderColor:COLORS.textInput,height:40,borderRadius:5,paddingLeft:15,marginBottom:10}}
       />

       <NormalButton 
       title={props.buttonTitle}
       onPress={()=>{props.close(true);}} />
    </View>
</View>
  );
}

const styles = StyleSheet.create({

});
