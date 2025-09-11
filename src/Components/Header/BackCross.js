import React, {useState} from 'react';
import {View, Text, TouchableOpacity,Icon, Modal} from 'react-native';
// import {Icon} from 'native-base';
import {moderateScale, verticalScale} from '../../PixelRatio';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import Navigation from '../../Service/Navigation';
import CrossModal from '../Modal/CrossModal';
import OptionsMenu from 'react-native-option-menu';
import {Icon as IconElement} from 'react-native-elements';

export default function BackCross({
  title,
  icon,
  getCallBack,
  onBackPress,
  moreIcon,
  type,
  more,
  followUser,
  blockUser,
  reportUser,
  unfollow,
}) {
  const otherUserPost = [
    unfollow ? 'Unfollow' : 'Follow',
    'Block',
    'Report',
    'Close',
  ];

  const moreOptionCallbackother = [
    () => followUser(unfollow),
    () => blockUser(),
    () => reportUser(),
  ];

  const [modal, setmodal] = useState(false);

  const goBack = () => {
    if (getCallBack) {
      onBackPress();
    } else {
      Navigation.back();
    }
  };

  return (
    <View
      style={{
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: verticalScale(50),
        alignSelf: 'center',
        marginTop: 30,
      }}>
      <TouchableOpacity onPress={goBack}>
        <Icon
          name="keyboard-arrow-left"
          type="MaterialIcons"
          style={{color: COLORS.white, fontSize: moderateScale(35)}}
        />
      </TouchableOpacity>

      <View style={{flexDirection: 'row'}}>
        <Text
          numberOfLines={1}
          style={{
            color: COLORS.white,
            fontFamily: FONTS.Regular,
            fontSize: moderateScale(type == 'order' ? 11.5 : 18),
          }}>
          {title}
        </Text>
        {icon ? (
          <Icon
            name="keyboard-arrow-down"
            type="MaterialIcons"
            style={{color: COLORS.white}}
          />
        ) : null}
      </View>
      {more ? (
        <OptionsMenu
          customButton={
            <IconElement
              name="more-vert"
              type="material"
              color={COLORS.white}
            />
          }
          destructiveIndex={1}
          options={otherUserPost}
          actions={moreOptionCallbackother}
        />
      ) : (
        <TouchableOpacity onPress={() => setmodal(true)} disabled={moreIcon}>
          {moreIcon ? (
            <Icon
              name="more-horiz"
              type="MaterialIcons"
              style={{color: COLORS.white, fontSize: moderateScale(30)}}
            />
          ) : (
            <Icon
              name="cross"
              type="Entypo"
              style={{color: COLORS.white, fontSize: moderateScale(30)}}
            />
          )}
        </TouchableOpacity>
      )}
      <Modal visible={modal} transparent={true}>
        <CrossModal
          close={async val => {
            setmodal(false);
            if (val) {
              Navigation.navigate('Home');
            }
          }}
        />
      </Modal>
    </View>
  );
}
