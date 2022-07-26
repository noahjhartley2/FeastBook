import React, {useState, createRef} from 'react';
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

const LoginScreen = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [errortext, setErrortext] = useState('');

    const passwordInputRef = createRef();
    
    const handleSubmitPress = () => {
        setErrortext('');
        if (!username) {
            setErrortext('Email required');
            return;
        }
        if (!userPassword) {
            setErrortext('Password required');
            return;
        }
        let dataToSend = {login: username, password: userPassword};
        var s = JSON.stringify(dataToSend)
        fetch('https://feastbook.herokuapp.com/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            if (response.id !== -1) {
                localStorage.setItem('username', username);
                localStorage.setItem('userID', response.id);
                localStorage.setItem('token', response.token)
                if (response.error === "Not verified check email") {
                    navigation.navigate('EmailVerification')
                }
                else {
                    navigation.navigate('Explore')
                }
            }
            else {
                setErrortext('Incorrect email and/or password')
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <View style = {styles.mainBody}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>
            <SafeAreaView style={styles.SafeAreaView}>
                <Text style={styles.loginPrompts}>Username</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(username) => setUsername(username)}
                    placeholder="Username"
                    returnKeyType="next"
                    onSubmitEditing={() => 
                        passwordInputRef.current && passwordInputRef.current.focus()
                    }
                />
                <Text style={styles.loginPrompts}>Password</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(userPassword) => setUserPassword(userPassword)}
                    placeholder="Password"
                    secureTextEntry={true}
                    returnKeyType="next"
                    onSubmitEditing={Keyboard.dismiss}
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
                <Text style={styles.buttonTextStyle}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.spacingSmall}></View>

            <TouchableOpacity
                stlye={styles.buttonStyle}
                onPress={() => navigation.navigate('PasswordReset')}>
                <Text style={styles.buttonTextStyle}>Forgot password?</Text>
            </TouchableOpacity>

            <View style={styles.spacingSmall}></View>
            <View style={styles.divider}></View>
            <View style={styles.spacingSmall}></View>

            <TouchableOpacity
                stlye={styles.buttonStyle}
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonTextStyle}>New user? Click here to register!</Text>
            </TouchableOpacity>

            <View style={styles.fill}></View>
        </View>
    );
};

export default LoginScreen;

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