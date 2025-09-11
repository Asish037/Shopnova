import {useIsFocused} from '@react-navigation/native';
// import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Icon,
  TouchableOpacity,
  View,
} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import CustomImageBackground from '../../Components/ImageBackground/CustomImageBackground';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import Event from '../../Service/Event';
import GradientButton from '../Button/GradientButton';
import BackHeader from '../Header/BackHeader';
import AddPaymentMethod from './AddPaymentMethod';

const CardList = ({closeModal, continuePay}) => {
  const isFoccused = useIsFocused();
  const [allPaymethod, setallPaymethod] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [addCardModal, setaddCardModal] = useState(false);

  useEffect(() => {
    if (isFoccused) {
      getPayMethod();
    }
  }, [isFoccused]);

  const getPayMethod = async () => {
    const result = await Event.getPaymentMethod();
    console.log('payme', result);
    if (result && result.status) {
      setallPaymethod(result.data);
    }
  };

  const handleSelect = async index => {
    let data = allPaymethod;
    const findSelectedOne = data.findIndex(i => i.selected === true);
    if (findSelectedOne >= 0 && findSelectedOne !== index) {
      data[findSelectedOne].selected = false;
    }
    data[index].selected = !data[index].selected;
    setallPaymethod(data);
    setrefresh(!refresh);
  };

  const continueToCheckout = () => {
    const findSelectedOne = allPaymethod.findIndex(i => i.selected === true);
    if (findSelectedOne >= 0) {
      continuePay(allPaymethod[findSelectedOne]);
    } else {
      SimpleToast.show('Select a card to continue!!');
      return;
    }
  };

  return (
    <CustomImageBackground>
      <BackHeader title="Payment Method" back={() => closeModal()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        <Pressable
          onPress={() => setaddCardModal(true)}
          style={[
            styles.list,
            {
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottomWidth: 0,
              paddingVertical: 0,
              paddingTop: 20,
            },
          ]}>
          <Text style={styles.semiboldTxt}>Select New Payment Method</Text>
          <Icon
            name="keyboard-arrow-right"
            type="MaterialIcons"
            style={{color: COLORS.white}}
          />
        </Pressable>
        {allPaymethod.map((it, key) => (
          <TouchableOpacity
            onPress={() => handleSelect(key)}
            key={key}
            style={[
              styles.list,
              {
                paddingVertical: moderateScale(20),
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <View>
              <Text
                style={[
                  styles.semiboldTxt,
                  {color: COLORS.cream, fontSize: 12, marginBottom: 5},
                ]}>
                {it.cardType} {it.cardNumber.substr(it.cardNumber.length - 4)}
              </Text>
              {/* <Text style={styles.regularTxt}>
                xxx {it.cardNumber.substr(it.cardNumber.length - 4)}
              </Text> */}
            </View>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: COLORS.theme,
                backgroundColor: it.selected ? COLORS.theme : null,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {allPaymethod.length > 0 ? (
        <GradientButton
          title="Continue"
          onPress={continueToCheckout}
          style={{
            position: 'absolute',
            width: '85%',
            alignSelf: 'center',
            marginTop: 20,
            bottom: 20,
          }}
        />
      ) : null}
      <Modal visible={addCardModal}>
        <AddPaymentMethod
          closeModal={() => setaddCardModal(false)}
          cardAdded={() => getPayMethod()}
        />
      </Modal>
    </CustomImageBackground>
  );
};

export default CardList;

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: moderateScale(30),
    paddingVertical: moderateScale(25),
    borderBottomWidth: 0.7,
    borderColor: COLORS.textInput,
  },
  gaplist: {
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: moderateScale(0),
    paddingVertical: moderateScale(15),
    borderBottomWidth: 0.7,
    borderColor: COLORS.textInput,
    alignSelf: 'center',
  },
  subList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  boldTxt: {
    color: COLORS.white,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(13),
  },
  semiboldTxt: {
    color: COLORS.white,
    fontFamily: FONTS.SemiBold,
    fontSize: moderateScale(13),
  },
  extraboldTxt: {
    color: COLORS.white,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(17),
  },
  regularTxt: {
    color: COLORS.white,
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(12),
  },
});
