import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
//import {ListItem} from 'react-native-elements';
import {COLORS} from '../../Constant/Colors';
import {FONTS} from '../../Constant/Font';
import LinearGradient from 'react-native-linear-gradient';

const CountryCityModal = props => {
  const {data, name, title} = props;

  console.log('data', data);

  useEffect(() => {
    setallData(data);
    setalldatabackup(data);
    return () => null;
  }, [data]);

  const [show, setshow] = useState(false);
  const [searchText, setsearchText] = useState('');
  const [allData, setallData] = useState(data);
  const [alldatabackup, setalldatabackup] = useState(data);

  const searchData = data => {
    let result = alldatabackup.filter(it =>
      new RegExp(data.toLowerCase()).test(it[name].toLowerCase()),
    );
    setallData(result);
    setsearchText(data);
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            height: 60,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            justifyContent: show ? 'flex-start' : 'space-between',
          }}>
          {/* <Icon
            onPress={() => props.Close()}
            name="keyboard-arrow-left"
            type="MaterialIcons"
            style={{color: COLORS.white}}
          /> */}
          {!show ? (
            <>
              {/* <ListItem.Title style={styles.title}>{title}</ListItem.Title>
              <Icon
                onPress={() => setshow(true)}
                name="md-search-outline"
                type="Ionicons"
                style={{color: COLORS.white}}
              /> */}
            </>
          ) : (
            <TextInput
              style={[
                //GlobalStyles.textInput,
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
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            // <ListItem
            //   //    bottomDivider
            //   onPress={() => props.SelectedItem(item)}
            //   containerStyle={styles.list}>
            //   <ListItem.Content>
            //     <ListItem.Title style={styles.title}>
            //       {item.name}
            //     </ListItem.Title>
            //   </ListItem.Content>
            // </ListItem>
            <View></View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CountryCityModal;

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontFamily: FONTS.Medium,
  },
  list: {backgroundColor: 'transparent', borderBottomColor: COLORS.cream},
});
