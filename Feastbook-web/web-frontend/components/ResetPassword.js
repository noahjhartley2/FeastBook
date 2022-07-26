import React, { useState } from 'react';
import './bootstrap/css/bootstrap-grid.min.css';
import './bootstrap/css/bootstrap.min.css';
import '../assets/css/ResetPassword.css'
import { Container, Row, Col } from 'react-bootstrap';

const ResetPassword = ({navigation}) => {
  return (
    <Container>
        <Row className='resetHeaderRow'> HELLO </Row>
        <Row className='resetInputRow'>
          <div>
            <label>Type Password</label>
            <input type='password' placeholder='password'/>
          </div>
          <div>
            <label>Reset Password</label>
            <input type='password' placeholder='password'/>
          </div>
        </Row>
        <Row className='resetFooterRow'>
          <Button>Click here to do it</Button>
        </Row>
    </Container>
  )
}

export default ResetPassword