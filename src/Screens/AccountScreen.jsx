import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
// import {useTheme} from '../Context/ThemeContext';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {CartContext} from '../Context/CartContext';
import {useAuth} from '../hooks/useAuth';
import axios from '../Components/axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CartContext } from '../Context/CartContext';


const AccountScreen = () => {
  const navigation = useNavigation();
  const {user, loadAuthData, token} = useContext(CartContext);
  console.log("user AccountScreen", user);
  const { isAuthenticated, logout, getUserName, getUserPhone } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  // const {getThemeColors} = useTheme();
  // const themeColors = getThemeColors();
  // const {user, token , loadUserData} = useContext(CartContext);
  // Reload user data whenever this screen comes into focus

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try{
  //     setIsLoading(true);
      
  //     const token = await AsyncStorage.getItem('authToken'); 

  //     // const config = {
  //     //   method: 'get',
  //     //   url: '/get-profile',
  //     //   headers: {
  //     //     'Accept': 'application/json',
  //     //     "Authorization": `Bearer ${token}`,
  //     //   },
  //     //   // data: qs.stringify({}),
  //     // }
  //     // const response = await axios(config);
  //     const response = await axios.get('get-profile', {
  //       headers: {
  //         Authorization: `Bearer ${JSON.parse(user)}`,
  //       },
  //     });
 
  //     console.log("User data:", response.data);

  //     const mappedData = {
  //       id: response.data.id,
  //       fullname: `${response.data.fname} ${response.data.lname}`,
  //       email: response.data.email,
  //       phone: response.data.phone,
  //     }

  //     loadUserData(mappedData);

  //   }catch(error){
  //       if (error.response) {
  //         console.log("API error:", error.response.data);
  //       } else {
  //         console.log("Network/Setup error:", error.message);
  //       }
  //   }finally{
  //     setIsLoading(false);
  //   }
  // }


  //   fetchUserData();
  // }, [loadUserData]);


  useFocusEffect(
    React.useCallback(() => {
      console.log('AccountScreen focused, fetching user data...');
      fetchUserData();
    }, [])
  );



    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log(`[${Platform.OS}] Starting fetchUserData...`);

        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log(`[${Platform.OS}] No auth token found in storage`);
          setIsLoading(false);
          return;
        }
        
        console.log(`[${Platform.OS}] Fetching user data with token:`, token.substring(0, 20) + '...');
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
        });

        const apiPromise = axios.get('/get-profile', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);

        console.log(`[${Platform.OS}] Full Axios response:`, response);
        console.log(`[${Platform.OS}] Raw API data:`, response.data.data);
        console.log(`[${Platform.OS}] Profile image URL:`, response.data?.data?.img);

        const mappedData = {
          id: response.data?.data?.id,
          fname: response.data?.data?.fname || '',
          lname: response.data?.data?.lname || '',
          fullname: `${response.data?.data?.fname || ''} ${response.data?.data?.lname || ''}`.trim(),
          email: response.data?.data?.email || '',
          phone: response.data?.data?.phone || '',
          img: response.data?.data?.img || null,
        };

        console.log(`[${Platform.OS}] Mapped user data:`, mappedData);

        // Ensure we have at least some data
        if (mappedData.id || mappedData.email) {
          loadAuthData(mappedData, token);
          console.log(`[${Platform.OS}] User data loaded successfully`);
        } else {
          console.log(`[${Platform.OS}] No valid user data found in API response`);
        }

      } catch (error) {
        console.log(`[${Platform.OS}] API call failed:`, error.message);
        if (error.response) {
          console.log(`[${Platform.OS}] API error response:`, error.response.data);
        } else {
          console.log(`[${Platform.OS}] Network/Setup error:`, error.message);
        }
        
        // Try to load existing data from AsyncStorage as fallback
        try {
          const existingUserData = await AsyncStorage.getItem('userData');
          if (existingUserData) {
            const parsedData = JSON.parse(existingUserData);
            console.log(`[${Platform.OS}] Using fallback data from AsyncStorage:`, parsedData);
            loadAuthData(parsedData, token);
          } else {
            console.log(`[${Platform.OS}] No fallback data available`);
          }
        } catch (fallbackError) {
          console.log(`[${Platform.OS}] Fallback data also failed:`, fallbackError.message);
        }
      } finally {
        console.log(`[${Platform.OS}] Setting loading to false`);
        setIsLoading(false);
      }
    };

  




  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      {/* Header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={COLORS.button} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={user?.img ? {uri: user.img} : require('../assets/girl1.png')}
              defaultSource={Platform.OS === 'ios' ? require('../assets/girl1.png') : undefined}
              onLoadStart={() => {
                console.log('Profile image loading started');
                setImageLoading(true);
              }}
              onLoadEnd={() => {
                console.log('Profile image loading completed');
                setImageLoading(false);
              }}
              onError={(error) => {
                console.log('Profile image loading error:', error);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color={COLORS.button} />
              </View>
            )}
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.userName}>
              {user?.fullname || `${user?.fname || ''} ${user?.lname || ''}`.trim() || user?.name || 'User'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
          </View>
        </View>


        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2334</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3665</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>235</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* My Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <View style={styles.orderTrackingContainer}>
            <TouchableOpacity
              style={styles.orderTrackingItem}
              onPress={() =>
                navigation.navigate('Orders', {
                  status: 'pending_payment',
                  title: 'To Pay',
                  filter: 'unpaid',
                })
              }>
              <View style={styles.orderIcon}>
                <MaterialCommunityIcons
                  name="package-variant"
                  size={25}
                  color="#FF6B35"
                />
              </View>
              <Text style={styles.orderLabel}>To pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderTrackingItem}
              onPress={() =>
                navigation.navigate('Orders', {
                  status: 'processing',
                  title: 'To Ship',
                  filter: 'paid',
                })
              }>
              <View style={styles.orderIcon}>
                <MaterialCommunityIcons
                  name="truck"
                  size={25}
                  color="#4ECDC4"
                />
              </View>
              <Text style={styles.orderLabel}>To ship</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderTrackingItem}
              onPress={() =>
                navigation.navigate('Orders', {
                  status: 'shipped',
                  title: 'To Receive',
                  filter: 'shipped',
                })
              }>
              <View style={styles.orderIcon}>
                <MaterialCommunityIcons
                  name="truck-delivery"
                  size={25}
                  color="#45B7D1"
                />
              </View>
              <Text style={styles.orderLabel}>To receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderTrackingItem}
              onPress={() =>
                navigation.navigate('Orders', {
                  status: 'delivered',
                  title: 'To Review',
                  filter: 'delivered',
                })
              }>
              <View style={styles.orderIcon}>
                <MaterialIcons name="rate-review" size={25} color="#96CEB4" />
              </View>
              <Text style={styles.orderLabel}>To review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderTrackingItem}
              onPress={() => navigation.navigate('Orders')}>
              <View style={styles.orderIcon}>
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={25}
                  color="#8E44AD"
                />
              </View>
              <Text style={styles.orderLabel}>View all</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[styles.menuIconContainer, {backgroundColor: '#FFF3E0'}]}>
              <MaterialCommunityIcons
                name="wallet"
                size={moderateScale(24)}
                color="#FF9800"
              />
            </View>
            <Text style={styles.menuText}>My wallet</Text>
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24)}
              color={COLORS.button}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('AddressScreen')}>
            <View
              style={[styles.menuIconContainer, {backgroundColor: '#E3F2FD'}]}>
              <MaterialIcons
                name="location-on"
                size={moderateScale(24)}
                color="#2196F3"
              />
            </View>
            <Text style={styles.menuText}>Shipping address</Text>
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24)}
              color={COLORS.button}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[styles.menuIconContainer, {backgroundColor: '#FCE4EC'}]}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={moderateScale(24)}
                color="#E91E63"
              />
            </View>
            <Text style={styles.menuText}>Rewards</Text>
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24)}
              color={COLORS.button}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MyCoupons')}>
            <View
              style={[styles.menuIconContainer, {backgroundColor: '#FFF8E1'}]}>
              <MaterialCommunityIcons
                name="ticket-percent"
                size={moderateScale(24)}
                color="#FFC107"
              />
            </View>
            <Text style={styles.menuText}>My Coupons</Text>
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24)}
              color={COLORS.button}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {borderBottomWidth: 0}]}
            onPress={() => navigation.navigate('HelpCenter')}>
            <View
              style={[styles.menuIconContainer, {backgroundColor: '#E8F5E8'}]}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={moderateScale(24)}
                color="#4CAF50"
              />
            </View>
            <Text style={styles.menuText}>Help Center</Text>
            <MaterialIcons
              name="chevron-right"
              size={moderateScale(24)}
              color={COLORS.button}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: moderateScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? moderateScale(15) : moderateScale(10),
    paddingVertical: Platform.OS === 'ios' ? moderateScale(10) : moderateScale(5),
    marginTop:  Platform.OS === 'ios' ? moderateScale(20) : moderateScale(10),
    marginBottom: moderateScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(25),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
  },
  settingsButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(20),
    paddingHorizontal: moderateScale(15),
    backgroundColor: 'transparent',
    // borderRadius: moderateScale(16),
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    marginBottom: moderateScale(5),
  },
  profileImageContainer: {
    marginRight: moderateScale(15),
  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(40),
    // borderWidth: 3,
    // borderColor: '#f8f9fa',
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
    borderRadius: moderateScale(40),
  },
  profileInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginBottom: moderateScale(4),
  },
  userEmail: {
    fontSize: moderateScale(14),
    color: '#06080aff',
    fontWeight: '500',
    fontFamily: FONTS.Regular,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: moderateScale(5),
    marginHorizontal: moderateScale(15),
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    marginBottom: moderateScale(4),
  },
  statLabel: {
    fontSize: moderateScale(13),
    color: '#666666',
    fontFamily: FONTS.Regular,
    fontWeight: '500',
  },
  section: {
    marginBottom: moderateScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    marginBottom: moderateScale(8),
    paddingHorizontal: moderateScale(12),
  },
  orderTrackingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: moderateScale(13),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.1)',
  },
  orderTrackingItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: moderateScale(40),
    borderColor: 'rgba(245, 74, 0, 0.2)',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(4),
    marginHorizontal: moderateScale(2),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  orderIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  orderLabel: {
    fontSize: moderateScale(12),
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    textAlign: 'center',
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: moderateScale(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 74, 0, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(11),
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(245, 74, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(15),
  },
  menuText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontFamily: FONTS.Medium,
    fontWeight: '650',
    lineHeight: moderateScale(15),
  },
});
