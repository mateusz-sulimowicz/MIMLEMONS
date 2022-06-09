import dotenv from 'dotenv';
import redis from 'redis';
import { updateUserLostGame, updateUserWonGame } from './firebase/requests.mjs'

// Import env variables from .env file.
dotenv.config();

const {
  REDIS, REDIS_PORT,
} = process.env;

const subscriber = redis.createClient(REDIS_PORT, REDIS);

subscriber.on('error', (err) => {
  console.log('Error occured while connecting or accessing redis server', err);
});

await subscriber.connect();

await subscriber.subscribe('GAME-RESULTS', (message) => {
    console.log('RECEIVED FROM REDIS', message); // 'message'
    const m = JSON.parse(message);
    console.log(m);

    if (m.won) {
        updateUserWonGame(m.uid);
    } else {
        updateUserLostGame(m.uid);
    }

});

export default {};
