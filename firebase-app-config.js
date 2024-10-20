import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  "projectId": "damit-ng-bata",
  "appId": "1:33706651741:web:2fe8f93ba67dc24f149db4",
  "storageBucket": "damit-ng-bata.appspot.com",
  "apiKey": "AIzaSyA8iMpg0QJyhWiFQIChVD9Eq165gli4mDU",
  "authDomain": "damit-ng-bata.firebaseapp.com",
  "messagingSenderId": "33706651741",
  "measurementId": "G-NQ1GTWHKM6"
}

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp)