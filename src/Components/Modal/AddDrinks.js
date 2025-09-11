import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import Auth from '../../Service/Auth';
import GradientButton from '../Button/GradientButton';
import GlobalStyles from '../GlobalStyle';

// const { width, height } = Dimensions.get('window');

const AddDrinks = props => {
  const {data} = props;

  const [drink, setdrink] = useState('');

  const submit = async () => {
    if (drink == '') {
      SimpleToast.show('Enter Drinks Name');
      return false;
    }

    let data = {
      name: drink,
    };

    let result = await Auth.addDrinks(data);
    if (result && result.status) {
      SimpleToast.show('Drinks created');
      props.drinkCreated(result.data);
    } else {
      SimpleToast.show('Something wrong, try after sometimes!');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <Pressable
          style={{flex: 1, backgroundColor: COLORS.liteBlack}}
          onPress={() => props.Close()}
        />

        <View style={styles.content}>
          <Text style={styles.heading}>Choose Your Drinks</Text>
          <TextInput
            placeholder="Drinks Name"
            placeholderTextColor={COLORS.white}
            style={[
              GlobalStyles.textInput,
              {marginVertical: 15, marginBottom: 15},
            ]}
            value={drink}
            onChangeText={val => setdrink(val)}
          />
          <GradientButton title="Done" onPress={submit} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddDrinks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.liteBlack,
  },
  content: {
    backgroundColor: COLORS.theme,
    padding: 15,
    // height: height / 1.6,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 25,
  },
  heading: {
    color: COLORS.white,
    fontFamily: FONTS.title,
    fontSize: moderateScale(17),
    marginBottom: 0,
  },
});
