
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  })

  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const handleSignIn = () => {   // sign in
  const auth = getAuth();
    signInWithPopup(auth, googleProvider)
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

  const handleFbSignIn = () => {       // Facebook sign in
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        const user = result.user;
        console.log('fb user:',user);
        //const credential = FacebookAuthProvider.credentialFromResult(result);
        //const accessToken = credential.accessToken;
      })
      .catch((error) => {
       // const errorCode = error.code;
        const errorMessage = error.message;
        //const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log("errorMessage:",errorMessage , 'credential:',credential);
      });
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

  const handleBlur = (e) => {    // OnBlur Even for input
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = (isPasswordValid && passwordHasNumber);
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {    // submit button
    if(newUser && user.email && user.password){
      const {email, password} = user;
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password) // create user
        .then((userCredential) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);

          const userr = userCredential.user;
          console.log(userr);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = 'The email address already in use by another account';
          newUserInfo.success = false;
          setUser(newUserInfo);
          // ..
        });
    }

    if(!newUser && user.email && user.password){  // login
      const {email, password} = user;
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          const name = userCredential.user;
          console.log('login',name)
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = 'wrong password';
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {
      console.log('user name updated successfully');
    }).catch((error) => {
      console.log('user name updated failed');
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>sign out</button>:
                          <button onClick={handleSignIn}>sign in</button>
      }<br/>
      <button onClick={handleFbSignIn}>Facebook login</button>
      {
        user.isSignedIn && <div>
          <p>Welcome {user.name} </p>
          <p>Your Email: {user.email}</p> 
          <img src={user.photo} alt="..."></img>
        </div>
      }

      <h1>Our own Authentication</h1> 
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser"></input>
      <label htmlFor='newUser'>New user sign up</label><br/>
       <form onSubmit={handleSubmit}>
        {newUser && <input type="text" onBlur={handleBlur} placeholder='Enter your name' name='name' required></input>} <br/>
        <input type="text" onBlur={handleBlur} placeholder='Enter your email' name='email' required></input> <br/>
        <input type="password" onBlur={handleBlur} placeholder='Enter your password' name='password' required></input> <br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in' } /><br/>
       </form>

      <p style={{color: 'red'}}> {user.error} </p>
      {user.success && <p style={{color: 'green'}}>User { newUser ? 'created' : 'Login '} successfully</p>}

    </div>
  );
}
                           
export default App;
