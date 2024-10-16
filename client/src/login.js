/************************************************************
 * Ensure the user is not authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (isAuth) window.location.href = './index.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import './css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav } from './utils/navbar';
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
const passwordSuccess = urlParams.get('password-success') === 'true' ? true : false;
const emailSuccess = urlParams.get('email-reset-success') === 'true' ? true : false;
const registrationFail = urlParams.get('registration-confirm-fail') === 'true' ? true : false;
const registrationSuccess = urlParams.get('registration-confirm-success') === 'true' ? true : false;
const toastDiv = document.getElementById('toast');

if (passwordSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Password successfully changed!', 'Log in using your new password.');

if (emailSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Email successfully changed!', 'Log in using your new email.');

if (registrationFail) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Link is outdated', 'Try logging in and confirming again', false);

if (registrationSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Account successfully created!', 'You can log in.');

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogin, sendConfirmationEmail } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const registerLink = document.getElementById('register-link');
const passwordResetButton = document.getElementById('password-reset');
const beerButton = document.getElementById('beer');

//helper function for goPlaces
const getURL = (params, prevPageName) => {
  params.delete('prev', prevPageName);
  return `./${prevPageName}.html?${params.toString()}`;
};

const goPlaces = () => {
  const currentQueryString = window.location.search;
  const params = new URLSearchParams(currentQueryString);
  const prevPageName = params.get('prev');
  const pages = [
    'history', 
    'search-results', 
    'view-historical-wiki', 
    'view-profile', 
    'wiki',
    'buy-me-a-beer',
    'password-reset-start',
    'success'
  ];
  const url = pages.includes(prevPageName) ? getURL(params, prevPageName) : './index.html';
  window.location.href = url;
};

const goSuccess = () => {
  const params = new URLSearchParams();
  params.append('header', 'Almost there!')
  params.append('message', 'I sent you an email. Please click the email confirmation link to finish signing up.');
  const url = `./success.html?${params.toString()}`;
  window.location.href = url;
};

const login = (event) => {
  event.preventDefault();
  const loginButton = document.getElementById('submit');
  setLoadingButton(loginButton, 'Logging In...');
  const credentials = {
    email: emailInput.value,
    password: passwordInput.value
  };
  onLogin(credentials)
  .then(() => {
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('avatar', data.avatar || '');
    goPlaces();
  })
  .catch((error) => {
    let errorMessage = '';
    if ('response' in error) errorMessage = error.response.data.error;
    if (
      errorMessage === 'Please enter a valid email address' 
      || errorMessage === 'Email does not exist'
      || errorMessage === 'Wrong password'
    ) {
      errorMessage = 'Incorrect email or password';
    } else if (errorMessage === 'User is not confirmed') {
      sendConfirmationEmail(credentials)
      .then(() => {
        goSuccess();
      })
      .catch((confError) => {
        errorMessage = 'response' in confError ? confError.response.data.error : 'Error: Check your internet connection.'
      })
    }
    /*if (shouldGoSuccess) {
      try {
        await sendConfirmationEmail(credentials);
        goSuccess();
      } catch(error) {
        errorMessage = 'Error: Could not send your account confirmation email.'
      }
    };*/
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
    setNotLoadingButton(loginButton, 'Log In');
  })
  /*try {
    const { data } = await onLogin(credentials);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('avatar', data.avatar || '');
    goPlaces();
  } catch(error) {
    let shouldGoSuccess = false;
    let errorMessage = '';
    if ('response' in error) errorMessage = error.response.data.error.toLowerCase();
    if (errorMessage.includes('email') || errorMessage.includes('password')) {
      errorMessage = 'Incorrect email or password';
    } else if (errorMessage === 'user is not confirmed') {
      shouldGoSuccess = true;
    } else {
      errorMessage = 'Error: Could not log you in.';
    }
    if (shouldGoSuccess) {
      try {
        await sendConfirmationEmail(credentials);
        goSuccess();
      } catch(error) {
        errorMessage = 'Error: Could not send your account confirmation email.'
      }
    };
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
    setNotLoadingButton(loginButton, 'Log In');
  };*/
};

const clearError = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const goRegister = () => window.location.href = `./register.html${window.location.search}`;

const goPasswordResetStart = () => window.location.href = './password-reset-start.html';

const hideToast = () => toastDiv.style.display = 'none';

form.addEventListener('submit', login);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
registerLink.addEventListener('click', goRegister);
navRegisterButton.addEventListener('click', goRegister);
passwordResetButton.addEventListener('click', goPasswordResetStart);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding