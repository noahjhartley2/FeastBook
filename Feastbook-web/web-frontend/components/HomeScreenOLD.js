import React, {useState, useEffect} from 'react';
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import '../assets/css/HomePage.css'
import like from '../assets/icons/likePlusG.png'
import likeF from '../assets/icons/likePlus.png'
import Topbar from './Topbar';
import { Container, Row, Col, Modal, Tabs, Tab } from 'react-bootstrap';

const HomeScreen = ({navigation, userToken, setUserToken, setVisitToken, likedPosts, setLikedPosts}) => {

    const [loading, setLoading] = useState(false);
    const [nameResults, setNameResults] = useState([]);
    const [postResults, setPostResults] = useState([]);

    const [favorites, setFavorites] = useState(likedPosts);

    const [selectedPost, setSelectedPost] = useState(null);
    const [fetching, setFetching] = useState(false);

    console.log("liked posts in homescreen: " + likedPosts);

    useEffect(() => {
        displayPosts();
      }, []);

    const displayPosts = () => {
        console.log("usertoken in homescreen displayposts: " + userToken.token)
        setLoading(true)
        fetch('https://feastbook.herokuapp.com/api/posts', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + userToken.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
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
                    id: response.results[i]._id,
                    likes: response.results[i].likes,
                    posterId: response.results[i].userid,
                    posterName: response.results[i].login
                }
                arr.push(temp);
            }
            setPostResults(arr);
            setLoading(false);
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    const getPosterNames = () =>
    {
        let arr = [];
        for (let i = 0; i < postResults.length; i++) {
            let dataToSend = {userid: postResults[i].posterId}
            var s = JSON.stringify(dataToSend)
            fetch('https://feastbook.herokuapp.com/api/getuserinfo', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + userToken.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: s
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response.results[0].login)
                let temp = {
                    posterName: response.results[0].login,
                    name: postResults[i].name,
                    image: postResults[i].image,
                    ingredients: postResults[i].ingredients,
                    directions: postResults[i].directions,
                    id: postResults[i].id,
                    posterId: postResults[i].posterId,
                    posterName: postResults[i].login,
                }
                console.log(temp);
                arr.push(temp);
                console.log(arr)
            })
            .catch((error) => {
                console.error(error);
            });
        }
        console.log(arr)
        setNameResults(arr);   
    }

    const getFavorites = () => {
        let dataToSend = {userid: userToken.id};
          var s = JSON.stringify(dataToSend)
          fetch('https://feastbook.herokuapp.com/api/getfavorite', {
              method: 'POST',
              headers: {
                    'Authorization': 'Bearer ' + userToken.token,
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
              setFavorites(arr);
          })
          .catch((error) => {
              console.error(error);
          });
      }

    const handleLikePress = (item) => {
        if(likedPosts.includes(item.id)) {
            // dislikePost(item.id);
            console.log("Home line 137: cannot dislike");
        }
        else {
            likePost(item);
        }
    }

    const dislikePost = (id) => {

        let retArr = likedPosts.map((x) => x);
        let removalIndex = likedPosts.indexOf(id);
        retArr.splice(removalIndex, 1);
        setLikedPosts(retArr);

 
        let dataToSend = {userid: userToken.id, postid: id};
        var s = JSON.stringify(dataToSend)
        console.log(s);
        fetch('https://feastbook.herokuapp.com/api/dislikepost', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken.token,
                //'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            console.log(likedPosts)
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const likePost = (item) => {
        console.log("calling likePost in HomeScreen")
        setLikedPosts([...likedPosts, item.id]);

        let dataToSend = {userid: userToken.id, postid: item.id};
        var s = JSON.stringify(dataToSend)
        console.log(s);
        fetch('https://feastbook.herokuapp.com/api/likepost', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken.token,
                //'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: s,
        })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const visitOtherUser = (item) => {
        console.log("check check" + item.posterName)
        let tempObject = {
            id: item.posterId,
            username: item.posterName
        }
        setVisitToken(tempObject);
        console.log('visit token called: ' + item.posterId);
        navigation.replace('Visiting');
    }



    return (
        <div className='background'>
            <Topbar navigation={navigation} screenSelected={1} 
            setUserToken={setUserToken} setVisitToken={setVisitToken}/>
            <Container className='homeContainer'>
                {postResults.length > 0 && !fetching ? 
                postResults.map(item =>(<div key={item.id} className='allTheInfo'>
                    <Row className='homePostHeaderRow'>
                        <Col className='homePostNameCol' md={7}>
                            {item.name}
                        </Col>
                        <Col className='homeUserNameCol' md={4}>
                            <div onClick={() => visitOtherUser(item)}  className='posterName'>
                                Poster: {item.posterName}
                            </div>
                        </Col>                        
                    </Row>
                    <Row className='homePostContentRow'>
                        <Col className='homeImgCol' md={4}>
                        <img src={item.image} className='homePostImg'/>
                        </Col>
                        <Col className='homeInfoCol' md={7}>
                            <Tabs
                                defaultActiveKey="ingredients"
                                id="hPostTabs"
                                className="tabs"
                                >
                                <Tab eventKey="ingredients" title="Ingredients" className='hIngTab'>
                                    <div className='hIngTabText'>
                                        {item.ingredients}
                                    </div>
                                </Tab>
                                <Tab eventKey="directions" title="Directions" className='hDirTab'>
                                    <div className='hDirTabText'>
                                        {item.directions}
                                    </div>
                                </Tab>
                            </Tabs>
                            {/* <div className='homeInfoText' wrap='hard'>
                                Ingedients:<br/>
                                {item.ingredients}
                            </div>
                            <div className='homeInfoText' wrap='hard'>
                                Directions<br/>
                                {item.directions}
                            </div> */}
                        </Col>
                        <Col className='homeLikesCol' md={1}>
                            <Row className='homeLikesRow'>                                
                                <img src={
                                    likedPosts.includes(item.id) ? likeF : like} 
                                    className='hLikeIcon'
                                    onClick={() => handleLikePress(item)}
                                />                              
                            </Row>
                        </Col>
                    </Row>
                </div>))
                : 'no posts found'
                }
            </Container>
        </div>
    )
}

export default HomeScreen