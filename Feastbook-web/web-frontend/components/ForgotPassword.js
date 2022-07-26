import React, {useState} from 'react';
import { Container, Row, Col, Modal, Tabs, Tab } from 'react-bootstrap';
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import '../assets/css/ForgotPassword.css'
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
  } from 'react-native';

const ForgotPassword = ({navigation}) => {

    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const handleSubmitPress = () => {
        console.log("submit press handled")
        if (!userEmail) {
            setErrortext('Email required');
            console.log('Email required');
            return;
        }
        setLoading(true);
        let dataToSend = {email: userEmail};
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
            if (response.error !== ''){
                if(response.error === 'Invalid Email') {
                    setErrortext('Invalid Email');
                }
                if(response.error === 'user does not exist') {
                    setErrortext('user does not exist');
                }
            }
            else {
                //tell them it worked
                navigation.navigate('PWResetSuccessful')
            }
        })
        .catch((error) => {
            setLoading(false);
            console.error(error);
        });
    }


    return (
        <ScrollView style={{flex:1, backgroundColor: '#fff'}}>
            <View style = {styles.mainBody}>
                <View style={styles.header}>
                    <Text style={styles.heading}>FeastBook</Text>
                </View>

                <View style={{flexDirection:'row', flexWrap:'wrap', alignSelf:'center'}}>                    
                    <View style={{flexDirection: 'column', marginTop:30}}>
                    
                        <SafeAreaView style={styles.SafeAreaView}>
                            <Text style={styles.resetPrompt}>Password Reset</Text>
                            
                            <View style={styles.spacingSmall}></View>
                            <Text style={styles.loginPrompts}>Please enter your email</Text>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(userEmail) => setUserEmail(userEmail)}
                                placeholder="Email"
                                returnKeyType="next"
                                onSubmitEditing={() => 
                                    passwordInputRef.current && passwordInputRef.current.focus()
                                }
                            />
                        
                            {errortext != '' ? (
                                <Text style={styles.errorTextStyle}>
                                    {errortext}
                                </Text>
                            ) : null}

                            <View style={styles.spacingSmall}></View>

                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={handleSubmitPress}>
                                <Text style={styles.buttonTextStyle}>Send Code</Text>
                            </TouchableOpacity>
                            <View style={styles.spacingSmall}></View>
                            <Text style={styles.passwordResetText} onClick={() => navigation.replace('Login')}>Click here to return to login</Text>
                            <View style={styles.spacingSmall}></View>
                        </SafeAreaView>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0F4C75',
    },
  
    heading: {
        margin: 10,
        alignSelf: 'center',
        color: '#BBE1FA',
        fontSize:32,
        fontWeight: '500',
        fontFamily: 'MontserratSB'
    },

    mainBody: {
        backgroundColor: '#fff',
        alignSelf: 'stretch'
    },

    SafeAreaView: {
        alignSelf: 'center',
        width: '200%',
        height: '130%',
        border: 'solid',
        borderWidth: 5,
        borderBottomColor: '#0F4C75',
        borderRightColor: '#0F4C75',
        borderLeftColor: '#0F4C75',
        borderRadius: 30,
        backgroundColor: '#1B262C',
        justifyContent: 'center',

    },

    loginPrompts: {
        fontFamily: 'Montserrat',
        paddingLeft: 20,
        color: '#fff',
        fontSize:16,
    },

    resetPrompt: {
        fontFamily: 'MontserratSB',
        textAlign: 'center',
        color: '#fff',
        fontSize:20,
    },


    inputStyle: {
        fontFamily: 'Montserrat',
        backgroundColor: '#fff',
        height: 40,
        margin: 12,
        alignSelf: 'center',
        width: '95%',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
        padding: 10,
    },

    errorTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize:18,
        color: 'red'
    },

    tabs: {
        width: '75%',
        marginTop: 30,
        borderTopWidth: 5,
        borderTopColor: '#0F4C75',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flexDirection:'row', 
        flexWrap:'wrap', 
        alignSelf: 'center',
        backgroundColor: '#1B262C'
    },

    loginTab: {
        width: '50%',
        height: 50,
        border: 'solid',
        borderRightWidth: 5,
        borderLeftWidth: 5,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderRightColor: '#0F4C75',
        borderLeftColor: '#0F4C75',
        borderBottomColor: 'transparent',
        borderTopColor: '#0F4C75',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        
    },

    registerTab: {
        width: '50%',
        border: 'solid',
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightColor: '#0F4C75',
        borderBottomColor: '#0F4C75',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderTopRightRadius: 30,
    },

    loginTextStyle: {
        fontFamily: 'MontserratSB',
        marginTop: 10,
        alignSelf: 'center',
        fontSize:18,
        color: '#fff',
        marginRight: 90,
        marginLeft: 100,
    },

    registerTextStyle: {
        fontFamily: 'MontserratSB',
        marginTop: 10,
        alignSelf: 'center',
        fontSize:18,
        color: '#fff',
        marginLeft: 80,
        marginRight: 100,
    },

    buttonStyle: {
        width: '65%',
        alignSelf: 'center',
        backgroundColor: "#0F4C75",
        height: 30,
        borderRadius: 10,
    },

    buttonTextStyle: {
        fontFamily: 'Montserrat',
        color: '#fff',
        alignSelf: 'center',
        fontSize: 18,
        marginTop:4,
    },

    sloganText: {
        marginTop: 30,
        fontFamily: 'MontserratSB',
        alignSelf: 'center',
        color: '#000',
        fontSize:22,
    },

    passwordResetText: {
        fontFamily: 'Montserrat',
        cursor: 'pointer',
        alignSelf: 'center',
        color: '#fff',
        fontSize:16,
    },

    spacingSmall: {
        marginTop:20
    },

    divider: {
        border: 'solid',
        borderColor: '#BBE1FA',
        alignSelf: 'center',
        width: 500,
    },

    fill: {
    }
  });