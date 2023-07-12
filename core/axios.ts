import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

const Axios = axios.create({
  baseURL: 'http://localhost:3001', // this is the API url from the server folder in the root directory of the project (server/index.js) file 
  headers: {
    Authorization: 'Bearer ' + cookies?.token,
  },
});

export { Axios };
