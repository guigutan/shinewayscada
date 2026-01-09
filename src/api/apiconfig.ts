import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://api.shinewaygroup.com/api',
  timeout: 10000,
});

