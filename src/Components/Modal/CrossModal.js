import React from 'react';
import {View, Text} from 'react-native';
import NormalButton from '../Button/NormalButton';
import GlobalStyles from '../GlobalStyle';

export default function CrossModal(props) {
  return (
    <View style={GlobalStyles.modalMainView}>
      <View style={GlobalStyles.modalContainer}>
        <View style={[GlobalStyles.modalHeader, {marginBottom: 10}]}>
          <Text style={GlobalStyles.modalTitle}>
            Do you want to exit and go back to main screen?
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <NormalButton
            style={{width: '48%'}}
            title="No"
            onPress={() => props.close(false)}
          />
          <NormalButton
            title="Yes"
            style={{width: '48%'}}
            onPress={() => props.close(true)}
          />
        </View>
      </View>
    </View>
  );
}
