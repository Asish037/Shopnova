import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {PADDING} from '../Constant/Padding';
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import GradientButton from '../Components/Button/GradientButton';
import Toast from 'react-native-simple-toast';
import CustomInput from '../Components/CustomInput';
import Header from '../Components/Header';
import {CartContext} from '../Context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import qs from 'qs';

const EditProfile = () => {
  const navigation = useNavigation();
  const {user, login} = useContext(CartContext);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [email, setemail] = useState(
    user?.email || 'zerodegreecoder@gmail.com',
  );
  const [mobileNumber, setMobileNumber] = useState(
    user?.mobileNumber || '9876543209',
  );
  const [fullname, SetFullname] = useState(user?.fullname || 'John Henry');
  const [disabled, setdisabled] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(
    user?.profileImage ||
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE_5aeaS13y24e1D7KBOIPNUwGflPnLR8AuQQUQ6tHDnycRg_2woHNm3fX1K_UYtxizZw&usqp=CAU',
  );

  const saveDetails = async () => {
    if (!email || !mobileNumber || !fullname) {
      Toast.show('Please fill all required fields!');
      return;
    }

    setdisabled(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('User token:', token); // Debug log
      if (!token) {
        Toast.show('No auth token found. Please log in again.');
        setdisabled(false);
        return;
      }

      // Make API call to update profile
      const config = {
        method: 'put',
        url: '/update-profile',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        data: {
          email: email,
          mobileNumber: mobileNumber,
          fullname: fullname,
          profileImage: profileImageUri,
        },
      };

      const response = await axios(config);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show('Failed to update profile. Please try again.');
      setdisabled(false);
      return;
    }

    // let updatedUserData = reponse.data

    let updatedUserData = {
      ...user,
      email: email,
      mobileNumber: mobileNumber,
      fullname: fullname,
      profileImage: profileImageUri,
    };

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

      // Update context
      await login(updatedUserData);

      setdisabled(false);
      Toast.show('Profile Updated Successfully!', Toast.LONG);

      // Navigate back or to main screen
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      setdisabled(false);
      Toast.show('Failed to save profile. Please try again.');
      console.error('Error saving profile:', error);
    }
  };

  const handleImagePicker = () => {
    // Here you can add image picker logic
    Toast.show('Image picker functionality to be implemented');
  };

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#bf284e" /> */}
      <LinearGradient colors={COLORS.gradient} style={styles.container}>
        <Header />

        {/* Profile Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.userName}>{fullname}</Text>
              <Text style={styles.subText}>Let's update your profile</Text>
            </View>
          </View>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={{uri: profileImageUri}}
                style={styles.profileImage}
              />
              <LinearGradient
                colors={['rgba(194, 54, 54, 0.8)', 'rgba(194, 54, 54, 0.6)']}
                style={styles.imageOverlay}
              />
            </View>
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImagePicker}
              activeOpacity={0.8}>
              <LinearGradient
                colors={COLORS.gradientButton}
                style={styles.editImageGradient}>
                <Ionicons name="camera" color={COLORS.white} size={14} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputFieldContainer}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={16}
                    color={COLORS.black}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#a0a0a0"
                    value={fullname}
                    onChangeText={SetFullname}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputFieldContainer}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={16}
                    color={COLORS.black}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#a0a0a0"
                    value={email}
                    onChangeText={setemail}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputFieldContainer}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={16}
                    color={COLORS.black}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#a0a0a0"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button Container - Fixed Position */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, disabled && styles.disabledButton]}
            onPress={saveDetails}
            disabled={disabled}
            activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>
              {disabled ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%',
    height: '100%',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.content.vertical,
    marginHorizontal: PADDING.margin.medium,
    marginTop: PADDING.margin.medium,
    borderRadius: moderateScale(15),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flex: 1,
  },
  greetingContainer: {
    marginRight: moderateScale(10),
    alignItems: 'flex-start', // Align text to the left
  },
  greetingText: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Regular,
    marginBottom: PADDING.margin.small,
    color: '#666666',
  },
  userName: {
    fontSize: moderateScale(22),
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontWeight: '700',
    marginBottom: PADDING.margin.small,
  },
  subText: {
    fontSize: moderateScale(14),
    color: '#666666',
    fontFamily: FONTS.Regular,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  editImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editImageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: verticalScale(10),
  },
  scrollContent: {
    paddingBottom: verticalScale(120), // Add padding for bottom button
    flexGrow: 1,
  },
  formContainer: {
    marginHorizontal: PADDING.header.horizontal,
    borderRadius: moderateScale(15),
    padding: PADDING.content.vertical,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    fontWeight: '700',
    marginBottom: PADDING.margin.medium,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: verticalScale(15),
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    marginBottom: PADDING.margin.medium,
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontWeight: '600',
    marginBottom: PADDING.margin.small,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: moderateScale(12),
    paddingHorizontal: PADDING.margin.medium,
    paddingVertical: PADDING.margin.small,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: PADDING.margin.medium,
    fontSize: moderateScale(22),
    color: COLORS.button,
  },
  textInput: {
    height: 50,
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: PADDING.margin.small,
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: FONTS.Regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
    marginTop: verticalScale(10),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: moderateScale(14),
    paddingVertical: PADDING.content.vertical,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: moderateScale(16),
    fontFamily: FONTS.Bold,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.button,
    borderRadius: moderateScale(14),
    paddingVertical: PADDING.content.vertical,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Added to ensure proper positioning context
    minHeight: verticalScale(50), // Added minimum height to ensure button is tall enough
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: FONTS.Bold,
    fontWeight: '600',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: PADDING.header.horizontal,
    paddingVertical: PADDING.content.vertical,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: PADDING.margin.medium,
  },

  // Legacy styles (can be removed if not used elsewhere)
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
    margin: 10,
  },
  isHighlighted: {
    borderColor: 'green',
  },
  editIcon: {
    position: 'absolute',
    top: 90,
    right: 30,
    height: 30,
    width: 30,
    backgroundColor: COLORS.white,
    borderColor: COLORS.button,
    borderWidth: 2,
    borderRadius: 15,
  },
  profilePicture: {
    borderRadius: 50,
    width: '100%',
    marginTop: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  picture: {
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 60,
    borderColor: COLORS.button,
    borderWidth: 2,
  },
  profileHeaderPicCircle: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    color: 'white',
    backgroundColor: COLORS.white,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
  iosTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iosTextStyle: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: FONTS.SemiBold,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'red', // Temporary debug background
  },
  iosFallbackText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: FONTS.SemiBold,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'red', // Temporary debug background
  },
});
