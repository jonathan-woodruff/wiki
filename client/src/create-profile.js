/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, log in
************************************************************/
import { checkConfirmationURL, magicLogin } from './api/auth';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const hash = urlParams.get('data');

const handlePageLoad = () => {
    checkConfirmationURL(ident, today, hash)
    .then(() => {
        const payload = { ident: ident };
        magicLogin(payload)
        .then(() => {
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('avatar', '');
            window.location.href = './edit-profile.html';
        })
        .catch(() => {
            const params = new URLSearchParams();
            params.append('registration-confirm-success', 'true');
            const queryString = params.toString();
            const url = `./login.html?${queryString}`;
            window.location.href = url;
        })
    })
    .catch((error) => {
        if ('response' in error && error.response.data.error === 'Link is outdated') {
            const params = new URLSearchParams();
            params.append('registration-confirm-fail', 'true');
            const queryString = params.toString();
            const url = `./login.html?${queryString}`;
            window.location.href = url;
        } else {
            window.location.href = './fail.html';
        }
    })
    /*
    try {
        await checkConfirmationURL(ident, today, hash);
    } catch(error) {
        if ('response' in error && error.response.data.error === 'Link is outdated') {
            const params = new URLSearchParams();
            params.append('registration-confirm-fail', 'true');
            const queryString = params.toString();
            const url = `./login.html?${queryString}`;
            window.location.href = url;
        } else {
            window.location.href = './fail.html';
        }
    }
    try {
        const payload = { ident: ident };
        await magicLogin(payload);
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('avatar', '');
        window.location.href = './edit-profile.html';
    } catch(error) {
        const params = new URLSearchParams();
        params.append('registration-confirm-success', 'true');
        const queryString = params.toString();
        const url = `./login.html?${queryString}`;
        window.location.href = url;
    }*/
};

handlePageLoad();