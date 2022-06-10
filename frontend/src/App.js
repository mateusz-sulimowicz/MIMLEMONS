import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route,  } from "react-router-dom";
import Lobby from "./Lobby";
import Game from "./Game";

import { auth, provider } from './firebase/util.js';

import './Lobby.css'

export default function App() {

  const socket = useRef();
  const room = useRef();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game" 
          element=
          {
            <Game 
               getUser={ () => auth.currentUser}
               getRoom={ () => room.current}
               getSocket={ () => socket.current}
            />
          }
        />
        <Route
          path="*"
          element={
            <Lobby 
               setSocket={ (webSocket) => socket.current = webSocket }
               getSocket={ () => socket.current }
               setRoom={ (players) => room.current = players }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
