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
                      alignSelf: 'center',
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
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
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
    paddingHorizontal: PADDING.header.horizontal,
    paddingTop: PADDING.margin.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: PADDING.margin.medium,
    marginBottom: PADDING.margin.xlarge,
    paddingBottom: PADDING.margin.medium,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(245, 74, 0, 0.2)',
    paddingHorizontal: PADDING.margin.small,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
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
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.button,
    marginLeft: PADDING.margin.medium,
    fontFamily: fonts.bold,
  },
  inputContainer: {
    marginBottom: PADDING.margin.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: PADDING.margin.small,
    fontFamily: fonts.bold,
  },
  textInput: {
    height: 55,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: PADDING.content.horizontal,
    borderRadius: moderateScale(12),
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: fonts.regular,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginTop: PADDING.margin.xlarge,
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.header.horizontal,
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
    marginBottom: PADDING.margin.xlarge,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(12),
    padding: PADDING.content.vertical,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addressTypeButtons: {
    flexDirection: 'row',
    marginTop: PADDING.margin.medium,
  },
  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.content.vertical,
    paddingHorizontal: PADDING.margin.small,
    marginRight: PADDING.margin.small,
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: COLORS.button,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAddressType: {
    backgroundColor: COLORS.button,
  },
  addressTypeText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: PADDING.margin.small,
    fontFamily: fonts.bold,
  },
  selectedAddressTypeText: {
    color: COLORS.white,
  },
  defaultToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: PADDING.content.vertical,
    paddingHorizontal: PADDING.content.horizontal,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(12),
    marginBottom: PADDING.margin.xlarge,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  defaultToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultToggleText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: PADDING.margin.small,
    fontFamily: fonts.bold,
  },
  toggleSwitch: {
    width: moderateScale(50),
    height: verticalScale(28),
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(2),
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.button,
  },
  toggleIndicator: {
    width: moderateScale(24),
    height: moderateScale(24),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  toggleIndicatorActive: {
    transform: [{translateX: moderateScale(24)}],
  },
});
