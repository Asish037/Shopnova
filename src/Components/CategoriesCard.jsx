import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';

const CategoriesCard = ({categories}) => {
    return (
        <FlatList
            data={categories}
            renderItem={({item}) => (
                <View style={styles.categoryItem}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                </View>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    );
};

export default CategoriesCard;

const styles = StyleSheet.create({});
