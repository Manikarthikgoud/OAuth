import React, { useCallback, useEffect, useState } from 'react'
import GoogleButton from 'react-google-button'
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios'
import { Col, Row } from 'antd'
import OAuthImage from './assets/google_oauth.jpg'

export default function Login() {

    const handleLogin = async () => {
        try {
            // Gets authentication url from backend server
            const {
                data: { url },
            } =
                await axios.get(`http://localhost:5000/auth/url`)
            // Navigate to consent screen
            console.log(url)
            window.location.assign(url)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className='user-profile'>
            <div className='login-card'>                
                <Row justify={'center'} align={'middle'} gutter={10}>
                    <Col md={16} style={{margin:'0px', display:'flex', alignItems:'center'}}>
                        <img src={OAuthImage} className='OAuthImage' />
                    </Col>
                    <Col md={8}>
                        <h2>Login</h2>
                        <GoogleButton
                            className='google-login-btn'
                            type="light" // can be light or dark
                            onClick={() => { handleLogin() }}                            
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
