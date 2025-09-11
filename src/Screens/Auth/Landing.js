import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import {moderateScale, verticalScale} from '../../PixelRatio';
// import Navigation from '../../Service/Navigation';
import {useNavigation} from '@react-navigation/native';
import model6 from '../../assets/model6.jpg';

const {width, height} = Dimensions.get('window');

// const DATA = [
//     {
//         "title" : "Mark quick reservations",
//         "subtitle" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
//     },
//     {
//         "title" : "What is Lorem Ipsum?",
//         "subtitle" : "Lorem Ipsum is simply dummy text of the printing"
//     },
//     {
//         "title" : "Where does it come from?",
//         "subtitle" : "Contrary to popular belief, Lorem Ipsum is not simply random text."
//     }
// ]

export default function Landing() {
  const Navigation = useNavigation();
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     // Navigation.navigate('PhoneNumber')
  //   }, 5000);
  //   return () => null;
  // }, [])

  return (
    Platform.OS === 'ios' ? (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={model6} style={styles.bgimage} resizeMode="cover">
          <View style={styles.topContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                <Text>Style</Text>
                <Text style={styles.logoBold}>ON</Text>
              </Text>
            </View>
            <View style={styles.taglineContainer}>
              <Text style={styles.tagline}>Curating the Best You</Text>
            </View>
          </View>

          <View style={styles.bottomContent}>
            <TouchableOpacity
              style={styles.exploreContainer}
              onPress={() => Navigation.navigate('Register')}>
              <View style={styles.gradientButton}>
                <Text style={styles.buttonText}>Lets Explore</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    ) : (
      <ImageBackground source={model6} style={styles.bgimage} resizeMode="cover">
        <View style={styles.topContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text>Style</Text>
              <Text style={styles.logoBold}>ON</Text>
            </Text>
          </View>
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>Curating the Best You</Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.exploreContainer}
            onPress={() => Navigation.navigate('Register')}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF8C00']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}>
              <Text style={styles.buttonText}>Lets Explore</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'black' : undefined,
  },
  bgimage: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 45,
  },
  topContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: 10,
  },
  bottomContent: {
    alignItems: 'center',
    paddingBottom: 25,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
    marginLeft: 24,
    width: '100%',
  },
  taglineContainer: {
    marginBottom: 40,
    alignItems: 'flex-start',
    marginLeft: 24,
    width: '100%',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.button,
    letterSpacing: 1.5,
  },
  logoBold: {
    color: COLORS.button,
    fontWeight: '800',
  },
  tagline: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.Regular,
    color: COLORS.white,
    fontWeight: '300',
    marginBottom: moderateScale(32),
    letterSpacing: 0.3,
  },
  exploreContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20
  },
  gradientButton: {
    width: '100%',
    height: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(35),
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gradientButton[0],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    lineHeight: 26,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

// const styles = StyleSheet.create({
//     wrapper: {
//         // width:'100%',
//         // height:height/2
//     },
//     slide: {
//     //   width:'100%',
//     //     height:height/2,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginHorizontal:15
//     //   backgroundColor: '#9DD6EB'
//     },
//     text: {
//       color: '#fff',
//       fontSize: moderateScale(17),
//       fontFamily:FONTS.title,
//       textTransform:'uppercase',
//       textAlign:'center'
//     },
//     subtext: {
//         color: '#fff',
//         fontSize: moderateScale(13),
//         fontFamily:FONTS.Regular,
//         textAlign:'center'
//       }
//   })