import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Header from '../Components/Header';

const ViewProfile = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <View style={styles.headerSection}>
        <Text style={styles.hedaerUserName}>{'Hey,\nJohn Henry'}</Text>
        <Image
          style={{
            width: moderateScale(55),
            height: moderateScale(55),
            borderRadius: moderateScale(50),
            borderWidth: 3,
            borderColor: COLORS.button,
            marginBottom: 5,
          }}
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE_5aeaS13y24e1D7KBOIPNUwGflPnLR8AuQQUQ6tHDnycRg_2woHNm3fX1K_UYtxizZw&usqp=CAU',
          }}
        />
      </View>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Orders');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Orders</Text>
                  <Text style={styles.headSubTitle}>
                    Check your order Status(track,return etc)
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Orders');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Payments Methods</Text>
                  <Text style={styles.headSubTitle}>
                    Manage your saved payment methods
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialIcons
                    name="payment"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MyWishList');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Wishlist</Text>
                  <Text style={styles.headSubTitle}>
                    Buy from items saved in Wishlist
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProfileSettings');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Profile</Text>
                  <Text style={styles.headSubTitle}>
                    Edit/update your profile details & more
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <FontAwesome
                    name="user-o"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MyCoupons');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>My Coupons</Text>
                  <Text style={styles.headSubTitle}>
                    Browse coupons to get discount on Nykaa
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="wallet-giftcard"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('HelpCenter');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Help Center</Text>
                  <Text style={styles.headSubTitle}>
                    FAQs, Live Chat, Customer Support
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={30}
                    style={{color: COLORS.black, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </LinearGradient>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headerSection: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    paddingBottom: 15,
  },
  hedaerUserName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginTop: 5,
  },
  headTitle: {
    color: COLORS.button,
    fontFamily: FONTS.title,
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  headSubTitle: {
    color: COLORS.black,
    fontFamily: FONTS.LightItalic,
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
  body: {
    alignItems: 'center',
  },
  bodySection: {
    width: '90%',
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  bodyPart: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'space-evenly',
  },
  bodyPartSmall: {
    width: '30%',
    alignItems: 'flex-end',
  },
});
