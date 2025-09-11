// import {Icon} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Modal, SafeAreaView} from 'react-native';
import {View, Text, FlatList, Icon, StyleSheet, TextInput} from 'react-native';
import {ListItem} from 'react-native-elements';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import Event from '../../Service/Event';
import GlobalStyles from '../GlobalStyle';
import CustomImageBackground from '../ImageBackground/CustomImageBackground';

const HomeCityModal = props => {
  const {
    data,
    name,
    title,
    visible,
    setcityId,
    setstateId,
    setselectedStateCity,
  } = props;

  console.log('data', data);

  useEffect(() => {
    getCityState();
    return () => null;
  }, []);

  const getCityState = async () => {
    const result = await Event.getDistingState();
    console.log('result=>>', result);
    if (result && result.status) {
      setallData(result.data);
      setalldatabackup(result.data);
    }
  };

  const [show, setshow] = useState(false);
  const [searchText, setsearchText] = useState('');
  const [allData, setallData] = useState([]);
  const [alldatabackup, setalldatabackup] = useState([]);

  const searchData = data => {
    let result = alldatabackup.filter(it =>
      new RegExp(data.toLowerCase()).test(it.cityData.name.toLowerCase()),
    );
    setallData(result);
    setsearchText(data);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <CustomImageBackground>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              height: 60,
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 10,
              justifyContent: show ? 'flex-start' : 'space-between',
            }}>
            <Icon
              onPress={() => props.Close()}
              name="keyboard-arrow-left"
              type="MaterialIcons"
              style={{color: COLORS.white}}
            />
            {!show ? (
              <>
                <ListItem.Title style={styles.title}>{title}</ListItem.Title>
                <Icon
                  onPress={() => setshow(true)}
                  name="md-search-outline"
                  type="Ionicons"
                  style={{color: COLORS.white}}
                />
              </>
            ) : (
              <TextInput
                style={[
                  GlobalStyles.textInput,
                  {width: '85%', height: 50, marginBottom: 0, marginLeft: 10},
                ]}
                placeholder="Search..."
                placeholderTextColor={COLORS.cream}
                onSubmitEditing={() => setshow(false)}
                value={searchText}
                onChangeText={data => searchData(data)}
              />
            )}
          </View>

          <FlatList
            data={allData}
            extraData={props}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => (
              <ListItem
                //    bottomDivider
                onPress={() => {
                  setcityId(item._id.city);
                  setstateId(item._id.state);
                  setselectedStateCity(item);
                  props.onClick(item);
                }}
                containerStyle={styles.list}>
                <ListItem.Content>
                  <ListItem.Title style={styles.title}>
                    {item?.cityData?.name}, {item?.stateData?.name}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
          />
        </SafeAreaView>
      </CustomImageBackground>
    </Modal>
  );
};

export default HomeCityModal;

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontFamily: FONTS.Medium,
  },
  list: {backgroundColor: 'transparent', borderBottomColor: COLORS.cream},
});
