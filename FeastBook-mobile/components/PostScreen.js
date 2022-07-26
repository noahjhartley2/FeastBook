import React, {useState, createRef} from 'react';
import home from '../assets/icons/home.png';
import user from '../assets/icons/user.png';
import search from '../assets/icons/search.png';
import plusFilled from '../assets/icons/plusFilled.png';
import * as ImagePicker from 'expo-image-picker';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image, 
  Button,
  Dimensions,
  Platform,
} from 'react-native';

const PostScreen = ({navigation}) => { 

    const userId = localStorage.getItem('userID');
    const [image, setImage] = useState(null);
    const [dishName, setDishName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [directions, setDirections] = useState('');
    const [base64Img, setBase64Img] = useState('');
    const [errortext, setErrortext] = useState('');
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem('username');
    const height = Dimensions.get("window").height + 50;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            base64: true,
        });

        //console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            setBase64Img("data:image/jpeg;base64," + result.base64);
        }
    };

    const handleSubmitPress = () => {
        setErrortext('');
        if (!image) {
            setErrortext('Image required');
            return;
        }
        if (!dishName) {
            setErrortext('Dish name required');
            return;
        }
        if (!ingredients) {
            setErrortext('Ingredients required');
            return;
        }
        if (!directions) {
            setErrortext('Directions required');
            return;
        }
        setLoading(true);
        let dataToSend = {userid: userId, name:dishName, photo: base64Img, ingredients: ingredients, directions: directions};
        var s = JSON.stringify(dataToSend)
        console.log(s);
        fetch('https://feastbook.herokuapp.com/api/createpost', {
            method: 'POST',
            headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            setLoading(false);
            console.log(response);
            navigation.navigate('SuccessfulPost')
        })
        .catch((error) => {
            setLoading(false);
            console.error(error);
        });
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>

            <ScrollView style={{backgroundColor: '#1B262C', flex: 1}}>
                <View style={styles.spacingSmall}></View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={pickImage}><Text style={styles.buttonTextStyle}>Upload Image</Text></TouchableOpacity>
                    <View style={styles.spacingSmall}></View>
                    {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }}/>}
                    <View style={styles.spacingSmall}></View>
                </View>

                <Text style={styles.loginPrompts}>Name of Dish</Text>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={(dishName) => setDishName(dishName)}
                    placeholder="Name of Dish"
                    returnKeyType="next">
                </TextInput>

                <Text style={styles.loginPrompts}>Ingredients</Text>
                <TextInput
                    style={styles.boxStyle}
                    onChangeText={(ingredients) => setIngredients(ingredients)}
                    placeholder="List Ingredients"
                    returnKeyType="next"
                    multiline={true}>
                </TextInput>

                <Text style={styles.loginPrompts}>Directions</Text>
                <TextInput
                    style={styles.boxStyle}
                    onChangeText={(directions) => setDirections(directions)}
                    placeholder="List Directions"
                    returnKeyType="next"
                    multiline={true}>
                </TextInput>

                <View style={styles.spacingSmall}></View>

                {errortext != '' ? (
                <Text style={styles.errorTextStyle}>
                    {errortext}
                </Text>
            ) : null}

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.submitButtonStyle} onPress={handleSubmitPress}>
                        <Text style={styles.submitButtonTextStyle}>Create Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.spacingLarge}></View>

            </ScrollView>

            <View style = {styles.footer}>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Explore')}>
                    <Image source={home} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
                <Image source={plusFilled} style={{width: 40, height: 40}}/>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Search')}>
                    <Image source={search} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Profile')}>
                    <Image source={user} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PostScreen;

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

    content: {
        fontFamily: 'MontserratSB',
        fontSize: 36,
        color: '#000'
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

    submitButtonStyle: {
        borderRadius: 10,
        width: 300,
        backgroundColor: "#0F4C75",
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        shadowColor: '#000',
        shadowOpacity: 5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },

    buttonTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize: 20,
        color: '#fff'
    },

    submitButtonTextStyle: {
        fontFamily: 'Montserrat',
        fontSize: 24,
        color: '#fff'
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

    boxStyle: {
        fontFamily: 'Montserrat',
        backgroundColor: '#fff',
        height: 120,
        margin: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
        padding: 10,
        textAlignVertical: 'top'
    },

    spacingSmall: {
        marginTop:20
    },

    spacingLarge: {
        marginTop:80
    },

    errorTextStyle: {
        fontFamily: 'Montserrat',
        alignSelf: 'center',
        fontSize:18,
        color: 'red',
        marginBottom: 20,
    }
});