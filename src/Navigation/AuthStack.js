import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Landing from '../Screens/Auth/Landing';
import Otp from '../Screens/Auth/Otp';
import Register from '../Screens/Auth/Register';
import Login from '../Screens/Auth/LoginScreen';
// import {COLORS} from '../Constant/Colors';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
      initialRouteName="Landing">
      {/* Main Auth Flow: Landing → Register → OTP → Main App */}
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Login" component={Login} />

      {/* Optional: Other auth routes if needed */}
      {/* <Stack.Screen name="PhoneNumber" component={PhoneNumber} /> */}
      {/* <Stack.Screen name="Password" component={Password} /> */}
      {/* <Stack.Screen name="Email" component={Email} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPassword} /> */}
      {/* <Stack.Screen name="UploadPic" component={UploadPic} /> */}
      {/* <Stack.Screen name="Preference" component={Preference} /> */}
    </Stack.Navigator>
  );
}
