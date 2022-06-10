// App.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'socket.io-client';

const Chat = ({name, destination, socket}) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState(1);
  const [messagesFrom, setMessagesFrom] = useState(1);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    if (newMessage) {
        if (newMessage.source === socket.id) {
            setMessagesFrom(messagesFrom + 1);
        } else {
            setMessages(messages + 1);
        }
    }
  }, [newMessage]);

  useEffect(() => {
    socket.on('RECEIVE-MESSAGE', (message) => {
        console.log('RECEIVED!!!', message);
       if (message.source === destination) {
           setNewMessage(message);
       }
    });
  }, []);

  const sendMessage = (text) => {
    const message = {
      source: socket.id,
      destination,
      text
    }
    setNewMessage(message);
    socket.emit('SEND-MESSAGE', message);
    
  }


  return (
    <>

      {
        (
          <>
            <div>
            
              <div className='info-opponent'>
                <div>{name}</div>
              </div>
              <div className='val-your'>
                <div>From:  </div>
                <div className='counter'>{messagesFrom}  </div>
              </div>
              <div className='val-opp'>
                <div>To: </div>
                <div  className='counter'>{messages}</div>
              </div>
            </div>
           
            
            <button className='buttonPing'onClick={() => sendMessage(`Dupsko od ${socket.id}`)}> 🍋 </button>
            
            
            
            
          </>
        )
      }
      
    </>
  );
}

export default Chat;