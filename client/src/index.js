/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';
import SearchIcon from './images/search_icon.svg';

const navRegisterButton = document.getElementById('nav-register-button');

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const picturePreview = document.getElementById('pic-preview');
  const searchImg = document.getElementById('search-icon');
  logoImg.src = Logo;
  picturePreview.src = PeaceChicken;
  searchImg.src = SearchIcon;
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
