import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Import env variables from .env file.
dotenv.config();
const { PORT, USERS, USERS_PORT } = process.env;

const usersURL = `http://${USERS}:${USERS_PORT}`;
console.log(usersURL);

axios.defaults.baseURL = usersURL;

// ----------- HTTP --------------

// Middleware that verifies user's auth token
// and passes the decoded token in req.body.token property.
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('AUTH AUTH AUTH');
  if (!authHeader) {
    // Auth header not found
    res.sendStatus(401);
    return;
  }
  // Auth header = "Bearer <token>"
  const idToken = authHeader.split(' ')[1];
  try {
    console.log('GET AUTH GET AUTH ');
    const response = await axios.post('/auth', { token: idToken });
    console.log('AUTHR EPSONSE ', response);
    if (response.data.token) {
      req.body.token = response.data.token;
      // Pass the decoded token to next handlers.
      next();
    } else {
      throw new Error('Failed to validate token!');
    }
  } catch (err) {
    console.log('Failed to verify token', err);
    res.sendStatus(403);
  }
};

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// Every request to the backend
// *needs* to be authenticated.
app.use(auth);

// GET user game data.
app.get('/users/', async (req, res) => {
  const response = await axios.get(`/users/${req.body.token.uid}`);
  res.send(response.data);
});

export const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
