
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
  const handleSignIn = () => {   // sign in
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
  const handleSignOut = () => {    // sign out
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

  const handleChange = (event) => {    // Change Even for input
    const input = event.target
    console.log(input.name, input.value);
  }

  const handleSubmit = () => {    // submit button
    console.log('submit');
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

      <h1>Our own Authentication</h1> 
      <form onSubmit={handleSubmit}>
      <input type="text" onBlur={handleChange} placeholder='Enter your email' name='email' required></input><br/>
      <input type="password" onBlur={handleChange} placeholder='Enter your password' name='password' required></input><br/>
      <input type="submit" value="submit" /><br/>


      </form>

    </div>
  );
}
                           
export default App;
