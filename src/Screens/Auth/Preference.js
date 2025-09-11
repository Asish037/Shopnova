// import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Icon,
  Pressable,
} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import Navigation from '../../Service/Navigation';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import CustomImageBackground from '../../Components/ImageBackground/CustomImageBackground';
import GlobalStyles from '../../Components/GlobalStyle';
import PrefModal from '../../Components/Modal/PrefModal';
import Auth from '../../Service/Auth';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/user';
import ThankYouModal from '../../Components/Modal/ThankYouModal';
import {useNavigation} from '@react-navigation/native';

export default function Preference() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [organizerModal, setorganizerModal] = useState(false);
  const [musicModal, setmusicModal] = useState(false);
  const [eventModal, seteventModal] = useState(false);
  const [drinksModal, setdrinksModal] = useState(false);
  const [organizerList, setorganizerList] = useState([]);
  const [musicList, setmusicList] = useState([]);
  const [eventList, seteventList] = useState([]);
  const [drinksList, setdrinksList] = useState([]);
  const [thankYouModal, setthankYouModal] = useState(false);

  useEffect(() => {
    getOrganizer();
    getMusic();
    getEvent();
    getDrinks();
    return () => null;
  }, []);

  const getOrganizer = async () => {
    let result = await Auth.getOrganizer();
    // console.log("result",result);
    if (result && result.status) {
      setorganizerList(result.data);
    }
  };

  const getMusic = async () => {
    let result = await Auth.getMusic();
    console.log('result', result);
    if (result && result.status) {
      setmusicList(result.data);
    }
  };

  const getEvent = async () => {
    let result = await Auth.getEvent();
    console.log('result', result);
    if (result && result.status) {
      seteventList(result.data);
    }
  };

  const getDrinks = async () => {
    let result = await Auth.getDrinks();
    console.log('result', result);
    if (result && result.status) {
      setdrinksList(result.data);
    }
  };

  const cmptRegister = async () => {
    if (
      organizerList.filter(it => it.status == false).length == 0 ||
      musicList.filter(it => it.status == false).length == 0 ||
      eventList.filter(it => it.status == false).length == 0 ||
      drinksList.filter(it => it.status == false).length == 0
    ) {
      Toast.show('Please fill out all fields!');
      return;
    }

    let data = {
      organizer: organizerList.filter(it => it.status == false),
      musicType: musicList.filter(it => it.status == false),
      favoriteDrink: drinksList.filter(it => it.status == false),
      eventType: eventList.filter(it => it.status == false),
    };

    let result = await Auth.updateprofile(data);
    console.log('update', result);
    if (result && result.status) {
      // Toast.show('Register Successfully!', Toast.SHORT);
      setthankYouModal(true);
      // await Auth.setAccount(result.data);
      // await Auth.setToken(result.data.token);
      // dispatch(setUser(result.data));
    }
  };

  return (
    <CustomImageBackground>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => Navigation.back()}
          style={{marginTop: moderateScale(45), marginLeft: moderateScale(15)}}>
          <Icon
            name="keyboard-arrow-left"
            type="MaterialIcons"
            style={{color: COLORS.white, fontSize: moderateScale(30)}}
          />
        </TouchableOpacity>
        <View
          style={{
            marginHorizontal: 30,
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <ImageWithTitle title="Choose Your Preference" />

            <Pressable
              onPress={() => setorganizerModal(true)}
              style={[
                GlobalStyles.textInputView,
                {
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <View style={{width: '90%'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Regular,
                    fontSize: moderateScale(12),
                  }}>
                  Organizer Type:{' '}
                  {organizerList
                    .filter(it => it.status == false)
                    .map((it, key) => (
                      <Text key={key}>{it.name}, </Text>
                    ))}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-down"
                type="MaterialIcons"
                style={{color: COLORS.white}}
              />
            </Pressable>

            <Pressable
              onPress={() => setmusicModal(true)}
              style={[
                GlobalStyles.textInputView,
                {
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <View style={{width: '90%'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Regular,
                    fontSize: moderateScale(12),
                  }}>
                  Music Type:{' '}
                  {musicList
                    .filter(it => it.status == false)
                    .map((it, key) => (
                      <Text key={key}>{it.name}, </Text>
                    ))}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-down"
                type="MaterialIcons"
                style={{color: COLORS.white}}
              />
            </Pressable>

            <Pressable
              onPress={() => seteventModal(true)}
              style={[
                GlobalStyles.textInputView,
                {
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <View style={{width: '90%'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Regular,
                    fontSize: moderateScale(12),
                  }}>
                  Event Type:{' '}
                  {eventList
                    .filter(it => it.status == false)
                    .map((it, key) => (
                      <Text key={key}>{it.name}, </Text>
                    ))}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-down"
                type="MaterialIcons"
                style={{color: COLORS.white}}
              />
            </Pressable>

            <Pressable
              onPress={() => setdrinksModal(true)}
              style={[
                GlobalStyles.textInputView,
                {
                  paddingHorizontal: 15,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
              <View style={{width: '90%'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Regular,
                    fontSize: moderateScale(12),
                  }}>
                  Favorite Drink:{' '}
                  {drinksList
                    .filter(it => it.status == false)
                    .map((it, key) => (
                      <Text key={key}>{it.name}, </Text>
                    ))}
                </Text>
              </View>
              <Icon
                name="keyboard-arrow-down"
                type="MaterialIcons"
                style={{color: COLORS.white}}
              />
            </Pressable>
          </View>

          <View style={{marginBottom: 15}}>
            <GradientButton
              title="Complete"
              onPress={cmptRegister}
              // onPress={() =>Navigation.navigate('App')}
            />
          </View>
        </View>

        <Modal
          visible={organizerModal}
          transparent={true}
          onRequestClose={() => setorganizerModal(false)}>
          <PrefModal
            data={organizerList}
            selected={data => [
              setorganizerList(data),
              setorganizerModal(false),
            ]}
          />
        </Modal>

        <Modal
          visible={musicModal}
          transparent={true}
          onRequestClose={() => setmusicModal(false)}>
          <PrefModal
            data={musicList}
            selected={data => [setmusicList(data), setmusicModal(false)]}
          />
        </Modal>

        <Modal
          visible={eventModal}
          transparent={true}
          onRequestClose={() => seteventModal(false)}>
          <PrefModal
            data={eventList}
            selected={data => [seteventList(data), seteventModal(false)]}
          />
        </Modal>

        <Modal
          visible={drinksModal}
          transparent={true}
          onRequestClose={() => setdrinksModal(false)}>
          <PrefModal
            add={true}
            data={drinksList}
            selected={data => [setdrinksModal(data), setdrinksModal(false)]}
          />
        </Modal>
      </View>
      <Modal
        visible={thankYouModal}
        transparent={true}
        onRequestClose={() => {
          setthankYouModal(false);
          navigation.replace('Login');
        }}>
        <ThankYouModal
          close={() => {
            setthankYouModal(false);
            navigation.replace('Login');
          }}
        />
      </Modal>
    </CustomImageBackground>
  );
}

const styles = StyleSheet.create({
  checkbox: {},
  dob: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11.5),
    color: COLORS.white,
    textAlign: 'right',
    marginTop: 5,
  },
});
