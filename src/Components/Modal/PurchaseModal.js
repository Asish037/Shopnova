import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Icon, ScrollView } from 'react-native';
import { COLORS } from '../../Constant/Colors';
import { FONTS } from '../../Constant/Font';
import Navigation from '../../Service/Navigation';
// import { Icon } from 'native-base';
import { moderateScale, verticalScale } from '../../PixelRatio';

export default function CloseButton(props) {

  const [Split, setSplit] = useState(true)

  return (
   
    <View style={{flex:1,justifyContent:'center',backgroundColor:'#0e293547'}}>
    <View style={{backgroundColor:COLORS.white,padding: 20,margin:30,borderRadius:20,paddingBottom: 30,}}>
      <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'space-between',marginBottom:25}}>
         <Text style={{fontFamily:FONTS.Bold,color:COLORS.black,fontSize:15}}>
           Purchase Authentication
         </Text>
         <TouchableOpacity onPress={()=>props.close()}>
         <Icon
         name="cross"
         type="Entypo"
         />
         </TouchableOpacity>
      </View>

     <ScrollView>
       
       <View style={styles.listView}>
          <Text style={styles.title}>
              Tickets / Reservation
          </Text>
          <Text style={styles.value}>
            $125
          </Text>
       </View>

       <View style={styles.listView}>
          <Text style={styles.title}>
              Additional Orders
          </Text>
          <Text style={styles.value}>
            $20
          </Text>
       </View>

       <View style={styles.listView}>
          <Text style={styles.title}>
              Tax
          </Text>
          <Text style={styles.value}>
            $225
          </Text>
       </View>

       <View style={styles.listView}>
          <Text style={styles.title}>
              Promotion Savings
          </Text>
          <Text style={styles.value}>
            - $10
          </Text>
       </View>

       <View style={styles.listView}>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold}]}>
              Sub Total
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold}]}>
            $370
          </Text>
       </View>

       <Pressable 
       onPress={()=>setSplit(!Split)}
       style={styles.listView}>
          <Text style={styles.title}>
              View Splitups
          </Text>
          <Icon 
            name={Split ? "arrow-drop-up" : "arrow-drop-down"}
            type="MaterialIcons"
            style={{opacity:.5}}
          />
       </Pressable>
     {Split ? 
      <>
       <View style={styles.SplitlistView}>
          <Text style={styles.value}>
              01. James Robert
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold,color:COLORS.orange}]}>
            Pending Sign
          </Text>
       </View>

       <View style={styles.SplitlistView}>
          <Text style={styles.value}>
              01. William David
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold,color:COLORS.orange}]}>
            Incomplete Sign up
          </Text>
       </View>

       <View style={styles.SplitlistView}>
          <Text style={styles.value}>
              03. Richard Joesph
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold,color:COLORS.green}]}>
            Confirmed
          </Text>
       </View>


       <View style={styles.SplitlistView}>
          <Text style={styles.value}>
              04. Charles
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold,color:COLORS.green}]}>
            Confirmed
          </Text>
       </View>
       </> 
       : null }


       <View style={[styles.listView,{marginTop:moderateScale(15),marginBottom:moderateScale(15)}]}>
          <Text style={[styles.value,{fontFamily:FONTS.SemiBold}]}>
              Total
          </Text>
          <Text style={[styles.value,{fontFamily:FONTS.title,color:COLORS.theme,fontSize:moderateScale(15)}]}>
            $370
          </Text>
       </View>
      

       <TouchableOpacity 
       onPress={()=>{props.close();Navigation.navigate('MakeReservation')}}
       style={{height:verticalScale(50),backgroundColor:COLORS.button,
       justifyContent:'center',alignItems:'center',borderRadius:5}}>
           <Text 
           style={{fontFamily:FONTS.title,color:COLORS.white,fontSize:15}}>
               VIEW ORDERS
           </Text>
       </TouchableOpacity>
       </ScrollView> 
    </View>
</View>
  );
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:3
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
  value: {fontFamily: FONTS.Regular, color: COLORS.black, fontSize: moderateScale(12)},
});
