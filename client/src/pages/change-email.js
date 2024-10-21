/************************************************************
 * Ensure the user is authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (!isAuth) window.location.href = './login.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav } from '../utils/navbar';
import Logo from '../images/logo.png';
import { refreshAvatar } from '../utils/navbar';

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

if (isAuth) {
  setSources();
  setNav();
}

/************************************************************
 * Load data from backend 
************************************************************/
import { getProfileData } from '../api/main';

const emailSpan = document.getElementById('email-info');

let dbUserEmail = '';

const loadEmail = async () => {
  const { data } = await getProfileData();
  const emailSpinner = document.getElementById('email-spinner');
  emailSpinner.style.display = 'none';
  emailSpan.innerHTML = data.email || '';
  dbUserEmail = data.email || '';
};

if (isAuth) loadEmail();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from '../utils/spinner';
import { showToast } from '../utils/toast';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
if (isAuth) setNotLoading(spinnerDiv, mainContainer, navbar, footer);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const emailSuccess = urlParams.get('email-reset-success') === 'true' ? true : false;
const toastDiv = document.getElementById('toast');

if (isAuth && emailSuccess) showToast(toastDiv, document.getElementById('toast-title'), document.getElementById('toast-body'), 'Email successfully changed!', 'You\'re all set.');;

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogout, sendChangeEmail } from '../api/auth';
import { setLoadingButton, setNotLoadingButton } from '../utils/spinner';

const form = document.getElementById('form');
const submitButton = document.getElementById('submit');
const errorElement = document.getElementById('error-message');
const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');
const emailInput = document.getElementById('email');

let isEmailError = false;

const clearErrorMessage = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const clearError = () => {
  if (isEmailError) {
    emailInput.classList.remove('border-danger');
    clearErrorMessage();
    isEmailError = false;
  }
};

const handleEmailInput = () => {
  clearError();

  //enable/disable save button
  if (emailInput.value === '' || emailInput.value === dbUserEmail) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};

const goSuccess = () => {
  const params = new URLSearchParams();
  params.append('header', 'One more step!')
  params.append('message', 'Please click the verification link in the email I sent to ' + emailInput.value + '.');
  const url = `./success.html?${params.toString()}`;
  window.location.href = url;
};

const saveEmail = async (event) => {
    event.preventDefault();
    clearError();
    setLoadingButton(submitButton, 'Saving...');
    try {
      const payload = {
        email: emailInput.value
      }
      await sendChangeEmail(payload);
      goSuccess();
    } catch(error) {
      if ('response' in error && error.response.status === 401) {
        localStorage.setItem('isAuth', 'false');
        window.location.reload();
      } else {
        isEmailError = true;
        errorElement.innerHTML = 'response' in error ? error.response.data.error : 'Error: Check your internet connection.';
        errorElement.classList.remove('d-none');
        errorElement.classList.add('border-danger');
      }
    }
    setNotLoadingButton(submitButton, 'Change Email');
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

form.addEventListener('submit', saveEmail);
emailInput.addEventListener('input', handleEmailInput);
logoutLink.addEventListener('click', handleLogout);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding