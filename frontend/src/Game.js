// App.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'socket.io-client';
import Countdown from 'react-countdown';

import { auth } from './firebase/util.js';
import Chat from "./Chat.js";
import './Game.css'
const getEmoji = require('get-random-emoji')

const Game = ({getUser, getRoom, getSocket}) => {

  const navigator = useNavigate();
  
  const [results, setResults] = useState();
  const [chats, setChats] = useState();

  const players = getRoom();

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])
  const alertUser = e => {
    e.preventDefault()
    e.returnValue = 'You wil be disconnected from the'
  }

  useEffect(() => {
    if (!getUser() || !getRoom() || !getSocket()) {
      navigator('/');
      window.location.reload(false);
    }

    auth.onAuthStateChanged(() => {
      if (!getUser()) {
        navigator('/');
      }
    });
    
    const newchats = players.map((socketId) => {
      const name = getEmoji();
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
    setChats(newchats);
  }, [])

  useEffect(() => {
      if (results) {
        setTimeout(() => { navigator('/')}, 5000);
      }
  }, [results]);

  useEffect(() => {
    getSocket().on('GAME-ENDED', (message) => {
      setResults(message);
    });
  }, []);

  return (
      <div className='user-info'>
        {
          !results
          ? 
            getUser() && getSocket() && getRoom()
            ? // Display user data.
              (
                <div className="lobby">
                    <div className='opponents_title'>
                      <div> Throw 🍋  at your emoji-opponents by clicking the big buttons! </div>
                      <div> Time left: <Countdown date={Date.now() + 60000} /> </div>
                    </div>
                    <div className='opponents'> {chats} </div>
                </div>
              )
            : <> You are not currently in-game.</>
          : <div className='toast'>
              {
                results === getUser().uid
                ? 
                  <div>You won 🥳🎉👏</div>    
                :   
                  <div>You lost 😔😭😢</div>     
              }
            </div>    
        }
      </div >
    );
}

export default Game;