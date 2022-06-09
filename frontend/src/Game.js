// App.js
import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import 'socket.io-client';

import { auth, provider } from './firebase/util.js';
import Chat from "./Chat.js";
import './Game.css'

const Game = ({getUser, getRoom, getSocket}) => {

  const navigator = useNavigate();

  const [results, setResults] = useState();

  console.log(getUser());
  console.log('ROOM', getRoom());
  console.log('SOCKET', getSocket());

  const players = getRoom();
  console.log(players);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigator('/');
      }
    });
  }, [])

  useEffect(() => {
      if (results) {
        setTimeout(() => { navigator('/')}, 5000);
      }
  }, [results]);

  useEffect(() => {
    getSocket().on('GAME-ENDED', (message) => {
      console.log('KTO TO KURWA WYGRAL', message)
      setResults(message);
      console.log('Game finshed!!!!', message);
    });
  }, []);


  let name = String.fromCharCode('A'.charCodeAt(0) - 1);
  const chats = players.map((socketId) => {
    name = String.fromCharCode(name.charCodeAt(0) + 1);
    return socketId !== getSocket().id
      ? // Not myself.
        (
          <div className='chat'>
              <Chat
                  name={name}
                  destination={socketId}
                  socket={getSocket()}
              />
          </div>
        )
      : // Dont send message to yourself :)
        <></>
  });

  return (
      <div className='user-info'>
      {
        !results
        ? 
            getUser()
            ? // Display user data.
            (
            <div className="lobby">
            <button className='buttonLogout' onClick={() => { auth.signOut(); navigator('/'); }}>LOG OUT</button>
              <div className='userData'>
                <div className='avatar'> 
                <img src={getUser().photoURL} alt="Your Google account avatar." />
                </div>
                <div className='userDetails'>
                  <div className='info'>
                    <div>Name:</div>
                    <div>{getUser().displayName}</div>
                  </div>
                </div>
                
              </div>
              <div>
                <div className='opponents_title'> Ping your opponents! </div>
                <div className='opponents'>
                  {chats}
                </div>
              </div>
            </div>
            
            )
            : <> You are not currently in-game.</>
        :  <div className='toast'>
            {
              results === getUser().uid
              ? 
                <div>You won!</div>    
              :   
                <div>You lost!</div>     
            }
           </div>    
      }
      </div >
    );
}

export default Game;