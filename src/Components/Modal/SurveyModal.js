// import {Icon, Radio} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Icon, Radio} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import Event from '../../Service/Event';
import GradientButton from '../Button/GradientButton';
import GlobalStyles from '../GlobalStyle';

export default function SurveyModal(props) {
  const {bookingId} = props;
  const [option, setoption] = useState('');

  const submitForCancel = async () => {
    if (!option) {
      SimpleToast.show('Please select an option!');
      return;
    }
    const result = await Event.cancelBooking({
      bookingId: bookingId,
      reason: option,
    });
    if (result && result.status) {
      SimpleToast.show('Reservation canceled successfully!');
    } else {
      SimpleToast.show('Something wrong, try after sometimes!');
    }
    props.close();
  };
  return (
    <View style={{...GlobalStyles.modalMainView, justifyContent: 'flex-end'}}>
      <View
        style={{
          backgroundColor: COLORS.theme,
          paddingHorizontal: 25,
          paddingVertical: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <View style={{...GlobalStyles.modalHeader, marginBottom: 0}}>
          <Text style={{...GlobalStyles.modalTitle, color: COLORS.white}}>
            Cancel Reservation
          </Text>
          <TouchableOpacity onPress={() => props.close()}>
            <Icon name="cross" type="Entypo" style={{color: COLORS.white}} />
          </TouchableOpacity>
        </View>
        <Text style={{color: COLORS.white, marginBottom: 15}}>
          Please share why you’d like to cancel this reservation
        </Text>

        <TouchableOpacity
          style={styles.listView}
          onPress={() => setoption('Unable to attened')}>
          <Icon
            name={option == 'Unable to attened' ? 'check-circle' : 'circle'}
            type="Feather"
            style={{fontSize: 25, marginRight: 5, color: COLORS.white}}
          />
          <Text style={styles.txt}>Unable to attened</Text>
        </TouchableOpacity>
        {/* <View style={styles.listView}>
          <Radio
            onPress={() => setoption('Wrong Event or Venue')}
            selected={option == 'Wrong Event or Venue'}
            selectedColor={COLORS.cream}
            color={COLORS.white}
          />
          <Text style={styles.txt}>Wrong Event or Venue</Text>
        </View> */}

        <TouchableOpacity
          style={styles.listView}
          onPress={() => setoption('Issues Checking In')}>
          <Icon
            name={option == 'Issues Checking In' ? 'check-circle' : 'circle'}
            type="Feather"
            style={{fontSize: 25, marginRight: 5, color: COLORS.white}}
          />
          <Text style={styles.txt}>Issues Checking In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listView}
          onPress={() => setoption('Other')}>
          <Icon
            name={option == 'Other' ? 'check-circle' : 'circle'}
            type="Feather"
            style={{fontSize: 25, marginRight: 5, color: COLORS.white}}
          />
          <Text style={styles.txt}>Other</Text>
        </TouchableOpacity>

        {/* <View style={styles.listView}>
          <Radio
            onPress={() => setoption('Other')}
            selected={option == 'Other'}
            selectedColor={COLORS.cream}
            color={COLORS.white}
          />
          <Text style={styles.txt}>Other</Text>
        </View> */}
        {/* 
        <TouchableOpacity
          onPress={submitForCancel}
          style={{...GlobalStyles.modalBut, marginTop: 10}}>
          <Text style={GlobalStyles.modalButTxt}>Submit</Text>
        </TouchableOpacity> */}
        <GradientButton
          title="Next"
          onPress={submitForCancel}
          style={{marginTop: 20}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listView: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  txt: {
    fontFamily: FONTS.Medium,
    fontSize: moderateScale(12),
    color: COLORS.white,
    marginLeft: 5,
  },
});
