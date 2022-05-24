
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new GoogleAuthProvider();
  const handleSignIn = () => {   
  const auth = getAuth();
    signInWithPopup(auth, provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
      console.log(displayName, email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
    .then(res => {
      const isSignOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(isSignOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>sign out</button>:
                          <button onClick={handleSignIn}>sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome {user.name} </p>
          <p>Your Email: {user.email}</p> 
          <img src={user.photo} alt="..."></img>
        </div>
      }
    </div>
  );
}
                           
export default App;
