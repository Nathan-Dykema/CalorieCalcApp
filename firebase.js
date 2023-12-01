// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, initializeAuth, getReactNativePersistence} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';





const firebaseConfig = {
  apiKey: "AIzaSyBhBVkqA0fvpT57qjA5cQ0QMcupjlDj3es",
  authDomain: "caloriecounterapp-2f7cd.firebaseapp.com",
  projectId: "caloriecounterapp-2f7cd",
  storageBucket: "caloriecounterapp-2f7cd.appspot.com",
  messagingSenderId: "375790161151",
  appId: "1:375790161151:web:ce4727d39e8b86a92950ca",
  measurementId: "G-X7RWKC0JQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

//const auth = getAuth(app);

export {app , auth};

