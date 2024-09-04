// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onViewHistory } from './api/main';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiID = urlParams.get('wiki');

const title = document.getElementById('title');
const countryAndSector = document.getElementById('country-sector');

const displayWikiHeader = (wiki) => {
    title.innerHTML = wiki.title;
    countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

const loadPage = async () => {
    try {
        const { data } = await onViewHistory(wikiID);
        displayWikiHeader(data.wiki);
    } catch(error) {
        const errorMessage = error.response.data.error; //error from axios
        console.log(errorMessage);
    }
};

loadPage();