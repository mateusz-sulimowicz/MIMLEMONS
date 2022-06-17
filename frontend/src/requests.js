import axios from 'axios';
import { io } from 'socket.io-client';

const backendURL = `https://mimlemons.com`;

axios.defaults.baseURL = backendURL;

console.log(axios.defaults.baseURL);

export const getUserData = (token) => axios
.get(`/api/users`,  {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
.then((res) => res.data)
.catch((err) => console.error(err));


export const createWebSocket = (authToken) => { 
  return io.connect(backendURL, {
    extraHeaders: {
      'Authorization': `Bearer ${authToken}`,
    },
})};
