import React, {useState, createRef} from 'react';
import home from '../assets/icons/home.png';
import user from '../assets/icons/user.png';
import searchFilled from '../assets/icons/searchFilled.png';
import plus from '../assets/icons/plus.png';
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
  FlatList,
  Dimensions
} from 'react-native';

const SearchScreen = ({navigation}) => { 

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultsNum, setResultsNum] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const height = Dimensions.get("window").height + 50;

    const handleSearch = () => {
        let dataToSend = {
            search: search
        }
        let s = JSON.stringify(dataToSend);
        console.log(s);
        fetch('https://feastbook.herokuapp.com/api/searchuser', {
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
            let arr = [];
            for (let i = 0; i < 10; i++) {
                if (typeof(response.results[i]) !== 'undefined') {
                    let temp = {
                        username: response.results[i].login,
                        id: response.results[i].id
                    }
                    arr.push(temp)
                }
                else break;
            }
            arr.sort((a, b) => a.username.localeCompare(b.username, undefined, {sensitivity: 'base'}));
            setSearchResults(arr);
            //console.log(searchResults);
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

            <SafeAreaView style={{backgroundColor: '#1B262C', flex: 1}}>
                <TextInput
                        style={styles.inputStyle}
                        onChangeText={(search) => setSearch(search)}
                        placeholder="Search"
                        returnKeyType="next"
                        onSubmitEditing={handleSearch}
                />

                <View>
                    <FlatList data={searchResults} renderItem={({item}) => 
                    <TouchableOpacity onPress={()=> navigation.navigate('VisitedProfile', {visitedUser: item?.username, visitedId: item?.id})}>
                        <Text style={styles.listStyle}>{item?.username}</Text>
                    </TouchableOpacity>}/>
                </View>
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
                <Image source={searchFilled} style={{width: 40, height: 40}}/>
                <TouchableOpacity
                    stlye={styles.buttonStyle}
                    onPress={() => navigation.navigate('Profile')}>
                    <Image source={user} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SearchScreen;

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

    inputStyle: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        backgroundColor: '#fff',
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
        padding: 10,
    },

    textStyle: {
        fontFamily: 'Montserrat',
        paddingLeft: 20,
        color: '#fff',
        fontSize:16,
    },

    listStyle: {
        fontFamily: 'Montserrat',
        paddingLeft: 20,
        marginBottom: 7,
        color: '#fff',
        fontSize:16,
    },
});