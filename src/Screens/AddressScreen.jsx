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
  ActivityIndicator,
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
import { CartContext } from '../Context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../Components/axios';

const AddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const {user,loadAuthData, token} = React.useContext(CartContext);
  // Check if this screen was opened from payment screen
  const fromPayment = route.params?.fromPayment || false;
  const currentSelectedAddress = route.params?.selectedAddress || null;

  // Load addresses on component mount
  useFocusEffect(
    React.useCallback(() => {
      console.log('AddressScreen - useFocusEffect triggered, addresses:', addresses.length);
      
      // Always fetch addresses on focus if we don't have any
      if (addresses.length === 0 && !isLoading) {
        console.log('AddressScreen - No addresses, fetching from API');
        fetchAddresses();
      }
      
      // Only fetch addresses if we don't have route params (coming from edit/add)
      if (!route.params?.newAddress && !route.params?.updatedAddress && addresses.length > 0) {
        console.log('AddressScreen - Refreshing addresses from API');
        fetchAddresses();
      }

      // If coming from EditAddress with new address data
      if (route.params?.newAddress) {
        const newAddress = route.params.newAddress;
        console.log('AddressScreen - Received new address:', newAddress);
        setAddresses(prev => [...prev, newAddress]);
        navigation.setParams({ newAddress: null });
      }

      if (route.params?.updatedAddress) {
        const updatedAddress = route.params.updatedAddress;
        console.log('AddressScreen - Received updated address:', updatedAddress);
        setAddresses(prev => {
          const existingIndex = prev.findIndex(addr => addr.id === updatedAddress.id);
          if (existingIndex !== -1) {
            // Update existing address
            const newAddresses = [...prev];
            newAddresses[existingIndex] = updatedAddress;
            console.log('AddressScreen - Updated address at index:', existingIndex);
            return newAddresses;
          } else {
            // Add new address if not found
            console.log('AddressScreen - Adding new address to list');
            return [...prev, updatedAddress];
          }
        });
        navigation.setParams({ updatedAddress: null });
      }

    }, [route.params?.newAddress, route.params?.updatedAddress, navigation, currentSelectedAddress])
  );

  // Component mount effect
  useEffect(() => {
    console.log('AddressScreen - Component mounting...');
    setIsMounted(true);
    return () => {
      console.log('AddressScreen - Component unmounting...');
      setIsMounted(false);
    };
  }, []);

  // Add a useEffect to handle initial load
  useEffect(() => {
    if (!isMounted) return;
    
    console.log('AddressScreen - Component mounted, addresses:', addresses.length, 'isLoading:', isLoading);
    if (addresses.length === 0 && !isLoading) {
      console.log('AddressScreen - No addresses on initial load, fetching...');
      fetchAddresses();
    }
  }, [isMounted, addresses.length, isLoading]);

  // Add a timeout fallback for initial load
  useEffect(() => {
    if (!isMounted) return;
    
    const timeout = setTimeout(() => {
      if (addresses.length === 0 && !isLoading) {
        console.log('AddressScreen - Timeout fallback, forcing address fetch...');
        fetchAddresses();
      }
    }, 2000); // 2 second timeout

    return () => clearTimeout(timeout);
  }, [isMounted]);


  const fetchAddresses = async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('AddressScreen - Already loading, skipping fetch');
      return;
    }
    
    console.log('Fetching addresses from API...');
    try{
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if(!token) console.log('No user token found');

      const config = {
        method: 'GET',
        url: 'get-address',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000, // 15 second timeout
      };
      const response = await axios(config);
      console.log('Fetched addresses:', response.data);
      const rawData = response.data.data;
      if (!rawData) {
        console.log('No address data found in response');
        setAddresses([]);
        return;
      }
      
      const mappedData = rawData.map((addr, index) => {
        // Ensure unique ID - use original ID if valid, otherwise generate unique one
        const uniqueId = addr.id && addr.id.toString().trim() !== '' 
          ? addr.id.toString() 
          : `address_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
          id: uniqueId,
          userId: addr.id,
          buildingNo: addr.building_name,
          contactName: addr.contact_name,
          type: addr.type,
          isDefault: addr.is_default === 1,
          addressLine1: addr.address_line_1,
          addressLine2: addr.address_line_2,
          cityId: addr.cityId,
          stateId: addr.stateId,
          countryId: addr.countryId,
          zipCode: addr.zipcode,
          phone: addr.phone,
        };
      });

      // Ensure no duplicate IDs exist
      const uniqueAddresses = mappedData.map((addr, index) => {
        const existingIds = mappedData.slice(0, index).map(a => a.id);
        if (existingIds.includes(addr.id)) {
          return {
            ...addr,
            id: `${addr.id}_duplicate_${index}_${Date.now()}`
          };
        }
        return addr;
      });

      loadAuthData(uniqueAddresses);
      setAddresses(uniqueAddresses);

      const defaultAddress = uniqueAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }


    }catch (error) {
        console.error("Error fetching addresses:", error);
        if (error.response) {
          console.log("API error:", error.response.data);
        } else {
          console.log("Network/Setup error:", error.message);
        }
        
        // Show error message to user
        Toast.show('Failed to load addresses. Please try again.', Toast.SHORT);
        
        // Keep existing addresses if any, don't clear them
        console.log('AddressScreen - Keeping existing addresses due to API error');
      } finally {
        setIsLoading(false);
      }
  }


  const handleEditAddress = address => {
    console.log('Editing address:', address);
    navigation.navigate('EditAddress', {
      pageTitle: 'Edit Address',
      addressData: address,
      fromAddressScreen: true,
    });
  };

  const handleAddNewAddress = () => {
    console.log('AddressScreen - Navigating to EditAddress for new address');
    navigation.navigate('EditAddress', {
      pageTitle: 'Add New Address',
      fromAddressScreen: true,
    });
  };

  const handleDeleteConfirmation = address => {
    setAddressToDelete(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = async() => {
    console.log('Deleting address:', addressToDelete);
    if (!addressToDelete) {
      setModalVisible(false);
      return;
    }

    setIsDeleting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Toast.show('No auth token found. Please log in again.');
        setModalVisible(false);
        setAddressToDelete(null);
        return;
      }

      const config = {
        method: 'delete',
        url: `/delete-address?addressId=${addressToDelete.id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };
      
      const response = await axios(config);
      console.log('Delete address response:', response.data);
 
      if (response.data.status !== 1) {
        Toast.show(response.data.message || 'Failed to delete address. Please try again.', Toast.SHORT);
        return;
      }

      // Update local state - use functional update to avoid stale closure
      setAddresses(prev => {
        const updatedAddresses = prev.filter(addr => addr.id !== addressToDelete.id);
        
        // Update selected address if needed
        if (selectedAddressId === addressToDelete.id) {
          const remainingAddresses = updatedAddresses;
          setSelectedAddressId(remainingAddresses[0]?.id || null);
        }
        
        return updatedAddresses;
      });
      
      Toast.show('Address deleted successfully!', Toast.SHORT);
      setModalVisible(false);
      setAddressToDelete(null);
      
      // Add a small delay to show the loader and then refresh
      setTimeout(() => {
        fetchAddresses();
      }, 1000);
      
    } catch (error) {
      console.error('Error deleting address:', error);
      console.log('Error details:', error.response ? error.response.data : error.message);
      Toast.show('Failed to delete address. Please try again.', Toast.SHORT);
      setModalVisible(false);
      setAddressToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAddress = address => {
    if (!address || !address.id) {
      console.log('Invalid address object:', address);
      Toast.show('Invalid address selected', Toast.SHORT);
      return;
    }
    
    setSelectedAddressId(address.id);
    if (fromPayment) {
      // Navigate back to payment screen with selected address
      navigation.navigate('Payment', {
        selectedAddress: address,
        grandTotal: route.params?.grandTotal,
      });
    } else {
      // Show confirmation when selecting in manage mode
      const addressType = address.type || address.addressType || 'Home';
      const contactName = address.contactName || 'Unknown';
      Toast.show(`${addressType} address selected for ${contactName}`, Toast.SHORT);
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
            {item.phone}
          </Text>
        </View>

        {!fromPayment && (
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={[
                styles.editButton,
                isSelected && styles.selectedEditButton,
                (isLoading || isDeleting) && styles.disabledButton
              ]}
              onPress={() => handleEditAddress(item)}
              activeOpacity={0.7}
              disabled={isLoading || isDeleting}>
              <View style={[
                styles.buttonIconContainer,
                isSelected && styles.selectedButtonIconContainer
              ]}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={18}
                  color={isSelected ? COLORS.button : COLORS.white}
                />
              </View>
              <Text style={[
                styles.editButtonText,
                isSelected && styles.selectedEditButtonText
              ]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                isSelected && styles.selectedDeleteButton,
                (isLoading || isDeleting) && styles.disabledButton
              ]}
              onPress={() => handleDeleteConfirmation(item)}
              activeOpacity={0.7}
              disabled={isLoading || isDeleting}>
              <View style={[
                styles.buttonIconContainer,
                isSelected && styles.selectedButtonIconContainer
              ]}>
                {isDeleting ? (
                  <ActivityIndicator 
                    size="small" 
                    color={isSelected ? '#FF4444' : COLORS.white} 
                  />
                ) : (
                  <MaterialIcons
                    name="delete-outline"
                    size={18}
                    color={isSelected ? '#FF4444' : COLORS.white}
                  />
                )}
              </View>
              <Text style={[
                styles.deleteButtonText,
                isSelected && styles.selectedDeleteButtonText
              ]}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  // Loading component while fetching addresses or deleting
  if (isLoading || isDeleting) {
    return (
      <LinearGradient colors={COLORS.gradient} style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.button} />
          <Text style={styles.loadingText}>
            {isDeleting ? 'Deleting address...' : 'Loading addresses...'}
          </Text>
        </View>
      </LinearGradient>
    );
  }


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
        data={addresses || []}
        renderItem={renderAddressCard}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.addressList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyAddressContainer}>
            <MaterialIcons name="location-off" size={48} color={COLORS.gray} />
            <Text style={styles.emptyAddressText}>No addresses found</Text>
            <Text style={styles.emptyAddressSubtext}>Add your first address to get started</Text>
          </View>
        )}
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
            
            if (!selectedAddress) {
              Toast.show('Please select an address first', Toast.SHORT);
              return;
            }
            
            navigation.navigate('PaymentMethod', {
              selectedAddress,
              grandTotal: route.params?.grandTotal,
              cartItems: route.params?.cartItems || [],
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
            text: isLoading ? 'Deleting...' : 'Delete',
            func: handleDeleteAddress,
            styles: {
              color: COLORS.white,
              fontSize: 16,
              fontWeight: '600',
              fontFamily: fonts.medium,
              backgroundColor: isLoading ? '#CCCCCC' : '#FF6B6B',
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
    // padding: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.white,
    marginTop: verticalScale(15),
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  headerSection: {
    marginTop: verticalScale(15),
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(15),
    backgroundColor: COLORS.white,
    marginHorizontal: moderateScale(15),
    borderRadius: moderateScale(20),
    elevation: 4,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  screenTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    flex: 1,
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(4),
    paddingHorizontal: moderateScale(5),
  },
  screenSubtitle: {
    fontSize: moderateScale(15),
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(20),
    textAlign: 'center',
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
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(120),
  },
  separator: {
    height: verticalScale(10),
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    elevation: 4,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.08)',
    marginHorizontal: moderateScale(4),
  },
  selectedAddressCard: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.button,
    borderWidth: 2,
    elevation: 8,
    shadowColor: COLORS.button,
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },
  selectableCard: {
    borderWidth: 2,
    borderColor: COLORS.lightbutton,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.button,
    marginLeft: moderateScale(6),
    fontFamily: FONTS.Medium,
  },
  defaultBadge: {
    backgroundColor: COLORS.green,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    marginLeft: moderateScale(6),
    elevation: 2,
    shadowColor: COLORS.green,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  defaultBadgeText: {
    color: COLORS.white,
    fontSize: moderateScale(9),
    fontWeight: '600',
    fontFamily: FONTS.Bold,
  },
  addressDetails: {
    marginBottom: verticalScale(10),
  },
  contactName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: verticalScale(4),
  },
  addressLine: {
    fontSize: moderateScale(13),
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(2),
  },
  phoneNumber: {
    fontSize: moderateScale(13),
    color: COLORS.grey,
    fontFamily: FONTS.Medium,
    marginTop: verticalScale(4),
    fontWeight: '500',
  },
  selectedAddressText: {
    color: COLORS.black,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.button,
    elevation: 4,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.button,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: '#FF4444',
    elevation: 4,
    shadowColor: '#FF4444',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  buttonIconContainer: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(6),
  },
  editButtonText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    letterSpacing: 0.5,
  },
  deleteButtonText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    letterSpacing: 0.5,
  },
  selectedEditButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.button,
    transform: [{ scale: 1.05 }],
  },
  selectedDeleteButton: {
    backgroundColor: COLORS.white,
    borderColor: '#FF4444',
    transform: [{ scale: 1.05 }],
  },
  selectedEditButtonText: {
    color: COLORS.button,
  },
  selectedDeleteButtonText: {
    color: '#FF4444',
  },
  selectedButtonIconContainer: {
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#CCCCCC',
  },
  emptyAddressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
    paddingHorizontal: moderateScale(20),
  },
  emptyAddressText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.black,
    marginTop: verticalScale(16),
    fontFamily: FONTS.Bold,
  },
  emptyAddressSubtext: {
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginTop: verticalScale(8),
    textAlign: 'center',
    fontFamily: FONTS.Regular,
  },
  addNewAddressButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(24),
    padding: moderateScale(22),
    elevation: 8,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
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
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.button,
    marginLeft: moderateScale(10),
    fontFamily: FONTS.Bold,
  },
  continueButton: {
    position: 'absolute',
    bottom: verticalScale(25),
    left: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: COLORS.button,
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    elevation: 8,
    shadowColor: COLORS.button,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  continueButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
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
