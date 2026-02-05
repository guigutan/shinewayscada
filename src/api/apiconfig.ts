import axios from 'axios';
export const api = axios.create({
  //baseURL: 'http://localhost:3000/api',
  //baseURL: 'http://api.shinewaygroup.com/api',
  baseURL: 'http://api.shinewaygroup.com:8000/api',
  timeout: 10000,
});

