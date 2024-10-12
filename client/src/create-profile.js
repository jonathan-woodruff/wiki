/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, log in
************************************************************/
import { checkConfirmationURL, loginAfterRegistration } from './api/auth';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const hash = urlParams.get('data');

const handlePageLoad = async () => {
    try {
        const { data } = await checkConfirmationURL(ident, today, hash);
        if (data.success) {
            const payload = { ident: ident };
            await loginAfterRegistration(payload);
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('avatar', '');
            window.location.href = './edit-profile.html';
        } else {
            window.location.href = './index.html';
        }
    } catch(error) {
        console.log(error);
        window.location.href = './index.html';
    }
};

handlePageLoad();