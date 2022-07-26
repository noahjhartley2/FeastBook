import React, {useState, createRef, useRef} from 'react';
import feastbook from '../assets/feastbook.png';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';

const LoginScreen = ({navigation, setReturnToken, setLikedPosts}) => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const passwordInputRef = createRef();

    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail) {
            setErrortext('Username required');
            return;
        }
        if (!userPassword) {
            setErrortext('Password required');
            return;
        }
        setLoading(true);
        let dataToSend = {login: userEmail, password: userPassword};
        var s = JSON.stringify(dataToSend);
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
                if (response.error === "Not verified check email") {
                    navigation.navigate('VerifyAccount');
                    return;
                }
                createLikesArr(response.id, response.token);
                setLoading(false);         
                setReturnToken(response); 
            }
            else {
                setErrortext(response.error); 
                console.log('Incorrect username and/or password');
            }
        })
        .catch((error) => {
            setLoading(false);
            console.error(error);
        });
    }

    function createLikesArr(userid, authToken) {
        console.log("token from login: " + authToken);
        let dataToSend = {userid: userid};
        var s = JSON.stringify(dataToSend)
        fetch('https://feastbook.herokuapp.com/api/getfavorite', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken,
                //'Accept': 'application/json, text/plain, */*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            let arr = [];
            for (let i = 0; i < response.results.length; i++) {
                arr.push(response.results[i]._id);
            }
            setLikedPosts(arr);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const handleForgotPassword = () => {
        navigation.replace('ForgotPassword')
    }

    return (
        <ScrollView style={{flex:1, backgroundColor: '#fff'}}>
            <View style = {styles.mainBody}>
                <View style={styles.header}>
                    <Text style={styles.heading}>FeastBook</Text>
                </View>

                <View>
                    <Text style={styles.sloganText}>Connect with friends and share your culinary creations with the world</Text>
                </View>

                <View style={{flexDirection:'row', flexWrap:'wrap', alignSelf:'center'}}>
                    <Image source={feastbook} style={{width: 300, height: 600}}/>
                    
                    <View style={{flexDirection: 'column', marginTop:30}}>
                        <View style={styles.tabs}>
                            <View style={styles.loginTab}>
                                <Text style={styles.loginTextStyle}>Login</Text>
                            </View>
                            <View style={styles.registerTab}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Register')}>
                                    <Text style={styles.registerTextStyle}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                        <SafeAreaView style={styles.SafeAreaView}>
                            
                            <View style={styles.spacingSmall}></View>
                            <Text style={styles.loginPrompts}>Username</Text>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(userEmail) => setUserEmail(userEmail)}
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
                            <Text style={styles.passwordResetText}
                                    onPress={handleForgotPassword}>
                                Forgot your password? Click here!
                            </Text>
                            <View style={styles.spacingSmall}></View>
                        </SafeAreaView>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;

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
        width: '75%',
        border: 'solid',
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        borderBottomColor: '#0F4C75',
        borderRightColor: '#0F4C75',
        borderLeftColor: '#0F4C75',
        borderBottomEndRadius: 30,
        borderBottomLeftRadius: 30,
        alignSelf: 'center',
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
        alignSelf: 'center',
        width: '95%',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
        padding: 10,
    },

    errorTextStyle: {
        marginLeft: '30%',
        color: 'red',
        fontSize: 'medium',
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
        cursor: 'pointer',
        fontFamily: 'Montserrat',
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