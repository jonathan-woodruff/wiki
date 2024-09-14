/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { isAuth } from './authenticate';
import { configureNav, logout } from './utils/navbar';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');
configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);

/************************************************************
 * Configure other images
************************************************************/
import SearchIcon from './images/search_icon.svg';

const searchImg = document.getElementById('search-icon');
searchImg.src = SearchIcon;

/************************************************************
 * Load data from backend 
************************************************************/
import { countries, sectors } from './constants/profile';

const loadCountries = () => {
  const countryInput = document.getElementById('country');
  countries.forEach((country) => {
    let option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    countryInput.appendChild(option);
  })
};

const loadSectors = () => {
  const sectorInput = document.getElementById('sector');
  sectors.forEach((sector) => {
    let option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    sectorInput.appendChild(option);
  });
};

loadCountries();
loadSectors();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

/************************************************************
 * All other JavaScript
************************************************************/
import { submitSearch, enterSubmit, focusOnInput, showFocus, showFocusOut, hideError } from './utils/search';

const logoutLink = document.getElementById('logout-link');
const submitButton = document.getElementById('submit');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');

logoutLink.addEventListener('click', logout);
submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);
searchEngine.addEventListener('input', hideError);
navRegisterButton.addEventListener('click', () => window.location.href = './login.html');