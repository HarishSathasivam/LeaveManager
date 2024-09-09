import React, { useState } from 'react';
import SignIn from './js/Login/SignIn';
import Login from './js/Login/Login';
import LandingPage from './js/main/LandingPage';
import './css/App.css';

function App() {
  let [isSignedIn, setIsSignedIn] = useState(false);
  let [currentUser, setCurrentUser] = useState('');
  let [showLogin, setShowLogin] = useState(true); // Track which page to show

  let loadLandingPage = () => {
    setIsSignedIn(true);
  };

  let handleCurrentUser = (user) => {
    setCurrentUser(user);
  };

  let togglePage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="App">

      {isSignedIn ? (
        <div>
          {currentUser && <LandingPage currentUser={currentUser} />}
        </div>
      ) : (
        <div className="container">
          <div className={`flipper ${showLogin ? '' : 'flipped'}`}>
            <div className="front">
              <Login loadLandingPage={loadLandingPage} handleCurrentUser={handleCurrentUser} togglePage={togglePage} />
            </div>
            <div className="back">
              <SignIn togglePage={togglePage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
