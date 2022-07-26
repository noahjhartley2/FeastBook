import React, { useState, useRef } from 'react';
import '../assets/css/VerifyAccount.css'
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import { Container, Row, Col, Button} from 'react-bootstrap';

const VerifyAccount = ({navigation, setUserToken}) => {

    const handleSubmitPress = () => {
        navigation.navigate('Login')
    }

  return (
    <div className='background'>
        <Container className='verifyContainer' fluid>
            <Row className='verifyRow1'>
                <strong>Error: account is not verified</strong>
            </Row>
            <Row className='verifyRow1'>
                
                Check your email for a verification link.
            </Row>
            <Row className='verifyRow2'>
                <button className='forgotButtonStyle' onClick={handleSubmitPress}>
                    Return to Login
                </button>
            </Row>
        </Container>
    </div>
  )

}

export default VerifyAccount