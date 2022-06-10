import dotenv from 'dotenv';
import express from 'express';
import { body, validationResult } from 'express-validator'; 
import cors from 'cors';

// Import env variables from .env file.
dotenv.config();
const { PORT } = process.env;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// The simplest matchmaking strategy - FIFO.
let socketIDs = new Set();

// Number of players required to make a match.
const ROOM_SIZE = 2;
let nextRoom = 0;

// ------------ HTTP --------------

// POST -- add user to the matchmaking.
app.post(
  '/',
  body('socketID').isAscii(),
  async (req, res) => {
    console.log(req.body);
    try {
        validationResult(req).throw();
        socketIDs.add(req.body.socketID);
        console.log('QUEUE', socketIDs);

        if (socketIDs.size == ROOM_SIZE) {
            // Enough players to create a match.
            res.send({ room:  Array.from(socketIDs), roomID: nextRoom });
            
            ++nextRoom;
            socketIDs = new Set(); // Reset matchmaking queue.
        } else {
            // Added player to matchmaking.
            res.sendStatus(200);
        }
    } catch (err) {
        console.error(err);
        res.send(400);
    }
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
