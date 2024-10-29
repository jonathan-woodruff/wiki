/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, refreshAvatar } from '../utils/navbar';
import Logo from '../images/logo.png';

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
import { countries, sectors } from '../constants/profile';

const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');

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

loadCountries();
loadSectors();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from '../utils/spinner';
import { showToast } from '../utils/toast';

const toastDiv = document.getElementById('toast');

const showPage = () => {
  const spinnerDiv = document.getElementById('spinner');
  const mainContainer = document.getElementById('main-container');
  const navbar = document.getElementById('navbar');
  const footer = document.getElementById('footer');
  setNotLoading(spinnerDiv, mainContainer, navbar, footer);
};

showPage();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const emailResetFail = urlParams.get('email-reset-fail') === 'true' ? true : false;
const editProfileSuccess = urlParams.get('edit-profile-success') === 'true' ? true : false;

if (emailResetFail) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Link is outdated', 'Try changing your email again.', false);

if (editProfileSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Success!', 'Your profile has been saved.', true);

/************************************************************
 * All other JavaScript
************************************************************/
import { submitSearch } from '../utils/search';
import { onLogout } from '../api/auth';

const logoutLink = document.getElementById('logout-link');
const submitButton = document.getElementById('submit');
const beerButton = document.getElementById('beer');

const handleSubmit = () => {
  submitSearch('', countryInput.value, sectorInput.value);
};

const handleLogout = async () => {
  try {
    await onLogout();
    localStorage.setItem('isAuth', 'false');
    window.location.reload();
  } catch(error) {
    showToast(
      toastDiv, 
      document.getElementById('toast-title'), 
      document.getElementById('toast-body'), 
      'Something went wrong', 
      'response' in error ? error.response.data.error : 'Check your internet connection.', 
      false
    );
  }
};

const hideToast = () => toastDiv.style.display = 'none';

logoutLink.addEventListener('click', handleLogout);
submitButton.addEventListener('click', handleSubmit);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
navRegisterButton.addEventListener('click', () => window.location.href = './login.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding