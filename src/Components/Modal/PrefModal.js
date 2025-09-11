import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  Icon
} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import GradientButton from '../Button/GradientButton';
import CheckBox from '@react-native-community/checkbox';
import AddDrinks from './AddDrinks';
// import {Icon} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const {width, height} = Dimensions.get('window');

const PrefModal = props => {
  const {data, add} = props;

  const [refresh, setrefresh] = useState(false);
  const [drinkModal, setdrinkModal] = useState(false);

  const checkedVal = (val, item, index) => {
    // alert(val);
    data[index].status = !val;
    setrefresh(!refresh);
  };

  return (
    <View style={styles.container}>
      <Pressable style={{flex: 1}} onPress={() => props.selected(data)} />

      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.heading}>Choose Your Preference</Text>
          {add ? (
            <Icon
              onPress={() => setdrinkModal(true)}
              name="plus"
              type="Entypo"
              style={{color: COLORS.cream}}
            />
          ) : null}
        </View>

        <KeyboardAwareScrollView style={{marginBottom: 60}}>
          <View style={{marginVertical: 15}}>
            {data.map((it, key) => (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Platform.OS == 'ios' ? 10 : 0,
                }}>
                <CheckBox
                  value={!it.status}
                  onValueChange={val => checkedVal(val, it, key)}
                  tintColors={true ? '#fff' : '#fff'}
                  style={{marginHorizontal: Platform.OS == 'ios' ? 10 : 0}}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Medium,
                  }}>
                  {it.name}
                </Text>
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
        <GradientButton
          title="Done"
          style={{position: 'absolute', bottom: 15, alignSelf: 'center'}}
          onPress={() => props.selected(data)}
        />
      </View>
      <Modal
        visible={drinkModal}
        transparent={true}
        onRequestClose={() => setdrinkModal(false)}>
        <AddDrinks
          Close={() => setdrinkModal(false)}
          drinkCreated={val => {
            data.push(val);
            setdrinkModal(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default PrefModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.liteBlack,
  },
  content: {
    backgroundColor: COLORS.theme,
    padding: 15,
    height: height / 1.6,
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
