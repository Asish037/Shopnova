import {View, Text, Image} from 'react-native';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
// import Entypo from "react-native-vector-icons/dist/Entypo";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartContext, CartProvider} from './../Context/CartContext';

import LoginScreen from '../Screens/Auth/LoginScreen';

import HomeScreen from '../Screens/HomeScreen';
import ProductDetailsScreen from '../Screens/ProductDetailsScreen';
import CartScreen from '../Screens/CartScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import AccountScreen from '../Screens/AccountScreen';
import Orders from '../Screens/Orders';
import PaymentScreen from '../Screens/PaymentScreen';
import AddressScreen from '../Screens/AddressScreen';
import MyWishList from '../Screens/MyWishList';
import { COLORS } from '../Constant/Colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CartTabIcon = ({focused, color, size}) => {
  const {cartItems, getTotalQuantity} = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

  return (
    <View style={{position: 'relative'}}>
      <Icon 
        name={focused ? "cart" : "cart-outline"} 
        size={size || 24} 
        color={color} 
      />
      {totalQuantity > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -3,
            bottom: 15,
            height: 14,
            width: 14,
            backgroundColor: '#E94560',
            borderRadius: 7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
            {totalQuantity}
          </Text>
        </View>
      )}
    </View>
  );
};

const MyHomeStack = () => {
  return (
    <Stack.Navigator
      style={{backgroundColor: 'transparent'}}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HOME" component={HomeScreen} />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{
          headerShown: false,
          header: () => null,
        }}
      />
      <Stack.Screen name="CART" component={CartScreen} />
      <Stack.Screen name="ACCOUNT" component={AccountScreen} />

      <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetailsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="MyWishList" component={MyWishList} />
      <Stack.Screen name="Orders" component={Orders} />
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
      <View style={{flex: 1}}>
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
          tabBarActiveTintColor: COLORS.button,
          tabBarInactiveTintColor: COLORS.grey,
          
        }}>
        <Tab.Screen
          name="HOME_STACK"
          component={MyHomeStack}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Icon 
                name={focused ? "home" : "home-outline"} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="categories"
          component={CategoriesScreen}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Icon 
                name={focused ? "grid" : "grid-outline"} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="CART"
          component={CartScreen}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <CartTabIcon focused={focused} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ACCOUNT"
          component={AccountScreen}
          options={{
            tabBarIcon: ({focused, color, size}) => (
              <Icon 
                name={focused ? "person" : "person-outline"} 
                size={size || 24} 
                color={color} 
              />
            ),
          }}
        />
        </Tab.Navigator>
      </View>
    </CartProvider>
    // </NavigationContainer>
  );
};

export default BottomTab;
