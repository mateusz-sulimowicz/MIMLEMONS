import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import './redis.mjs'

// Firebase-related imports.
import { admin } from './firebase/config.mjs';
import { getUser } from './firebase/requests.mjs'

// Import env variables from .env file.
dotenv.config();
const { PORT } = process.env;

// ----------- HTTP --------------

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// POST - return decoded auth token if valid.
app.post('/auth/', async (req, res) => {
    const idToken = req.body.token;

    if (!idToken) {
        // Auth token not found
        res.sendStatus(401);
        return;
      }
      try {
        const decodedToken = await admin
          .auth()
          .verifyIdToken(idToken);
    
        res.send({ token: decodedToken });
      } catch (err) {
        res.sendStatus(403);
      }
})

// GET user game data.
app.get('/users/:uid', async (req, res) => {
  const u = await getUser(req.params.uid);
  res.send(u);
});

export const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
