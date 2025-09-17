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
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {PADDING} from '../Constant/Padding';
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
    pincode: addressData?.zipCode || addressData?.zipcode || addressData?.pincode || '',
    houseNumber: addressData?.houseNumber || addressData?.addressLine1 || '',
    roadName: addressData?.roadName || addressData?.addressLine2 || '',
    contactName: addressData?.contactName || '',
    phoneNumber: addressData?.phoneNumber || addressData?.phone || '',
    addressType: addressData?.type || addressData?.addressType || 'Home',
    isDefault: addressData?.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Check if we need to fetch address details
    const initializeData = async () => {
      // If we have addressData, we're editing - no need to fetch
      if (addressData) {
        console.log('Editing existing address:', addressData);
        setIsFetchingDetails(false);
        return;
      }

      // If no addressData, we're creating new - show loading briefly
      setIsFetchingDetails(true);
      try {
        // Simulate API call delay for new address
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsFetchingDetails(false);
      } catch (error) {
        console.error('Error initializing new address:', error);
        setIsFetchingDetails(false);
      }
    };

    initializeData();

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

  // Update form data when addressData changes
  useEffect(() => {
    if (addressData) {
      console.log('Address data received:', addressData); // Debug log
      setFormData({
        pincode: addressData?.zipCode || addressData?.zipcode || addressData?.pincode || '',
        houseNumber: addressData?.houseNumber || addressData?.addressLine1 || '',
        roadName: addressData?.roadName || addressData?.addressLine2 || '',
        contactName: addressData?.contactName || '',
        phoneNumber: addressData?.phoneNumber || addressData?.phone || '',
        addressType: addressData?.type || addressData?.addressType || 'Home',
        isDefault: addressData?.isDefault || false,
      });
    }
  }, [addressData]);

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
        address_line_1: formData.houseNumber,
        address_line_2: formData.roadName,
        cityId: null,
        countryId: null,
        stateId: null,
        zipcode: formData.pincode,
        phone: formData.phoneNumber,
        contact_name: formData.contactName, 
        type: formData.addressType,
        is_default: formData.isDefault ? 1 : 0,
      };


      const response = await axios.put('/update-address', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('API response:', response.data);

      Toast.show('Address updated successfully!', Toast.SHORT);

      if (response.data && response.data.data) {
        const res = response.data.data;

        const updated = {
          id: res.id,
          userId: res.userId,
          addressLine1: res.address_line_1 || "",
          addressLine2: res.address_line_2 || "",
          contactName: res.contact_name || "",
          phoneNumber: res.phone || "",
          type: res.type || "Home",
          isDefault: res.is_default === 1,
          zipcode: res.zipcode || "",
        };

        if (fromAddressScreen) {
          navigation.navigate('AddressScreen', { updatedAddress: updated });
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert("Error", "Invalid response from server");
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

  // Loading component for fetching details
  if (isFetchingDetails) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={COLORS.gradient} style={styles.container}>
          <Header />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.button} />
            <Text style={styles.loadingText}>
              {addressData ? 'Loading address details...' : 'Preparing form...'}
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <StatusBar
        backgroundColor={COLORS.gradientButton[1]}
        barStyle="light-content"
        /> */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}>
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim}]}>
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

                <View style={{marginBottom: 25}}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      marginBottom: verticalScale(8),
                      color: COLORS.black,
                      fontFamily: fonts.bold,
                      letterSpacing: 0.3,
                    }}>
                    Pincode:
                  </Text>
                  <TextInput
                    style={{
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E8E8E8',
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: moderateScale(16),
                      borderRadius: moderateScale(14),
                      fontSize: moderateScale(16),
                      color: COLORS.black,
                      fontFamily: fonts.regular,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
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

                <View style={{marginBottom: 25}}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      marginBottom: verticalScale(8),
                      color: COLORS.black,
                      fontFamily: fonts.bold,
                      letterSpacing: 0.3,
                    }}>
                    House/Flat/Building No.:
                  </Text>
                  <TextInput
                    style={{
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E8E8E8',
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: moderateScale(16),
                      borderRadius: moderateScale(14),
                      fontSize: moderateScale(16),
                      color: COLORS.black,
                      fontFamily: fonts.regular,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
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

                <View style={{marginBottom: 25}}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      marginBottom: verticalScale(8),
                      color: COLORS.black,
                      fontFamily: fonts.bold,
                      letterSpacing: 0.3,
                    }}>
                    Road Name/Area/Colony:
                  </Text>
                  <TextInput
                    style={{
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E8E8E8',
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: moderateScale(16),
                      borderRadius: moderateScale(14),
                      fontSize: moderateScale(16),
                      color: COLORS.black,
                      fontFamily: fonts.regular,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
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
                      color={formData.isDefault ? COLORS.orange : COLORS.grey}
                    />
                    <Text
                      style={[
                        styles.defaultToggleText,
                        { color: formData.isDefault ? COLORS.orange : COLORS.black },
                      ]}>
                      {formData.isDefault ? "Default address" : "Set as default address"}
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

                <View style={{marginBottom: 25}}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      marginBottom: verticalScale(8),
                      color: COLORS.black,
                      fontFamily: fonts.bold,
                      letterSpacing: 0.3,
                    }}>
                    Contact Name:
                  </Text>
                  <TextInput
                    style={{
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E8E8E8',
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: moderateScale(16),
                      borderRadius: moderateScale(14),
                      fontSize: moderateScale(16),
                      color: COLORS.black,
                      fontFamily: fonts.regular,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
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

                <View style={{marginBottom: 25}}>
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      marginBottom: verticalScale(8),
                      color: COLORS.black,
                      fontFamily: fonts.bold,
                      letterSpacing: 0.3,
                    }}>
                    Phone Number:
                  </Text>
                  <TextInput
                    style={{
                      height: 60,
                      borderWidth: 2,
                      borderColor: '#E8E8E8',
                      backgroundColor: '#FAFAFA',
                      paddingHorizontal: moderateScale(16),
                      borderRadius: moderateScale(14),
                      fontSize: moderateScale(16),
                      color: COLORS.black,
                      fontFamily: fonts.regular,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
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
                    style={styles.saveButton}
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
    marginTop: Platform.OS === 'android' ? 10 : 20,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%',
    height: '100%',
    // backgroundColor: 'white',
    // backgroundColor: COLORS.gradient[0], // Set background color to match gradient start
  },
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.header.horizontal,
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.white,
    marginTop: PADDING.margin.medium,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    paddingBottom: verticalScale(120),
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(25),
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(20),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(4),
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
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.button,
    marginLeft: moderateScale(8),
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: verticalScale(20),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginHorizontal: moderateScale(4),
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
  inputLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: verticalScale(8),
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
  textInput: {
    height: 60,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(14),
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: fonts.regular,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(30),
    paddingHorizontal: moderateScale(16),
  },
  saveButton: {
    width: '95%',
    height: verticalScale(65),
    borderRadius: moderateScale(20),
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: 'center',
  },
  buttonContainerKeyboard: {
    paddingBottom: verticalScale(5),
  },
  addressTypeContainer: {
    marginBottom: verticalScale(25),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginHorizontal: moderateScale(4),
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
  addressTypeButtons: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    justifyContent: 'space-between',
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(12),
    marginHorizontal: moderateScale(4),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(14),
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedAddressType: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.button,
    shadowColor: COLORS.button,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  addressTypeText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.grey,
    marginLeft: moderateScale(6),
    fontFamily: fonts.bold,
  },
  selectedAddressTypeText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  defaultToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(18),
    paddingHorizontal: moderateScale(20),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(25),
    marginHorizontal: moderateScale(4),
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
  defaultToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultToggleText: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: moderateScale(8),
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
  toggleSwitch: {
    width: moderateScale(56),
    height: verticalScale(32),
    backgroundColor: '#E8E8E8',
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.button,
    shadowColor: COLORS.button,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleIndicator: {
    width: moderateScale(26),
    height: moderateScale(26),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(13),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  toggleIndicatorActive: {
    transform: [{translateX: moderateScale(26)}],
  },
});
