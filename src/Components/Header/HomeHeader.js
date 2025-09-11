import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Icon, Pressable} from 'react-native';
// import {Icon} from 'native-base';
import {moderateScale, verticalScale} from '../../PixelRatio';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import Navigation from '../../Service/Navigation';
import {useSelector} from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
// import {useTheme} from '../../Context/ThemeContext';
// import ThemeSelectionModal from '../Modal/ThemeSelectionModal';

export default function HomeHeader({arrowPress, ...props}) {
  const {userData, guestLogin} = useSelector(state => state.User);
  // const {currentTheme, isDarkTheme} = useTheme();
  // const [showThemeModal, setShowThemeModal] = useState(false);

  // console.log("userData",userData)

  const goToProfile = async () => {
    // if (guestLogin) {
    //   SimpleToast.show('You need to login to view profile!');
    //   return;
    // } else {
    Navigation.navigate('MyAccount');
    // }
  };

  // const toggleThemeModal = () => {
  //   setShowThemeModal(!showThemeModal);
  // };

  return (
    <View
      style={{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: verticalScale(50),
        alignSelf: 'center',
        marginTop: 30,
      }}>
      <TouchableOpacity onPress={goToProfile}>
        <Icon
          name="user-circle"
          type="FontAwesome"
          style={{color: COLORS.white, fontSize: moderateScale(25)}}
        />
      </TouchableOpacity>
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center', maxWidth: '60%'}}
        onPress={arrowPress}>
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.white,
            fontFamily: FONTS.Medium,
            fontSize: moderateScale(17),
          }}>
          {props.title}
        </Text>
        {props.icon ? (
          <Icon
            name="keyboard-arrow-down"
            type="MaterialIcons"
            style={{color: COLORS.white}}
          />
        ) : null}
      </Pressable>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
        {/* Theme Toggle Button - Temporarily Disabled */}
        {/* <TouchableOpacity onPress={toggleThemeModal}>
          <Icon
            name={isDarkTheme ? "sunny" : "moon"}
            type="Ionicons"
            style={{color: COLORS.white, fontSize: moderateScale(22)}}
          />
        </TouchableOpacity> */}
        
        {/* Chat Button */}
        <TouchableOpacity onPress={() => Navigation.navigate('ChatList')}>
          <Icon
            name="email"
            type="MaterialCommunityIcons"
            style={{color: COLORS.white, fontSize: moderateScale(25)}}
          />
        </TouchableOpacity>
      </View>
      
      {/* Theme Selection Modal - Temporarily Disabled */}
      {/* <ThemeSelectionModal 
        visible={showThemeModal} 
        onClose={() => setShowThemeModal(false)} 
      /> */}
    </View>
  );
}
