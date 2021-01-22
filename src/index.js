import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';
import 'tachyons';
// const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
	apiKey: "AIzaSyAaEhifXg7wmY6EGFYnuXfW_hn63Ao3fVo",
  authDomain: "chatapp-6c03e.firebaseapp.com",
  projectId: "chatapp-6c03e",
  storageBucket: "chatapp-6c03e.appspot.com",
  messagingSenderId: "388831121229",
  appId: "1:388831121229:web:3f5e7c0d370d8064183104",
  measurementId: "G-69YNPS6461"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
