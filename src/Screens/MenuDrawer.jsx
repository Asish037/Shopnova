import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../Components/Header'   
import LinearGradient from 'react-native-linear-gradient'
import { COLORS } from '../Constant/Colors'


const MenuDrawer = () => {
    return (
        <LinearGradient colors={COLORS.gradient} style={styles.container}>
            <Header />
            {/* <Text>MenuDrawer</Text> */}
            <View style={styles.subContainer} >
                <Text style={styles.text}> Coming Soon</Text>
            </View>
        </LinearGradient>
    )
}

export default MenuDrawer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        // color: COLORS.white,
        fontSize: 18,
        textAlign: 'center'
    }
})