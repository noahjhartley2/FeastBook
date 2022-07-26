import React, {useState, createRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'localstorage-polyfill'
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { getDrawerStatusFromState } from '@react-navigation/drawer';


const PasswordResetScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    
    const handleSubmitPress = () => {
        setErrortext('');
        if (!email) {
            setErrortext('Email required');
            return;
        }
        setLoading(true);
        let dataToSend = {email: email};
        var s = JSON.stringify(dataToSend)
        fetch('https://feastbook.herokuapp.com/api/forgotpassword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            setLoading(false);
            console.log(response);
            if (response.error === "Invalid Email") {
                setErrortext("User not found")
            }
            else {
                navigation.navigate('PasswordReset2')
            }
        })
        .catch((error) => {
            setLoading(false);
            console.error(error);
        });
    }

    return (
        <View style = {styles.mainBody}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>
            <SafeAreaView style={styles.SafeAreaView}>
                <Text style={styles.loginPrompts}>Pleast enter your email</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(email) => setEmail(email)}
                    placeholder="Email"
                    returnKeyType="next"
                />
            </SafeAreaView>
            {errortext != '' ? (
                <Text style={styles.errorTextStyle}>
                    {errortext}
                </Text>
            ) : null}

            <View style={styles.spacingSmall}></View>

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>Send code</Text>
            </TouchableOpacity>

            <View style={styles.spacingSmall}></View>
            <View style={styles.divider}></View>
            <View style={styles.spacingSmall}></View>

            <TouchableOpacity
                stlye={styles.buttonStyle}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonTextStyle}>Click here to return to login</Text>
            </TouchableOpacity>

            <View style={styles.fill}></View>
        </View>
    );
};

export default PasswordResetScreen;

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

    mainBody: {
        backgroundColor: '#1B262C'
    },

    SafeAreaView: {
        marginTop: 30,
        backgroundColor: '#1B262C',
    },

    loginPrompts: {
        fontFamily: 'Montserrat',
        paddingLeft: 20,
        color: '#fff',
        fontSize:16,
    },

    inputStyle: {
        fontFamily: 'Montserrat',
        backgroundColor: '#fff',
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
        padding: 10,
    },

    errorTextStyle: {
    },

    buttonStyle: {
        borderRadius: 10,
        marginLeft:20,
        marginRight:20,
        backgroundColor: "#0F4C75",
        height: 30
    },

    buttonTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize:18,
        color: '#fff'
    },

    registerTextStyle: {
    },

    spacingSmall: {
        marginTop:20
    },

    divider: {
        border: 'solid',
        borderWidth: 1,
        borderColor: "#BBE1FA"
    },

    fill: {
        marginTop: 3000
    },

    errorTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize:18,
        color: 'red'
    }
  });