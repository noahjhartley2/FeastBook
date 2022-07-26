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


const PasswordResetScreen2 = ({navigation}) => {
    const [code, setCode] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');
    
    const handleSubmitPress = () => {
        setErrortext('');
        if (!code) {
            setErrortext('Code required');
            return;
        }
        if (!password1) {
            setErrortext('Password required');
            return;
        }
        if (!password2) {
            setErrortext('Password required');
            return;
        }
        if (password1 !== password2) {
            setErrortext('Passwords must match');
            return;
        }
        setLoading(true);
        let dataToSend = {otp: code, newPassword1: password1, newPassword2: password2};
        var s = JSON.stringify(dataToSend)
        fetch('https://feastbook.herokuapp.com/api/resetpassword', {
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
            if (response.error === "invalid token") {
                setErrortext("Invalid Token")
            }
            else {
                navigation.navigate('PWResetSuccessful')
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
                <Text style={styles.emailPrompt}>A verification code was sent to your email. Please enter it below.</Text>

                <View style={styles.spacingSmall}></View>

                <Text style={styles.loginPrompts}>Enter the verification code</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(code) => setCode(code)}
                    placeholder="Verification Code"
                    returnKeyType="next"
                />

                <Text style={styles.loginPrompts}>New Password</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(password1) => setPassword1(password1)}
                    secureTextEntry={true}
                    placeholder="New Password"
                    returnKeyType="next"
                />

                <Text style={styles.loginPrompts}>Re-enter New Password</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(password2) => setPassword2(password2)}
                    secureTextEntry={true}
                    placeholder="Re-enter New Password"
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
                <Text style={styles.buttonTextStyle}>Update Password</Text>
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

export default PasswordResetScreen2;

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

    emailPrompt: {
        fontFamily: 'MontserratSB',
        paddingLeft: 20,
        color: '#fff',
        fontSize:18,
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