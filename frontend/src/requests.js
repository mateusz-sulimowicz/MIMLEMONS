import axios from 'axios';
import { io } from 'socket.io-client';

const backendURL = `http://${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKEND_PORT}`;

axios.defaults.baseURL = backendURL;

console.log(axios.defaults.baseURL);

export const getUserData = (token) => axios
.get(`/users`,  {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
.then((res) => res.data)
.catch((err) => console.error(err));

axios.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2))
  return request
})

export const createWebSocket = (authToken) => { 
  return io.connect(backendURL, {
    extraHeaders: {
      'Authorization': `Bearer ${authToken}`,
    },
})};
