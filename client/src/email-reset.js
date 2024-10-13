/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, log in
************************************************************/
import { tryEmailReset, magicLogin } from './api/auth';
import { logout } from './utils/navbar';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const newEmail = urlParams.get('new-email');
const hash = urlParams.get('data');

const handlePageLoad = async () => {
    try {
        await tryEmailReset(ident, today, newEmail, hash);
    } catch(error) {
        window.location.href = './change-email.html';
    }
    try {
        await logout();
    } catch(error) {
        console.log(error);
    }
    try {
        const payload = { ident: ident };
        const { data } = await magicLogin(payload);
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('avatar', data.avatar || '');
        window.location.href = './change-email.html';
    } catch(error) {
        window.location.href = './change-email.html';
    }
};

handlePageLoad();