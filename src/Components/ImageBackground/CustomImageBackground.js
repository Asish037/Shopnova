import React from 'react';
import {ImageBackground, StatusBar} from 'react-native';

export default function CustomImageBackground({children}) {
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('../../assets/background.png')}>
      <StatusBar backgroundColor="transparent" translucent={true} />
        {children}
    </ImageBackground>
  );
}
