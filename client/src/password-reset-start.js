/************************************************************
 * Ensure the user is not authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (isAuth) window.location.href = './change-password.html';

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
const passwordFail = urlParams.get('password-reset-fail') === 'true' ? true : false;
const toastDiv = document.getElementById('toast');

if (passwordFail) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Link is outdated', 'Try resetting your password again.', false);

/************************************************************
 * All other JavaScript
************************************************************/
import { sendPasswordResetEmail } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submit');
const errorElement = document.getElementById('error-message');
const loginLink = document.getElementById('nav-register-button');
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
    submitButton.disabled = emailInput.value ? false : true;
};

const goSuccess = () => {
  const params = new URLSearchParams();
  params.append('header', 'Nice!')
  params.append('message', 'Please check your email');
  const url = `./success.html?${params.toString()}`;
  window.location.href = url;
};

const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingButton(submitButton, 'Sending...');
    try {
      const payload = {
        email: emailInput.value
      }
      await sendPasswordResetEmail(payload);
      goSuccess();
    } catch(error) {
        const errorMessage = 'response' in error ? error.response.data.error : 'Error: Could not send an email.';
        isEmailError = true;
        errorElement.innerHTML = errorMessage;
        errorElement.classList.remove('d-none')
        emailInput.classList.add('border-danger');
    }
    setNotLoadingButton(submitButton, 'Email Me a Password Reset Link');
};

const goLogin = () => {
  const params = new URLSearchParams();
  params.append('prev', 'password-reset-start');
  const url = `./login.html?${params.toString()}`;
  window.location.href = url;
};

const hideToast = () => toastDiv.style.display = 'none';

form.addEventListener('submit', handleSubmit);
emailInput.addEventListener('input', handleEmailInput);
loginLink.addEventListener('click', () => window.location.href = './login.html');
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
navRegisterButton.addEventListener('click', goLogin);
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding