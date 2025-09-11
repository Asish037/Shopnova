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

const ProfileSettings = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <View style={styles.headerSection}>
        <Text style={styles.hedaerUserName}>{'Hey,\nJohn Henry'}</Text>
        <Image
          style={{
            width: moderateScale(95),
            height: moderateScale(95),
            borderRadius: moderateScale(50),
            borderWidth: 4,
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
                navigation.navigate('EditProfile');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Manage Account</Text>
                  <Text style={styles.headSubTitle}>
                    Manage your profile information
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="account-edit-outline"
                    size={30}
                    style={{color: COLORS.button, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddressScreen');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Manage Address</Text>
                  <Text style={styles.headSubTitle}>
                    Manage your address information
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialIcons
                    name="add-location-alt"
                    size={30}
                    style={{color: COLORS.button, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Privacy');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Terms and Conditions</Text>
                  <Text style={styles.headSubTitle}>
                    Explore terms and conditions related to your Shopnova accounts
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={30}
                    style={{color: COLORS.button, fontSize: moderateScale(30)}}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AccountDelete');
              }}>
              <View style={styles.bodySection}>
                <View style={styles.bodyPart}>
                  <Text style={styles.headTitle}>Delete Account</Text>
                  <Text style={styles.headSubTitle}>
                    Your account will no longer be accessible to use on any
                    device
                  </Text>
                </View>
                <View style={styles.bodyPartSmall}>
                  <MaterialCommunityIcons
                    name="delete-forever"
                    size={30}
                    style={{color: COLORS.button, fontSize: moderateScale(30)}}
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

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    paddingBottom: 20,
  },
  hedaerUserName: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(25),
    fontWeight: '700',
  },
  headTitle: {
    color: COLORS.black,
    fontFamily: FONTS.title,
    fontSize: moderateScale(25),
    fontWeight: '700',
  },
  headSubTitle: {
    color: COLORS.grey,
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
