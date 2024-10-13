/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import './css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

const navRegisterButton = document.getElementById('nav-register-button');

const setSources = () => {
    const logoImg = document.getElementById('logo-img');
    logoImg.src = Logo;
    const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
    refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};
  
const setNav = () => {
    const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
    const navCreateLI = document.getElementById('nav-create-li');
    const navCreateA = document.getElementById('nav-create-a');
    const navCommunityLI = document.getElementById('nav-community-li');
    const navCommunityA = document.getElementById('nav-community-a');
    const navDropdown = document.getElementById('nav-dropdown');
    configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};
  
setSources();
setNav();

/************************************************************
 * Load data from backend 
************************************************************/
import { onViewHistory } from './api/main';
import { convertTimestamp } from './utils/time';

const currentQueryString = window.location.search;
const currentUrlParams = new URLSearchParams(currentQueryString);
const wikiID = currentUrlParams.get('wiki');
const showMoreDiv = document.getElementById('show-more-div');
const showMoreButton = document.getElementById('show-more-button');

const numCardsToShow = 5;
let numShowMoreClicked = 0;
let allEditions = [];
let editionNum;

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

const displayWikiHeader = (wiki) => {
    const title = document.getElementById('title');
    const countryAndSector = document.getElementById('country-sector');
    title.innerHTML = wiki.title;
    countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

const showCards = (wikiHistory) => {
    const baseSlice = numShowMoreClicked * numCardsToShow;
    const endSlice = numCardsToShow;
    const editionsToShow = wikiHistory.slice(baseSlice, baseSlice + endSlice);
    editionsToShow.forEach(edition => {
        const cardDiv = document.getElementById('card-div');
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
        
        const userAvatar = document.createElement('img');
        userAvatar.alt = 'User profile picture';
        userAvatar.src = edition.user[0].photo;
        userAvatar.classList.add('img-fluid');
        userAvatar.classList.add('rounded-circle');
        userAvatar.classList.add('d-inline-block');
        userAvatar.classList.add('align-text-center');
        userAvatar.width = '40';
        userAvatar.height = '40';
        authorLink.appendChild(userAvatar);
        authorLink.innerHTML += edition.user[0].name;
        dateAndAuthor.appendChild(authorLink);

        editionNum--;
    });
    if (wikiHistory.length > baseSlice + endSlice) {
        showMoreDiv.style.display = 'block';
    } else {
        showMoreDiv.style.display = 'none';
    };
};

const loadPage = async () => {
    try {
        const { data } = await onViewHistory(wikiID);
        displayWikiHeader(data.wiki);
        allEditions = data.wikiHistory;
        editionNum = allEditions.length;
        showCards(allEditions);
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

loadPage();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const showPage = () => {
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    setNotLoading(spinnerDiv, mainContainer, navbar, footer);
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/
const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');

const goLogin = () => {
    const params = new URLSearchParams();
    params.append('prev', 'history');
    params.append('wiki', wikiID);
    const url = `./login.html?${params.toString()}`;
    window.location.href = url;
};

const showMoreCards = () => {
    numShowMoreClicked++;
    showCards(allEditions);
};

const handleLogout = async () => {
    try {
        await logout();
        window.location.reload();
    } catch(error) {
        console.log(error);
    }
};

logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
showMoreButton.addEventListener('click', showMoreCards);
//window.addEventListener("pageshow", handlePageshow)
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');