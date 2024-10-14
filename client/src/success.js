/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import './css/buttons.css';

/************************************************************
 * Configure the message text
************************************************************/
const h1 = document.getElementById('h1');
const messageParagraph = document.getElementById('message');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const header = urlParams.get('header');
const message = urlParams.get('message');

h1.innerHTML = header;
messageParagraph.innerHTML = message;

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');
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

const handleLogout = async () => {
  try {
      await logout();
      window.location.reload();
  } catch(error) {
      console.log(error);
  }
};

const goLogin = () => {
  const params = new URLSearchParams();
  params.append('prev', 'success');
  params.append('header', header);
  params.append('message', message);
  const url = `./login.html?${params.toString()}`;
  window.location.href = url;
};

logoutLink.addEventListener('click', handleLogout);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
navRegisterButton.addEventListener('click', goLogin);

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');
setNotLoading(spinnerDiv, mainContainer, navbar, footer);