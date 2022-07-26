import React, {useState } from 'react';
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import '../assets/css/RegisterSuccess.css';
import checkmark from '../assets/icons/checkmark.png';
import { Container, Row, Col, Button } from 'react-bootstrap';

const RegisterSuccess = ({navigation}) => {

  return (
    <div className='background'>
      <Container className='regSuccessContainer' fluid>
          <Row className='regSuccessRow1'>
              Follow the link in your email to verify the account      
          </Row>
          <Row className='regSuccessRow'>
              <button onClick={() => navigation.replace("Login")}
              className='regSuccessButtonStyle'>
                Ready to log in?
              </button>
          </Row>
      </Container>
    </div>
  )

}

export default RegisterSuccess