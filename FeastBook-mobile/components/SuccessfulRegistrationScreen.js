import React, {useState, createRef, useEffect, useCallback} from 'react';
import home from '../assets/icons/home.png';
import user from '../assets/icons/user.png';
import search from '../assets/icons/search.png';
import plusFilled from '../assets/icons/plusFilled.png';
import checkmark from '../assets/icons/checkmark.png';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image, 
  RefreshControl,
  ScrollView
} from 'react-native';

const SuccessfulRegistrationScreen = ({navigation}) => { 

    setTimeout(() => {  navigation.navigate('Login'); }, 2000);

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>

            <ScrollView style={{flex: 1, backgroundColor: '#1B262C', paddingTop: '50%'}}>
                <View style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#1B262C'}}>
                    <Image source={checkmark}/>
                </View>
                <View style={{alignSelf: 'center', backgroundColor: '#1B262C'}}>
                    <Text style={styles.successText}>Registration successful!</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default SuccessfulRegistrationScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0F4C75',
        alignItems: 'center',
    },
  
    heading: {
        paddingTop:33,
        color: '#BBE1FA',
        fontSize:32,
        fontFamily: 'MontserratSB'
    },

    footer: {
        flex: 1,
        height: 40,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0F4C75',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    currentPageStyle: {
        fontFamily: 'Montserrat',
        color: "#000"
    },

    navPageStyle: {
        fontFamily: 'Montserrat',
        color: "#fff"
    },

    buttonStyle: {
        borderRadius: 10,
        width: 200,
        backgroundColor: "#0F4C75",
        height: 30,
        shadowColor: '#000',
        shadowOpacity: 5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },

    successText: {
        fontFamily: 'MontserratSB',
        color: '#fff',
        fontSize: 22,
    },

    spacingSmall: {
        marginTop:20
    },

    spacingLarge: {
        marginTop:80
    },
});