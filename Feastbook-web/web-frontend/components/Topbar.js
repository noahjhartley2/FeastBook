import React, {useState, useEffect, useRef} from 'react';
import '../assets/css/Topbar.css'
import home from '../assets/icons/home.png'
import homeFilled from '../assets/icons/homeFilled.png'
import plus from '../assets/icons/plus.png'
import plusFilled from '../assets/icons/plusFilled.png'
import user from '../assets/icons/user.png'
import userFilled from '../assets/icons/userFilled.png'
import logoutIcon from '../assets/icons/logout.png'
import SearchBar from './SearchBar';

import { Container, Row, Col } from 'react-bootstrap';

const Topbar = ({navigation, screenSelected, setUserToken, setVisitToken}) => {

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    if(screenSelected != null)
    {
        switch(screenSelected)
        {
            //Home selected
            case 1:
                homeIcon = homeFilled;
                plusIcon = plus;
                userIcon = user;
                break;
            // Add post selected
            case 2:
                homeIcon = home;
                plusIcon = plusFilled;
                userIcon = user;
                break;
            // Profile selected
            case 3: 
                homeIcon = home;
                plusIcon = plus;
                userIcon = userFilled;
                break;
            // visited user selected
            case 4: 
                homeIcon = home;
                plusIcon = plus;
                userIcon = user;
                break;
        }
    }  
    
    var homeIcon, plusIcon, userIcon;

    // Top right navigation icons.
    const handleHomeClick = () => {
        navigation.replace('Home');
    }
    const handlePlusClick = () => {
        navigation.replace('Add Post');
    }
    const handleProfileClick = () => {
        navigation.replace('Profile');
    }
    const handleLogoutClick = () => {
        setUserToken(null);
    }

  return (
    <div className='topbarContainer'>
        <Container fluid>
            <Row className='topbarRow'>
                <Col className='topbarLeft' md={3}>
                    <span className='logo'>FeastBook</span>
                </Col>
                <Col className='topbarCenter' md={6}>
                    <SearchBar className='topbarSearch' setVisitToken={setVisitToken} navigation={navigation}/>
                </Col>
                <Col className='topbarRight' md={3}>
                    <div className='topbarIcons'>
                        <div className='topbarIconItem'>
                            <img src={homeIcon} onClick={handleHomeClick}/>
                        </div>
                        <div className='topbarIconItem'>
                            <img src={userIcon} onClick={handleProfileClick}/>
                        </div>
                        <div className='topbarIconItem'>
                            <img src={plusIcon} onClick={handlePlusClick}/>
                        </div>
                        <div className='topbarIconItem'>
                            <img src={logoutIcon} onClick={handleLogoutClick}/>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>

  )
}

export default Topbar