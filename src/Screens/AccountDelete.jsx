import React, {useState} from 'react';
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
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../utils/fonts';
import GradientButton from '../Components/Button/GradientButton';

const AccountDelete = () => {
  const navigation = useNavigation();
  const [disabled, setdisabled] = useState(false);
  const pressed = () => {
    console.log('hello');
  };
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headContainer}>
          <Text style={styles.titleHead}>Delect Account</Text>
          <Text style={styles.subHead}>
            We are sad to see you go! Before proceeding to delete. Please note
            that you will lose access to the following features :
          </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.imgCard}>
            <MaterialCommunityIcons
              name="wallet"
              size={30}
              style={{color: COLORS.button, fontSize: moderateScale(30)}}
            />
          </View>
          <View style={styles.bodyPart}>
            <Text style={styles.subHead}>MJ Wallet Balance</Text>
            <Text style={styles.subHead}>
              You will not be able to use balance in your MJ wallet
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.imgCard}>
            <MaterialCommunityIcons
              name="star"
              size={30}
              style={{color: COLORS.button, fontSize: moderateScale(30)}}
            />
          </View>
          <View style={styles.bodyPart}>
            <Text style={styles.subHead}>Reward Points</Text>
            <Text style={styles.subHead}>
              You will not be able to use or redeem rewards points
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.imgCard}>
            <MaterialCommunityIcons
              name="account"
              size={30}
              style={{color: COLORS.button, fontSize: moderateScale(30)}}
            />
          </View>
          <View style={styles.bodyPart}>
            <Text style={styles.subHead}>MJ Account</Text>
            <Text style={styles.subHead}>
              Your acciunt will no longer be accessible to the use on any device
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.imgCard}>
            <MaterialIcons
              name="manage-history"
              size={30}
              style={{color: COLORS.button, fontSize: moderateScale(30)}}
            />
          </View>
          <View style={styles.bodyPart}>
            <Text style={styles.subHead}>Orders History</Text>
            <Text style={styles.subHead}>
              Pervious orders cannot be accessed
            </Text>
          </View>
        </View>
        <View style={styles.bottomSec}>
          <GradientButton
            title="Delete Account"
            onPress={pressed}
            disabled={disabled}
          />
          <Text style={styles.subHead}> No, i don't want to delete </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AccountDelete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    alignContent: 'center',
  },
  headContainer: {
    margin: 10,
  },
  titleHead: {
    alignContent: 'center',
    color: COLORS.black,
    fontWeight: '800',
    fontFamily: fonts.bold,
    fontSize: 30,
    textDecorationLine: 'underline',
    paddingBottom: 5,
  },
  subHead: {
    alignContent: 'center',
    color: COLORS.black,
    fontWeight: '400',
    fontFamily: fonts.regular,
    fontSize: 15,
    flexWrap: 'wrap',
    paddingBottom: 5,
  },
  bodyContainer: {
    width: '90%',
    height: verticalScale(120),
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
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  bodyPartSmall: {
    width: '30%',
    alignItems: 'flex-start',
  },
  imgCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 8,
    shadowColor: COLORS.theme,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(50),
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSec: {
    padding: 5,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
