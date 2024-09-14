//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Display the html
import { setNotLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import { isAuth } from './authenticate';
import { onViewHistory } from './api/main';
import { convertTimestamp } from './utils/time';
import { configureNav, logout } from './utils/navbar';

import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiID = urlParams.get('wiki');

const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const title = document.getElementById('title');
const countryAndSector = document.getElementById('country-sector');
const cardDiv = document.getElementById('card-div');
const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');
const logoutLink = document.getElementById('logout-link');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const displayWikiHeader = (wiki) => {
    title.innerHTML = wiki.title;
    countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

const showCards = (wikiHistory) => {
    let editionNum = wikiHistory.length;
    wikiHistory.forEach(edition => {
        const card = document.createElement('div');
        card.id = edition._id;
        card.role = 'button';
        card.classList.add('card');
        card.classList.add('mb-3');
        card.classList.add('shadow-sm');
        card.addEventListener('mouseover', handleMouseover);
        card.addEventListener('mouseout', handleMouseout);
        card.addEventListener('click', handleClick);
        cardDiv.appendChild(card);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        const h2 = document.createElement('h2');
        h2.classList.add('card-title');
        h2.classList.add('h4');
        h2.innerHTML = 'Edition ' + editionNum;
        cardBody.appendChild(h2);

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerHTML = edition.changeDescription;
        cardBody.appendChild(cardText);

        const dateAndAuthor = document.createElement('p');
        dateAndAuthor.style.fontSize = '0.9em';
        dateAndAuthor.innerHTML = 'Edited ' + convertTimestamp(edition.contentTime) + ' by ';
        cardBody.appendChild(dateAndAuthor);

        const authorLink = document.createElement('a');
        const params = new URLSearchParams();
        const userID = edition.authorUserId;
        params.append('user', userID);
        const queryString = params.toString();
        authorLink.href = `./view-profile.html?${queryString}`;
        authorLink.alt = 'Link to user profile';
        authorLink.innerHTML = edition.user[0].name;
        dateAndAuthor.appendChild(authorLink);

        editionNum--;
    });
};

const handleMouseover = (event) => {
    const card = event.currentTarget;
    card.classList.add('bg-light');
};
  
const handleMouseout = (event) => {
    const card = event.currentTarget;
    card.classList.remove('bg-light');
};
  
const handleClick = (event) => {
    const card = event.currentTarget;
    const wikiHistoryID = card.id;
    const params = new URLSearchParams();
    params.append('edition', wikiHistoryID);
    params.append('editionHeader', event.currentTarget.children[0].children[0].innerHTML);
    const queryString = params.toString();
    const url = `./view-historical-wiki.html?${queryString}`;
    window.location.href = url;
};

const loadPage = async () => {
    try {
        const { data } = await onViewHistory(wikiID);
        displayWikiHeader(data.wiki);
        showCards(data.wikiHistory);
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

const goLogin = () => {
    const params = new URLSearchParams();
    params.append('prev', 'history');
    params.append('wiki', wikiID);
    const url = `./login.html?${params.toString()}`;
    window.location.href = url;
};

logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goLogin);

configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
loadPage();