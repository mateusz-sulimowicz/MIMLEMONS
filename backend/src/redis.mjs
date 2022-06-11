import dotenv from 'dotenv';
import redis from 'redis';

// Import env variables from .env file.
dotenv.config();

const {
  REDIS, REDIS_PORT,
} = process.env;

const publisher = redis.createClient({
  socket: {
    port: REDIS_PORT,
    host: REDIS,
  }
});
publisher.on('error', (err) => {
  console.log('Error occured while connecting or accessing redis server', err);
});

await publisher.connect();

export const publishGameResult = async (uid, result) => {
  await publisher.publish('GAME-RESULTS', JSON.stringify({ uid, won: result }));
};
  
export default {};

