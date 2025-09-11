import CheckBox from '@react-native-community/checkbox';
// import {Icon} from 'native-base';
import React, {useState} from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Icon,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale} from '../../PixelRatio';
import GradientButton from '../Button/GradientButton';

const {width, height} = Dimensions.get('window');

const ReportModal = ({data, onReport, closeModal}) => {
  const [refresh, setrefresh] = useState(false);
  const [reportData, setreportData] = useState(data);

  const checkedVal = (item, index) => {
    const currentIndex = reportData.findIndex(i => i.status == true);
    if (currentIndex >= 0) {
      reportData[currentIndex].status = false;
    }
    reportData[index].status = !reportData[index].status;
    setreportData(reportData);
    setrefresh(!refresh);
  };

  const handleReport = () => {
    const selected = data.find(i => i.status == true);
    if (selected) {
      onReport(selected);
    } else {
      SimpleToast.show('Select an option to report!');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={{flex: 1}} onPress={closeModal} />

      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.heading}>Report</Text>
        </View>

        <KeyboardAwareScrollView style={{marginBottom: 60}}>
          <View style={{marginVertical: 15}}>
            {reportData.map((it, key) => (
              <TouchableOpacity
                key={key}
                onPress={() => checkedVal(it, key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                {/* <CheckBox
                  value={!it.status}
                  onValueChange={val => checkedVal(val, it, key)}
                  tintColors={true ? '#fff' : '#fff'}
                  style={{marginHorizontal: Platform.OS == 'ios' ? 10 : 0}}
                /> */}
                <Icon
                  name={
                    it.status
                      ? 'checkbox-marked-circle-outline'
                      : 'checkbox-blank-circle-outline'
                  }
                  type="MaterialCommunityIcons"
                  style={{marginRight: 8, fontSize: 30, color: COLORS.white}}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Medium,
                  }}>
                  {it.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </KeyboardAwareScrollView>
        <GradientButton
          title="Report"
          style={{position: 'absolute', bottom: 15, alignSelf: 'center'}}
          onPress={handleReport}
        />
      </View>
    </View>
  );
};

export default ReportModal;

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
