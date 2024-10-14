/************************************************************
 * Ensure the user is authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (!isAuth) window.location.href = './login.html';

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

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navRegisterButton = document.getElementById('nav-register-button');
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
import { getProfileData } from './api/main';

const emailInput = document.getElementById('email');

let dbUserEmail = '';

const loadEmail = async () => {
  const { data } = await getProfileData();
  emailInput.value = data.email || '';
  dbUserEmail = data.email || '';
};

loadEmail();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';
import { showToast } from './utils/toast';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
setNotLoading(spinnerDiv, mainContainer, navbar, footer);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const emailSuccess = urlParams.get('email-reset-success') === 'true' ? true : false;
const toastDiv = document.getElementById('toast');

if (emailSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Email successfully changed!', 'You\'re all set.');;

/************************************************************
 * All other JavaScript
************************************************************/
import { putEmail, checkForCookie, sendChangeEmail } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const submitButton = document.getElementById('submit');
const errorElement = document.getElementById('error-message');
const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');

let isEmailError = false;

const clearErrorMessage = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const clearError = (event) => {
  if (isEmailError) {
    emailInput.classList.remove('border-danger');
    clearErrorMessage();
    isEmailError = false;
  }
};

const handleEmailInput = (event) => {
    clearError();

    //enable/disable save button
    if (emailInput.value === '' || emailInput.value === dbUserEmail) {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
  };

const handlePageshow = async () => {
    try {
      await checkForCookie();
    } catch(error) {
      if (error.response.status === 401) {
        localStorage.setItem('isAuth', 'false');
        window.location.href = './login.html';
      }
    }
};

const goSuccess = () => {
  const params = new URLSearchParams();
  params.append('header', 'Nice!')
  params.append('message', 'Please check your email');
  const url = `./success.html?${params.toString()}`;
  window.location.href = url;
};

const saveEmail = async (event) => {
    event.preventDefault();
    setLoadingButton(submitButton, 'Saving...');
    try {
      const payload = {
        email: emailInput.value
      }
      await sendChangeEmail(payload);
      goSuccess();
    } catch(error) {
      if (error.response.status === 401) {
        localStorage.setItem('isAuth', false);
        window.location.reload();
      }
      isEmailError = true;
      errorElement.innerHTML = error.response.data.error;
      errorElement.classList.remove('d-none');
      errorElement.classList.add('border-danger');
      submitButton.disabled = true;
    }
    setNotLoadingButton(submitButton, 'Change Email');
};

const handleLogout = async () => {
  try {
      await logout();
      window.location.reload();
  } catch(error) {
      console.log(error);
  }
};

const hideToast = () => toastDiv.style.display = 'none';

form.addEventListener('submit', saveEmail);
emailInput.addEventListener('input', handleEmailInput);
logoutLink.addEventListener('click', handleLogout);
window.addEventListener('pageshow', handlePageshow);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding