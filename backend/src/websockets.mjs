import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import axios from 'axios';

import { server } from "./http.mjs";

import { handleJoinGame, handleMessage } from './game-server.mjs';

// Import env variables from .env file.
dotenv.config();

const usersURL = `http://${process.env.USERS}:${process.env.USERS_PORT}`;
console.log(usersURL);

axios.defaults.baseURL = usersURL;

// ----------- WebSockets ------------

// Middleware that verifies user's auth token
// and passes the decoded token in req.body.token property.
const webSocketAuth = async (socket, next) => {
  console.log('HELLO: ', socket.handshake);
  const authHeader = socket.handshake.headers.authorization;

  if (!authHeader) {
    // Auth header not found
    next(new Error('Auth token not found!'));
  } else {
    // Auth header = "Bearer <token>"
    const idToken = authHeader.split(' ')[1];
    try {
      const response = await axios.post('/auth', { token: idToken });

      if (response.data.token) {
        console.log('ELGANCKO');
        // Pass the decoded token to next handlers.
        socket.token = response.data.token;
        next();
      } else {
        throw new Error('Failed to validate token!');
      }
    } catch (err) {
      next(new Error('Failed to authenticate user!', err));
    }
  }
};

const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Only authenticated users can *connect*.
io.use(webSocketAuth);

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  console.log('Auth token passed', socket.token);

  handleJoinGame(socket);
  handleMessage(socket);
});

export default io;
