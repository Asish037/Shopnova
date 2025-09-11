import React from 'react';
import {
  ActivityIndicator
} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { CartProvider } from "./src/Context/CartContext";
import MainStackNavigator from './MainStackNavigator';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <NavigationContainer fallback={<ActivityIndicator animating />}>
          <MainStackNavigator />
        </NavigationContainer>
      </CartProvider>
    </Provider>
  );
}

export default App;