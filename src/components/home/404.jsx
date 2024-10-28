import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fontsource/poppins"
import {
  FiArrowRight
} from "react-icons/fi"

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <body>
        <h1>There's Nothing Here...</h1>
        <center>
            <button className='go-back-home-button' onClick={() => navigate('/home')}>Take Me Back Home{' '}<FiArrowRight /></button>
        </center>
      </body>
    </>
  );
}