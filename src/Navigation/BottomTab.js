import {View, Text, Image} from 'react-native';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Icon from "react-native-vector-icons/dist/FontAwesome";
// import Entypo from "react-native-vector-icons/dist/Entypo";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartContext, CartProvider} from './../Context/CartContext';

import LoginScreen from '../Screens/Auth/LoginScreen';

import HomeScreen from '../Screens/HomeScreen';
import ProductDetailsScreen from '../Screens/ProductDetailsScreen';
import CartScreen from '../Screens/CartScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import AccountScreen from '../Screens/AccountScreen';
import PaymentScreen from '../Screens/PaymentScreen';
import AddressScreen from '../Screens/AddressScreen';
import MyWishList from '../Screens/MyWishList';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CartTabIcon = ({focused, size}) => {
  const {cartItems, getTotalQuantity} = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

  if (focused) {
    return (
      <View style={{position: 'relative'}}>
        <Image
          source={require('../assets/focused/shopping_cart.png')}
          style={{
            height: size,
            width: size,
            resizeMode: 'center',
            
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -3,
            bottom: 22,
            height: 14,
            width: 14,
            backgroundColor: '#E94560',
            borderRadius: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 10}}>{totalQuantity}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{position: 'relative'}}>
        <Image
          source={require('../assets/normal/shopping_cart.png')}
          style={{
            height: size,
            width: size,
            resizeMode: 'center',
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -3,
            bottom: 22,
            height: 14,
            width: 14,
            backgroundColor: '#666666',
            borderRadius: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 10}}>{totalQuantity}</Text>
        </View>
      </View>
    );
  }
};

const MyHomeStack = () => {
  return (
    <Stack.Navigator
      style={{backgroundColor: 'transparent'}}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HOME" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="CART" component={CartScreen} />
      <Stack.Screen name="ACCOUNT" component={AccountScreen} />

      <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="MyWishList" component={MyWishList} />
      {/* <Stack.Screen name="ORDERS" component={Orders} /> */}
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        //cardStyle: {backgroundColor: COLORS.button},
        gestureEnabled: true,
        //backgroundColor: COLORS.button,
        gestureDirection: 'horizontal',
        // ...TransitionPresets.FadeFromBottomAndroid,
        //...TransitionPresets.SlideFromRightIOS,
      }}
      initialRouteName="HomeScreen"
      //headerMode="none"
    >
      {/* <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Password" component={Password} /> */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="Email" component={Email} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="UploadPic" component={UploadPic} />
      <Stack.Screen name="Preference" component={Preference} /> */}
    </Stack.Navigator>
  );
};

const BottomTab = () => {
  return (
    // <NavigationContainer>
    <CartProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            // position: 'absolute',
            bottom: 0,
            left: 20,
            right: 20,
            elevation: 5,
            height: 50,
            // overflow: 'hidden',
            // borderRadius: 20,
            // backgroundColor: 'transparent',
            backgroundColor: '#ffffffff', 
          },
          tabBarActiveTintColor: '#E94560',
          tabBarInactiveTintColor: '#040101ff',
          
        }}>
        <Tab.Screen
          name="HOME_STACK"
          component={MyHomeStack}
          options={{
            tabBarIcon: ({focused, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('../assets/focused/home.png')}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'center',
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('../assets/normal/home.png')}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'center',
                    }}
                  />
                );
              }
            },
          }}
        />
        <Tab.Screen
          name="categories"
          component={CategoriesScreen}
          options={{
            tabBarIcon: ({focused, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('../assets/focused/reorder.png')}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'center',
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('../assets/normal/reorder.png')}
                    style={{
                      height: 24,
                      width: 24,
                      resizeMode: 'center',
                    }}
                  />
                );
              }
            },
          }}
        />
        <Tab.Screen
          name="CART"
          component={CartScreen}
          options={{
            tabBarIcon: ({focused, size}) => (
              <CartTabIcon focused={focused} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="ACCOUNT"
          component={AccountScreen}
          options={{
            tabBarIcon: ({focused, size}) => {
              if (focused) {
                return (
                  <Image
                    source={require('../assets/focused/account.png')}
                    style={{
                      height: size,
                      width: size,
                      resizeMode: 'center',
                    }}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('../assets/normal/account.png')}
                    style={{
                      height: size,
                      width: size,
                      resizeMode: 'center',
                    }}
                  />
                );
              }
            },
          }}
        />
      </Tab.Navigator>
    </CartProvider>
    // </NavigationContainer>
  );
};

export default BottomTab;
