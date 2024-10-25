/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, log in
************************************************************/
import { tryEmailReset, magicLogin, onLogout } from '../api/auth';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const newEmail = urlParams.get('new-email');
const hash = urlParams.get('data');

const handlePageLoad = async () => {
    try {
        await tryEmailReset(ident, today, newEmail, hash);
        try {
            await onLogout();
            localStorage.setItem('isAuth', 'false');
            const params = new URLSearchParams();
            params.append('email-reset-success', 'true');
            const queryString = params.toString();
            try {
                const payload = { ident: ident };
                const response = await magicLogin(payload);
                localStorage.setItem('isAuth', 'true');
                localStorage.setItem('avatar', response.data.avatar || '');
                const url = `./change-email.html?${queryString}`;
                window.location.href = url;
            } catch(error) {
                //couldn't log the user in, so bring them to the log in page, and notify them that the email reset was successful
                const url = `./login.html?${queryString}`;
                window.location.href = url;
            }
        } catch(error) {
            window.location.href = './fail.html';
        }
    } catch(error) {
        if ('response' in error && error.response.data.error === 'Link is outdated') {
            const params = new URLSearchParams();
            params.append('email-reset-fail', 'true');
            const queryString = params.toString();
            const url = `./index.html?${queryString}`;
            window.location.href = url;
        } else {
            window.location.href = './fail.html';
        }
    }
};

if (ident && today && newEmail && hash) {
    handlePageLoad();
} else {
    window.location.href = './fail.html';
}