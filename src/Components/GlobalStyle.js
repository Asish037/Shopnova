import {StyleSheet} from 'react-native';
import {COLORS} from '../Constant/Colors';
import {FONTS} from '../Constant/Font';
import {moderateScale, verticalScale} from '../PixelRatio';

const GlobalStyle = StyleSheet.create({
  // Modal styles
  modalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: FONTS.Bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  modalBut: {
    backgroundColor: COLORS.button,
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(20),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButTxt: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: FONTS.Medium,
    textAlign: 'center',
  },
  
  // Text input styles
  textInput: {
    backgroundColor: COLORS.textInput,
    borderRadius: 5,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    fontFamily: FONTS.Regular,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.textInput,
  },
  textInputView: {
    backgroundColor: COLORS.textInput,
    borderRadius: 5,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    marginVertical: verticalScale(10),
  },
  
  // List styles
  list: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: moderateScale(15),
    marginVertical: verticalScale(10),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgray,
  },
  
  // Text styles
  semiboldTxt: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Medium,
    color: COLORS.black,
  },
  regularTxt: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.Regular,
    color: COLORS.black,
  },
});

export default GlobalStyle;
