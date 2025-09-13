import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {PADDING} from '../Constant/Padding';
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Header from '../Components/Header';

const HelpCenter = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />

      <ScrollView>
        <View style={styles.headerSection}>
          <Text style={styles.headTitle}>Help Center</Text>
          <View style={styles.bodyPartSmall}>
            <MaterialIcons
              name="headphones"
              style={{color: COLORS.button, fontSize: moderateScale(25)}}
            />
          </View>
        </View>
        <View style={styles.bodyPart}>
          <Text style={[styles.headSubTitle, {paddingLeft: 20}]}>
            Browse Topics
          </Text>
          <View style={styles.bodySection}>
            <View style={styles.columnDiv}>
              <MaterialCommunityIcons
                name="cart-check"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>Order Related</Text>
            </View>
            <View style={styles.columnDiv}>
              <MaterialCommunityIcons
                name="shopping-outline"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>Shopping</Text>
            </View>
          </View>
          <View style={styles.bodySection}>
            <View style={styles.columnDiv}>
              <MaterialCommunityIcons
                name="account-outline"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>MJ Account</Text>
            </View>
            <View style={styles.columnDiv}>
              <MaterialIcons
                name="payment"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>Payments</Text>
            </View>
          </View>
          <View style={styles.bodySection}>
            <View style={styles.columnDiv}>
              <MaterialIcons
                name="sell"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>Sell On MJ</Text>
            </View>
            <View style={styles.columnDiv}>
              <Ionicons
                name="document-outline"
                style={{color: COLORS.button, fontSize: moderateScale(40)}}
              />
              <Text style={styles.topicText}>Others</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.headSubTitle, {paddingLeft: 10}]}>
              {' '}
              Need more help ?
            </Text>
            <View style={styles.buttonBox}>
              <View style={{width: '20%'}}>
                <MaterialIcons
                  name="wechat"
                  style={{color: COLORS.black, fontSize: moderateScale(30)}}
                />
              </View>
              <View style={{flexDirection: 'column', width: '70%', justifyContent: 'center'}}>
                <Text style={styles.helpButtonTitle}>Chat with us</Text>
                <Text style={styles.helpButtonSubtitle}>
                  Get instant query assistance
                </Text>
              </View>
              <View style={{width: '20%'}}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  style={{color: COLORS.black, fontSize: moderateScale(30)}}
                />
              </View>
            </View>
            <View style={styles.buttonBox}>
              <View style={{width: '20%'}}>
                <MaterialIcons
                  name="headphones"
                  style={{color: COLORS.black, fontSize: moderateScale(30)}}
                />
              </View>
              <View style={{flexDirection: 'column', width: '70%', justifyContent: 'center'}}>
                <Text style={styles.helpButtonTitle}>Get in touch</Text>
              </View>
              <View style={{width: '20%'}}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  style={{color: COLORS.black, fontSize: moderateScale(30)}}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%',
    height: '100%',
  },
  headerSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.content.vertical,
    borderBottomWidth: 1,
    borderColor: COLORS.textInput,
  },
  headTitle: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: moderateScale(30),
    fontWeight: '700',
  },
  headSubTitle: {
    color: COLORS.black,
    fontFamily: FONTS.LightItalic,
    fontSize: moderateScale(18),
    fontWeight: '500',
    marginVertical: 10,
  },
  bodySection: {
    paddingHorizontal: PADDING.margin.small,
    paddingVertical: PADDING.margin.small,
    marginHorizontal: PADDING.margin.small,
    marginVertical: PADDING.margin.small,
    width: moderateScale(320),
    height: verticalScale(140),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyPart: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: moderateScale(320),
    justifyContent: 'space-evenly',
    paddingHorizontal: PADDING.header.horizontal,
    paddingBottom: PADDING.margin.xlarge,
  },
  bodyPartSmall: {
    width: '40%',
    alignItems: 'flex-end',
  },
  columnDiv: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderColor: COLORS.lightgray,
    borderWidth: 2,
    padding: PADDING.margin.small,
    shadowColor: COLORS.theme,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(140),
    height: moderateScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    color: COLORS.black,
    fontFamily: FONTS.LightItalic,
    fontSize: moderateScale(16),
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonBox: {
    marginHorizontal: PADDING.margin.medium,
    marginVertical: PADDING.margin.small,
    padding: PADDING.margin.small,
    backgroundColor: COLORS.white,
    width: moderateScale(300),
    height: moderateScale(60),
    borderRadius: 15,
    borderColor: COLORS.lightgray,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  helpButtonTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: 2,
  },
  helpButtonSubtitle: {
    color: COLORS.gray || '#666666',
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
    fontWeight: '400',
    lineHeight: moderateScale(16),
  },
});
