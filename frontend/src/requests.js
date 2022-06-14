import axios from 'axios';
import { io } from 'socket.io-client';

const backendURL = `https://${process.env.REACT_APP_BACKEND}`;

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
