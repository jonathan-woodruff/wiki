/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

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
import { onViewProfile } from './api/main';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userID = urlParams.get('user');

const showHeader = (name) => {
    const h1 = document.getElementById('h1');
    h1.innerHTML = name;
};

const showPhoto = (photo) => {

};

const showDescription = (description) => {
    if (description) {
        const descriptionParagraph = document.getElementById('description');
        descriptionParagraph.innerHTML = description;
    } else {
        const descriptionSection = document.getElementById('description-section');
        descriptionSection.classList.add('d-none');
    }
};

const showServices = (services) => {
    if (services.length) {
        services.forEach(service => {
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = service.country + ' | ' + service.sector + ' (' + service.year + ')';
            const servicesUL = document.getElementById('services');
            servicesUL.appendChild(listItem);
        });
    } else {
        const serviceSection = document.getElementById('service-section');
        serviceSection.classList.add('d-none');
    }
};

const showActivity = (numWikisCreated, numWikiEdits) => {
    const wikisCreatedLI = document.getElementById('wikis-created');
    const wikiEditsLI = document.getElementById('wiki-edits');
    wikisCreatedLI.innerHTML = '# wikis created: ' + numWikisCreated;
    wikiEditsLI.innerHTML = '# wiki edits: ' + numWikiEdits; 
};

const getData = async () => {
    try {
        const { data } = await onViewProfile(userID);
        showHeader(data.name);
        showPhoto(data.photo);
        showDescription(data.description);
        showServices(data.services);
        showActivity(data.wikisCreated, data.wikiEdits);
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

getData();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const showPage = () => {
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');
    setNotLoading(spinnerDiv, mainContainer, navbar);
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/
const logoutLink = document.getElementById('logout-link');

const goLogin = () => {
    const params = new URLSearchParams();
    params.append('prev', 'view-profile');
    params.append('user', userID);
    const url = `./login.html?${params.toString()}`;
    window.location.href = url;
};

logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goLogin);
//window.addEventListener("pageshow", handlePageshow)