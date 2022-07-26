import React, {useState, useEffect, useRef} from 'react';
import searchIcon from '../assets/icons/search.png'
import cancelIcon from '../assets/icons/cancel.png'
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import '../assets/css/Searchbar.css'
import { OverlayTrigger, Popover } from 'react-bootstrap';

const SearchBar = ({navigation, setVisitToken}) => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        console.log("handling search");
        let dataToSend = {
            search: search
        }
        let s = JSON.stringify(dataToSend);
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
        })
        .catch((error) => {
            setLoading(false);
            console.error(error);
        });
    }

    const visitProfile = (user) =>
    {
        setVisitToken(user);
        console.log('visit token called: ' + JSON.stringify(user));
        navigation.replace('Visiting');                     
    }
    
    const popover = (
        <Popover id='pop' className='popper'>
            <Popover.Body>
            {searchResults != 0 && (
            <div className='searchResultsContainer'>
                {
                searchResults.map(user => {
                    return (
                        <div    key={user.id}
                                className='searchResult'
                                onClick={() => visitProfile(user)}>
                            {user.username}
                        </div>
                    )
                })}
            </div>
            )}
            </Popover.Body>
        </Popover>
    );

    const initSearch = () =>
    {
        console.log("init search called")
    }

    const wipeSearch = () =>
    {
        console.log("wipe search called")
        setSearch('');
        setTimeout(() => setSearchResults([]), 500);
    }

    return (
        <div className='searchContainer'>
            <OverlayTrigger trigger='focus' placement='bottom-start' overlay={popover}>
                <div className='searchBar' 
                onBlur={wipeSearch} onFocus={initSearch}>
                    <img src={searchIcon} className='searchIcon'/>
                    <input placeholder='Search...' 
                        className='searchInput'
                        type='text'
                        onChange={event => {setSearch(event.target.value)}} 
                        onKeyUp={handleSearch}
                        value={search}
                    />
                </div>
            </OverlayTrigger>
            {/* <Modal show={show}>

            </Modal> */}
            {/* {searchResults != 0 && (
            <div className='searchResultsContainer'>
                {
                searchResults.map(user => {
                    return (
                        <div    key={user.id}
                                className='searchResult'
                                onClick={() => visitProfile(user)}>
                            {user.username}
                        </div>
                    )
                })}
            </div>
            )}   */}
        </div>
  )
}

export default SearchBar