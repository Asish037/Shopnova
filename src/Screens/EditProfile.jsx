import React, {useState, useContext, useEffect} from 'react';
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
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import GradientButton from '../Components/Button/GradientButton';
import Toast from 'react-native-simple-toast';
import CustomInput from '../Components/CustomInput';
import Header from '../Components/Header';
import {CartContext} from '../Context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';
import qs from 'qs';
import ImagePicker from 'react-native-image-crop-picker';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const EditProfile = () => {
  const navigation = useNavigation();
  const {user, login} = useContext(CartContext);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [email, setemail] = useState(
    user?.email || 'zerodegreecoder@gmail.com',
  );
  const [mobileNumber, setMobileNumber] = useState(
    user?.phone || '9876543209',
  );
  const [fname, setFname] = useState(user?.fname || '');
  const [lname, setLname] = useState(user?.lname || '');
  
  // Debug user data
  console.log('EditProfile - User data:', user);
  console.log('EditProfile - fname:', user?.fname, 'lname:', user?.lname);
  const [fullname, setFullname] = useState(
    user?.fullname || 
    (user?.fname && user?.lname ? `${user.fname} ${user.lname}` : '') ||
    user?.name || 'John Henry'
  );

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      console.log('EditProfile - Updating form fields with user data:', user);
      setFname(user.fname || '');
      setLname(user.lname || '');
      setemail(user.email || '');
      setMobileNumber(user.phone || '');
      
      // Combine fname and lname into fullname for the form
      const combinedName = user.fullname || 
        (user.fname && user.lname ? `${user.fname} ${user.lname}` : '') ||
        user.name || '';
      setFullname(combinedName);
      
      setProfileImageUri(user.img || user.profileImage || null);
    }
  }, [user]);

  // Refresh user data when screen is focused - fetch fresh data from API
  useFocusEffect(
    React.useCallback(() => {
      console.log('EditProfile focused, fetching fresh user data...');
      fetchFreshUserData();
    }, [])
  );

  // Function to fetch fresh user data from API
  const fetchFreshUserData = async () => {
    try {
      setIsRefreshing(true);
      console.log('EditProfile - Fetching fresh user data from API...');
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('EditProfile - No auth token found');
        setIsRefreshing(false);
        return;
      }

      const response = await axios.get('/get-profile', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('EditProfile - Fresh API response:', response.data);
      
      if (response.data && response.data.data) {
        const freshUserData = {
          id: response.data.data.id,
          fname: response.data.data.fname || '',
          lname: response.data.data.lname || '',
          fullname: `${response.data.data.fname || ''} ${response.data.data.lname || ''}`.trim(),
          email: response.data.data.email || '',
          phone: response.data.data.phone || '',
          img: response.data.data.img || null,
        };

        console.log('EditProfile - Fresh user data:', freshUserData);
        
        // Update form fields with fresh data
        setFname(freshUserData.fname);
        setLname(freshUserData.lname);
        setemail(freshUserData.email);
        setMobileNumber(freshUserData.phone);
        setFullname(freshUserData.fullname);
        setProfileImageUri(freshUserData.img);
        
        // Update context with fresh data
        await login(freshUserData);
      }
    } catch (error) {
      console.error('EditProfile - Error fetching fresh user data:', error);
      // Fallback to existing user data if API fails
      if (user) {
        console.log('EditProfile - Using existing user data as fallback');
        setFname(user.fname || '');
        setLname(user.lname || '');
        setemail(user.email || '');
        setMobileNumber(user.phone || '');
        
        const combinedName = user.fullname || 
          (user.fname && user.lname ? `${user.fname} ${user.lname}` : '') ||
          user.name || '';
        setFullname(combinedName);
        
        setProfileImageUri(user.img || user.profileImage || null);
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  const [disabled, setdisabled] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(
    user?.img || user?.profileImage || null
  );
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [profileImageType, setProfileImageType] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Preload the static image for faster loading
  React.useEffect(() => {
    if (!profileImageUri) {
      // Preload the static image
      Image.prefetch(Image.resolveAssetSource(require('../assets/account.png')).uri);
    }
  }, [profileImageUri]);

    const saveDetails = async () => {
      console.log('profile_img', profileImageUri);
      if (!email || !mobileNumber || !fullname) {
        Toast.show('Please fill all required fields!');
        return;
      }

      // Client-side email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Toast.show('Please enter a valid email address');
        return;
      }

      // Client-side mobile number validation
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNumber.replace(/\D/g, ''))) {
        Toast.show('Please enter a valid 10-digit mobile number');
        return;
      }

      setdisabled(true);

      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Toast.show('No auth token found. Please log in again.');
          setdisabled(false);
          return;
        }

        // Split fullname into fname + lname
        const [firstName, ...lastNameParts] = fullname.trim().split(" ");
        const fnameValue = firstName || "";
        const lnameValue = lastNameParts.join(" ") || "NA";
        // Add proper data URI prefix to base64 data
        let profile_img;
        if (profileImageBase64 && profileImageType) {
          // Use the MIME type directly from the image picker
          profile_img = `data:${profileImageType};base64,${profileImageBase64}`;
          console.log('=== Profile Image Data for API ===');
          console.log('Using base64 data with prefix:', !!profileImageBase64);
          console.log('Image MIME type:', profileImageType);
          console.log('Final data URI length:', profile_img.length);
          console.log('Data URI preview:', profile_img.substring(0, 50) + '...');
        } else {
          console.log('No new image selected, keeping existing profile image');
          // Don't send profile_img if no new image was selected
          // This will keep the existing profile image on the server
          profile_img = null; // or omit this field entirely
        }
        
        const data_to_pass = {
          fname: fnameValue,
          lname: lnameValue,
          email: email,
          phone: mobileNumber, 
        };
        
        // Only include profile_img if a new image was selected
        if (profile_img) {
          data_to_pass.profile_img = profile_img;
        }
        console.log('data_to_pass', data_to_pass);
        const config = {
          method: 'put',
          url: '/update-profile',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          data: data_to_pass,
        };

        const response = await axios(config);
        console.log(response.data);

        if (response.data.status === 1) {
          const backendUser = response.data.data;

          // Build frontend-friendly object
          const updatedUserData = {
            ...backendUser,
            fullname: `${backendUser.fname || ""} ${backendUser.lname || ""}`.trim(),
            phone: backendUser.phone, // keep backend key
            mobileNumber: backendUser.phone, // keep your frontend key too
            profileImage: backendUser.profileImage || profileImageUri || "", // keep local image handling
          };

          await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
          await login(updatedUserData);

          setdisabled(false);
          Toast.show('Profile Updated Successfully!', Toast.LONG);

          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        } else {
          // Handle validation errors
          if (response.data.errors) {
            const errorMessages = [];
            Object.keys(response.data.errors).forEach(field => {
              if (response.data.errors[field] && response.data.errors[field].length > 0) {
                errorMessages.push(`${field}: ${response.data.errors[field][0]}`);
              }
            });
            const errorText = errorMessages.join('\n');
            Toast.show(errorText || response.data.message || 'Validation failed');
          } else {
            Toast.show(response.data.message || 'Failed to update profile');
          }
          setdisabled(false);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        
        // Handle different types of errors
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.errors) {
            // Handle validation errors from catch block
            const errorMessages = [];
            Object.keys(errorData.errors).forEach(field => {
              if (errorData.errors[field] && errorData.errors[field].length > 0) {
                errorMessages.push(`${field}: ${errorData.errors[field][0]}`);
              }
            });
            const errorText = errorMessages.join('\n');
            Toast.show(errorText || errorData.message || 'Validation failed');
          } else {
            Toast.show(errorData.message || 'Failed to update profile');
          }
        } else if (error.message) {
          Toast.show(error.message);
        } else {
          Toast.show('Failed to update profile. Please try again.');
        }
        
        setdisabled(false);
      }
  };


  // No need for manual base64 conversion - react-native-image-crop-picker provides it directly

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        let permission;

        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        }

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Gallery Permission',
          message: 'We need access to your gallery to let you choose a profile photo',
          buttonPositive: 'OK',
        });

        console.log('Gallery permission result:', granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Toast.show(
            'Permission permanently denied. Please enable it in app settings.',
            Toast.LONG,
          );
          Linking.openSettings(); // opens system settings for your app
          return false;
        } else {
          Toast.show('Gallery permission denied.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS - Let the image picker handle permissions automatically
      // The Info.plist already has NSPhotoLibraryUsageDescription
      console.log('iOS - Using image picker built-in permission handling');
      return true; // Let image picker handle the permission request
    }
  };


  // Image picker using react-native-image-crop-picker
  const handleImagePicker = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Toast.show('Gallery permission is required to select a profile image.');
      return;
    }

    try {
      console.log('Opening image picker with react-native-image-crop-picker...');
      
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: true, // This gives us base64 data directly!
        compressImageQuality: 0.7,
        cropping: false, // Set to true if you want cropping functionality
      });

      console.log('✅ Image selected successfully!');
      console.log('Image URI:', image.path);
      console.log('Image base64 available:', !!image.data);
      console.log('Base64 length:', image.data ? image.data.length : 'N/A');
    
      // Set both URI and base64 data
      setProfileImageUri(image.path);
      setProfileImageBase64(image.data);
      setProfileImageType(image.mime || 'image/jpeg'); // Store the MIME type
      
      Toast.show('Profile image updated locally. Save changes to upload.');
      
    } catch (error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log('User cancelled image picker');
      } else {
        console.error('❌ Error with image picker:', error);
        Toast.show('Error picking image. Please try again.');
      }
    }
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
              <Text style={styles.subText}>
                {isRefreshing ? 'Refreshing profile data...' : "Let's update your profile"}
              </Text>
              {isRefreshing && (
                <ActivityIndicator 
                  size="small" 
                  color={COLORS.button} 
                  style={styles.refreshIndicator}
                />
              )}
            </View>
          </View>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={profileImageUri ? {uri: profileImageUri} : require('../assets/account.png')}
                style={styles.profileImage}
                resizeMode="cover"
                defaultSource={Platform.OS === 'ios' ? require('../assets/account.png') : undefined}
                onLoadStart={() => {
                  console.log('Image loading started');
                  setImageLoading(true);
                }}
                onLoadEnd={() => {
                  console.log('Image loading completed');
                  setImageLoading(false);
                }}
                onError={(error) => {
                  console.log('Image loading error:', error);
                  setImageLoading(false);
                  // Fallback to static image on error
                  if (profileImageUri) {
                    setProfileImageUri(null);
                  }
                }}
              />
              {imageLoading && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="small" color={COLORS.button} />
                </View>
              )}
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
                    onChangeText={setFullname}
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
                    editable={false}
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
    marginTop: Platform.OS === 'android' ? 10 : 20,
    width: '100%',
    height: '100%',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(18),
    marginHorizontal: moderateScale(6),
    marginTop: verticalScale(12),
    borderRadius: moderateScale(16),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.button,
  },
  profileInfo: {
    flex: 1,
  },
  greetingContainer: {
    marginRight: moderateScale(10),
    alignItems: 'flex-start', // Align text to the left
  },
  greetingText: {
    fontSize: moderateScale(15),
    fontFamily: FONTS.Regular,
    marginBottom: verticalScale(4),
    color: COLORS.grey,
    letterSpacing: 0.3,
  },
  userName: {
    fontSize: moderateScale(24),
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontWeight: '700',
    marginBottom: verticalScale(4),
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: moderateScale(13),
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    letterSpacing: 0.2,
  },
  refreshIndicator: {
    marginTop: verticalScale(4),
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageWrapper: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
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
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(35),
  },
  editImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  editImageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: verticalScale(15),
  },
  scrollContent: {
    paddingBottom: verticalScale(130), // Add padding for bottom button
    flexGrow: 1,
  },
  formContainer: {
    marginHorizontal: moderateScale(6),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    fontWeight: '700',
    marginBottom: verticalScale(20),
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: verticalScale(15),
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    marginBottom: verticalScale(18),
  },
  inputLabel: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontWeight: '600',
    marginBottom: verticalScale(8),
    letterSpacing: 0.3,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: moderateScale(12),
    fontSize: moderateScale(18),
    color: COLORS.button,
  },
  textInput: {
    height: 55,
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: moderateScale(8),
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
    borderRadius: moderateScale(18),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelButtonText: {
    color: COLORS.grey,
    fontSize: moderateScale(17),
    fontFamily: FONTS.Bold,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.button,
    borderRadius: moderateScale(18),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
    fontSize: moderateScale(17),
    fontFamily: FONTS.Bold,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(20),
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    shadowColor: COLORS.button,
    shadowOffset: {width: 0, height: -6},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 74, 0, 0.1)',
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