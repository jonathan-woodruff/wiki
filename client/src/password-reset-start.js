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
import { sendPasswordResetEmail } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const submitButton = document.getElementById('submit');
const errorElement = document.getElementById('error-message');

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
    if (emailInput.value === '') {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
};

const goSuccess = () => {
  const params = new URLSearchParams();
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
      if (error.response.status === 401) {
        localStorage.setItem('isAuth', false);
        window.location.reload();
      }
      isEmailError = true;
      errorElement.innerHTML = error.response.data.errors[0].msg;
      errorElement.classList.remove('d-none');
      errorElement.classList.add('border-danger');
      submitButton.disabled = true;
    }
    setNotLoadingButton(submitButton, 'Email Me a Password Reset Link');
};

form.addEventListener('submit', handleSubmit);
emailInput.addEventListener('input', handleEmailInput);