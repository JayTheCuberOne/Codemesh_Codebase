import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fontsource/poppins"
import {
  FiArrowRight
} from "react-icons/fi"

// import GoogleLoginButton from './GoogleLoginButton';
import { GoogleLogin, googleLogout, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';

// for testing
import { postCode, getMe, getUnprotected, getProtected, getProtectedWithoutJwt } from '../utils/Fetcher'

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';
import {
  jwtTokenState
} from '../utils/RecoilRoots';

import '../home/styles.css';
import { Box } from '@mui/material';

export default function Login() {
  const [cookies, setCookies, removeCookies] = useCookies(['accessToken', 'refreshToken']);
  const [jwtToken, setJwtToken] = useRecoilState(jwtTokenState);

  const learnSection = null;

  const scrollDown = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    console.log(`jwtToken@Home : ${jwtToken}`);
  }, [jwtToken]);

  const navigate = useNavigate();

  // const onLoginClick = useCallback(() => {
  //   navigate("/login");
  // }, [navigate]);  

  // const testUnprotected = () => {
  //   getUnprotected().then((data) => {
  //     console.log("unprotected");
  //     console.log(data);
  //   });
  // }
  // const testProtected = () => {
  //   console.log(`jwtToken : ${jwtToken}`);
  //   getProtected(jwtToken).then((data) => {
  //     console.log("protected");
  //     console.log(data);
  //   });
  // }
  // const testProtectedWithoutJwt = () => {
  //   getProtectedWithoutJwt().then((data) => {
  //     console.log("protected without jwt");
  //     console.log(data);
  //   });
  // }

  const getIdToken = (token) => {
    //setToken(accessToken);
    // get JWT
    postCode(token).then((resp) => {
      // console.log(resp);
      if (resp == null) {
        window.alert("Login Failed");

        // Send to login
        return;
      }
      // console.log("-------- Access Token--------");
      // console.log(resp['accessToken']);
      // setAccessToken(resp['accessToken']);
      // setRefreshToken(resp['refreshToken']);
      setCookies('accessToken', resp['accessToken']); //, { path: '/' });
      setCookies('refreshToken', resp['refreshToken']); //, { path: '/' });

      navigate("/home");
    });
  }


  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Box height="100px"/>
        <h1>Welcome Aboard, Voyager!</h1>
        <p>Your Next Companion to Learn and Create AI in the Easiest Way</p>
        <br />
        <center>
          <div className='google-login'>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(`GoogleLogin success -> ${credentialResponse.credential}`);
                getIdToken(credentialResponse.credential);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        </center>
        <br/>
        <center>
          <footer>Developed by <a className='hyperlink' href='https://github.com/qwertyuiop0011' target='_blank'>Jeesung Lee</a> & St. Johnsbury Academy Jeju AI Development Club<br/>ⓒ2024 Codemesh | All rights reserved.</footer>
        </center>
      </body>
    </>
  );
}