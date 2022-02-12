import dotenv from 'dotenv';

// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";


dotenv.config()

// Initialize Firebase
const app = initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId:  process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  });

const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

export const auth = getAuth();

auth.useDeviceLanguage();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider).then((res) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = res.user;

    
    console.log("hello")
    console.log(token)

  }).catch((error) => {
    console.log(error.message)
  })

  
}

export const logOut = () => {
  signOut(auth).then(()=> {
    console.log("logout successful")
  }).catch((error) => {
    console.log(error.message)
  })
}
