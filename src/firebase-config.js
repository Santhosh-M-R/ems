import { initializeApp } from 'firebase/app';
import {getDatabase} from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyDpkLj87b7erQ2dvj2Hp0qsl3oY0qgoRr0",
  authDomain: "expense-management-system1.firebaseapp.com",
  projectId: "expense-management-system1",
  storageBucket: "expense-management-system1.appspot.com",
  messagingSenderId: "689650198864",
  appId: "1:689650198864:web:a109dd905b8773a02d2455",
  measurementId: "G-B7DFRVH9N6"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

