import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import GradientButton from '../Components/Button/GradientButton';
import Toast from 'react-native-simple-toast';
import {fonts} from '../utils/fonts';
import Header from '../Components/Header';
import axios from '../Components/axios'
import qs from 'qs';
import asyncStorage from '@react-native-async-storage/async-storage';

const EditAddress = ({route}) => {
  const navigation = useNavigation();
  const addressData = route.params?.addressData;
  const fromAddressScreen = route.params?.fromAddressScreen;
  const pageTitle = route.params?.pageTitle || 'Edit Address';

  const [formData, setFormData] = useState({
    pincode: addressData?.pincode || '',
    houseNumber: addressData?.houseNumber || '',
    roadName: addressData?.roadName || '',
    contactName: addressData?.contactName || '',
    phoneNumber: addressData?.phoneNumber || '',
    addressType: addressData?.type || 'Home',
    isDefault: addressData?.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Animate screen entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [fadeAnim]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House/Flat number is required';
    }

    if (!formData.roadName.trim()) {
      newErrors.roadName = 'Road/Area name is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveNewAddress = async () => {
    console.log('Save button pressed!'); // Debug log
    if (!validateForm()) {
      Toast.show('Please fill all required fields correctly!', Toast.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      const token =  await asyncStorage.getItem('userToken');
      console.log('User token:', token); // Debug log
      if (!token) {
      Alert.alert("Error", "No auth token found. Please log in again.");
      setIsLoading(false);
      return;
    }


      //  payload in backend format
      const payload = {
        id: addressData?.id || Date.now().toString(),
        userId: addressData?.userId,
        address_line_1: `${formData.houseNumber}, ${formData.roadName}`,
        address_line_2: formData.pincode,
        cityId: null,
        countryId: null,
        stateId: null,
        zipcode: formData.pincode,
        phone: formData.phoneNumber,
      };

      const response = await axios.put('/update-address', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('API response:', response.data);

      Toast.show('Address updated successfully!', Toast.SHORT);

      if (fromAddressScreen) {
        navigation.navigate('AddressScreen', { updatedAddress: response.data });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // const CustomHeader = () => (
  // <View style={styles.headerContainer}>
  // <TouchableOpacity
  // style={styles.backButton}
  // onPress={() => navigation.goBack()}>
  // <Ionicons name="arrow-back" size={24} color={COLORS.white} />
  // </TouchableOpacity>
  // <Text style={styles.headerTitle}>{pageTitle}</Text>
  // <View style={styles.headerRightSpace} />
  // </View>
  // );

  const InputField = ({
    icon,
    label,
    placeholder,
    keyboardType,
    value,
    onChangeText,
    error,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey}
        keyboardType={keyboardType}
        value={value}
        onChangeText={text => {
          console.log('Text changed:', text, 'for field:', label);
          onChangeText(text);
        }}
        editable={true}
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize="words"
        onFocus={() => {
          console.log('TextInput FOCUSED:', label);
        }}
        onBlur={() => {
          console.log('TextInput BLURRED:', label);
        }}
        onPressIn={() => {
          console.log('TextInput PRESSED IN:', label);
        }}
        testID={`textInput-${label}`}
        accessible={true}
        accessibilityLabel={`${label} input field`}
        pointerEvents="auto"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <StatusBar
        backgroundColor={COLORS.gradientButton[1]}
        barStyle="light-content"
        /> */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}>
        <Animated.View style={[styles.animatedContainer, {opacity: fadeAnim}]}>
          <LinearGradient colors={COLORS.gradient} style={styles.container}>
            <Header />

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}>
              <View style={styles.formContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color={COLORS.black}
                  />
                  <Text style={styles.sectionTitle}>Address Details</Text>
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 5,
                      color: COLORS.black,
                    }}>
                    Pincode:
                  </Text>
                  <TextInput
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 16,
                      color: COLORS.black,
                    }}
                    placeholder="Enter 6-digit pincode"
                    keyboardType="numeric"
                    value={formData.pincode}
                    onChangeText={value => handleInputChange('pincode', value)}
                    editable={true}
                    pointerEvents="auto"
                  />
                  {errors.pincode ? (
                    <Text style={styles.errorText}>{errors.pincode}</Text>
                  ) : null}
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 5,
                      color: COLORS.black,
                    }}>
                    House/Flat/Building No.:
                  </Text>
                  <TextInput
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 16,
                      color: COLORS.black,
                    }}
                    placeholder="Enter house/flat number"
                    keyboardType="default"
                    value={formData.houseNumber}
                    onChangeText={value =>
                      handleInputChange('houseNumber', value)
                    }
                    editable={true}
                    pointerEvents="auto"
                  />
                  {errors.houseNumber ? (
                    <Text style={styles.errorText}>{errors.houseNumber}</Text>
                  ) : null}
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 5,
                      color: COLORS.black,
                    }}>
                    Road Name/Area/Colony:
                  </Text>
                  <TextInput
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 16,
                      color: COLORS.black,
                    }}
                    placeholder="Enter road name or area"
                    keyboardType="default"
                    value={formData.roadName}
                    onChangeText={value => handleInputChange('roadName', value)}
                    editable={true}
                    pointerEvents="auto"
                  />
                  {errors.roadName ? (
                    <Text style={styles.errorText}>{errors.roadName}</Text>
                  ) : null}
                </View>

                {/* Address Type Selector */}
                <View style={styles.addressTypeContainer}>
                  <Text style={styles.sectionTitle}>Address Type</Text>
                  <View style={styles.addressTypeButtons}>
                    {['Home', 'Office', 'Other'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.addressTypeButton,
                          formData.addressType === type &&
                            styles.selectedAddressType,
                        ]}
                        onPress={() => handleInputChange('addressType', type)}>
                        <MaterialIcons
                          name={
                            type === 'Home'
                              ? 'home'
                              : type === 'Office'
                              ? 'business'
                              : 'location-on'
                          }
                          size={20}
                          color={
                            formData.addressType === type
                              ? COLORS.white
                              : COLORS.orange
                          }
                        />
                        <Text
                          style={[
                            styles.addressTypeText,
                            formData.addressType === type &&
                              styles.selectedAddressTypeText,
                          ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Default Address Toggle */}
                <TouchableOpacity
                  style={styles.defaultToggleContainer}
                  onPress={() =>
                    handleInputChange('isDefault', !formData.isDefault)
                  }>
                  <View style={styles.defaultToggleLeft}>
                    <MaterialIcons
                      name="star"
                      size={20}
                      color={COLORS.white}
                    />
                    <Text style={styles.defaultToggleText}>
                      Set as default address
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.toggleSwitch,
                      formData.isDefault && styles.toggleSwitchActive,
                    ]}>
                    <View
                      style={[
                        styles.toggleIndicator,
                        formData.isDefault && styles.toggleIndicatorActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="contact-phone"
                    size={24}
                    color={COLORS.black}
                  />
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 5,
                      color: COLORS.black,
                    }}>
                    Contact Name:
                  </Text>
                  <TextInput
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 16,
                      color: COLORS.black,
                    }}
                    placeholder="Enter contact person name"
                    keyboardType="default"
                    value={formData.contactName}
                    onChangeText={value =>
                      handleInputChange('contactName', value)
                    }
                    editable={true}
                    pointerEvents="auto"
                  />
                  {errors.contactName ? (
                    <Text style={styles.errorText}>{errors.contactName}</Text>
                  ) : null}
                </View>

                <View style={{marginBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 5,
                      color: COLORS.black,
                    }}>
                    Phone Number:
                  </Text>
                  <TextInput
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderColor: COLORS.grey,
                      backgroundColor: COLORS.white,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      fontSize: 16,
                      color: COLORS.black,
                    }}
                    placeholder="Enter 10-digit phone number"
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={value =>
                      handleInputChange('phoneNumber', value)
                    }
                    editable={true}
                    pointerEvents="auto"
                  />
                  {errors.phoneNumber ? (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  ) : null}
                </View>

                {/* Save Button inside ScrollView */}
                <View style={styles.buttonContainer}>
                  <GradientButton
                    title={isLoading ? 'Saving...' : 'Save Address'}
                    onPress={saveNewAddress}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      borderRadius: moderateScale(15),
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gradient[0], // Set background color to match gradient start
  },
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingBottom: verticalScale(100),
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(25),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    paddingHorizontal: moderateScale(5),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: moderateScale(8),
    fontFamily: fonts.medium,
  },
  inputContainer: {
    marginBottom: verticalScale(15),
    backgroundColor: 'transparent',
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: verticalScale(8),
    fontFamily: fonts.medium,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontFamily: fonts.regular,
  },
  inputIcon: {
    marginRight: moderateScale(10),
  },
  errorText: {
    fontSize: moderateScale(12),
    color: COLORS.red,
    marginTop: verticalScale(5),
    marginLeft: moderateScale(15),
    fontFamily: fonts.regular,
  },
  buttonContainer: {
    // Remove absolute positioning
    alignItems: 'center', // center the button
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(15),
  },
  saveButton: {
    width: '80%',
    borderRadius: moderateScale(15),
    // paddingVertical: verticalScale(12),
  },
  buttonContainerKeyboard: {
    paddingBottom: verticalScale(5),
  },
  addressTypeContainer: {
    marginBottom: verticalScale(20),
  },
  addressTypeButtons: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(5),
    marginRight: moderateScale(8),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: COLORS.button,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedAddressType: {
    backgroundColor: COLORS.button,
  },
  addressTypeText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.black,
    marginLeft: moderateScale(6),
    fontFamily: fonts.medium,
  },
  selectedAddressTypeText: {
    color: COLORS.white,
  },
  defaultToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(13),
    paddingHorizontal: moderateScale(12),
    // backgroundColor: COLORS.white,
    backgroundColor: 'transparent',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(20),
    // elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    // width: 0,
    // height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  defaultToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultToggleText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: COLORS.black,
    marginLeft: moderateScale(8),
    fontFamily: fonts.medium,
  },
  toggleSwitch: {
    width: moderateScale(40),
    height: verticalScale(15),
    backgroundColor: '#dcb1b1ff',
    borderRadius: moderateScale(13),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(2),
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.black,
  },
  toggleIndicator: {
    width: moderateScale(22),
    height: moderateScale(22),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(11),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleIndicatorActive: {
    transform: [{translateX: moderateScale(24)}],
  },
});
