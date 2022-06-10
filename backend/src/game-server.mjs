import dotenv from 'dotenv';
import axios from 'axios';
import { publishGameResult } from './redis.mjs';

// Import env variables from .env file.
dotenv.config();

const {
  MATCHMAKING, MATCHMAKING_PORT,
} = process.env;

const matchmakingURL = `http://${MATCHMAKING}:${MATCHMAKING_PORT}`;
console.log(matchmakingURL);

const roomToSocketIds = {};
const socketIdToRoom = {};
const socketIdToSocket = {};
const socketIdToScore = {};
let nextRoomID = 0;

const addSocketsToRoom = (room) => {
  roomToSocketIds[nextRoomID] = room;
  roomToSocketIds[nextRoomID].forEach((socketId) => {
    socketIdToRoom[socketId] = nextRoomID;
  });
  nextRoomID += 1;
  return nextRoomID - 1;
};

// eslint-disable-next-line arrow-body-style
const areInTheSameRoom = (messageSource, messageDest) => {
  console.log('ARE TOGETHER?', messageSource, messageDest);

  const sourceRoom = socketIdToRoom[messageSource];
  const destRoom = socketIdToRoom[messageDest];

  console.log('SOURCE ROOM', sourceRoom);
  console.log('DEST ROOM', destRoom);

  return sourceRoom === destRoom;
};

const initScore = (socketId, room) => {
  socketIdToScore[socketId] = {};
  room.forEach((id) => {
    if (id !== socketId) {
      socketIdToScore[socketId][id] = 0;
    }
  });
};

const calcResult = (roomId) => {
  const results = {};
  const socketIds = roomToSocketIds[roomId];
  socketIds.forEach((id) => {
    results[id] = 0;
  });

  socketIds.forEach((id) => {
    socketIds.forEach((id1) => {
      console.log('UWAGA UWAGA', id, id1);

      const scores = socketIdToScore[id];
      const scores1 = socketIdToScore[id1];

      console.log('SCORAES', scores);
      console.log('SCOREDS1', scores1);

      if (scores[id1] > scores1[id]) {
        results[id] += 1;
      }
    });
  });

  let winnerScore = -1;
  let winnerCount = 0;
  let winner;
  socketIds.forEach((id) => {
    if (results[id] > winnerScore) {
      winnerScore = results[id];
      winnerCount = 1;
      winner = id;
    } else if (results[id] === winnerScore) {
      winnerCount += 1;
    }
  });

  if (winnerCount > 1) {
    // Tie
    console.log('THE RESULT IS: tie');
    return 'tie';
  }

  winner = socketIdToSocket[winner].token.uid;

  console.log('THE WINNER IS:', winner);
  return winner;
};

export const handleJoinGame = (socket) => {
  socket.on('JOIN-GAME', async () => {
    console.log('JOINED WITH TOKEN', socket.token);
    console.log('Client joined: ', socket.id);

    socketIdToSocket[socket.id] = socket;

    console.log('SCORES OF SOCKET', socketIdToScore[socket.id]);
    // Add socket's ID to the matchmaking queue.
    const response = await axios.post(`${matchmakingURL}`, { socketID: socket.id });
    if (response.data.room) {
      // Matchmaker created a match.
      const roomId = addSocketsToRoom(response.data.room);
      roomToSocketIds[roomId].forEach((id) => {
        const s = socketIdToSocket[id];

        initScore(id, roomToSocketIds[roomId]);

        s.emit('GAME-STARTED', roomToSocketIds[roomId]);
      });

      // After 10 seconds, game will end
      // and players will receive GAME-ENDED message.
      setTimeout(() => {
        const res = calcResult(roomId);
        roomToSocketIds[roomId].forEach((socketId) => {
          const s = socketIdToSocket[socketId];
          s.emit('GAME-ENDED', res);

          if (s.token.uid === res) {
            console.log('PUBLISH  WON');
            publishGameResult(s.token.uid, true);
          } else {
            console.log('PUBLISH  LOST');
            publishGameResult(s.token.uid, false);
          }
        });
      }, 60000);
    }
  });
};

export const handleMessage = (socket) => {
  socket.on('SEND-MESSAGE', (message) => {
    console.log('MESSAGE', message);

    if (areInTheSameRoom(socket.id, message.destination)) {
      const dest = socketIdToSocket[message.destination];

      const m = {
        destination: message.destination,
        source: socket.id,
        text: message.text,
      };

      socketIdToScore[socket.id][dest.id] += 1;

      console.log('SCORE UPDATED', socketIdToScore[socket.id]);
      dest.emit('RECEIVE-MESSAGE', m);
    }
  });
};

export default {};
