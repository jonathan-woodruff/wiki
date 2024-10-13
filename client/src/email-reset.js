/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, log in
************************************************************/
import { tryEmailReset } from './api/auth';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const newEmail = urlParams.get('new-email');
const hash = urlParams.get('data');

const handlePageLoad = async () => {
    try {
        await tryEmailReset(ident, today, newEmail, hash);
        window.location.href = './change-email.html';
    } catch(error) {
        window.location.href = './change-email.html';
    }
};

handlePageLoad();