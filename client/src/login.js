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
import { onLogin } from './api/auth';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');
const passwordResetButton = document.getElementById('password-reset');

//helper function for goPlaces
const getURL = (params, prevPageName) => {
  params.delete('prev', prevPageName);
  return `./${prevPageName}.html?${params.toString()}`;
};

export const goPlaces = () => {
  const currentQueryString = window.location.search;
  const params = new URLSearchParams(currentQueryString);
  const prevPageName = params.get('prev');
  const pages = [
    'history', 
    'search-results', 
    'view-historical-wiki', 
    'view-profile', 
    'wiki'
  ];
  const url = pages.includes(prevPageName) ? getURL(params, prevPageName) : './index.html';
  console.log(url);
  window.location.href = url;
};

const login = async (event) => {
  event.preventDefault();
  const loginButton = document.getElementById('submit');
  setLoadingButton(loginButton, 'Logging In...');
  try {
    const credentials = {
        email: emailInput.value,
        password: passwordInput.value
    };
    const { data } = await onLogin(credentials);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('avatar', data.avatar);
    goPlaces();
  } catch(error) {
    const axiosError = error.response.data.errors[0].msg.toLowerCase();
    let errorMessage;
    if (axiosError.includes('email') || axiosError.includes('password')) {
      errorMessage = 'Incorrect email or password';
    } else {
      errorMessage = 'Could not log in. Check your network connection.'
    }
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
    setNotLoadingButton(loginButton, 'Log In');
  };
};

const clearError = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const goRegister = () => window.location.href = `./register.html${window.location.search}`;

const goPasswordResetStart = () => window.location.href = './password-reset-start.html';

form.addEventListener('submit', login);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
registerLink.addEventListener('click', goRegister);
logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goRegister);
passwordResetButton.addEventListener('click', goPasswordResetStart);