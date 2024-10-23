/* This file sends requests to the server using axios for token-based requests */
import { SERVER_URL } from '../constants/index';
import axios from 'axios';
axios.defaults.withCredentials = true; //send the cookie back to the server with token

export async function onRegister(credentials) {
    return await axios.post(`https://wiki-web-service.onrender.com/auth/register`, credentials);
};

export async function onLogin(credentials) {
    return await axios.post(`${SERVER_URL}/auth/login`, credentials);
};

export async function onLogout() {
    return await axios.get(`${SERVER_URL}/auth/logout`);
};

export async function checkForCookie() {
    return await axios.get(`${SERVER_URL}/auth/checkForCookie`);
};

export async function putPassword(payload) {
    return await axios.put(`${SERVER_URL}/auth/changePassword`, payload);
};

export async function putEmail(payload) {
    return await axios.put(`${SERVER_URL}/auth/updateUserEmail`, payload);
};

export async function sendPasswordResetEmail(payload) {
    return await axios.post(`${SERVER_URL}/auth/sendPasswordResetEmail`, payload);
};

export async function resetPassword(payload) {
    return await axios.post(`${SERVER_URL}/auth/resetPassword`, payload);
};

export async function checkResetURL(ident, today, hash) {
    return await axios.get(`${SERVER_URL}/auth/checkResetURL?ident=${ident}&today=${today}&data=${hash}`);
};

export async function checkConfirmationURL(ident, today, hash) {
    return await axios.get(`${SERVER_URL}/auth/checkConfirmationURL?ident=${ident}&today=${today}&data=${hash}`);
};

export async function magicLogin(payload) {
    return await axios.post(`${SERVER_URL}/auth/magicLogin`, payload);
};

export async function sendConfirmationEmail(payload) {
    return await axios.post(`${SERVER_URL}/auth/sendConfirmationEmail`, payload);
};

export async function sendChangeEmail(payload) {
    return await axios.post(`${SERVER_URL}/auth/sendChangeEmail`, payload);
};

export async function tryEmailReset(ident, today, newEmail, hash) {
    return await axios.get(`${SERVER_URL}/auth/tryEmailReset?ident=${ident}&today=${today}&newEmail=${newEmail}&data=${hash}`);
};