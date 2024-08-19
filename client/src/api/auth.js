/* This file sends requests to the server using axios for token-based requests */
import { SERVER_URL } from '../constants/index';
import axios from 'axios';
axios.defaults.withCredentials = true; //send the cookie back to the server with token

export async function onAddDummy() {
    return await axios.post(`${SERVER_URL}/auth/addDummy`);
}