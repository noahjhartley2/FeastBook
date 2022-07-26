import React, {useState, useRef, useEffect} from 'react';
import Topbar from './Topbar';
import '../assets/css/LikedPosts.css';
import cancelIcon from '../assets/icons/cancel.png';
import back from '../assets/icons/back64.png';
import like from '../assets/icons/like.png';
import likeF from '../assets/icons/dislike.png';
import { Container, Row, Col, Modal, Tabs, Tab, Alert, Button } from 'react-bootstrap';

const LikedPosts = ({navigation, userToken, setUserToken, setVisitToken, 
                      likedPosts, setLikedPosts}) => {

  const [loading, setLoading] = useState(false);
  const [postResults, setPostResults] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [localLikedPosts, setLocalLikedPosts] = useState(likedPosts);

  useEffect(() => {
    displayFavorites();       
    }, []);

  const displayFavorites = () => {
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
          setPostResults(arr);
      })
      .catch((error) => {
          console.error(error);
      });
  }


  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => {setShow(false); setShowAlert(false) };
  const handleShow = () => setShow(true);

  const showPost = (post) => {
    setSelectedPost(post);
    handleShow();
  }

  const handleDislike = () => setShowAlert(true);
  const dislikePost = () => {
    let retArr = likedPosts.map((x) => x);
    let removalIndex = retArr.indexOf(selectedPost.id);
    retArr.splice(removalIndex, 1);
    setLikedPosts(retArr);

    console.log("disliked post: " + selectedPost.name)
    let dataToSend = {userid: userToken.id, postid: selectedPost.id};
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
        console.log(response);
        handleClose();
        displayFavorites();
    })
    .catch((error) => {
        console.error(error);
    });
  }
  

  return (
  <div className='background'>
      <Topbar navigation={navigation} screenSelected={3} 
      setUserToken={setUserToken} setVisitToken={setVisitToken}/>
      <Modal show={show} onHide={handleClose} className='modalContainer'>
        <Alert variant='warning' show={showAlert} className='delAlert'>
        <Alert.Heading>
          Unfavorite {selectedPost !== null ? selectedPost.name : "this post"}?
        </Alert.Heading>
        <hr/>
        <div className="d-flex justify-content-lg-between">
          <Button onClick={() => setShowAlert(false)} variant="success">
            Cancel
          </Button>
          <Button onClick={dislikePost} variant="warning">
            Remove from Favorites.
          </Button>
        </div>
        </Alert>
        <Modal.Body>
          {selectedPost != undefined ?
          <Container className='modalBodyContainer'>
            <Row className='modalHeaderRow'>
              <Col xs={9} className="modalHeaderCol1">{selectedPost.name}</Col>
              <Col className="modalHeaderCol2">
                <img src={likeF} onClick={() => handleDislike(selectedPost.id)} className='vLikeIcon'/>
                <img src={cancelIcon} onClick={handleClose} className='vCancelIcon'/>
              </Col>
            </Row>
            <Row className='modalContentRow'>
              <Col className='imageHalf'>
                <img src={selectedPost.image}/>
              </Col>
              <Col className='infoHalf'>
                <Tabs
                  defaultActiveKey="ingredients"
                  id="postTabs"
                  className="mb-3"
                >
                  <Tab eventKey="ingredients" title="Ingredients" className='ingTab'>
                    {selectedPost.ingredients}
                  </Tab>
                  <Tab eventKey="directions" title="Directions" className='dirTab'>
                    {selectedPost.directions}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Container>
          : 'Error: no post selected.'
          }
        </Modal.Body>
      </Modal>
      <Container>
          <Row className='headerRow'>
              <Col md={5} className='titleCell'>Favorites:</Col>
              <Col md={{span : 5, offset: 2}} className='backToProfileCell'
                  onClick={() => navigation.navigate('Profile')}>
                      <img src={back}/>
                  </Col>
          </Row>
          <Row className='postsRow'>            
              {postResults.length > 0 ? 
              postResults.map(item => 
                  (<Col xs={4}  
                      key={item.id}
                      className='postCell'>
                  <img src={item.image} onClick={() => showPost(item)} className='postImage'/>
                  </Col>))                
              : 'No posts...'
              } 
          </Row>         
      </Container>
  </div>
  )

}

export default LikedPosts