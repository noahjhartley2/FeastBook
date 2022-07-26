import React, {useState, useRef, useEffect} from 'react';
import Topbar from './Topbar';
import '../assets/css/Profile.css'
import cancelIcon from '../assets/icons/cancel.png'
import delIcon from '../assets/icons/delete.png'
import { Container, Row, Col, Modal, Tabs, Tab, Alert, Button } from 'react-bootstrap';

const Profile = ({navigation, userToken, setUserToken, setVisitToken}) => {

  const [loading, setLoading] = useState(false);
  const [postResults, setPostResults] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    displayPosts();
  }, []);

  const displayPosts = () => {
    setLoading(true);
    let dataToSend = {id: userToken.id};
    var s = JSON.stringify(dataToSend)
    fetch('https://feastbook.herokuapp.com/api/userposts', {
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
        setLoading(false);
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

  const showPosts = (post) => {
    setSelectedPost(post);
    handleShow();
  }

  const handleDelete = () => setShowAlert(true);

  const deletePost = () => {

    console.log("Delete : " + selectedPost.id);
    setShowAlert(false);
    setShow(false);

    let dataToSend = {id: userToken.id, postid: selectedPost.id};
    var s = JSON.stringify(dataToSend)
    console.log(s);
    fetch('https://feastbook.herokuapp.com/api/deletepost', {
        method: 'DELETE',
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
        displayPosts();
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
      <Alert variant='danger' show={showAlert} className='delAlert'>
        <Alert.Heading>
          Are you sure you want to PERMANENTLY DELETE <br/>{selectedPost !== null ? selectedPost.name : "this post"}?
        </Alert.Heading>
        <hr/>
        <div className="d-flex justify-content-lg-between">
          <Button onClick={deletePost} variant="danger">
            DELETE
          </Button>
          <Button onClick={() => setShowAlert(false)} variant="success">
            Cancel
          </Button>
        </div>
      </Alert>
        <Modal.Body>
          {selectedPost != undefined ?
          <Container className='modalBodyContainer'>
            <Row className='modalHeaderRow'>
              <Col xs={9} className="modalHeaderCol1">{selectedPost.name}</Col>
              <Col className="modalHeaderCol2">
                <img src={delIcon} onClick={handleDelete} className='delIcon'/>
                <img src={cancelIcon} onClick={handleClose} className='cancelIcon'/>
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
                  className="tabs"
                >
                  <Tab eventKey="ingredients" title="Ingredients" className='ingTab'>
                    <div className='ingTabText'>
                      {selectedPost.ingredients}
                    </div>
                  </Tab>
                  <Tab eventKey="directions" title="Directions" className='dirTab'>
                    <div className='ingTabText'>
                      {selectedPost.directions}
                    </div>
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
          <Col md={5} className='nameCell'>{userToken.login}</Col>
          <Col md={{span : 5, offset: 2}} className='favoritesCell'
                onClick={() => navigation.navigate('Likes')}>Favorites</Col>
        </Row>
        <Row className='postsRow'>          
          {postResults.length > 0 ? 
            postResults.map(item => 
              (<Col xs={4}  
                    key={item.id}
                    className='postCell'>
                <img src={item.image} onClick={() => showPosts(item)} className='postImage'/>
              </Col>))                
            : 'No posts...'
          } 
        </Row>         
      </Container>
    </div>
  )
}

export default Profile