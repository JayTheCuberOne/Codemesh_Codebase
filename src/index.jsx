import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';

// added for google oauth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <GoogleOAuthProvider> {/* ClientId attribute has been redacted due to security issues. */}
      <RecoilRoot>
        <App />
      </RecoilRoot>
      </GoogleOAuthProvider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
