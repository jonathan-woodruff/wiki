/************************************************************
 * Ensure the user is not authenticated 
************************************************************/
import { isAuth } from './authenticate';
if (isAuth) window.location.href = './index.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout, goPlaces } from './utils/navbar';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const picturePreview = document.getElementById('pic-preview');
  logoImg.src = Logo;
  picturePreview.src = PeaceChicken;
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
};

setSources();
setNav();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading, setLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogin } from './api/auth';

const form = document.getElementById('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorElement = document.getElementById('error-message');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');

const login = async (event) => {
  event.preventDefault();
  setLoading(spinnerDiv, mainContainer, navbar);
  try {
    const credentials = {
        email: emailInput.value,
        password: passwordInput.value
    };
    await onLogin(credentials);
    goPlaces();
  } catch(error) {
    //console.log(error.response.data.errors[0].msg);
    const errorMessage = 'Incorrect email or password';
    errorElement.innerHTML = errorMessage;
    errorElement.classList.remove('d-none');
    setNotLoading(spinnerDiv, mainContainer, navbar);
  };
};

const clearError = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const goRegister = () => window.location.href = `./register.html?${window.location.search}`;

form.addEventListener('submit', login);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
registerLink.addEventListener('click', goRegister);
logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goRegister);