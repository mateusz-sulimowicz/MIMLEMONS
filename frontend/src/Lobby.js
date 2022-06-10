// App.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from 'react-google-button'
import 'socket.io-client';

import { auth, provider } from './firebase/util.js';

import { getUserData, createWebSocket } from './requests';

import './Lobby.css';

const Lobby = ({setSocket, getSocket, setRoom}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [matchmaking, setMatchmaking] = useState(false);
  const [userGameData, setUserGameData] = useState();

  useEffect(() => {
    // On component mounting we add observer to auth state.
    const unsub = auth.onAuthStateChanged(async (user) => {
      console.log(`state changed`, user);
      setUser(user);

      console.log(user)
      setLoading(false);
    });
    // On component unmounting we unsubscribe.
    return () => unsub;
  }, [] /* Execute only on mount/unmount. */);

  useEffect(() => {
     
  }, [] /* Execute only on mount/unmount. */);

  useEffect(() => {
    const openSocket = async (user) => {
      if (user && !getSocket()) {
        const token = await user.getIdToken(/* forceRefresh */ true);
        setSocket(createWebSocket(token));

          getSocket().on('GAME-STARTED', (players) => {
            console.log('GRACZE ZE MNA W GRZE', players);
            setRoom(players);
            navigate('/game');
          })
       
          console.log('Token', token);

          const u = await getUserData(token);
          console.log('User data', u);

          setUserGameData(u);
          
      }
      if (user && !userGameData) {
        const token = await user.getIdToken(/* forceRefresh */ true);
        

        console.log('Token', token);

        const u = await getUserData(token);
        console.log('User data', u);

        setUserGameData(u);
      }
    }
    openSocket(user)
  }, [user] /* Execute only on `user` state changed. */);

  const joinGame = () => {
    console.log("JOIN!!!!");

    setMatchmaking(true);
    getSocket().emit('JOIN-GAME', (response) => {
      console.log(response);
    });    
  }

  console.log(user);
  console.log('WEBSOCKET', getSocket());
  return (
      <>
      {
        loading
        ? // Display Loading message.
          <div  className='lobby'> 
          <div className='toast'> Loading...</div> </div>  
        : // State has loaded.
          user
          ? // Display user data.
            (
            <div className='lobby'>
              <button className='buttonLogout' onClick={() => auth.signOut()}>LOG OUT</button>
              <div className='userData'>
                <div className='avatar'> 
                <img src={user.photoURL} alt="Your Google account avatar." />
                </div>
                <div className='userDetails'>
                  <div className='info'>
                    <div className='infotag'>Name:</div>
                    <div>{user.displayName}</div>
                  </div>
                 
                  <div className='info'>
                    <div className='infotag'> <div>Email:</div></div>
                    <div>{user.email}</div>
                  </div>
                {
                  userGameData && // User game data successfully fetched from backend.
                  (
                    <>
                    <div className='info'>
                      <div  className='infotag'> <div>Games won:</div>     </div>
                      <div>{userGameData.gamesWon}</div>
                    </div>
                    <div className='info'>
                      <div  className='infotag'> <div>Games played:</div></div>
                      <div>{userGameData.gamesPlayed}</div>
                    </div>
                    </>
                  ) 
                }
                </div>
                
              </div>
              {
                !matchmaking
                ? 
                  userGameData && // User game data successfully fetched from backend.
                    (
                      <button className='buttonJoin' onClick={() => joinGame()}>
                        JOIN GAME
                      </button>
                    ) 
                : 
                  (
                    <button className='buttonJoin' onClick={() => joinGame()}>
                    👀 Looking for a game ... 👀
                    </button>
                  ) 
              }  
            </div>
            ) 
          : // User has not signed in yet -> display "Sign in with Google" button only.
          <div className='loginPage'>
            <div className='greeting'>
              <div> Hello! </div>
            </div>
            <div className='login'>
              <GoogleButton  className='butonLogin'  onClick={() => auth.signInWithPopup(provider)}>Sign in with Google</GoogleButton>
            </div>
          </div>
          
      }
      </>
    );
}

export default Lobby;