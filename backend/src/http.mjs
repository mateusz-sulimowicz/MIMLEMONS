import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Import env variables from .env file.
dotenv.config();
const { PORT, USERS, USERS_PORT } = process.env;

const usersURL = `http://${USERS}:${USERS_PORT}`;

axios.defaults.baseURL = usersURL;

// ----------- HTTP --------------

// Middleware that verifies user's auth token
// and passes the decoded token in req.body.token property.
const auth = async (req, res, next) => {
  console.log('request', req);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Auth header not found
    res.sendStatus(401);
    return;
  }
  // Auth header = "Bearer <token>"
  const idToken = authHeader.split(' ')[1];
  try {
    const response = await axios.post('/auth', { token: idToken });
    if (response.data.token) {
      req.body.token = response.data.token;
      // Pass the decoded token to next handlers.
      next();
    } else {
      throw new Error('Failed to validate token!');
    }
  } catch (err) {
    res.sendStatus(403);
  }
};

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// Every request to the backend
// *needs* to be authenticated.
//app.use(auth);


// GET user game data.
app.get('/', async (req, res) => {
  res.send();
});

// GET user game data.
app.get('/api/users/', auth, async (req, res) => {
  const response = await axios.get(`/users/${req.body.token.uid}`);
  res.send(response.data);
});

export const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default server;
