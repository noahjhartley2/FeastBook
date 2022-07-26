import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

const EmailVerificationScreen = ({navigation}) => { 

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>

            <ScrollView style={{flex: 1, backgroundColor: '#1B262C', paddingTop: '50%'}}>
                <View style={{alignSelf: 'center', backgroundColor: '#1B262C', marginBottom: '10%'}}>
                    <Text style={styles.successText}>Check your email to verify registration</Text>
                </View>

                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonTextStyle}>Click here to return to login</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default EmailVerificationScreen;

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

    buttonTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize:18,
        color: '#fff'
    },

    successText: {
        fontFamily: 'MontserratSB',
        color: '#fff',
        fontSize: 22,
        textAlign: 'center'
    },

    spacingSmall: {
        marginTop:20
    },

    spacingLarge: {
        marginTop:80
    },
});