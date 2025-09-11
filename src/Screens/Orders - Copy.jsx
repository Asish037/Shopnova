import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale} from '../PixelRatio';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import myorderData from '../data/myorderData.json';
import Header from '../Components/Header';

const Orders = () => {
  const navigation = useNavigation();
  const [ordersData, setOrdersData] = useState(myorderData.orders);

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <Header />
      <View style={styles.headerSection}>
        <Text>
          {'Order ID:\n APK - 1234567899900'}
          {console.log('kkkk' + JSON.stringify(ordersData))}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          {ordersData.length > 0 &&
            ordersData.map((items, key) => (
              <TouchableWithoutFeedback onPress={() => {}} key={key}>
                <View style={styles.body} key={key}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('OrderDetails', {items: items});
                    }}>
                    <View style={styles.bodySection}>
                      <View style={[styles.bodyPartSmall, styles.imgCard]}>
                        <Image
                          source={{
                            uri: items.items[0].thumbnail_image,
                          }}
                          style={{
                            height: 50,
                            width: 50,
                            resizeMode: 'center',
                          }}
                        />
                      </View>
                      <View style={styles.bodyPart}>
                        <Text style={styles.headTitle}>
                          {`${
                            items.shipping_status === 'Shipped'
                              ? 'Delivered'
                              : 'Arriving tomorrow by 10 pm'
                          }`}
                        </Text>
                        <View
                          style={{
                            width: '80%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.headSubTitle}>
                              {items.items[0].product_name}
                            </Text>
                          </View>
                          <View style={{justifyContent: 'flex-end'}}>
                            <Text style={styles.headSubTitle}>
                              Qty:{items.items[0].quantity}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.bodyPartEnd}>
                        <MaterialCommunityIcons
                          name="arrow-right"
                          size={'30'}
                          style={{
                            color: COLORS.black,
                            fontSize: moderateScale(30),
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    paddingBottom: 20,
  },
  headTitle: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: moderateScale(15),
    fontWeight: '900',
  },
  headSubTitle: {
    color: COLORS.button,
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  body: {
    alignItems: 'center',
  },
  bodySection: {
    width: '90%',
    borderBottomWidth: 0.2,
    borderColor: COLORS.textInput,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyPart: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '70%',
    justifyContent: 'space-around',
    padding: 10,
  },
  bodyPartSmall: {
    width: '20%',
    alignItems: 'flex-start',
  },
  bodyPartEnd: {
    width: '20%',
    justifyContent: 'flex-end',
  },
  imgCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: moderateScale(50),
    height: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
