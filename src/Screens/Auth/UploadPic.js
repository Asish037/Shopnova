// import {Icon} from 'native-base';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Icon,
} from 'react-native';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
import Navigation from '../../Service/Navigation';
import GradientButton from '../../Components/Button/GradientButton';
import ImageWithTitle from '../../Components/Header/ImageWithTitle';
import CustomImageBackground from '../../Components/ImageBackground/CustomImageBackground';
import TransparentButton from '../../Components/Button/TransparentButton';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import Auth from '../../Service/Auth';

const {width, height} = Dimensions.get('window');

const IMG_URL =
  'https://www.searchpng.com/wp-content/uploads/2019/02/User-Icon-PNG.png';

export default function UploadPic() {
  const [img, setimg] = React.useState(IMG_URL);
  const [imgdata, setimgdata] = React.useState({});

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const browseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      setimg(image.path);
      setimgdata(image);
    });
  };

  const uploadImg = async () => {
    if (img == IMG_URL) {
      Toast.show('Choose an image!', Toast.SHORT);
      return false;
    }

    let result = await Auth.uploadPic(imgdata);
    console.log('imagUpload', result);
    if (result && result.status) {
      Toast.show('Upload Successfully!', Toast.SHORT);
      Navigation.navigate('Preference');
    }
  };

  return (
    <CustomImageBackground>
      <View style={{flex: 1}}>
        {/* <TouchableOpacity
          // onPress={() => Navigation.back()}
          style={{marginTop: moderateScale(45), marginLeft: moderateScale(15)}}>
          <Icon
            name="keyboard-arrow-left"
            type="MaterialIcons"
            style={{color: COLORS.white, fontSize: moderateScale(30)}}
          />
        </TouchableOpacity> */}
        <View
          style={{
            marginTop: moderateScale(45),
            marginHorizontal: 30,
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View>
            <ImageWithTitle title="Upload Your Photo" />
            <View
              style={{
                width: width / 1.7,
                height: width / 1.7,
                backgroundColor: COLORS.textInput,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: COLORS.white,
                borderRadius: moderateScale(20),
              }}>
              <Image
                source={{uri: img}}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 10,
                  borderRadius: 5,
                }}
              />

              <TouchableOpacity
                onPress={browseImage}
                style={{
                  backgroundColor: COLORS.button,
                  width: '50%',
                  height: verticalScale(45),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: FONTS.Medium,
                    fontSize: moderateScale(11.5),
                  }}>
                  Browse Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <GradientButton
              title="Submit"
              onPress={uploadImg}
              // onPress={() =>Navigation.navigate('Preference')}
            />
            <TransparentButton
              title="Skip for now"
              onPress={() => Navigation.navigate('Preference')}
            />
          </View>
        </View>
      </View>
    </CustomImageBackground>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    // backgroundColor:COLORS.textInput
    // borderColor:'#fff'
  },
  dob: {
    fontFamily: FONTS.Regular,
    fontSize: moderateScale(11.5),
    color: COLORS.white,
    textAlign: 'right',
    marginTop: 5,
  },
});
