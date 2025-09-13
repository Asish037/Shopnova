import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import Header from '../Components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, verticalScale } from '../PixelRatio';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../Constant/Colors';
import { FONTS } from '../Constant/Font';
import { PADDING } from '../Constant/Padding';

const Settings = () => {
  const navigation = useNavigation();
  const handleLogout = () => {
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Landing'),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <LinearGradient style={styles.container} colors={COLORS.gradient}>
      <Header />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('EditProfile')}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#FFF3E0' },
                ]}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={moderateScale(24)}
                  color="#FF9800"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Edit Profile</Text>
                <Text style={styles.menuSubText}>
                  Update your personal information
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                navigation.navigate('EditAddress', { pageTitle: 'Edit Address' })
              }>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#E3F2FD' },
                ]}>
                <MaterialIcons
                  name="location-on"
                  size={moderateScale(24)}
                  color="#2196F3"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Edit Address</Text>
                <Text style={styles.menuSubText}>
                  Manage your delivery addresses
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards & Offers Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Rewards & Offers</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('MyCoupons')}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#FFF8E1' },
                ]}>
                <MaterialCommunityIcons
                  name="ticket-percent"
                  size={moderateScale(24)}
                  color="#FFC107"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>My Coupons</Text>
                <Text style={styles.menuSubText}>
                  View and manage discount coupons
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  'Coming Soon',
                  'Rewards collection feature will be available soon!',
                )
              }>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#FCE4EC' },
                ]}>
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={moderateScale(24)}
                  color="#E91E63"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Rewards</Text>
                <Text style={styles.menuSubText}>
                  Collect points and earn rewards
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('HelpCenter')}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#E8F5E8' },
                ]}>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={moderateScale(24)}
                  color="#4CAF50"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Help Center</Text>
                <Text style={styles.menuSubText}>Get help and support</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  'Contact Us',
                  'Email: support@app.com\nPhone: +1-234-567-8900',
                )
              }>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#F3E5F5' },
                ]}>
                <MaterialCommunityIcons
                  name="headset"
                  size={moderateScale(24)}
                  color="#9C27B0"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Customer Service</Text>
                <Text style={styles.menuSubText}>Contact our support team</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Options Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>More Options</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Privacy')}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#FFF3E0' },
                ]}>
                <MaterialIcons
                  name="privacy-tip"
                  size={moderateScale(24)}
                  color="#FF9800"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Privacy Policy</Text>
                <Text style={styles.menuSubText}>Read our privacy policy</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.lastMenuItem]}
              onPress={() =>
                Alert.alert('App Info', 'Version: 1.0.0\nBuild: 100')
              }>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#E1F5FE' },
                ]}>
                <AntDesign
                  name="infocirlceo"
                  size={moderateScale(24)}
                  color="#00BCD4"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>About App</Text>
                <Text style={styles.menuSubText}>
                  App version and information
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.lastMenuItem]}
              onPress={handleLogout}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: '#FFEBEE' },
                ]}>
                <Ionicons
                  name="log-out-outline"
                  size={moderateScale(24)}
                  color="#F44336"
                />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Logout</Text>
                <Text style={styles.menuSubText}>Sign out of your account</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={moderateScale(24)}
                color="#6C757D"
              />
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: PADDING.container.vertical,
    paddingBottom: PADDING.container.bottom,
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.header.horizontal,
  },
  title: {
    fontSize: moderateScale(23),
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    marginTop: moderateScale(4),
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: '#2c2c2c',
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(20),
  },
  scrollContent: {
    paddingBottom: moderateScale(16),
  },
  sectionContainer: {
    marginBottom: PADDING.margin.xlarge,
    paddingHorizontal: PADDING.header.horizontal,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: COLORS.button,
    fontFamily: FONTS.Bold,
    marginBottom: PADDING.margin.medium,
    paddingHorizontal: PADDING.margin.small,
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(16),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PADDING.content.vertical,
    paddingHorizontal: PADDING.content.horizontal,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'transparent',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: PADDING.margin.medium,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontWeight: '600',
    lineHeight: moderateScale(22),
    marginBottom: PADDING.margin.small,
  },
  menuSubText: {
    fontSize: moderateScale(14),
    color: '#666666',
    fontFamily: FONTS.Regular,
    lineHeight: moderateScale(18),
    fontWeight: '400',
  },
});
