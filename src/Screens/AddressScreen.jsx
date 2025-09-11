import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale, verticalScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {fonts} from '../utils/fonts';
import CustomAlert from '../Components/Modal/CustomAlert';
import Header from '../Components/Header';

const AddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Check if this screen was opened from payment screen
  const fromPayment = route.params?.fromPayment || false;
  const currentSelectedAddress = route.params?.selectedAddress || null;

  // Load addresses on component mount
  useFocusEffect(
    React.useCallback(() => {
      // Sample addresses data -
      const sampleAddresses = [
        {
          id: '1',
          type: 'Home',
          contactName: 'John Henry',
          addressLine1: '132 My Street, Kingston',
          addressLine2: 'New York 12401',
          phoneNumber: '9876543210',
          isDefault: true,
        },
        {
          id: '2',
          type: 'Office',
          contactName: 'John Henry',
          addressLine1: '45 Business Plaza, Manhattan',
          addressLine2: 'New York 10001',
          phoneNumber: '9876543210',
          isDefault: false,
        },
      ];

      const loadAddresses = () => {
        // Simulate API call
        setAddresses(sampleAddresses);
        setSelectedAddressId(
          currentSelectedAddress?.id || sampleAddresses[0]?.id,
        );
      };

      loadAddresses();
      // If coming from EditAddress with new address data
      if (route.params?.newAddress) {
        const newAddress = route.params.newAddress;
        setAddresses(prev => [...prev, newAddress]);
        // Clear the params to prevent re-adding
        navigation.setParams({newAddress: null});
      }
      // If coming from EditAddress with updated address
      if (route.params?.updatedAddress) {
        const updatedAddress = route.params.updatedAddress;
        setAddresses(prev =>
          prev.map(addr =>
            addr.id === updatedAddress.id ? updatedAddress : addr,
          ),
        );
        navigation.setParams({updatedAddress: null});
      }
    }, [
      route.params?.newAddress,
      route.params?.updatedAddress,
      navigation,
      currentSelectedAddress,
    ]),
  );

  const handleEditAddress = address => {
    navigation.navigate('EditAddress', {
      pageTitle: 'Edit Address',
      addressData: address,
      fromAddressScreen: true,
    });
  };

  const handleAddNewAddress = () => {
    navigation.navigate('EditAddress', {
      pageTitle: 'Add New Address',
      fromAddressScreen: true,
    });
  };

  const handleDeleteConfirmation = address => {
    setAddressToDelete(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete.id));
      if (selectedAddressId === addressToDelete.id) {
        const remainingAddresses = addresses.filter(
          addr => addr.id !== addressToDelete.id,
        );
        setSelectedAddressId(remainingAddresses[0]?.id || null);
      }
      Toast.show('Address deleted successfully!', Toast.SHORT);
      setModalVisible(false);
      setAddressToDelete(null);
    }
  };

  const handleSelectAddress = address => {
    setSelectedAddressId(address.id);
    if (fromPayment) {
      // Navigate back to payment screen with selected address
      navigation.navigate('Payment', {
        selectedAddress: address,
        grandTotal: route.params?.grandTotal,
      });
    } else {
      // Show confirmation when selecting in manage mode
      Toast.show(`${address.type} address selected`, Toast.SHORT);
    }
  };

  const renderAddressCard = ({item}) => {
    const isSelected = selectedAddressId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          isSelected && styles.selectedAddressCard,
          fromPayment && styles.selectableCard,
        ]}
        onPress={() => handleSelectAddress(item)}
        activeOpacity={0.7}>
        <View style={styles.addressCardHeader}>
          <View style={styles.addressTypeContainer}>
            <MaterialIcons
              name={item.type === 'Home' ? 'home' : 'business'}
              size={20}
              color={isSelected ? COLORS.black : COLORS.blue}
            />
            <Text
              style={[
                styles.addressType,
                isSelected && styles.selectedAddressText,
              ]}>
              {item.type}
            </Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          {isSelected && fromPayment && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.blue} />
          )}
        </View>

        <View style={styles.addressDetails}>
          <Text
            style={[
              styles.contactName,
              isSelected && styles.selectedAddressText,
            ]}>
            {item.contactName}
          </Text>
          <Text
            style={[
              styles.addressLine,
              isSelected && styles.selectedAddressText,
            ]}>
            {item.addressLine1}
          </Text>
          <Text
            style={[
              styles.addressLine,
              isSelected && styles.selectedAddressText,
            ]}>
            {item.addressLine2}
          </Text>
          <Text
            style={[
              styles.phoneNumber,
              isSelected && styles.selectedAddressText,
            ]}>
            {item.phoneNumber}
          </Text>
        </View>

        {!fromPayment && (
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButtonWithText}
              onPress={() => handleEditAddress(item)}>
              <MaterialCommunityIcons
                name="pencil"
                size={18}
                color={isSelected ? COLORS.white : COLORS.button}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isSelected && styles.selectedActionText,
                ]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonWithText}
              onPress={() => handleDeleteConfirmation(item)}>
              <MaterialIcons
                name="delete-outline"
                size={18}
                color={isSelected ? COLORS.white : COLORS.red || '#FF6B6B'}
              />
              <Text
                style={[
                  styles.actionButtonTextDelete,
                  isSelected && styles.selectedActionText,
                ]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />

      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>
            {fromPayment ? 'Select Delivery Address' : 'Manage Addresses'}
          </Text>
          {/* {!fromPayment && selectedAddressId && (
            <TouchableOpacity
              style={styles.headerEditButton}
              onPress={() => {
                const selectedAddress = addresses.find(
                  addr => addr.id === selectedAddressId,
                );
                if (selectedAddress) {
                  handleEditAddress(selectedAddress);
                }
              }}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={COLORS.white}
              />
              <Text style={styles.headerEditText}>Edit Selected</Text>
            </TouchableOpacity>
          )} */}
        </View>
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
        <Text style={styles.screenSubtitle}>
          {fromPayment
            ? 'Choose where you want your order delivered'
            : 'Add, edit or delete your saved addresses'}
        </Text>
        </View>
       
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        renderItem={renderAddressCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.addressList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Add New Address Button */}
      {!fromPayment && (
        <TouchableOpacity
          style={styles.addNewAddressButton}
          onPress={handleAddNewAddress}>
          <View style={styles.addNewAddressContent}>
            <MaterialIcons name="add" size={24} color={COLORS.button} />
            <Text style={styles.addNewAddressText}>Add New Address</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Floating Edit Button */}
      {/* {!fromPayment && selectedAddressId && (
        <TouchableOpacity
          style={styles.floatingEditButton}
          onPress={() => {
            const selectedAddress = addresses.find(
              addr => addr.id === selectedAddressId,
            );
            if (selectedAddress) {
              handleEditAddress(selectedAddress);
            }
          }}>
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      )} */}

      {/* Continue Button */}
      {fromPayment && selectedAddressId && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            const selectedAddress = addresses.find(
              addr => addr.id === selectedAddressId,
            );
            navigation.navigate('PaymentMethod', {
              selectedAddress,
              grandTotal: route.params?.grandTotal,
            });
          }}>
          <Text style={styles.continueButtonText}>
            Continue with Selected Address
          </Text>
        </TouchableOpacity>
      )}

      {/* Messages custom */}
      <CustomAlert
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={'Delete Address'}
        message={`Are you sure you want to delete this address?\n\n${addressToDelete?.addressLine1}`}
        android={{
          container: {
            backgroundColor: COLORS.white,
          },
          title: {
            color: COLORS.black,
            fontFamily: fonts.medium,
            fontSize: 18,
            fontWeight: '600',
          },
          message: {
            color: COLORS.gray || '#666',
            fontFamily: fonts.regular,
            fontSize: 14,
            fontWeight: '400',
          },
        }}
        ios={{
          container: {
            backgroundColor: COLORS.white,
          },
          title: {
            color: COLORS.black,
            fontFamily: fonts.medium,
            fontSize: 18,
            fontWeight: '600',
          },
          message: {
            color: COLORS.gray || '#666',
            fontFamily: fonts.regular,
            fontSize: 14,
            fontWeight: '400',
          },
        }}
        buttons={[
          {
            text: 'Cancel',
            styles: {
              color: COLORS.button,
              fontSize: 16,
              fontWeight: '500',
              fontFamily: fonts.medium,
            },
          },
          {
            text: 'Delete',
            func: handleDeleteAddress,
            styles: {
              color: COLORS.white,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: fonts.medium,
              backgroundColor: '#FF6B6B',
            },
          },
        ]}
      />
    </LinearGradient>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    height: '100%',
  },
  headerSection: {
    marginTop: verticalScale(10),
    paddingHorizontal: moderateScale(15),
    paddingBottom: verticalScale(20),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  screenTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    flex: 1,
  },
  subtitleContainer: {
    alignItems: 'flex-start',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(10),
  },
  screenSubtitle: {
    fontSize: moderateScale(14),
    color: '#212020ff',
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(18),
    textAlign: 'left',
    fontWeight: '400',
  },
  headerEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.button,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerEditText: {
    color: COLORS.white,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontFamily: FONTS.Medium,
    marginLeft: moderateScale(4),
  },
  addressList: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: verticalScale(100),
  },
  separator: {
    height: verticalScale(10),
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedAddressCard: {
    backgroundColor: COLORS.lightbutton,
    borderColor: COLORS.lightbutton,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  selectableCard: {
    borderWidth: 2,
    borderColor: COLORS.lightbutton,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.blue,
    marginLeft: moderateScale(8),
    fontFamily: FONTS.Medium,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    marginLeft: moderateScale(8),
  },
  defaultBadgeText: {
    color: COLORS.white,
    fontSize: moderateScale(10),
    fontWeight: '500',
    fontFamily: FONTS.Medium,
  },
  addressDetails: {
    marginBottom: verticalScale(10),
  },
  contactName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    marginBottom: verticalScale(3),
  },
  addressLine: {
    fontSize: moderateScale(14),
    color: COLORS.gray || '#666',
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(2),
  },
  phoneNumber: {
    fontSize: moderateScale(14),
    color: COLORS.gray || '#666',
    fontFamily: FONTS.Regular,
    marginTop: verticalScale(4),
  },
  selectedAddressText: {
    color: COLORS.black,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: moderateScale(7),
    marginLeft: moderateScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  actionButtonWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    marginLeft: moderateScale(8),
    borderRadius: moderateScale(15),
    backgroundColor: 'rgba(0,0,0,0.08)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  actionButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: COLORS.button,
    marginLeft: moderateScale(4),
    fontFamily: FONTS.Medium,
  },
  actionButtonTextDelete: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: COLORS.red || '#FF6B6B',
    marginLeft: moderateScale(4),
    fontFamily: FONTS.Medium,
  },
  selectedActionText: {
    color: COLORS.white,
  },
  addNewAddressButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(30),
    right: moderateScale(30),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: COLORS.button,
    borderStyle: 'dashed',
  },
  addNewAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewAddressText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.button,
    marginLeft: moderateScale(8),
    fontFamily: FONTS.Medium,
  },
  continueButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: COLORS.DarkPink,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONTS.Medium,
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: verticalScale(100),
    right: moderateScale(20),
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: COLORS.button,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});
