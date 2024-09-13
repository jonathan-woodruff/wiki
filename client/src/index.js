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

import { configureNav, logout } from './utils/navbar';
import { countries, sectors } from './constants/profile';
import { submitSearch, enterSubmit, focusOnInput, showFocus, showFocusOut, hideError } from './utils/search';

import SearchIcon from './images/search_icon.svg';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const logoutLink = document.getElementById('logout-link');
const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const submitButton = document.getElementById('submit');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');
const searchImg = document.getElementById('search-icon');
const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');

searchImg.src = SearchIcon;
logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const loadCountries = () => {
  countries.forEach((country) => {
    let option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    countryInput.appendChild(option);
  })
};

const loadSectors = () => {
  sectors.forEach((sector) => {
    let option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    sectorInput.appendChild(option);
  });
};

logoutLink.addEventListener('click', logout);
submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);
searchEngine.addEventListener('input', hideError);
navRegisterButton.addEventListener('click', () => window.location.href = './login.html');

configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
loadCountries();
loadSectors();