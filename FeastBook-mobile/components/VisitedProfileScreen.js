import React, {useState, createRef, useEffect} from 'react';
import home from '../assets/icons/home.png';
import userFilled from '../assets/icons/userFilled.png';
import search from '../assets/icons/search.png';
import plus from '../assets/icons/plus.png';
import 'localstorage-polyfill';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';

const VisitedProfileScreen = ({route, navigation}) => { 

    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userID');
    const username = localStorage.getItem('username');
    const [postResults, setPostResults] = useState([]);
    const {visitedUser, visitedId} = route.params;

    useEffect(() => {
        displayPosts();
    }, []);

    const displayPosts = () => {
        let dataToSend = {id: visitedId};
        var s = JSON.stringify(dataToSend)
        //console.log(s);
        fetch('https://feastbook.herokuapp.com/api/userposts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            let arr = [];
            for (let i = 0; i < response.results.length; i++) {
                let temp = {
                    name: response.results[i].name,
                    image: response.results[i].photo,
                    ingredients: response.results[i].ingredients,
                    directions: response.results[i].directions,
                    id: response.results[i]._id
                }
                arr.push(temp);
            }
            //console.log(response);
            //console.log(response.results[0])
            setPostResults(arr)
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.heading}>FeastBook</Text>
            </View>

            <SafeAreaView style={{backgroundColor: '#1B262C', flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                <Text style={styles.username}>{visitedUser}</Text>
                </View>
                <View style={styles.spacingSmall}></View>

                <View style={{flex: 1}}>
                    <FlatList data={postResults} renderItem={({item}) => 
                        <View>
                            <Image style={styles.postImage} source={{uri: item.image}}/>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.postName}>{item.name}</Text>
                            </View>
                            <View style={styles.body}>
                                <Text style={styles.postBody}>Ingredients</Text>
                                <Text style={styles.postText}>{item.ingredients}</Text>
                            </View>

                            <View style={{marginTop:5}}></View>

                            <View style={styles.body}>
                                <Text style={styles.postBody}>Directions</Text>
                                <Text style={styles.postText}>{item.directions}</Text>
                            </View>
                            <View style={{marginTop:30}}></View>
                        </View>
                    }/>
                </View>
                <View style={styles.spacingSmall}></View>
            </SafeAreaView>

            <View style = {styles.footer}>
                
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Explore')}>
                    <Image source={home} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Post')}>
                    <Image source={plus} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Search')}>
                    <Image source={search} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
                <Image source={userFilled} style={{width: 40, height: 40}}/>
            </View>
        </View>
    )
}

export default VisitedProfileScreen;

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

    username: {
        marginTop: '3%',
        paddingLeft: '3%',
        fontFamily: 'MontserratSB',
        fontSize: 30,
        color: '#fff'
    },

    postImage: {
        width: '100%',
        aspectRatio: 4/4,
    },

    postName: {
        marginTop: '1%',
        marginBottom: '1%',
        paddingLeft: '3%',
        width: '95%',
        fontFamily: 'MontserratSB',
        fontSize: 18,
        color: '#fff'
    },

    postBody: {
        paddingLeft: '2%',
        fontFamily: 'MontserratSB',
        fontSize: 16,
        color: '#fff'
    },

    postText: {
        paddingLeft: '2%',
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#fff'
    },

    body: {
        border: 'solid',
        borderWidth: 4,
        borderColor: '#0F4C75',
        borderRadius: 10,
        width: '95%',
        alignSelf: 'center'
    },

    spacingSmall: {
        marginTop:20
    },

    spacingLarge: {
        marginTop:80
    },

    buttonStyle: {
        marginTop: '3%',
        width: '35%',
        borderRadius: 10,
        backgroundColor: "#0F4C75",
        position: 'absolute', 
        right: '3%',
        shadowColor: '#000',
        shadowOpacity: 5,
        elevation: 6,
        shadowRadius: 15 ,
        shadowOffset : { width: 1, height: 13},
    },

    buttonTextStyle: {
        fontFamily: 'MontserratSB',
        alignSelf: 'center',
        top: 3,
        fontSize:26,
        color: '#fff'
    },
});