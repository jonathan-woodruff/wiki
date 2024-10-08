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
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

setSources();
setNav();

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
const logoutLink = document.getElementById('logout-link');
const customButton = document.getElementById('button-custom');
const button5 = document.getElementById('button-5');
const button10 = document.getElementById('button-10');
const customDiv = document.getElementById('custom-div');

const clearButtons = () => {
    customButton.classList.replace('btn-outline-success', 'btn-outline-primary');
    button5.classList.replace('btn-outline-success', 'btn-outline-primary');
    button10.classList.replace('btn-outline-success', 'btn-outline-primary');
};

const handleButtonClick = (event) => {
    clearButtons();
    const fixedButton = event.currentTarget;
    console.log(fixedButton);
    fixedButton.classList.replace('btn-outline-primary', 'btn-outline-success')
};

const handleFixedClick = (event) => {
    handleButtonClick(event);
    customDiv.style.display = 'none';
};

const handleCustomClick = (event) => {
    handleButtonClick(event);
    customDiv.style.display = 'block';
};

logoutLink.addEventListener('click', logout);
customButton.addEventListener('click', handleCustomClick);
button5.addEventListener('click', handleFixedClick);
button10.addEventListener('click', handleFixedClick);