// import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, Icon,  TextInput, View} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';
import SimpleToast from 'react-native-simple-toast';
import GradientButton from '../../Components/Button/GradientButton';
import CustomImageBackground from '../../Components/ImageBackground/CustomImageBackground';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import Event from '../../Service/Event';
import GlobalStyles from '../GlobalStyle';
import BackHeader from '../Header/BackHeader';

const AddPaymentMethod = props => {
  const [payType, setpayType] = useState([
    {
      name: 'Paypal',
      status: false,
      id: '',
    },
    {
      name: 'Stripe',
      status: false,
      id: '',
    },
  ]);
  const [disable, setdisable] = React.useState(false);
  const [refresh, setrefresh] = React.useState(false);
  const [cardHolderName, setcardHolderName] = React.useState('');
  const [creditCardData, setcreditCardData] = React.useState({});
  const [disabled, setdisabled] = React.useState(false);
  const [showCardAdd, setshowCardAdd] = React.useState(false);

  useEffect(() => {}, [payType]);

  const setPay = data => {
    let payData = payType;
    const index = payData.findIndex(it => it.status == true);
    if (index >= 0) {
      payData[index].status = false;
    }
    payData[data].status = !payData[data].status;
    setpayType(payData);
    setrefresh(!refresh);
  };

  const closeModal = () => {
    if (showCardAdd) {
      setshowCardAdd(false);
    } else {
      props.closeModal();
    }
  };

  const renderPaymentType = () => {
    if (showCardAdd) {
      return null;
    }
    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{width: '85%', alignSelf: 'center'}}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: FONTS.SemiBold,
              textAlign: 'left',
              marginVertical: 15,
            }}>
            Select New Payment Method
          </Text>

          <View
            style={{
              marginHorizontal: 30,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View style={{width: '100%', alignSelf: 'center'}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Pressable
                  style={[
                    styles.box,
                    {
                      borderWidth:
                        payType.filter(
                          it => it.name == 'Stripe' && it.status == true,
                        ).length > 0
                          ? 2
                          : 0.2,
                    },
                  ]}
                  onPress={() => setPay(1)}>
                  <Icon
                    name="credit-card-alt"
                    type="FontAwesome"
                    style={styles.icon}
                  />
                  <Text style={{...styles.txt, textAlign: 'center'}}>
                    Credit / Debit Card
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPay(0)}
                  style={[
                    styles.box,
                    {
                      borderWidth:
                        payType.filter(
                          it => it.name == 'Paypal' && it.status == true,
                        ).length > 0
                          ? 2
                          : 0.2,
                    },
                  ]}>
                  <Icon name="paypal" type="FontAwesome" style={styles.icon} />
                  <Text style={styles.txt}>Paypal</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {payType.filter(it => it.status == true).length > 0 ? (
          <GradientButton
            title="Continue"
            onPress={() => setshowCardAdd(true)}
            // onPress={() =>
            //   Navigation.navigate('PaymentCard', {
            //     type: payType.filter(it => it.status == true)[0].name,
            //   })
            // }
            style={{width: '85%', alignSelf: 'center', marginBottom: 20}}
          />
        ) : null}
      </View>
    );
  };

  const renderAddCard = () => {
    if (!showCardAdd) {
      return null;
    }
    return (
      <View style={{flex: 1, width: '90%', alignSelf: 'center'}}>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.SemiBold,
            textAlign: 'center',
            marginVertical: 15,
          }}>
          Enter Credit / Debit Card Information
        </Text>

        <CreditCardInput
          onChange={_onChange}
          inputStyle={{color: COLORS.white}}
          inputContainerStyle={{
            borderBottomColor: '#ffffff',
            borderBottomWidth: 1,
          }}
          labelStyle={{color: COLORS.white, fontFamily: FONTS.Medium}}
        />

        <TextInput
          placeholder="Card Holder Name"
          placeholderTextColor={COLORS.white}
          style={{
            ...GlobalStyles.textInput,
            width: '90%',
            alignSelf: 'center',
            marginTop: 20,
          }}
          value={cardHolderName}
          onChangeText={setcardHolderName}
        />

        <GradientButton
          style={{
            marginTop: 10,
            width: '90%',
            alignSelf: 'center',
            position: 'absolute',
            bottom: 20,
          }}
          title="Add Payment Method"
          onPress={addPayMethod}
          disabled={disabled}
        />
      </View>
    );
  };

  const _onChange = data => {
    console.log('data=>>', data);
    setcreditCardData(data);
  };

  const addPayMethod = async () => {
    if (!creditCardData?.valid) {
      SimpleToast.show('Invalid Card Details!');
      return false;
    }
    if (!cardHolderName) {
      SimpleToast.show('Enter Card Holder Name!');
      return;
    }
    setdisabled(true);
    const cardNumber = creditCardData?.values?.number.replace(/\s/g, '');
    const month = creditCardData?.values?.expiry.split('/')[0];
    const year = creditCardData?.values?.expiry.split('/')[1];
    const cvc = creditCardData?.values?.cvc;
    let data = {
      cardNumber: cardNumber,
      CardHolderName: cardHolderName,
      ExpiryMonth: month,
      ExpireYear: year,
      cvc: cvc,
      type: payType.filter(it => it.status == true)[0].name,
    };
    console.log('data=>', data);
    const result = await Event.adPaymentMethod(data);
    console.log('payment =>>>>', result);
    if (result && result.status) {
      SimpleToast.show('Payment method added successfully!');
      //   Navigation.navigate('PaymentInfo');
      props.closeModal();
      props.cardAdded();
    } else {
      SimpleToast.show('Something wrong, try after sometimes');
    }
    setdisabled(false);
  };

  return (
    <CustomImageBackground>
      <BackHeader title="Payment Method" back={() => closeModal()} />
      {renderPaymentType()}
      {renderAddCard()}
    </CustomImageBackground>
  );
};

export default AddPaymentMethod;

const styles = StyleSheet.create({
  box: {
    width: '48%',
    height: verticalScale(100),
    borderWidth: 0.2,
    borderColor: COLORS.theme,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {color: COLORS.white, fontFamily: FONTS.Medium},
  icon: {
    fontSize: moderateScale(34),
    color: COLORS.theme,
    opacity: 0.8,
    marginBottom: 3,
  },
});
